import { describe, it, expect } from "vitest";
import {
  getGlucoseCategory,
  formatDateDisplay,
  formatDateLong,
  getTodayKolkata,
  isFutureDate,
  TIME_SLOT_LABELS,
  TIME_SLOT_DESCRIPTIONS,
  ALL_TIME_SLOTS,
} from "../lib/utils.js";

describe("Frontend Utilities & Domain Logic", () => {
  describe("getGlucoseCategory", () => {
    it("should classify values below 70 as Low", () => {
      const cat = getGlucoseCategory(65);
      expect(cat.label).toBe("Low (<70)");
      expect(cat.badgeClass).toContain("#FBECE6");
    });

    it("should classify values between 70 and 140 as Optimal", () => {
      const lower = getGlucoseCategory(70);
      const mid = getGlucoseCategory(110);
      const upper = getGlucoseCategory(140);
      expect(lower.label).toBe("Optimal");
      expect(mid.label).toBe("Optimal");
      expect(upper.label).toBe("Optimal");
    });

    it("should classify values between 141 and 180 as Elevated", () => {
      const lower = getGlucoseCategory(141);
      const upper = getGlucoseCategory(180);
      expect(lower.label).toBe("Elevated");
      expect(upper.label).toBe("Elevated");
    });

    it("should classify values above 180 as High", () => {
      const cat = getGlucoseCategory(181);
      expect(cat.label).toBe("High (>180)");
    });
  });

  describe("Time slot constants", () => {
    it("should have exactly 4 clinical slots in canonical order", () => {
      expect(ALL_TIME_SLOTS).toHaveLength(4);
      expect(ALL_TIME_SLOTS).toEqual([
        "MORNING_FASTING",
        "AFTER_BREAKFAST",
        "AFTER_LUNCH",
        "AFTER_DINNER",
      ]);
    });

    it("should have descriptive human labels for each slot", () => {
      expect(TIME_SLOT_LABELS.MORNING_FASTING).toBe("Morning (fasting)");
      expect(TIME_SLOT_LABELS.AFTER_BREAKFAST).toBe("After breakfast");
      expect(TIME_SLOT_LABELS.AFTER_LUNCH).toBe("After lunch");
      expect(TIME_SLOT_LABELS.AFTER_DINNER).toBe("After dinner");
    });

    it("should have clinical descriptions for each slot", () => {
      expect(TIME_SLOT_DESCRIPTIONS.MORNING_FASTING).toContain("Overnight fast");
      expect(TIME_SLOT_DESCRIPTIONS.AFTER_BREAKFAST).toContain("1–2 hours post breakfast");
    });
  });

  describe("Date utilities", () => {
    it("should format date correctly in en-IN style", () => {
      const formatted = formatDateDisplay("2026-11-21");
      expect(formatted).toContain("21");
      expect(formatted).toContain("Nov");
      expect(formatted).toContain("2026");
    });

    it("should format long date with day of week", () => {
      const formatted = formatDateLong("2026-11-21");
      expect(formatted).toContain("2026");
      expect(formatted).toContain("November");
    });

    it("getTodayKolkata should return valid YYYY-MM-DD", () => {
      const today = getTodayKolkata();
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("isFutureDate should identify future dates relative to today", () => {
      expect(isFutureDate("2099-01-01")).toBe(true);
      expect(isFutureDate("2000-01-01")).toBe(false);
    });
  });
});
