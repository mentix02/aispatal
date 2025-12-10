import Link from "next/link";

import { auth } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import LoginForm from "@/components/LoginForm";

export default async function Page() {
  // Check if user is already authenticated
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    // Redirect authenticated users to the dashboard
    return redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Login Card Container */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-2xl sm:p-10">
          {/* Header/Title Section */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-slate-800">Welcome Back</h1>
            <p className="mt-2 text-slate-500">Sign in to continue to your dashboard.</p>
          </div>

          {/* Form Structure (Inputs only, no state/logic) */}
          <LoginForm />

          {/* Signup Link */}
          <div className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary-600 font-medium transition duration-150 hover:text-cyan-700">
              Sign up
            </Link>
          </div>
        </div>
        {/* End Login Card */}
      </div>
    </div>
  );
}
