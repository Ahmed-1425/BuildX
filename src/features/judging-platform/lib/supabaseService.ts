// =============================================================================
// BUILDx Hackathon Judging Platform - Supabase Realtime Service
// Guarantees synchronization across multiple judging laptops in real-time
// =============================================================================

import { supabase, isSupabaseReady } from './supabase';
import { Evaluation, EvaluationScore, AwardVote, JudgingSettings } from '../types';

export interface SupabaseTestResult {
  ok: boolean;
  message: string;
  tableCounts?: {
    teams: number;
    judges: number;
    evaluations: number;
  };
}

/**
 * Tests direct connectivity with Supabase and checks essential tables.
 */
export async function testSupabaseConnection(): Promise<SupabaseTestResult> {
  if (!supabase || !isSupabaseReady()) {
    return {
      ok: false,
      message: 'لم يتم إعداد رابط أو مفتاح Supabase بعد.',
    };
  }

  try {
    const [teamsRes, judgesRes, evalsRes] = await Promise.all([
      supabase.from('teams').select('id', { count: 'exact', head: true }),
      supabase.from('judges').select('id', { count: 'exact', head: true }),
      supabase.from('evaluations').select('id', { count: 'exact', head: true }),
    ]);

    if (teamsRes.error) {
      return {
        ok: false,
        message: `خطأ في الاتصال بجدول teams: ${teamsRes.error.message}. يرجى تشغيل كود SQL الكامل في Supabase SQL Editor.`,
      };
    }

    return {
      ok: true,
      message: 'الاتصال بقاعدة بيانات Supabase يعمل بنجاح وبسرعة عالية!',
      tableCounts: {
        teams: teamsRes.count ?? 0,
        judges: judgesRes.count ?? 0,
        evaluations: evalsRes.count ?? 0,
      },
    };
  } catch (err: any) {
    return {
      ok: false,
      message: `فشل الاتصال: ${err.message || 'خطأ غير معروف في الشبكة'}`,
    };
  }
}

/**
 * Fetches all evaluations and scores from Supabase.
 */
export async function fetchRemoteEvaluations(): Promise<Evaluation[] | null> {
  if (!supabase || !isSupabaseReady()) return null;

  try {
    const { data: evalsData, error: evalsError } = await supabase
      .from('evaluations')
      .select(`
        id,
        judge_id,
        team_id,
        status,
        strengths,
        improvements,
        final_recommendation,
        total_weighted_score,
        version,
        submitted_at,
        updated_at,
        created_at
      `);

    if (evalsError || !evalsData) {
      console.warn('Error fetching evaluations from Supabase:', evalsError);
      return null;
    }

    const { data: scoresData, error: scoresError } = await supabase
      .from('evaluation_scores')
      .select('*');

    if (scoresError) {
      console.warn('Error fetching scores from Supabase:', scoresError);
    }

    const scoresByEval = new Map<string, Record<string, EvaluationScore>>();
    if (scoresData) {
      for (const row of scoresData) {
        if (!scoresByEval.has(row.evaluation_id)) {
          scoresByEval.set(row.evaluation_id, {});
        }
        scoresByEval.get(row.evaluation_id)![row.criterion_id] = {
          criterionId: row.criterion_id,
          rawScore: Number(row.raw_score),
          weightedPoints: Number(row.weighted_points),
          justification: row.justification || '',
        };
      }
    }

    const mapped: Evaluation[] = evalsData.map((row) => ({
      id: row.id,
      judgeId: row.judge_id,
      teamId: row.team_id,
      status: row.status,
      strengths: row.strengths || '',
      improvements: row.improvements || '',
      finalRecommendation: row.final_recommendation || '',
      totalWeightedScore: Number(row.total_weighted_score) || 0,
      version: row.version || 1,
      submittedAt: row.submitted_at || undefined,
      updatedAt: row.updated_at,
      scores: scoresByEval.get(row.id) || {},
    }));

    return mapped;
  } catch (err) {
    console.warn('Failed to fetch remote evaluations:', err);
    return null;
  }
}

/**
 * Fetches all award votes from Supabase.
 */
export async function fetchRemoteAwardVotes(): Promise<AwardVote[] | null> {
  if (!supabase || !isSupabaseReady()) return null;

  try {
    const { data, error } = await supabase
      .from('award_votes')
      .select('*');

    if (error || !data) {
      console.warn('Error fetching award votes:', error);
      return null;
    }

    return data.map((row) => ({
      id: row.id,
      judgeId: row.judge_id,
      awardCategoryId: row.award_category_id,
      teamId: row.team_id,
      status: row.status,
      updatedAt: row.updated_at,
    }));
  } catch (err) {
    console.warn('Failed to fetch remote award votes:', err);
    return null;
  }
}

/**
 * Fetches settings from Supabase.
 */
export async function fetchRemoteSettings(): Promise<Partial<JudgingSettings> | null> {
  if (!supabase || !isSupabaseReady()) return null;

  try {
    const { data, error } = await supabase
      .from('judging_settings')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    if (error || !data) return null;

    return {
      isJudgingOpen: data.is_judging_open,
      areResultsLocked: data.are_results_locked,
      areResultsPublished: data.are_results_published,
      allowRepeatCategoryWinners: data.allow_repeat_category_winners,
      allowSubFourCalculation: data.allow_sub_four_calculation,
      subFourReason: data.sub_four_reason,
      publishedRevealStage: data.published_reveal_stage,
    };
  } catch {
    return null;
  }
}

/**
 * Saves or updates an evaluation and all its criteria scores in Supabase.
 */
export async function saveEvaluationRemote(evaluation: Evaluation): Promise<{ success: boolean; error?: string }> {
  if (!supabase || !isSupabaseReady()) {
    return { success: false, error: 'Supabase client is not configured' };
  }

  try {
    // 1. Upsert evaluation record
    const { error: evalError } = await supabase
      .from('evaluations')
      .upsert({
        id: evaluation.id,
        judge_id: evaluation.judgeId,
        team_id: evaluation.teamId,
        status: evaluation.status,
        strengths: evaluation.strengths || '',
        improvements: evaluation.improvements || '',
        final_recommendation: evaluation.finalRecommendation || '',
        total_weighted_score: evaluation.totalWeightedScore,
        version: evaluation.version || 1,
        submitted_at: evaluation.submittedAt || null,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'judge_id,team_id',
      });

    if (evalError) {
      console.error('Supabase evaluation upsert error:', evalError);
      return { success: false, error: evalError.message };
    }

    // 2. Upsert each criteria score
    const scores = Object.values(evaluation.scores || {});
    if (scores.length > 0) {
      const scoreRows = scores.map((sc) => ({
        evaluation_id: evaluation.id,
        criterion_id: sc.criterionId,
        raw_score: sc.rawScore,
        weighted_points: sc.weightedPoints,
        justification: sc.justification || '',
        updated_at: new Date().toISOString(),
      }));

      const { error: scoreError } = await supabase
        .from('evaluation_scores')
        .upsert(scoreRows, {
          onConflict: 'evaluation_id,criterion_id',
        });

      if (scoreError) {
        console.error('Supabase score upsert error:', scoreError);
        return { success: false, error: scoreError.message };
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error('Save evaluation remote error:', err);
    return { success: false, error: err.message || 'Unknown error' };
  }
}

/**
 * Saves an award vote to Supabase.
 */
export async function saveAwardVoteRemote(vote: AwardVote): Promise<{ success: boolean; error?: string }> {
  if (!supabase || !isSupabaseReady()) {
    return { success: false, error: 'Supabase client is not configured' };
  }

  try {
    const { error } = await supabase
      .from('award_votes')
      .upsert({
        id: vote.id,
        judge_id: vote.judgeId,
        award_category_id: vote.awardCategoryId,
        team_id: vote.teamId,
        status: vote.status || 'valid',
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'judge_id,award_category_id',
      });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Removes an award vote from Supabase (e.g. toggle remove).
 */
export async function removeAwardVoteRemote(judgeId: string, categoryId: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase || !isSupabaseReady()) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase
      .from('award_votes')
      .delete()
      .match({ judge_id: judgeId, award_category_id: categoryId });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Updates settings in Supabase.
 */
export async function updateSettingsRemote(updates: Partial<JudgingSettings>): Promise<{ success: boolean; error?: string }> {
  if (!supabase || !isSupabaseReady()) return { success: false };

  try {
    const dbUpdates: any = {
      updated_at: new Date().toISOString(),
    };
    if (updates.isJudgingOpen !== undefined) dbUpdates.is_judging_open = updates.isJudgingOpen;
    if (updates.areResultsLocked !== undefined) dbUpdates.are_results_locked = updates.areResultsLocked;
    if (updates.areResultsPublished !== undefined) dbUpdates.are_results_published = updates.areResultsPublished;
    if (updates.allowRepeatCategoryWinners !== undefined) dbUpdates.allow_repeat_category_winners = updates.allowRepeatCategoryWinners;
    if (updates.allowSubFourCalculation !== undefined) dbUpdates.allow_sub_four_calculation = updates.allowSubFourCalculation;
    if (updates.subFourReason !== undefined) dbUpdates.sub_four_reason = updates.subFourReason;
    if (updates.publishedRevealStage !== undefined) dbUpdates.published_reveal_stage = updates.publishedRevealStage;

    const { error } = await supabase
      .from('judging_settings')
      .update(dbUpdates)
      .eq('id', 'default');

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
