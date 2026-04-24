import { redirect } from "next/navigation";

/**
 * /upgrade is deprecated — billing is now handled at /billing/checkout.
 * Keep this route so old links don't 404; just redirect.
 */
export default function UpgradePage() {
  redirect("/billing/checkout");
}
