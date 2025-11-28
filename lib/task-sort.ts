import { Task } from "@prisma/client";

const priorityOrder = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
} as const;

const statusOrder = {
  IN_PROGRESS: 3,
  PENDING: 2,
  DONE: 1,
} as const;

export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    // 1. Ordenar primero por estado: IN_PROGRESS > PENDING > DONE
    const aStatus = statusOrder[a.status];
    const bStatus = statusOrder[b.status];

    if (aStatus !== bStatus) {
      return bStatus - aStatus; // Mayor orden primero (IN_PROGRESS primero)
    }

    // 2. Si tienen el mismo estado, ordenar por fecha de finalización (dueDate) - más cercana primero
    // Las tareas sin fecha van al final
    const aDueDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
    const bDueDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;

    if (aDueDate !== bDueDate) {
      return aDueDate - bDueDate;
    }

    // 3. Si tienen la misma fecha (o ambas son null), ordenar por prioridad (más alta primero)
    const aPriority = priorityOrder[a.priority];
    const bPriority = priorityOrder[b.priority];

    if (aPriority !== bPriority) {
      return bPriority - aPriority; // Mayor prioridad primero
    }

    // 4. Si siguen iguales, ordenar por antigüedad (más antiguo primero)
    const aCreated = new Date(a.createdAt).getTime();
    const bCreated = new Date(b.createdAt).getTime();

    return aCreated - bCreated;
  });
}

