export interface TaskTable {
  rows: number;
  cols: number;
  readOnly?: boolean[][];
}

export interface TaskFile {
  name: string;
  url: string;
}

export interface Task {
  number: number;
  answer: string;
  key: string;
  taskId?: string;
  score: number;
  showVideo?: boolean;
  content?: string;
  instruction?: string;
  table?: TaskTable;
  files?: TaskFile[];
}

export interface KimData {
  kim: string;
  tasks: Task[];
  time: number;
  realMode: boolean;
  hideAnswer?: boolean;
  oneAttempt?: boolean;
  authRequired?: boolean;
}

export interface User {
  id: string;
  email?: string;
  name?: string;
  role?: string;
}
