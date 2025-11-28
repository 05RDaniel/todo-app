"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

type LoginState = {
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
      password: parsed.data.password,
      OR: [
        { username: parsed.data.identifier },
        { email: parsed.data.identifier },
      ],
    },
  });

  if (!user) {
    return { error: "Invalid username/email or password" };
  }

  redirect(`/home?user=${encodeURIComponent(user.username)}`);
}

