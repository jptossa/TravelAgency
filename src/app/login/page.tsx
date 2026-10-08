import { AuthForm } from "@/app/auth-form";

export default function LoginPage() {
  return (
    <section className="auth-page">
      <h1>Sign in</h1>
      <AuthForm mode="login" />
    </section>
  );
}
