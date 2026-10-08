import { AuthForm } from "@/app/auth-form";

export default function SignupPage() {
  return (
    <section className="auth-page">
      <h1>Create account</h1>
      <AuthForm mode="signup" />
    </section>
  );
}
