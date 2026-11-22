import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { TimeSlot } from "../types/api.js";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const TIME_SLOT_LABELS: Record<TimeSlot, string> = {
  MORNING_FASTING: "Morning (fasting)",
  AFTER_BREAKFAST: "After breakfast",
  AFTER_LUNCH: "After lunch",
  AFTER_DINNER: "After dinner",
};

export const TIME_SLOT_DESCRIPTIONS: Record<TimeSlot, string> = {
  MORNING_FASTING: "Overnight fast, before morning meal",
  AFTER_BREAKFAST: "1–2 hours post breakfast",
  AFTER_LUNCH: "1–2 hours post lunch",
  AFTER_DINNER: "1–2 hours post evening meal",
};

export const ALL_TIME_SLOTS: TimeSlot[] = [
  "MORNING_FASTING",
  "AFTER_BREAKFAST",
  "AFTER_LUNCH",
  "AFTER_DINNER",
];

export function getTodayKolkata(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function isFutureDate(dateStr: string): boolean {
  const today = getTodayKolkata();
  return dateStr > today;
}

export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  const dateObj = new Date(Date.UTC(y, m - 1, d));
  return dateObj.toLocaleDateString("en-IN", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateLong(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  const dateObj = new Date(Date.UTC(y, m - 1, d));
  return dateObj.toLocaleDateString("en-IN", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatTimeDisplay(isoString: string): string {
  if (!isoString) return "";
  const dateObj = new Date(isoString);
  return dateObj.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function getGlucoseCategory(value: number): {
  label: string;
  badgeClass: string;
} {
  if (value < 70) {
    return {
      label: "Low (<70)",
      badgeClass: "bg-[#FBECE6] text-[#A64B2A] border-[#F2D0C4]",
    };
  }
  if (value <= 140) {
    return {
      label: "Optimal",
      badgeClass: "bg-[#EAF2EC] text-[#286B55] border-[#D1E3D6]",
    };
  }
  if (value <= 180) {
    return {
      label: "Elevated",
      badgeClass: "bg-[#FEF6E9] text-[#A46714] border-[#FBE3B8]",
    };
  }
  return {
    label: "High (>180)",
    badgeClass: "bg-[#FBECE6] text-[#BB754C] border-[#F3CFBF]",
  };
}
