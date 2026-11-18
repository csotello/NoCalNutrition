export type TaskType = {
  id: string;
  title: string;
  completed: boolean;
};

export function isTaskType(value: unknown): value is TaskType {
  if (typeof value !== 'object' || value === null) return false;
  const task = value as Record<string, unknown>;
  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.completed === 'boolean'
  );
}
