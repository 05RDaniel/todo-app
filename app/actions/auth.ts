"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/auth";
import { z } from "zod";
import bcrypt from "bcryptjs";

export type LoginState = {
  error?: string;
};

const LoginSchema = z.object({
  identifier: z.string().min(3, "Enter your username or email"),
  password: z.string().min(1, "Password is required"),
});

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState | void> {
  const parsed = LoginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid credentials",
    };
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: parsed.data.identifier },
        { email: parsed.data.identifier },
      ],
    },
  });

  if (!user) {
    return { error: "Invalid username/email or password" };
  }

  // For existing users with plain text passwords, check directly
  // For new users, passwords will be hashed
  const passwordMatch =
    user.password === parsed.data.password ||
    (await bcrypt.compare(parsed.data.password, user.password).catch(() => false));

  if (!passwordMatch) {
    return { error: "Invalid username/email or password" };
  }

  await setSession(user.id);
  redirect("/");
}

export async function logoutAction() {
  const { clearSession } = await import("@/lib/auth");
  await clearSession();
  redirect("/login");
}

export type RegisterState = {
  error?: string;
};

const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState | void> {
  const parsed = RegisterSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid registration data",
    };
  }

  // Check if username already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { username: parsed.data.username },
        { email: parsed.data.email },
      ],
    },
  });

  if (existingUser) {
    if (existingUser.username === parsed.data.username) {
      return { error: "Username already taken" };
    }
    if (existingUser.email === parsed.data.email) {
      return { error: "Email already registered" };
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      username: parsed.data.username,
      email: parsed.data.email,
      password: hashedPassword,
    },
  });

  await setSession(user.id);
  redirect("/");
}

export type UpdateUsernameState = {
  error?: string;
  success?: boolean;
};

const UpdateUsernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
});

export async function updateUsernameAction(
  _prevState: UpdateUsernameState,
  formData: FormData,
): Promise<UpdateUsernameState> {
  const { requireAuth } = await import("@/lib/auth");
  const user = await requireAuth();

  const parsed = UpdateUsernameSchema.safeParse({
    username: formData.get("username"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid username",
    };
  }

  // Check if username already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      username: parsed.data.username,
      NOT: { id: user.id },
    },
  });

  if (existingUser) {
    return { error: "Username already taken" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { username: parsed.data.username },
  });

  return { success: true };
}

export type ChangePasswordState = {
  error?: string;
  success?: boolean;
};

const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export async function changePasswordAction(
  _prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const { requireAuth } = await import("@/lib/auth");
  const currentUser = await requireAuth();

  const parsed = ChangePasswordSchema.safeParse({
    oldPassword: formData.get("oldPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid password data",
    };
  }

  // Get user with password from database
  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: { password: true },
  });

  if (!user) {
    return { error: "User not found" };
  }

  // Verify old password
  const passwordMatch =
    user.password === parsed.data.oldPassword ||
    (await bcrypt.compare(parsed.data.oldPassword, user.password).catch(() => false));

  if (!passwordMatch) {
    return { error: "Current password is incorrect" };
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(parsed.data.newPassword, 10);

  await prisma.user.update({
    where: { id: currentUser.id },
    data: { password: hashedPassword },
  });

  return { success: true };
}

export type DeleteAccountState = {
  error?: string;
};

export async function deleteAccountAction(
  _prevState: DeleteAccountState,
  formData: FormData,
): Promise<DeleteAccountState | void> {
  const { requireAuth, clearSession } = await import("@/lib/auth");
  const currentUser = await requireAuth();

  const password = formData.get("password") as string;

  if (!password) {
    return { error: "Password is required" };
  }

  // Get user with password from database
  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: { password: true, id: true },
  });

  if (!user) {
    return { error: "User not found" };
  }

  // Verify password
  const passwordMatch =
    user.password === password ||
    (await bcrypt.compare(password, user.password).catch(() => false));

  if (!passwordMatch) {
    return { error: "Password is incorrect" };
  }

  // Delete user and all their tasks
  await prisma.task.deleteMany({
    where: { userId: user.id },
  });

  await prisma.user.delete({
    where: { id: user.id },
  });

  await clearSession();
  redirect("/login");
}

