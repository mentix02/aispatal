import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import LogoutButton from "@/components/LogoutButton";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user.name}!</p>
      <LogoutButton />
    </div>
  );
}
