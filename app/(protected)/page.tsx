import { redirect } from "next/navigation";

export default function ProtectedPage() {
  // Server-side redirect zur Dashboard-Seite
  redirect("/dashboard");
}
