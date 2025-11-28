"use client";

import { useState, useMemo, useEffect } from "react";
import { Task } from "@prisma/client";

type TaskFiltersProps = {
  tasks: Task[];
  onFilteredTasksChange: (tasks: Task[]) => void;
};

export function TaskFilters({ tasks, onFilteredTasksChange }: TaskFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "IN_PROGRESS" | "DONE">(
    "ALL",
  );
  const [priorityFilter, setPriorityFilter] = useState<"ALL" | "LOW" | "MEDIUM" | "HIGH">("ALL");

  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Búsqueda por texto (título y descripción)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query)),
      );
    }

    // Filtro por estado
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    // Filtro por prioridad
    if (priorityFilter !== "ALL") {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    return filtered;
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  // Notificar cambios a el componente padre
  useEffect(() => {
    onFilteredTasksChange(filteredTasks);
  }, [filteredTasks, onFilteredTasksChange]);

  const resultCount = filteredTasks.length;
  const hasActiveFilters = searchQuery.trim() || statusFilter !== "ALL" || priorityFilter !== "ALL";

  return (
    <div className="rounded-xl border border-slate-800/70 bg-gradient-to-br from-slate-900/60 to-slate-900/40 p-3 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
          Search & Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("ALL");
              setPriorityFilter("ALL");
            }}
            className="text-[10px] font-semibold uppercase tracking-wide text-sky-300 hover:text-sky-200 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto] sm:items-center">
        {/* Búsqueda */}
        <div>
          <label htmlFor="search" className="sr-only">
            Search tasks
          </label>
          <div className="relative">
            <svg
              className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              id="search"
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-800/70 bg-slate-950/60 pl-7 pr-2.5 py-1.5 text-xs text-white placeholder:text-slate-500 transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
          </div>
        </div>

        {/* Filtro por estado */}
        <div className="sm:ml-2">
          <label className="sr-only">Status</label>
          <div className="flex gap-0.5 rounded-lg border border-slate-800/70 bg-slate-950/60 p-0.5">
            {[
              { value: "ALL", label: "All" },
              { value: "PENDING", label: "Pending" },
              { value: "IN_PROGRESS", label: "Progress" },
              { value: "DONE", label: "Done" },
            ].map((option) => {
              const isSelected = statusFilter === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatusFilter(option.value as typeof statusFilter)}
                  className={`rounded-md px-1.5 py-1 text-[9px] font-semibold uppercase tracking-wide transition-all ${
                    isSelected
                      ? "bg-sky-500/20 text-sky-300"
                      : "text-slate-400 hover:bg-slate-900/80 hover:text-slate-300"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtro por prioridad */}
        <div className="sm:ml-2">
          <label className="sr-only">Priority</label>
          <div className="flex gap-0.5 rounded-lg border border-slate-800/70 bg-slate-950/60 p-0.5">
            {[
              { value: "ALL", label: "All", color: "" },
              { value: "LOW", label: "L", color: "bg-emerald-500" },
              { value: "MEDIUM", label: "M", color: "bg-amber-500" },
              { value: "HIGH", label: "H", color: "bg-rose-500" },
            ].map((option) => {
              const isSelected = priorityFilter === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPriorityFilter(option.value as typeof priorityFilter)}
                  className={`rounded-md px-1.5 py-1 text-[10px] font-bold transition-all ${
                    isSelected
                      ? option.value === "ALL"
                        ? "bg-sky-500/20 text-sky-300"
                        : `${option.color} text-white shadow-sm`
                      : "text-slate-400 hover:bg-slate-900/80 hover:text-slate-300"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contador de resultados */}
      {hasActiveFilters && (
        <div className="mt-2 rounded-lg border border-slate-800/70 bg-slate-950/40 px-2.5 py-1 text-center">
          <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
            Showing {resultCount} of {tasks.length} tasks
          </p>
        </div>
      )}
    </div>
  );
}

