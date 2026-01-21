import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const UpdateTaskSchema = z.object({
  title: z.string().min(3, "Add a short title").max(80).optional(),
  description: z
    .string()
    .max(280, "Keep the description under 280 characters")
    .optional()
    .transform((val) => (val?.trim() ? val.trim() : undefined)),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "DONE"]).optional(),
  dueDate: z
    .string()
    .optional()
    .transform((value) => (value ? new Date(value) : undefined))
    .refine(
      (value) => !value || !Number.isNaN(value.getTime()),
      "Enter a valid due date",
    ),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const task = await prisma.task.findFirst({
      where: { id, userId: user.id },
      include: {
        parent: {
          select: {
            id: true,
            title: true,
          },
        },
        subtasks: {
          orderBy: [
            { status: "asc" },
            { dueDate: "asc" },
            { priority: "desc" },
            { createdAt: "asc" },
          ],
        },
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ task });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error && error.message.includes("Unauthorized") ? 401 : 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    const task = await prisma.task.findFirst({
      where: { id, userId: user.id },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    const parsed = UpdateTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid task data" },
        { status: 400 }
      );
    }

    const updateData: {
      title?: string;
      description?: string | null;
      priority?: "LOW" | "MEDIUM" | "HIGH";
      status?: "PENDING" | "IN_PROGRESS" | "DONE";
      dueDate?: Date | null;
      completedAt?: Date | null;
    } = {};
    if (parsed.data.title !== undefined) updateData.title = parsed.data.title.trim();
    if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
    if (parsed.data.priority !== undefined) updateData.priority = parsed.data.priority;
    if (parsed.data.dueDate !== undefined) updateData.dueDate = parsed.data.dueDate;

    if (parsed.data.status !== undefined) {
      const newStatus = parsed.data.status;
      updateData.status = newStatus;
      if (newStatus === "DONE") {
        updateData.completedAt = new Date();
      } else if (task.status === "DONE") {
        // Task was DONE but is now changing to PENDING or IN_PROGRESS
        updateData.completedAt = null;
      }
      // Otherwise, keep the existing completedAt
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ task: updatedTask });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error && error.message.includes("Unauthorized") ? 401 : 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const task = await prisma.task.findFirst({
      where: { id, userId: user.id },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    // Delete all subtasks first
    await prisma.task.deleteMany({
      where: { parentId: id },
    });

    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error && error.message.includes("Unauthorized") ? 401 : 500 }
    );
  }
}

