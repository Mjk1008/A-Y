import { redirect } from "next/navigation";

// Signup is now handled via phone OTP on the login page
export default function SignupPage() {
  redirect("/login");
}
