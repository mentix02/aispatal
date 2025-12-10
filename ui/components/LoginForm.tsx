"use client";

import Form from "next/form";
import { useActionState } from "react";

import { signIn, SignInFormState } from "@/actions/auth";

export default function LoginForm() {
  const [signInState, signInAction] = useActionState<SignInFormState, FormData>(signIn, {});

  const renderErrors = (fieldKey: keyof SignInFormState) => {
    const errors = signInState[fieldKey];
    if (errors && errors.length > 0) {
      return (
        <ul className="mt-1 space-y-0.5 text-sm text-red-600">
          {errors.map((error, index) => (
            <li key={index} className="list-inside list-disc">
              {error}
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  return (
    <Form action={signInAction} className="space-y-6">
      {/* GLOBAL ERROR MESSAGE */}
      {signInState.error && (
        <div className="rounded-lg border border-red-400 bg-red-50 p-3 text-red-700">
          <p className="font-semibold">Error:</p>
          <p className="text-sm">{signInState.error[0]}</p>
        </div>
      )}

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
          Email Address
        </label>
        <input
          required
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={`w-full rounded-lg border px-4 py-2 shadow-sm transition duration-150 focus:border-transparent focus:ring-2 ${
            signInState.email ? "border-red-500 ring-red-500" : "ring-primary-600 border-gray-300"
          }`}
        />
        {renderErrors("email")}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className={`w-full rounded-lg border px-4 py-2 shadow-sm transition duration-150 focus:border-transparent focus:ring-2 ${
            signInState.password ? "border-red-500 ring-red-500" : "ring-primary-600 border-gray-300"
          }`}
        />
        {renderErrors("password")}
      </div>

      {/* Remember Me / Forgot Password Links */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="text-primary-600 focus:ring-primary-600 h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="remember-me" className="ml-2 block text-slate-700">
            Remember me
          </label>
        </div>

        <a href="#" className="text-primary-600 font-medium transition duration-150 hover:text-cyan-700">
          Forgot password?
        </a>
      </div>

      {/* Login Button */}
      <div>
        <button
          type="submit"
          className="bg-primary-600 hover:bg-primary-700 ring-primary-600 flex w-full justify-center rounded-lg border border-transparent px-4 py-2.5 text-lg font-semibold text-white shadow-md transition duration-150 focus:ring-2 focus:ring-offset-2 focus:outline-none"
        >
          Sign in
        </button>
      </div>
    </Form>
  );
}
