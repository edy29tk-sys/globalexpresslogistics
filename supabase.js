import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseReady = Boolean(url && anonKey);
export const supabase = supabaseReady ? createClient(url, anonKey) : null;

export function configMessage() {
  return "Connect your Supabase project by setting VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.";
}