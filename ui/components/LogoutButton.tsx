"use client";

import { redirect } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export default function LogoutButton() {
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          redirect("/login");
        },
      },
    });
  };

  // Tailwind CSS classes for styling
  return (
    <button className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600" onClick={handleLogout}>
      Logout
    </button>
  );
}
