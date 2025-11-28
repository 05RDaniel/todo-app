"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
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

const UpdateTaskSchema = CreateTaskSchema.extend({
  id: TaskIdSchema,
  status: z.enum(["PENDING", "IN_PROGRESS", "DONE"]).optional(),
});

export async function createTaskAction(formData: FormData) {
  const user = await requireAuth();
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
      userId: user.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/tasks");
}

export async function toggleTaskStatusAction(formData: FormData) {
  const user = await requireAuth();
  const parsed = TaskIdSchema.safeParse(formData.get("taskId"));
  const newStatus = formData.get("newStatus") as "PENDING" | "IN_PROGRESS" | "DONE";

  if (!parsed.success) {
    throw new Error("Task not found");
  }

  if (!newStatus || !["PENDING", "IN_PROGRESS", "DONE"].includes(newStatus)) {
    throw new Error("Invalid status");
  }

  const task = await prisma.task.findFirst({
    where: { id: parsed.data, userId: user.id },
    select: { status: true },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  await prisma.task.update({
    where: { id: parsed.data },
    data: {
      status: newStatus,
      completedAt: newStatus === "DONE" ? new Date() : null,
    },
  });

  revalidatePath("/");
  revalidatePath("/tasks");
}

export async function deleteTaskAction(formData: FormData) {
  const user = await requireAuth();
  const parsed = TaskIdSchema.safeParse(formData.get("taskId"));

  if (!parsed.success) {
    throw new Error("Task not found");
  }

  const task = await prisma.task.findFirst({
    where: { id: parsed.data, userId: user.id },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  // Delete all subtasks first
  await prisma.task.deleteMany({
    where: { parentId: parsed.data },
  });

  // Delete the task
  await prisma.task.delete({
    where: { id: parsed.data },
  });

  revalidatePath("/");
  revalidatePath("/tasks");
}

export async function updateTaskAction(formData: FormData) {
  const user = await requireAuth();
  const parsed = UpdateTaskSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority"),
    dueDate: formData.get("dueDate"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid task data");
  }

  const task = await prisma.task.findFirst({
    where: { id: parsed.data.id, userId: user.id },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  const newStatus: "PENDING" | "IN_PROGRESS" | "DONE" = parsed.data.status ?? task.status;
  const wasDone = task.status === "DONE";
  const isNowDone = newStatus === "DONE";
  
  await prisma.task.update({
    where: { id: parsed.data.id },
    data: {
      title: parsed.data.title.trim(),
      description: parsed.data.description,
      priority: parsed.data.priority,
      dueDate: parsed.data.dueDate,
      status: newStatus,
      completedAt: isNowDone ? new Date() : !isNowDone && wasDone ? null : task.completedAt,
    },
  });

  revalidatePath("/tasks");
  revalidatePath("/");
  revalidatePath(`/tasks/${parsed.data.id}`);
}

const CreateSubtaskSchema = z.object({
  title: z.string().min(3, "Add a short title").max(80),
  description: z
    .string()
    .max(280, "Keep the description under 280 characters")
    .optional()
    .transform((val) => (val?.trim() ? val.trim() : undefined)),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  parentId: TaskIdSchema,
});

export async function createSubtaskAction(formData: FormData) {
  const user = await requireAuth();
  const parsed = CreateSubtaskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority"),
    parentId: formData.get("parentId"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid subtask data");
  }

  // Verify parent task belongs to user
  const parentTask = await prisma.task.findFirst({
    where: { id: parsed.data.parentId, userId: user.id },
  });

  if (!parentTask) {
    throw new Error("Parent task not found");
  }

  await prisma.task.create({
    data: {
      title: parsed.data.title.trim(),
      description: parsed.data.description,
      priority: parsed.data.priority,
      status: "PENDING",
      userId: user.id,
      parentId: parsed.data.parentId,
    },
  });

  revalidatePath(`/tasks/${parsed.data.parentId}`);
  revalidatePath("/tasks");
}

export async function deleteSubtaskAction(formData: FormData) {
  const user = await requireAuth();
  const parsed = TaskIdSchema.safeParse(formData.get("subtaskId"));

  if (!parsed.success) {
    throw new Error("Subtask not found");
  }

  const subtask = await prisma.task.findFirst({
    where: { id: parsed.data, userId: user.id },
    include: { parent: true },
  });

  if (!subtask) {
    throw new Error("Subtask not found");
  }

  await prisma.task.delete({
    where: { id: parsed.data },
  });

  revalidatePath("/tasks");
  if (subtask.parent) {
    revalidatePath(`/tasks/${subtask.parent.id}`);
  }
}

