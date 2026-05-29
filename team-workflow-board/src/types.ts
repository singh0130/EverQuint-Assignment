export type ColumnStatus = 'Backlog' | 'In Progress' | 'Done';

export type PriorityLevel = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: ColumnStatus;
  priority: PriorityLevel;
  assignee: string;
  tags: string[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface FilterState {
  search: string;
  assignee: string;
  priority: string;
  tag: string;
}

export type SortField = 'createdAt' | 'priority';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: SortField;
  direction: SortDirection;
}
