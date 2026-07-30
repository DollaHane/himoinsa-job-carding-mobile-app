export function isToday(dateStr: string | null | undefined): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const today = new Date();
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

export function isTomorrow(dateStr: string | null | undefined): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    d.getFullYear() === tomorrow.getFullYear() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getDate() === tomorrow.getDate()
  );
}

export function isOverdue(dateStr: string | null | undefined): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d < now && !isToday(dateStr);
}

export function formatSeconds(s: number | null | undefined) {
  if (!s) return "N/A";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function formatUnixDateTime(ts: number): string {
  const d = new Date(ts * 1000);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleDateString("en-ZA", { month: "long" });
  const year = String(d.getFullYear()).slice(-2);
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  return `${day} ${month} ${year}, ${h}:${m}:${s}`;
}

export function formatTimerRange(
  start: string | number | null | undefined,
  end: string | number | null | undefined,
): string {
  if (!start || !end) return "—";
  const s = parseUnixDateTime(Number(start));
  const e = parseUnixDateTime(Number(end));
  if (s.date === e.date && s.time === e.time) return `${s.date}, ${s.time}`;
  if (s.date === e.date) return `${s.date}, ${s.time} — ${e.time}`;
  return `${s.date}, ${s.time} — ${e.date}, ${e.time}`;
}

function parseUnixDateTime(ts: number): { date: string; time: string } {
  const d = new Date(ts * 1000);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleDateString("en-ZA", { month: "long" });
  const year = String(d.getFullYear()).slice(-2);
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  return { date: `${day} ${month} ${year}`, time: `${h}:${m}:${s}` };
}

export function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
