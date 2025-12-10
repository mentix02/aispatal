import Link from "next/link";

import SignUpForm from "@/components/SignUpForm";

export default async function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Sign Up Card Container */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-2xl sm:p-10">
          {/* Header/Title Section */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-slate-800">Create Your Account</h1>
            <p className="mt-2 text-slate-500">Sign up to get started with your new account.</p>
          </div>

          {/* Render the extracted form component */}
          <SignUpForm />

          {/* Login Link */}
          <div className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-primary-600 font-medium transition duration-150 hover:text-cyan-700">
              Sign in
            </Link>
          </div>
        </div>
        {/* End Sign Up Card */}
      </div>
    </div>
  );
}
