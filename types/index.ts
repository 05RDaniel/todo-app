import { Task } from "@prisma/client";

export type TaskWithParent = Task & {
  parent: {
    id: string;
    title: string;
  } | null;
};

