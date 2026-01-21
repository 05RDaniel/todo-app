import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { sortTasks } from "@/lib/task-sort";
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

export async function GET() {
  try {
    const user = await requireAuth();

    const tasks = await prisma.task.findMany({
      where: { userId: user.id },
      include: {
        parent: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: [
        { status: "asc" },
        { dueDate: "asc" },
        { priority: "desc" },
        { createdAt: "asc" },
      ],
    });

    const sortedTasks = sortTasks(tasks);

    return NextResponse.json({ tasks: sortedTasks });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error && error.message.includes("Unauthorized") ? 401 : 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const parsed = CreateTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid task data" },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title: parsed.data.title.trim(),
        description: parsed.data.description,
        priority: parsed.data.priority,
        status: "PENDING",
        dueDate: parsed.data.dueDate,
        userId: user.id,
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error && error.message.includes("Unauthorized") ? 401 : 500 }
    );
  }
}

