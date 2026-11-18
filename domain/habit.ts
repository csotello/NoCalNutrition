export const defaultDays: HabitDays = {
  Monday: 'Default',
  Tuesday: 'Default',
  Wednesday: 'Default',
  Thursday: 'Default',
  Friday: 'Default',
  Saturday: 'Default',
  Sunday: 'Default',
};

export type HabitDay =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export type HabitDayStatus = 'Default' | 'Complete' | 'Finished';

export type HabitDays = Record<HabitDay, HabitDayStatus>;

export type HabitType = {
  title: string;
  category: string;
  days: HabitDays;
};

export function isHabitType(value: unknown): value is HabitType {
  if (typeof value !== 'object' || value === null) return false;
  const habit = value as Record<string, unknown>;
  if (
    typeof habit.title !== 'string' ||
    typeof habit.days !== 'object' ||
    habit.days === null
  ) {
    return false;
  }
  if (typeof habit.category !== 'string') return false;
  const days = habit.days as Record<string, unknown>;
  return (Object.keys(defaultDays) as (keyof HabitDays)[]).every(
    day =>
      typeof days[day] === 'string' &&
      ['Default', 'Complete', 'Finished'].includes(days[day] as HabitDayStatus),
  );
}
