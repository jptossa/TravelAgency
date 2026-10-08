import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/supabase-config";

// Anonymous client for public catalogue data (e.g. planets). It has no user
// session, so it is safe inside "use cache" functions. For user-scoped data
// use createSupabaseServerClient() from supabase-server.ts instead.
export function createSupabaseClient() {
  const { url, key } = getSupabaseConfig();
  return createClient(url, key, { auth: { persistSession: false } });
}
