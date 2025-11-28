import { Task } from "@prisma/client";
import { TaskListClient } from "./task-list-client";

type TaskListProps = {
  tasks: Task[];
};

export function TaskList({ tasks }: TaskListProps) {
  return <TaskListClient tasks={tasks} />;
}

