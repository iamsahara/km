import Link from "next/link";
import { withRole } from "@/lib/role";

export default function LoginPage() {
  return (
    <div className="login-card">
      <h1>KM Login</h1>
      <p>Select a role to enter the app.</p>
      <div className="login-actions">
        <Link href={withRole("/dashboard", "manager")}>Continue as manager</Link>
        <Link href={withRole("/dashboard", "staff")}>Continue as staff</Link>
      </div>
    </div>
  );
}
