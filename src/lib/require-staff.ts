import { auth } from "@/auth";

export async function requireStaffSession() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const isStaff = role === "ADMIN" || role === "MODERATOR";
  return { session, isStaff };
}
