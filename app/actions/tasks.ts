"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CreateTaskSchema = z.object({
  title: z.string().min(3, "Add a short title").max(80),
  description: z
    .string()
    .max(280, "Keep the description under 280 characters")
    .optional()
    .transform((val) => (val?.trim() ? val.trim() : undefined)),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  dueDate: z
    .string()
    .optional()
    .transform((value) => (value ? new Date(value) : undefined))
    .refine(
      (value) => !value || !Number.isNaN(value.getTime()),
      "Enter a valid due date",
    ),
});

const TaskIdSchema = z.string().cuid();

export async function createTaskAction(formData: FormData) {
  const parsed = CreateTaskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority"),
    dueDate: formData.get("dueDate"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid task data");
  }

  await prisma.task.create({
    data: {
      title: parsed.data.title.trim(),
      description: parsed.data.description,
      priority: parsed.data.priority,
      status: "PENDING",
      dueDate: parsed.data.dueDate,
    },
  });

  revalidatePath("/");
}

export async function toggleTaskStatusAction(formData: FormData) {
  const parsed = TaskIdSchema.safeParse(formData.get("taskId"));

  if (!parsed.success) {
    throw new Error("Task not found");
  }

  const task = await prisma.task.findUnique({
    where: { id: parsed.data },
    select: { status: true },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  const nextStatus = task.status === "DONE" ? "PENDING" : "DONE";

  await prisma.task.update({
    where: { id: parsed.data },
    data: {
      status: nextStatus,
      completedAt: nextStatus === "DONE" ? new Date() : null,
    },
  });

  revalidatePath("/");
}

export async function deleteTaskAction(formData: FormData) {
  const parsed = TaskIdSchema.safeParse(formData.get("taskId"));

  if (!parsed.success) {
    throw new Error("Task not found");
  }

  await prisma.task.delete({
    where: { id: parsed.data },
  });

  revalidatePath("/");
}

