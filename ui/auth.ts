import { Pool } from "pg";
import * as crypto from "crypto";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

const DJANGO_ARGON_PREFIX = "argon2";

const djangoHashPassword = async (password: string) =>
  DJANGO_ARGON_PREFIX + (await Bun.password.hash(password, "argon2id"));
const djangoVerifyPassword = async ({ hash, password }: { hash: string; password: string }) => {
  if (hash.startsWith(DJANGO_ARGON_PREFIX)) hash = hash.substring(DJANGO_ARGON_PREFIX.length);
  return await Bun.password.verify(password, hash, "argon2id");
};

export const auth = betterAuth({
  // Database Connection
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  // Plugins
  plugins: [nextCookies()],
  // Password Hashing
  databaseHooks: {
    user: {
      create: {
        before: async (user, context) => {
          const hashedPassword = await context?.context.password.hash(context?.body.password);
          const userWithPassword = { ...user, password: hashedPassword };
          return { data: userWithPassword };
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    password: {
      // Django's Argon2id hashes have an extra "argon2" prefix that Bun doesn't expect, so we add it back when hashing
      hash: djangoHashPassword,
      verify: djangoVerifyPassword,
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
      password: { type: "string", required: false, input: false }, // shared with Django managed table
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
  // Rename tables to avoid conflicts with Django managed tables.
  // Just turn pascalCase to snake_case.
  account: {
    modelName: "nextjs_account",
    fields: {
      userId: "user_id",
      accountId: "account_id",
      providerId: "provider_id",

      idToken: "id_token",
      accessToken: "access_token",
      refreshToken: "refresh_token",
      accessTokenExpiresAt: "access_token_expires_at",
      refreshTokenExpiresAt: "refresh_token_expires_at",

      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  session: {
    modelName: "nextjs_session",
    fields: {
      userId: "user_id",
      expiresAt: "expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
      ipAddress: "ip_address",
      userAgent: "user_agent",
    },
  },
  verification: {
    modelName: "nextjs_verification",
    fields: {
      expiresAt: "expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
});
