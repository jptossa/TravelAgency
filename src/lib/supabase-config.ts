// Shared by every Supabase client (public reads, user sessions, proxy).
// Server-side only: no NEXT_PUBLIC_ prefix, so never shipped to the browser.
export function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY environment variable.",
    );
  }

  // supabase-js appends /rest/v1 itself, so strip any path/trailing slash.
  return { url: new URL(url).origin, key };
}
