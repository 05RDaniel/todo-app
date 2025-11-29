import { TaskListClient } from "./task-list-client";
import { TaskWithParent } from "@/types";

type TaskListProps = {
  tasks: TaskWithParent[];
};

export function TaskList({ tasks }: TaskListProps) {
  return <TaskListClient tasks={tasks} />;
}

