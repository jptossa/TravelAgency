import { Suspense } from "react";
import { signOut } from "@/app/auth/actions";
import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default function AccountPage() {
  return (
    <Suspense fallback={<p className="muted">Loading your account…</p>}>
      <AccountContent />
    </Suspense>
  );
}

async function AccountContent() {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, role")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <section>
      <h1>Your account</h1>
      <dl>
        <dt>Name</dt>
        <dd>{profile?.display_name ?? "—"}</dd>
        <dt>Email</dt>
        <dd>{user.email}</dd>
      </dl>
      <form action={signOut}>
        <button type="submit" className="button">
          Sign out
        </button>
      </form>
    </section>
  );
}
