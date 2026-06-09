export function nextYearISO(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function formatDDMMYY(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getFullYear()).slice(2)}`;
}

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
export function getItemIcon(title: string) {
  const lower = title.toLowerCase();

  if (
    lower.includes("mot") ||
    lower.includes("car") ||
    lower.includes("garage")
  ) {
    return "🚗";
  }

  if (
    lower.includes("doctor") ||
    lower.includes("gp") ||
    lower.includes("hospital")
  ) {
    return "🩺";
  }

  if (lower.includes("dentist")) {
    return "🦷";
  }

  if (
    lower.includes("shop") ||
    lower.includes("milk") ||
    lower.includes("buy")
  ) {
    return "🛒";
  }

  if (lower.includes("passport")) {
    return "🛂";
  }

  if (lower.includes("insurance")) {
    return "🛡️";
  }

  if (
    lower.includes("call") ||
    lower.includes("phone")
  ) {
    return "📞";
  }

  if (
    lower.includes("flight") ||
    lower.includes("holiday")
  ) {
    return "✈️";
  }

  if (
    lower.includes("tax") ||
    lower.includes("hmrc") ||
    lower.includes("invoice") ||
    lower.includes("bill") ||
    lower.includes("payment") ||
    lower.includes("bank")
  ) {
    return "🧾";
  }

  if (
    lower.includes("boiler") ||
    lower.includes("plumber") ||
    lower.includes("electric") ||
    lower.includes("gas") ||
    lower.includes("water") ||
    lower.includes("internet") ||
    lower.includes("broadband")
  ) {
    return "🏠";
  }

  if (
    lower.includes("dog") ||
    lower.includes("cat") ||
    lower.includes("vet")
  ) {
    return "🐾";
  }

  if (
    lower.includes("school") ||
    lower.includes("nursery") ||
    lower.includes("parents")
  ) {
    return "🎒";
  }

  return "📝";
}