"use client";

import { useState } from "react";
import { Task } from "@prisma/client";
import { TaskFilters } from "./task-filters";
import { TaskList } from "./task-list";
import Link from "next/link";

type TasksPageClientProps = {
  tasks: Task[];
};

export function TasksPageClient({ tasks }: TasksPageClientProps) {
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <TaskFilters tasks={tasks} onFilteredTasksChange={setFilteredTasks} />
        </div>
        <div className="sm:ml-4 flex-shrink-0">
          <Link
            href="/tasks/new"
            className="inline-block rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-all hover:from-sky-400 hover:to-sky-500 hover:shadow-xl hover:shadow-sky-500/30 whitespace-nowrap"
          >
            + Create new task
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Tasks list</h2>
        <TaskList tasks={filteredTasks} />
      </div>
    </div>
  );
}

