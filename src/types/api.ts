export type TimeSlot =
  | "MORNING_FASTING"
  | "AFTER_BREAKFAST"
  | "AFTER_LUNCH"
  | "AFTER_DINNER";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Reading {
  id: string;
  userId: string;
  readingDate: string; // YYYY-MM-DD
  timeSlot: TimeSlot;
  glucoseValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ReadingsListResponse {
  readings: Reading[];
  pagination: Pagination;
}

export interface ReportSummary {
  highest: number | null;
  lowest: number | null;
  average: number | null;
  count: number;
}

export interface DailyReportResponse {
  date: string;
  readings: Reading[];
  summary: ReportSummary;
}

export interface DayBreakdown {
  date: string;
  readings: Reading[];
  summary: ReportSummary;
}

export interface MonthlyReportResponse {
  startDate: string;
  endDate: string;
  summary: ReportSummary;
  dailyBreakdown: DayBreakdown[];
}

export interface DashboardStatsResponse {
  date: string;
  summary: ReportSummary;
  readings: Reading[];
}

export interface CreateReadingInput {
  readingDate: string;
  timeSlot: TimeSlot;
  glucoseValue: number;
}

export interface UpdateReadingInput {
  readingDate?: string;
  timeSlot?: TimeSlot;
  glucoseValue?: number;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
}
