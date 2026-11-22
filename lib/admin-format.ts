/*
 * Display helpers for the admin panel (safe on server and client).
 * Dates are always shown in Pakistan time, where the studio works.
 */

const TIME_ZONE = "Asia/Karachi";

export type Tone = "accent" | "blue" | "violet" | "green" | "red" | "neutral";

type StatusInfo = { label: string; tone: Tone; hint: string };

export const LEAD_STATUSES: Record<string, StatusInfo> = {
  new: { label: "New", tone: "accent", hint: "Not replied to yet" },
  contacted: { label: "Contacted", tone: "blue", hint: "You've reached out" },
  qualified: { label: "Interested", tone: "violet", hint: "A good fit, in talks" },
  converted: { label: "Won", tone: "green", hint: "Became a client" },
  rejected: { label: "Closed", tone: "red", hint: "Not going ahead" },
};

export const APPLICATION_STATUSES: Record<string, StatusInfo> = {
  new: { label: "New", tone: "accent", hint: "Not reviewed yet" },
  reviewing: { label: "Reviewing", tone: "violet", hint: "You're looking at it" },
  contacted: { label: "Contacted", tone: "blue", hint: "You've reached out" },
  hired: { label: "Hired", tone: "green", hint: "Joined the team" },
  rejected: { label: "Not selected", tone: "red", hint: "Not going ahead" },
};

export const LEAD_STATUS_ORDER = ["new", "contacted", "qualified", "converted", "rejected"];
export const APPLICATION_STATUS_ORDER = ["new", "reviewing", "contacted", "hired", "rejected"];

export function statusInfo(kind: "lead" | "application", status: string): StatusInfo {
  const map = kind === "lead" ? LEAD_STATUSES : APPLICATION_STATUSES;
  return map[status] ?? { label: status, tone: "neutral", hint: "" };
}

export function formatDate(iso: string, withTime = false): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit", hour12: true } : {}),
  }).format(new Date(iso));
}

export function timeAgo(iso: string, now = Date.now()): string {
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, size] of steps) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return "just now";
}

export function greeting(now = new Date()): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, hour: "numeric", hour12: false }).format(now),
  );
  if (hour < 5) return "Good evening";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function todayLabel(now = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(now);
}

export function initials(name: string): string {
  // First letter of the first and last word that contain a letter, so
  // "Aisha Khan (Barakah)" gives "AB" and stray punctuation is ignored.
  const letters = name
    .split(/\s+/)
    .map((word) => word.match(/\p{L}/u)?.[0])
    .filter((c): c is string => Boolean(c));
  if (letters.length === 0) return "?";
  return (letters[0] + (letters.length > 1 ? letters[letters.length - 1] : "")).toUpperCase();
}

/** wa.me link with a friendly opening message, or null without a usable number. */
export function whatsappLink(phone: string | null | undefined, message: string): string | null {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function emailLink(email: string, subject: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

export function pluralize(count: number, one: string, many = `${one}s`): string {
  return `${count} ${count === 1 ? one : many}`;
}

/**
 * "All 3 show on the home page" / "6 here · the first 4 show on the home page".
 * Avoids sentences like "3 projects · shows the 4 newest".
 */
export function showsOn(count: number, limit: number, where: string): string {
  if (count === 0) return `None show on ${where} yet`;
  if (count === 1) return `It shows on ${where}`;
  if (count <= limit) return `All ${count} show on ${where}`;
  return `${count} here · the first ${limit} show on ${where}`;
}
