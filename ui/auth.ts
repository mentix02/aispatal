import { Pool } from "pg";
import * as crypto from "crypto";
import { betterAuth } from "better-auth";

const DJANGO_ARGON_PREFIX = "argon2";

export const auth = betterAuth({
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  // Password Hashing
  emailAndPassword: {
    enabled: true,
    password: {
      // Django's Argon2id hashes have an extra "argon2" prefix that Bun doesn't expect, so we add it back when hashing
      hash: async (password: string) => DJANGO_ARGON_PREFIX + (await Bun.password.hash(password, "argon2id")),
      verify: async ({ hash, password }) => {
        if (hash.startsWith(DJANGO_ARGON_PREFIX)) hash = hash.substring(DJANGO_ARGON_PREFIX.length);
        return await Bun.password.verify(password, hash, "argon2id");
      },
    },
  },
  // ID Generation Strategy
  advanced: {
    database: {
      generateId: "serial",
    },
  },
  // Table Configurations
  user: {
    modelName: "user_user", // shared with Django managed table
    fields: {
      createdAt: "created_at",
      updatedAt: "updated_at",
      emailVerified: "email_verified",
    },
    additionalFields: {
      is_staff: { type: "boolean", defaultValue: false, required: false, input: false }, // shared with Django managed table
      is_superuser: { type: "boolean", defaultValue: false, required: false, input: false }, // shared with Django managed table
      is_active: { type: "boolean", defaultValue: true, required: false, input: false }, // shared with Django managed table
      skey: { type: "string", unique: true, input: false, defaultValue: () => crypto.randomUUID() },
      access_key: {
        input: false,
        type: "string",
        required: false,
        defaultValue: () => crypto.randomBytes(24).toString("base64url"),
      }, // same as Python's `secrets.token_urlsafe(24) [which produces a 32-character string]`
    },
  },
  // Rename tables to avoid conflicts with Django managed tables
  account: { modelName: "nextjs_account" },
  session: { modelName: "nextjs_session" },
  verification: { modelName: "nextjs_verification" },
});
