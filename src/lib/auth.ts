import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export type CurrentUser = {
  id: string;
  email: string | null;
};

// Data access layer for the session. Reads cookies, so call it behind <Suspense>.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return null;

  return { id: claims.sub, email: claims.email ?? null };
}

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  return data?.role === "admin";
}

// Gate for admin pages and actions. Non-admins get a 404 so the area is not
// advertised. Row-level security enforces the same rule in the database.
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireUser();
  if (!(await isAdmin(user.id))) notFound();
  return user;
}
