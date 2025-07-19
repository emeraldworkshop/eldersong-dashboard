// src/utils/auth.ts
import { supabase } from '@/lib/supabase';

const SESSION_KEY = 'auth_session';

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export function storeSession(session: any, ttlSeconds = 3600) {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, expiresAt }));
}

export function getStoredSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}
