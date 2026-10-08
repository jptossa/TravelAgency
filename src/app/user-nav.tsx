import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import { getCurrentUser, isAdmin } from "@/lib/auth";

// Reads the session, so it must render behind <Suspense> (see layout.tsx).
export async function UserNav() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <>
        <Link href="/login">Sign in</Link>
        <Link href="/signup">Sign up</Link>
      </>
    );
  }

  const admin = await isAdmin(user.id);

  return (
    <>
      {admin && <Link href="/admin">Admin</Link>}
      <Link href="/account">Account</Link>
      <form action={signOut}>
        <button type="submit" className="link-button">
          Sign out
        </button>
      </form>
    </>
  );
}
