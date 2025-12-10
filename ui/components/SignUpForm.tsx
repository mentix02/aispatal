"use client";

import Form from "next/form";
import { useActionState } from "react";

import { signUp, SignUpFormState } from "@/actions/auth";
export default function SignUpForm() {
  // Initialize useActionState with the server action and an initial state (empty object)
  const [signUpState, signUpAction] = useActionState<SignUpFormState, FormData>(signUp, {});

  // Helper function to render validation errors for a specific field
  const renderErrors = (fieldKey: keyof SignUpFormState) => {
    const errors = signUpState[fieldKey];
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
    <Form action={signUpAction} className="space-y-6">
      {/* GLOBAL ERROR MESSAGE */}
      {signUpState.error && (
        <div className="rounded-lg border border-red-400 bg-red-50 p-3 text-red-700">
          <p className="font-semibold">Error:</p>
          <p className="text-sm">{signUpState.error[0]}</p>
        </div>
      )}

      {/* Full Name Field */}
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
          Full Name
        </label>
        <input
          required
          autoFocus
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="John Doe"
          // Conditional styling for error state: border-red-500 if error exists
          className={`w-full rounded-lg border px-4 py-2 shadow-sm transition duration-150 focus:border-transparent focus:ring-2 ${
            signUpState.name ? "border-red-500 ring-red-500" : "ring-primary-600 border-gray-300"
          }`}
        />
        {renderErrors("name")}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          // Conditional styling for error state
          className={`w-full rounded-lg border px-4 py-2 shadow-sm transition duration-150 focus:border-transparent focus:ring-2 ${
            signUpState.email ? "border-red-500 ring-red-500" : "ring-primary-600 border-gray-300"
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
          autoComplete="new-password"
          required
          placeholder="••••••••"
          // Conditional styling for error state
          className={`w-full rounded-lg border px-4 py-2 shadow-sm transition duration-150 focus:border-transparent focus:ring-2 ${
            signUpState.password ? "border-red-500 ring-red-500" : "ring-primary-600 border-gray-300"
          }`}
        />
        {renderErrors("password")}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirm_password" className="mb-1 block text-sm font-medium text-slate-700">
          Confirm Password
        </label>
        <input
          id="confirm_password"
          name="confirm_password"
          type="password"
          required
          placeholder="••••••••"
          // Conditional styling for error state
          className={`w-full rounded-lg border px-4 py-2 shadow-sm transition duration-150 focus:border-transparent focus:ring-2 ${
            signUpState.confirm_password ? "border-red-500 ring-red-500" : "ring-primary-600 border-gray-300"
          }`}
        />
        {renderErrors("confirm_password")}
      </div>

      {/* Terms & Conditions Checkbox */}
      <div className="flex items-start">
        <div className="flex h-5 items-center">
          <input
            id="terms-conditions"
            name="terms-conditions"
            type="checkbox"
            required
            className="text-primary-600 focus:ring-primary-600 h-4 w-4 rounded border-gray-300"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="terms-conditions" className="font-medium text-slate-700">
            I agree to the
            <a href="#" className="text-primary-600 ml-1 font-medium hover:text-cyan-700">
              Terms and Conditions
            </a>
          </label>
        </div>
      </div>

      {/* Sign Up Button */}
      <div>
        <button
          type="submit"
          className="bg-primary-600 hover:bg-primary-700 ring-primary-600 flex w-full justify-center rounded-lg border border-transparent px-4 py-2.5 text-lg font-semibold text-white shadow-md transition duration-150 focus:ring-2 focus:ring-offset-2 focus:outline-none"
        >
          Create Account
        </button>
      </div>
    </Form>
  );
}
