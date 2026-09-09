// =============================================================================
// BUILDx Hackathon Judging Platform - Supabase Client Configuration
// =============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_URL_KEY = 'buildx_supabase_url';
const STORAGE_KEY_KEY = 'buildx_supabase_anon_key';

export function getSupabaseCredentials(): { url: string; anonKey: string; source: 'env' | 'storage' | 'none' } {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  if (envUrl && envKey && envUrl !== 'MY_SUPABASE_URL' && !envUrl.includes('placeholder')) {
    return { url: envUrl, anonKey: envKey, source: 'env' };
  }

  if (typeof window !== 'undefined') {
    const localUrl = (localStorage.getItem(STORAGE_URL_KEY) || '').trim();
    const localKey = (localStorage.getItem(STORAGE_KEY_KEY) || '').trim();
    if (localUrl && localKey) {
      return { url: localUrl, anonKey: localKey, source: 'storage' };
    }
  }

  return { url: '', anonKey: '', source: 'none' };
}

let activeClient: SupabaseClient | null = null;

export function initSupabase(): SupabaseClient | null {
  const creds = getSupabaseCredentials();
  if (!creds.url || !creds.anonKey) {
    activeClient = null;
    return null;
  }

  try {
    activeClient = createClient(creds.url, creds.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 20,
        },
      },
    });
    return activeClient;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    activeClient = null;
    return null;
  }
}

// Initial client instance
export let supabase: SupabaseClient | null = initSupabase();

export function isSupabaseReady(): boolean {
  const creds = getSupabaseCredentials();
  return Boolean(creds.url && creds.anonKey && activeClient);
}

export function saveSupabaseConfig(url: string, anonKey: string): { success: boolean; error?: string } {
  try {
    const cleanUrl = url.trim().replace(/\/$/, '');
    const cleanKey = anonKey.trim();

    if (!cleanUrl.startsWith('https://')) {
      return { success: false, error: 'يجب أن يبدأ رابط Supabase بـ https://' };
    }
    if (cleanKey.length < 20) {
      return { success: false, error: 'مفتاح Anon Key غير صالح أو قصير جدًا.' };
    }

    localStorage.setItem(STORAGE_URL_KEY, cleanUrl);
    localStorage.setItem(STORAGE_KEY_KEY, cleanKey);

    supabase = initSupabase();
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export function clearSupabaseConfig(): void {
  localStorage.removeItem(STORAGE_URL_KEY);
  localStorage.removeItem(STORAGE_KEY_KEY);
  supabase = initSupabase();
}

// Backward compatibility export
export const isSupabaseConfigured = Boolean(isSupabaseReady());
