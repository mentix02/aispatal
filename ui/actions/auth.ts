"use server";

import z from "zod";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

const SignUpDataSchema = z.object({
  name: z.string().nonempty(),
  email: z.email().nonempty(),
  confirm_password: z.string().min(8, "Please confirm your password."),
  password: z.string().nonempty().min(8, { error: "Password should be at least 8 characters." }).max(128),
});

export type SignUpData = z.infer<typeof SignUpDataSchema>;

export type SignUpFormState = {
  // keyof SignUpData: string[] - list of errors per field
  [key in keyof SignUpData]?: string[];
} & {
  error?: string[];
};

const SignInDataSchema = z.object({
  email: z.string().nonempty(),
  password: z.string().nonempty(),
});

export type SignInData = z.infer<typeof SignInDataSchema>;

export type SignInFormState = {
  [key in keyof SignInData]?: string[];
} & {
  error?: string[];
};

export async function signUp(previousState: SignUpFormState, formData: FormData): Promise<SignUpFormState> {
  const data: SignUpData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirm_password: formData.get("confirm_password") as string,
  };

  // Validate input data
  const parseResult = await SignUpDataSchema.spa(data);

  if (!parseResult.success) {
    const fieldErrors: SignUpFormState = {};
    parseResult.error.issues.forEach((issue) => {
      const fieldName = issue.path[0] as keyof SignUpData;
      console.log("fieldName", fieldName);
      if (!fieldErrors[fieldName]) fieldErrors[fieldName] = [];
      fieldErrors[fieldName]?.push(issue.message);
    });
    return { ...previousState, ...fieldErrors };
  }

  // Check if passwords match
  if (data.password !== data.confirm_password) {
    return {
      ...previousState,
      confirm_password: ["Passwords do not match."],
    };
  }

  try {
    // Create user
    await auth.api.signUpEmail({
      body: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
  } catch (error) {
    return {
      ...previousState,
      error: [(error as Error).message || "An unexpected error occurred during sign up."],
    };
  }

  redirect("/dashboard");
}

export async function signIn(previousState: SignInFormState, formData: FormData): Promise<SignUpFormState> {
  const data: SignInData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Validate input data
  const parseResult = await SignInDataSchema.spa(data);

  if (!parseResult.success) {
    const fieldErrors: SignInFormState = {};
    parseResult.error.issues.forEach((issue) => {
      const fieldName = issue.path[0] as keyof SignInData;
      if (!fieldErrors[fieldName]) fieldErrors[fieldName] = [];
      fieldErrors[fieldName]?.push(issue.message);
    });
    return { ...previousState, ...fieldErrors };
  }

  try {
    // Sign in user
    await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
      headers: await headers(),
    });
  } catch (error) {
    return {
      ...previousState,
      error: [(error as Error).message || "An unexpected error occurred during sign in."],
    };
  }

  redirect("/dashboard");
}
