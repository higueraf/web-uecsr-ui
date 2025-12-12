const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";


export function getImageUrl(raw?: string | null): string | undefined {
  if (!raw) return undefined;
  if (raw.startsWith("http")) return raw;
  return `${API_URL}${raw}`;
}
