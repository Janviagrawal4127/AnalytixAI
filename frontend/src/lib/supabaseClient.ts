import { createClient } from "@supabase/supabase-js";

/**
 * Sanitizes environment variable strings to guarantee they only contain
 * valid ISO-8859-1 / ASCII characters without quotes or trailing whitespace.
 * Prevents browser "Failed to read the 'headers' property from 'RequestInit':
 * String contains non ISO-8859-1 code point" when initializing Supabase headers.
 */
function cleanEnvString(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  // Strip quotes, smart quotes, and any non-ASCII characters (> 127)
  const cleaned = value
    .replace(/[^\x20-\x7E]/g, "")
    .trim()
    .replace(/^["'`]|["'`]$/g, "");
  return cleaned || fallback;
}

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseUrl = cleanEnvString(rawUrl, "https://placeholder-project.supabase.co");
const supabaseAnonKey = cleanEnvString(rawKey, "placeholder-anon-key");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
