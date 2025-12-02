"use client";

import { useState, useCallback, memo } from "react";
import { TaskFilters } from "./task-filters";
import { TaskListClient } from "./task-list-client";
import Link from "next/link";
import { TaskWithParent } from "@/types";

type TasksPageClientProps = {
  tasks: TaskWithParent[];
};

export const TasksPageClient = memo(function TasksPageClient({ tasks }: TasksPageClientProps) {
  const [filteredTasks, setFilteredTasks] = useState<TaskWithParent[]>(tasks);

  const handleFilteredTasksChange = useCallback((filtered: TaskWithParent[]) => {
    setFilteredTasks(filtered);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <TaskFilters tasks={tasks} onFilteredTasksChange={handleFilteredTasksChange} />
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
        <TaskListClient tasks={filteredTasks} />
      </div>
    </div>
  );
});

