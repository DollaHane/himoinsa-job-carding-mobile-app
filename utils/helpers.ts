export function encodeURL(str: string): string {
  return encodeURIComponent(str)
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A");
}

export function formatDate (date: Date | null) {
  if (!date) return "";
  return date.toISOString().split("T")[0];
};
