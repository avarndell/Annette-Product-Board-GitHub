import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Without keys the app runs in demo mode and saves to this browser only.
export const hasConfig = Boolean(url && anonKey);
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
