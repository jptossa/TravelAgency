import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import { getCurrentUser } from "@/lib/auth";

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

  return (
    <>
      <Link href="/account">Account</Link>
      <form action={signOut}>
        <button type="submit" className="link-button">
          Sign out
        </button>
      </form>
    </>
  );
}
