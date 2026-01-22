
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface SummaryResponse {
  summary: string;
  error?: string;
}

export interface TasksResponse {
  tasks: Task[];
  error?: string;
}
