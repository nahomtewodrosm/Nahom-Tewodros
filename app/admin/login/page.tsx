import { login } from "../../actions";
import Link from "next/link";
export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <div className="wrap" style={{ maxWidth: 420, paddingTop: 120 }}>
      <Link href="/" className="admin-home-link">← Back to portfolio</Link>
      <p className="label">Admin</p>
      <h2 style={{ fontSize: 36 }}>Enter password</h2>
      <form action={login} className="stack">
        <input name="password" type="password" placeholder="Password" autoFocus required />
        {error && <p style={{ color: "#ff6b6b" }}>Wrong password.</p>}
        <button>Sign in</button>
      </form>
    </div>
  );
}
