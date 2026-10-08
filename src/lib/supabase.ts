import { createClient } from "@supabase/supabase-js";

// Server-side only: these env vars have no NEXT_PUBLIC_ prefix, so they are
// never shipped to the browser. The publishable (anon) key is subject to RLS.
export function createSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY environment variable.",
    );
  }

  // supabase-js appends /rest/v1 itself, so strip any path/trailing slash.
  return createClient(new URL(url).origin, key, {
    auth: { persistSession: false },
  });
}
