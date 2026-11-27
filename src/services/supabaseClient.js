import { createClient } from '@supabase/supabase-js';

// Get config from localStorage or environment
const getStoredConfig = () => {
  const customUrl = localStorage.getItem('usha_supabase_url');
  const customKey = localStorage.getItem('usha_supabase_anon_key');
  
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const url = customUrl || envUrl || '';
  const key = customKey || envKey || '';

  const isValid = Boolean(
    url && 
    key && 
    url.startsWith('https://') && 
    !url.includes('your-project-id') &&
    !key.includes('your-anon-key')
  );

  return { url, key, isValid };
};

const config = getStoredConfig();

export const isSupabaseConfigured = config.isValid;

export const supabase = config.isValid
  ? createClient(config.url, config.key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : null;

export const saveSupabaseConfig = (url, anonKey) => {
  if (url && anonKey) {
    localStorage.setItem('usha_supabase_url', url.trim());
    localStorage.setItem('usha_supabase_anon_key', anonKey.trim());
  } else {
    localStorage.removeItem('usha_supabase_url');
    localStorage.removeItem('usha_supabase_anon_key');
  }
};

export const getSupabaseConfig = () => {
  return getStoredConfig();
};
