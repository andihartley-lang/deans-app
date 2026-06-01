export function getStatus(dueDate: string | null) {
  if (!dueDate) return "captured";

  const now = new Date();
  const due = new Date(dueDate);

  const diffTime = due.getTime() - now.getTime();

  const diffDays = Math.ceil(
    diffTime / (1000 * 60 * 60 * 24)
  );

  if (diffDays <= 2) {
    return "critical";
  }

  if (diffDays <= 14) {
    return "active";
  }

  return "scheduled";
}