export interface Item {
  id: string;
  title: string;
  due_date: string | null;
  status: string;
  created_at: string;
  completed_at: string | null;
}