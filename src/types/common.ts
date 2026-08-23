export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type Role = 'administrator' | 'manager' | 'member';

export type Health = 'on-track' | 'at-risk' | 'off-track';

export interface Paginated<T> {
  items: T[];
  total: number;
}
