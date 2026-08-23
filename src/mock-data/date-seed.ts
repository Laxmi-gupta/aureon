/**
 * All mock timestamps are generated relative to "now" so the product always
 * feels current — overdue tasks are actually overdue, "today" always has
 * items due, no matter when this project is demoed.
 */
export function daysFromNow(offset: number, hour = 9, minute = 0): string {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  date.setDate(date.getDate() + offset);
  return date.toISOString();
}

export function hoursFromNow(offset: number): string {
  const date = new Date();
  date.setHours(date.getHours() + offset, date.getMinutes(), 0, 0);
  return date.toISOString();
}
