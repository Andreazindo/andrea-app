import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function requireAdmin(callbackUrl = "/admin/ventas/nueva") {
  const session = await auth();
  if (!session?.user?.id) redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  if (session.user.role !== "ADMIN" && session.user.role !== "OWNER") {
    redirect("/tienda");
  }
  return session.user;
}
