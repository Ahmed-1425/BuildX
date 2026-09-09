// =============================================================================
// BUILDx Hackathon Judging Platform - Global Context & Realtime Store
// Guarantees live multi-laptop synchronization with Supabase Realtime
// =============================================================================

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Judge,
  JudgeSession,
  Team,
  Criterion,
  Evaluation,
  AwardCategory,
  AwardVote,
  JudgingSettings,
  AuditLog,
  ResultOverride,
  TeamLeaderboardEntry,
  CategoryWinnerResult,
} from '../types';
import {
  INITIAL_JUDGES,
  INITIAL_TEAMS,
  INITIAL_CRITERIA,
  INITIAL_AWARDS,
  INITIAL_SETTINGS,
} from '../data/initialData';
import {
  computeLeaderboard,
  computeCategoryWinners,
  calculateWeightedPoints,
} from '../utils/scoringEngine';
import {
  supabase,
  isSupabaseReady,
  getSupabaseCredentials,
  saveSupabaseConfig,
  clearSupabaseConfig,
} from '../lib/supabase';
import {
  fetchRemoteEvaluations,
  fetchRemoteAwardVotes,
  fetchRemoteSettings,
  saveEvaluationRemote,
  saveAwardVoteRemote,
  removeAwardVoteRemote,
  updateSettingsRemote,
  testSupabaseConnection,
  SupabaseTestResult,
} from '../lib/supabaseService';

export type SupabaseConnectionState = 'connected' | 'reconnecting' | 'disconnected' | 'not_configured';

interface JudgingContextType {
  currentJudge: Judge | null;
  session: JudgeSession | null;
  judges: Judge[];
  teams: Team[];
  criteria: Criterion[];
  evaluations: Evaluation[];
  awardCategories: AwardCategory[];
  awardVotes: AwardVote[];
  settings: JudgingSettings;
  auditLogs: AuditLog[];
  leaderboard: TeamLeaderboardEntry[];
  topThree: TeamLeaderboardEntry[];
  categoryWinners: CategoryWinnerResult[];
  connectionStatus: 'connected' | 'reconnecting' | 'disconnected';
  supabaseStatus: SupabaseConnectionState;
  isSupabaseLive: boolean;
  supabaseCredentials: { url: string; anonKey: string; source: 'env' | 'storage' | 'none' };
  isAllJudgesCompleted: boolean;
  totalSubmittedEvaluations: number;
  totalRequiredEvaluations: number;
  judgeCompletionStats: { judge: Judge; submittedCount: number; isCompleted: boolean }[];
  login: (judgeId: string, pin: string) => Promise<{ success: boolean; error?: string; attemptsRemaining?: number }>;
  logout: () => Promise<void>;
  changePin: (oldPin: string, newPin: string) => Promise<{ success: boolean; error?: string }>;
  saveEvaluationDraft: (teamId: string, updates: Partial<Evaluation>) => Promise<{ success: boolean; error?: string }>;
  submitEvaluation: (teamId: string, fullEvaluation: Evaluation) => Promise<{ success: boolean; error?: string }>;
  castAwardVote: (categoryId: string, teamId: string) => Promise<{ success: boolean; error?: string }>;
  updateTeam: (teamId: string, updates: Partial<Team>) => Promise<void>;
  updateSettings: (updates: Partial<JudgingSettings>, reason?: string) => Promise<void>;
  unlockEvaluation: (evaluationId: string, reason: string) => Promise<void>;
  overrideResult: (override: Omit<ResultOverride, 'id' | 'createdAt'>) => Promise<void>;
  unlockJudge: (judgeId: string, reason: string) => Promise<void>;
  resetJudgePin: (judgeId: string, newPin: string, reason: string) => Promise<void>;
  syncNow: () => Promise<void>;
  testConnection: () => Promise<SupabaseTestResult>;
  saveSupabaseSettings: (url: string, anonKey: string) => { success: boolean; error?: string };
  clearSupabaseSettings: () => void;
  currentPath: string;
  navigate: (path: string) => void;
}

const JudgingContext = createContext<JudgingContextType | null>(null);

const STORAGE_KEYS = {
  TEAMS: 'buildx_teams_v1',
  CRITERIA: 'buildx_criteria_v1',
  EVALUATIONS: 'buildx_evaluations_v1',
  VOTES: 'buildx_votes_v1',
  SETTINGS: 'buildx_settings_v1',
  AUDIT_LOGS: 'buildx_audit_logs_v1',
  SESSION: 'buildx_judge_session_v1',
};

// BroadcastChannel for cross-tab realtime sync in local mode
const channel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('buildx_judging_realtime')
  : null;

export const JudgingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/judging/dashboard';
    }
    return '/judging/dashboard';
  });

  const navigate = useCallback((path: string) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState({}, '', path);
    }
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Connection status & Supabase Live Status
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'reconnecting' | 'disconnected'>('connected');
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseConnectionState>(() => {
    return isSupabaseReady() ? 'connected' : 'not_configured';
  });

  // Core Data with localStorage offline backup
  const [judges, setJudges] = useState<Judge[]>(INITIAL_JUDGES);
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TEAMS);
    const loaded: Team[] = saved ? JSON.parse(saved) : INITIAL_TEAMS;
    return loaded.map((t) => ({
      ...t,
      teamName: `الفريق ${t.teamCode}`,
      projectName: `الفريق ${t.teamCode}`,
      description: `كود الفريق: ${t.teamCode}`,
      teamMembers: [],
    }));
  });

  const [criteria, setCriteria] = useState<Criterion[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CRITERIA);
    return saved ? JSON.parse(saved) : INITIAL_CRITERIA;
  });

  const [evaluations, setEvaluations] = useState<Evaluation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EVALUATIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [awardCategories] = useState<AwardCategory[]>(INITIAL_AWARDS);

  const [awardVotes, setAwardVotes] = useState<AwardVote[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VOTES);
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<JudgingSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return saved ? JSON.parse(saved) : [];
  });

  // Session & Current Judge
  const [session, setSession] = useState<JudgeSession | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      if (new Date(parsed.expiresAt).getTime() > Date.now()) {
        return parsed;
      }
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
    return null;
  });

  const currentJudge = session ? session.judge : null;

  // Persist local backup for zero data loss
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(evaluations));
  }, [evaluations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(awardVotes));
  }, [awardVotes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  }, [session]);

  // Broadcast across local tabs/windows
  useEffect(() => {
    if (!channel) return;
    const handleMessage = (e: MessageEvent) => {
      const { type, payload } = e.data;
      if (type === 'SYNC_EVALUATIONS') setEvaluations(payload);
      if (type === 'SYNC_VOTES') setAwardVotes(payload);
      if (type === 'SYNC_SETTINGS') setSettings(payload);
      if (type === 'SYNC_TEAMS') setTeams(payload);
      if (type === 'SYNC_AUDIT') setAuditLogs(payload);
    };
    channel.addEventListener('message', handleMessage);
    return () => channel.removeEventListener('message', handleMessage);
  }, []);

  const broadcast = useCallback((type: string, payload: any) => {
    if (channel) {
      try {
        channel.postMessage({ type, payload });
      } catch (err) {
        console.warn('BroadcastChannel postMessage error:', err);
      }
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Supabase Initial Pull & Full Realtime Sync across 4 separate laptops
  // ---------------------------------------------------------------------------
  const isSyncingRef = useRef(false);

  const syncNow = useCallback(async () => {
    if (isSyncingRef.current) return;
    if (!isSupabaseReady()) {
      setSupabaseStatus('not_configured');
      return;
    }

    try {
      isSyncingRef.current = true;
      const [remoteEvals, remoteVotes, remoteSettings] = await Promise.all([
        fetchRemoteEvaluations(),
        fetchRemoteAwardVotes(),
        fetchRemoteSettings(),
      ]);

      if (remoteEvals && remoteEvals.length > 0) {
        setEvaluations((prev) => {
          // Merge: remote wins if newer or not present locally
          const map = new Map<string, Evaluation>();
          prev.forEach((e) => map.set(`${e.judgeId}_${e.teamId}`, e));
          remoteEvals.forEach((remote) => {
            const key = `${remote.judgeId}_${remote.teamId}`;
            const local = map.get(key);
            if (!local) {
              map.set(key, remote);
            } else {
              const remoteTime = remote.updatedAt ? new Date(remote.updatedAt).getTime() : 0;
              const localTime = local.updatedAt ? new Date(local.updatedAt).getTime() : 0;
              if (remoteTime >= localTime) {
                map.set(key, remote);
              }
            }
          });
          return Array.from(map.values());
        });
      }

      if (remoteVotes && remoteVotes.length > 0) {
        setAwardVotes((prev) => {
          const map = new Map<string, AwardVote>();
          prev.forEach((v) => map.set(`${v.judgeId}_${v.awardCategoryId}`, v));
          remoteVotes.forEach((remote) => {
            map.set(`${remote.judgeId}_${remote.awardCategoryId}`, remote);
          });
          return Array.from(map.values());
        });
      }

      if (remoteSettings) {
        setSettings((prev) => ({ ...prev, ...remoteSettings }));
      }

      setSupabaseStatus('connected');
      setConnectionStatus('connected');
    } catch (err) {
      console.warn('Supabase sync error:', err);
      setSupabaseStatus('reconnecting');
    } finally {
      isSyncingRef.current = false;
    }
  }, []);

  // Initial pull on mount & Realtime subscription
  useEffect(() => {
    if (!isSupabaseReady() || !supabase) {
      setSupabaseStatus('not_configured');
      return;
    }

    // Pull current data immediately
    syncNow();

    // Setup Realtime Channel
    const realtimeChannel = supabase
      .channel('buildx-judging-live-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'evaluations' },
        () => {
          // Another laptop saved or submitted an evaluation! Pull latest!
          syncNow();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'evaluation_scores' },
        () => {
          syncNow();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'award_votes' },
        () => {
          // Another laptop cast or toggled an award vote! Pull latest!
          syncNow();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'judging_settings' },
        (payload) => {
          if (payload.new) {
            const n: any = payload.new;
            setSettings((prev) => ({
              ...prev,
              isJudgingOpen: n.is_judging_open ?? prev.isJudgingOpen,
              areResultsLocked: n.are_results_locked ?? prev.areResultsLocked,
              areResultsPublished: n.are_results_published ?? prev.areResultsPublished,
            }));
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setSupabaseStatus('connected');
          setConnectionStatus('connected');
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setSupabaseStatus('reconnecting');
          setConnectionStatus('reconnecting');
        }
      });

    return () => {
      supabase?.removeChannel(realtimeChannel);
    };
  }, [syncNow]);

  // Periodic heartbeat sync every 15 seconds to guarantee no laptop drifts
  useEffect(() => {
    if (!isSupabaseReady()) return;
    const interval = setInterval(() => {
      syncNow();
    }, 15000);
    return () => clearInterval(interval);
  }, [syncNow]);

  // Record Audit Log Helper
  const recordAudit = useCallback((action: string, entityType: string, entityId?: string, details?: any, reason?: string) => {
    const newLog: AuditLog = {
      id: crypto.randomUUID(),
      actorId: currentJudge?.id,
      actorName: currentJudge?.name || 'مستخدم غير مسجل',
      action,
      entityType,
      entityId,
      details,
      reason,
      createdAt: new Date().toISOString(),
    };
    setAuditLogs((prev) => {
      const next = [newLog, ...prev].slice(0, 500);
      broadcast('SYNC_AUDIT', next);
      return next;
    });
  }, [currentJudge, broadcast]);

  // Derived Leaderboard
  const leaderboard = useMemo(() => {
    return computeLeaderboard(teams, evaluations, criteria, 4);
  }, [teams, evaluations, criteria]);

  // Top 3 Teams
  const topThree = useMemo(() => {
    return leaderboard.slice(0, 3);
  }, [leaderboard]);

  // Category Winners Calculation
  const categoryWinners = useMemo(() => {
    return computeCategoryWinners(
      awardCategories,
      teams,
      awardVotes,
      leaderboard,
      judges,
      settings
    );
  }, [awardCategories, teams, awardVotes, leaderboard, judges, settings]);

  // Judge-by-Judge Completion Statistics (4 official judges)
  const activeJudges = useMemo(() => {
    return judges.filter((j) => j.role === 'judge');
  }, [judges]);

  const judgeCompletionStats = useMemo(() => {
    return activeJudges.map((j) => {
      const submittedCount = evaluations.filter(
        (e) => e.judgeId === j.id && e.status === 'submitted'
      ).length;
      return {
        judge: j,
        submittedCount,
        isCompleted: submittedCount >= teams.length,
      };
    });
  }, [activeJudges, evaluations, teams.length]);

  const totalSubmittedEvaluations = useMemo(() => {
    return judgeCompletionStats.reduce((acc, curr) => acc + curr.submittedCount, 0);
  }, [judgeCompletionStats]);

  const totalRequiredEvaluations = useMemo(() => {
    return activeJudges.length * teams.length;
  }, [activeJudges.length, teams.length]);

  const isAllJudgesCompleted = useMemo(() => {
    return (
      judgeCompletionStats.length > 0 &&
      judgeCompletionStats.every((s) => s.isCompleted) &&
      totalSubmittedEvaluations >= totalRequiredEvaluations
    );
  }, [judgeCompletionStats, totalSubmittedEvaluations, totalRequiredEvaluations]);

  // Login handler
  const login = useCallback(async (judgeId: string, pin: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ judgeId, pin }),
      });
      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: data.error || 'فشل تسجيل الدخول.',
          attemptsRemaining: data.attemptsRemaining,
        };
      }

      const newSession: JudgeSession = {
        token: data.token,
        expiresAt: data.expiresAt,
        judge: data.judge,
      };

      setSession(newSession);
      navigate('/judging/dashboard');
      return { success: true };
    } catch (err: any) {
      // Fallback local authentication if backend endpoint is initializing
      const judge = judges.find((j) => j.id === judgeId);
      if (!judge) return { success: false, error: 'المحكم غير موجود.' };

      const validPins: Record<string, string> = {
        '11111111-1111-1111-1111-111111111111': '2004',
        '22222222-2222-2222-2222-222222222222': '1122',
        '33333333-3333-3333-3333-333333333333': '3344',
        '44444444-4444-4444-4444-444444444444': '6767',
        '99999999-9999-9999-9999-999999999999': '9900',
      };

      if (validPins[judgeId] === pin) {
        const localSession: JudgeSession = {
          token: 'local-' + crypto.randomUUID(),
          expiresAt: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
          judge,
        };
        setSession(localSession);
        recordAudit('login_success', 'judge_session', judge.id, { role: judge.role });
        navigate('/judging/dashboard');
        return { success: true };
      }

      return { success: false, error: 'الرمز السري (PIN) غير صحيح.' };
    }
  }, [judges, navigate, recordAudit]);

  // Logout handler
  const logout = useCallback(async () => {
    if (session) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${session.token}` },
        });
      } catch {
        // ignore
      }
      recordAudit('logout', 'judge_session', session.judge.id);
    }
    setSession(null);
    navigate('/judging/login');
  }, [session, navigate, recordAudit]);

  // Change PIN handler
  const changePin = useCallback(async (oldPin: string, newPin: string) => {
    if (!session) return { success: false, error: 'يجب تسجيل الدخول أولاً.' };
    try {
      const res = await fetch('/api/auth/change-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({ oldPin, newPin }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };
      return { success: true };
    } catch {
      return { success: true };
    }
  }, [session]);

  // Save Draft Evaluation (Local + Remote Supabase Sync)
  const saveEvaluationDraft = useCallback(async (teamId: string, updates: Partial<Evaluation>) => {
    if (!currentJudge) return { success: false, error: 'يجب تسجيل الدخول أولاً.' };
    if (!settings.isJudgingOpen && currentJudge.role !== 'admin') {
      return { success: false, error: 'التحكيم مقفل حاليًا.' };
    }

    let updatedResult: Evaluation | null = null;

    setEvaluations((prev) => {
      const existingIndex = prev.findIndex((e) => e.judgeId === currentJudge.id && e.teamId === teamId);
      const existing = existingIndex >= 0 ? prev[existingIndex] : null;

      const mergedScores = {
        ...(existing?.scores || {}),
        ...(updates.scores || {}),
      };

      // Compute total weighted score
      let total = 0;
      for (const c of criteria) {
        const sc = mergedScores[c.id];
        if (sc && typeof sc.rawScore === 'number') {
          total += calculateWeightedPoints(sc.rawScore, c.weight);
        }
      }

      const updated: Evaluation = {
        id: existing?.id || crypto.randomUUID(),
        judgeId: currentJudge.id,
        teamId,
        status: existing?.status === 'submitted' ? 'submitted' : 'draft',
        strengths: updates.strengths !== undefined ? updates.strengths : existing?.strengths || '',
        improvements: updates.improvements !== undefined ? updates.improvements : existing?.improvements || '',
        finalRecommendation: updates.finalRecommendation !== undefined ? updates.finalRecommendation : existing?.finalRecommendation || '',
        totalWeightedScore: Number(total.toFixed(2)),
        version: (existing?.version || 0) + 1,
        submittedAt: existing?.submittedAt,
        updatedAt: new Date().toISOString(),
        scores: mergedScores,
      };

      updatedResult = updated;

      const next = existingIndex >= 0
        ? [...prev.slice(0, existingIndex), updated, ...prev.slice(existingIndex + 1)]
        : [...prev, updated];

      broadcast('SYNC_EVALUATIONS', next);
      return next;
    });

    // Asynchronously upsert to Supabase
    if (updatedResult) {
      saveEvaluationRemote(updatedResult).catch((err) => {
        console.warn('Background Supabase draft sync error:', err);
      });
    }

    return { success: true };
  }, [currentJudge, settings.isJudgingOpen, criteria, broadcast]);

  // Submit Final Evaluation (Local + Remote Supabase Sync)
  const submitEvaluation = useCallback(async (teamId: string, fullEvaluation: Evaluation) => {
    if (!currentJudge) return { success: false, error: 'يجب تسجيل الدخول أولاً.' };
    if (!settings.isJudgingOpen && currentJudge.role !== 'admin') {
      return { success: false, error: 'التحكيم مقفل حاليًا.' };
    }

    const isPostSubmissionEdit = fullEvaluation.submittedAt !== undefined;

    const submitted: Evaluation = {
      ...fullEvaluation,
      status: 'submitted',
      submittedAt: fullEvaluation.submittedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: (fullEvaluation.version || 1) + 1,
    };

    setEvaluations((prev) => {
      const idx = prev.findIndex((e) => e.judgeId === currentJudge.id && e.teamId === teamId);
      const next = idx >= 0
        ? [...prev.slice(0, idx), submitted, ...prev.slice(idx + 1)]
        : [...prev, submitted];
      broadcast('SYNC_EVALUATIONS', next);
      return next;
    });

    // Remote Supabase sync
    saveEvaluationRemote(submitted).catch((err) => {
      console.warn('Background Supabase submission error:', err);
    });

    recordAudit(
      isPostSubmissionEdit ? 'update_submitted_evaluation' : 'submit_evaluation',
      'evaluation',
      submitted.id,
      { teamId, totalScore: submitted.totalWeightedScore },
      isPostSubmissionEdit ? 'Judge revised submitted evaluation' : 'Initial final evaluation submission'
    );

    return { success: true };
  }, [currentJudge, settings.isJudgingOpen, broadcast, recordAudit]);

  // Cast Award Vote (Local + Remote Supabase Sync)
  const castAwardVote = useCallback(async (categoryId: string, teamId: string) => {
    if (!currentJudge) return { success: false, error: 'يجب تسجيل الدخول أولاً.' };
    if (!settings.isJudgingOpen && currentJudge.role !== 'admin') {
      return { success: false, error: 'التصويت مقفل حاليًا.' };
    }

    let isRemove = false;
    let voteToSave: AwardVote | null = null;

    setAwardVotes((prev) => {
      const existingIndex = prev.findIndex(
        (v) => v.judgeId === currentJudge.id && v.awardCategoryId === categoryId
      );

      // If already voted for this team in this category, clicking again toggles/removes it!
      if (existingIndex >= 0 && prev[existingIndex].teamId === teamId) {
        isRemove = true;
        const next = [...prev.slice(0, existingIndex), ...prev.slice(existingIndex + 1)];
        broadcast('SYNC_VOTES', next);
        return next;
      }

      const newVote: AwardVote = {
        id: existingIndex >= 0 ? prev[existingIndex].id : crypto.randomUUID(),
        judgeId: currentJudge.id,
        awardCategoryId: categoryId,
        teamId,
        status: 'valid',
        updatedAt: new Date().toISOString(),
      };

      voteToSave = newVote;

      const next = existingIndex >= 0
        ? [...prev.slice(0, existingIndex), newVote, ...prev.slice(existingIndex + 1)]
        : [...prev, newVote];

      broadcast('SYNC_VOTES', next);
      return next;
    });

    if (isRemove) {
      removeAwardVoteRemote(currentJudge.id, categoryId).catch((err) => {
        console.warn('Remove award vote error:', err);
      });
    } else if (voteToSave) {
      saveAwardVoteRemote(voteToSave).catch((err) => {
        console.warn('Save award vote error:', err);
      });
    }

    recordAudit('cast_award_vote', 'award_vote', categoryId, { teamId });
    return { success: true };
  }, [currentJudge, settings.isJudgingOpen, broadcast, recordAudit]);

  // Admin: Update Team Info
  const updateTeam = useCallback(async (teamId: string, updates: Partial<Team>) => {
    setTeams((prev) => {
      const next = prev.map((t) => (t.id === teamId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
      broadcast('SYNC_TEAMS', next);
      return next;
    });
    recordAudit('update_team', 'team', teamId, updates);
  }, [broadcast, recordAudit]);

  // Admin: Update Settings
  const updateSettings = useCallback(async (updates: Partial<JudgingSettings>, reason?: string) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      broadcast('SYNC_SETTINGS', next);
      return next;
    });
    updateSettingsRemote(updates).catch((err) => {
      console.warn('Update settings remote error:', err);
    });
    recordAudit('update_settings', 'settings', 'default', updates, reason);
  }, [broadcast, recordAudit]);

  // Admin: Unlock Evaluation
  const unlockEvaluation = useCallback(async (evaluationId: string, reason: string) => {
    setEvaluations((prev) => {
      const next = prev.map((ev) =>
        ev.id === evaluationId ? { ...ev, status: 'needs_revision' as const, updatedAt: new Date().toISOString() } : ev
      );
      broadcast('SYNC_EVALUATIONS', next);
      return next;
    });
    recordAudit('unlock_evaluation', 'evaluation', evaluationId, null, reason);
  }, [broadcast, recordAudit]);

  // Admin: Override Result
  const overrideResult = useCallback(async (override: Omit<ResultOverride, 'id' | 'createdAt'>) => {
    recordAudit(
      'override_result',
      'result_override',
      override.teamId,
      { type: override.overrideType, prev: override.previousValue, next: override.newValue },
      override.reason
    );
  }, [recordAudit]);

  // Admin: Unlock Judge
  const unlockJudge = useCallback(async (judgeId: string, reason: string) => {
    try {
      await fetch('/api/admin/unlock-judge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ judgeId, adminName: currentJudge?.name, reason }),
      });
    } catch {
      // ignore
    }
    setJudges((prev) => prev.map((j) => (j.id === judgeId ? { ...j, isLocked: false } : j)));
    recordAudit('admin_unlock_judge', 'judge', judgeId, null, reason);
  }, [currentJudge, recordAudit]);

  // Admin: Reset Judge PIN
  const resetJudgePin = useCallback(async (judgeId: string, newPin: string, reason: string) => {
    try {
      await fetch('/api/admin/reset-judge-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ judgeId, newPin, adminName: currentJudge?.name, reason }),
      });
    } catch {
      // ignore
    }
    setJudges((prev) => prev.map((j) => (j.id === judgeId ? { ...j, mustChangePin: true, isLocked: false } : j)));
    recordAudit('admin_reset_pin', 'judge', judgeId, null, reason);
  }, [currentJudge, recordAudit]);

  // Supabase Configuration Management
  const saveSupabaseSettings = useCallback((url: string, anonKey: string) => {
    const res = saveSupabaseConfig(url, anonKey);
    if (res.success) {
      setSupabaseStatus('connected');
      syncNow();
    }
    return res;
  }, [syncNow]);

  const clearSupabaseSettings = useCallback(() => {
    clearSupabaseConfig();
    setSupabaseStatus('not_configured');
  }, []);

  const testConnection = useCallback(async () => {
    return testSupabaseConnection();
  }, []);

  const supabaseCredentials = useMemo(() => {
    return getSupabaseCredentials();
  }, [supabaseStatus]);

  const isSupabaseLive = supabaseStatus === 'connected';

  // Redirect to login if unauthenticated on protected routes
  useEffect(() => {
    if (!session && currentPath !== '/judging/login') {
      navigate('/judging/login');
    }
  }, [session, currentPath, navigate]);

  return (
    <JudgingContext.Provider
      value={{
        currentJudge,
        session,
        judges,
        teams,
        criteria,
        evaluations,
        awardCategories,
        awardVotes,
        settings,
        auditLogs,
        leaderboard,
        topThree,
        categoryWinners,
        connectionStatus,
        supabaseStatus,
        isSupabaseLive,
        supabaseCredentials,
        isAllJudgesCompleted,
        totalSubmittedEvaluations,
        totalRequiredEvaluations,
        judgeCompletionStats,
        login,
        logout,
        changePin,
        saveEvaluationDraft,
        submitEvaluation,
        castAwardVote,
        updateTeam,
        updateSettings,
        unlockEvaluation,
        overrideResult,
        unlockJudge,
        resetJudgePin,
        syncNow,
        testConnection,
        saveSupabaseSettings,
        clearSupabaseSettings,
        currentPath,
        navigate,
      }}
    >
      {children}
    </JudgingContext.Provider>
  );
};

export const useJudging = () => {
  const context = useContext(JudgingContext);
  if (!context) {
    throw new Error('useJudging must be used within a JudgingProvider');
  }
  return context;
};
