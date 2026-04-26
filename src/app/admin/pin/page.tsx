import { redirect } from "next/navigation";

// PIN authentication removed — admin access is now based on phone/is_admin field only
export default function AdminPinPage() {
  redirect("/admin");
}
