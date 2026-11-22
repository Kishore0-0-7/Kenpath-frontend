import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  User,
  AuthResponse,
  Reading,
  ReadingsListResponse,
  DailyReportResponse,
  MonthlyReportResponse,
  DashboardStatsResponse,
  CreateReadingInput,
  UpdateReadingInput,
  ApiError,
} from "../types/api.js";

const TOKEN_KEY = "sweety_auth_token";
const CACHED_USER_KEY = "sweety_cached_user";

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Ignore in non-browser
  }
}

export function getCachedUser(): User | null {
  try {
    const raw = localStorage.getItem(CACHED_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCachedUser(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(CACHED_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CACHED_USER_KEY);
    }
  } catch {
    // Ignore in non-browser
  }
}

// Local storage offline query caching helpers
function getCachedData<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setCachedData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Ignore if quota exceeded
  }
}

/**
 * Aggressive Sanitization: Detects if an error contains server internals,
 * source file paths, Prisma keywords, or database hostnames.
 */
function isLeakedTechnicalError(msg: string): boolean {
  if (!msg) return false;
  return (
    msg.includes("at ") ||
    msg.includes("/mnt/") ||
    msg.includes("/home/") ||
    msg.includes("node_modules") ||
    msg.includes("prisma") ||
    msg.includes("Prisma") ||
    msg.includes("neon.tech") ||
    msg.includes("Invalid `prisma.") ||
    msg.includes("Can't reach database server") ||
    msg.includes("SELECT ") ||
    msg.includes("INSERT ") ||
    msg.includes("5432") ||
    msg.includes("Unhandled Server Error") ||
    msg.includes("clientVersion") ||
    msg.includes(".ts:") ||
    msg.includes(".js:")
  );
}

export function getApiBaseUrl(): string {
  const envUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();
  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }

  // If in browser and on production domain
  if (typeof window !== "undefined" && window.location) {
    const host = window.location.hostname;
    if (host.includes("kishore007.me") || host.includes("pages.dev") || host.includes("workers.dev")) {
      return "https://kenpath-backend.kishore007.me";
    }
  }

  // In local dev with Vite proxy, use empty base (relative paths like /api)
  return "";
}

export function resolveApiUrl(endpoint: string): string {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }

  const base = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  if (!base) {
    return cleanEndpoint;
  }

  if (base.endsWith("/api") && cleanEndpoint.startsWith("/api")) {
    return `${base}${cleanEndpoint.substring(4)}`;
  }

  if (!base.endsWith("/api") && !cleanEndpoint.startsWith("/api")) {
    return `${base}/api${cleanEndpoint}`;
  }

  return `${base}${cleanEndpoint}`;
}

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = resolveApiUrl(endpoint);
  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (fetchErr: any) {
    const isOffline = typeof navigator !== "undefined" && !navigator.onLine;
    const message = isOffline
      ? "You are currently offline. Live cloud syncing is paused."
      : "Unable to reach the server. Please check your internet connection.";
    const error = new Error(message);
    (error as any).code = isOffline ? "NETWORK_OFFLINE" : "NETWORK_ERROR";
    (error as any).status = 0;
    throw error;
  }

  if (!response.ok) {
    let errorData: ApiError | null = null;
    try {
      errorData = (await response.json()) as ApiError;
    } catch {
      // not json
    }

    // Only clear token if HTTP 401 specifically returned by an authorized route
    if (
      response.status === 401 &&
      !url.includes("/api/auth/login") &&
      !url.includes("/api/auth/register")
    ) {
      setStoredToken(null);
      setCachedUser(null);
    }

    let message = errorData?.error?.message;

    // Aggressive client-side sanitization to NEVER show leaked code/paths/stack traces
    if (!message || isLeakedTechnicalError(message)) {
      if (response.status === 503 || errorData?.error?.code === "DATABASE_UNAVAILABLE") {
        message = "Database service is temporarily unreachable. Please check your internet connection.";
      } else if (response.status >= 500) {
        message = "Service is currently experiencing connection issues. Please try again in a moment.";
      } else {
        message = `Request failed with status ${response.status}`;
      }
    }

    const error = new Error(message);
    (error as any).code = errorData?.error?.code || (response.status === 503 ? "DATABASE_UNAVAILABLE" : "SERVER_ERROR");
    (error as any).details = errorData?.error?.details;
    (error as any).status = response.status;
    throw error;
  }

  return response.json() as Promise<T>;
}

// Authentication API
export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const data = await request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    setStoredToken(data.token);
    setCachedUser(data.user);
    return data;
  },

  register: async (credentials: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const data = await request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    setStoredToken(data.token);
    setCachedUser(data.user);
    return data;
  },

  me: async (): Promise<{ user: User }> => {
    try {
      const data = await request<{ user: User }>("/api/auth/me");
      setCachedUser(data.user);
      return data;
    } catch (err: any) {
      // If we are offline or DB is unavailable, fall back to cached user so session is preserved
      const cached = getCachedUser();
      if (cached && (err.status === 0 || err.status === 503 || err.code === "DATABASE_UNAVAILABLE" || err.code === "NETWORK_OFFLINE" || err.code === "NETWORK_ERROR")) {
        console.warn("Using cached offline user session:", cached.email);
        return { user: cached };
      }
      throw err;
    }
  },

  logout: async (): Promise<{ message: string }> => {
    try {
      await request<{ message: string }>("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      setStoredToken(null);
      setCachedUser(null);
    }
    return { message: "Logged out" };
  },
};

// Readings API (with offline cache fallback)
export const readingsApi = {
  list: async (params?: {
    date?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<ReadingsListResponse> => {
    const query = new URLSearchParams();
    if (params?.date) query.set("date", params.date);
    if (params?.startDate) query.set("startDate", params.startDate);
    if (params?.endDate) query.set("endDate", params.endDate);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));

    const qs = query.toString();
    const cacheKey = `sweety_cache_readings_${qs}`;

    try {
      const data = await request<ReadingsListResponse>(`/api/readings${qs ? `?${qs}` : ""}`);
      setCachedData(cacheKey, data);
      return data;
    } catch (err: any) {
      const cached = getCachedData<ReadingsListResponse>(cacheKey);
      if (cached && (err.status === 0 || err.status === 503 || err.code === "DATABASE_UNAVAILABLE" || err.code === "NETWORK_OFFLINE" || err.code === "NETWORK_ERROR")) {
        console.warn("Serving cached offline readings journal");
        return cached;
      }
      throw err;
    }
  },

  getById: async (id: string): Promise<{ reading: Reading }> => {
    return request<{ reading: Reading }>(`/api/readings/${id}`);
  },

  create: async (data: CreateReadingInput): Promise<{ reading: Reading }> => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      throw new Error("Cannot save reading while offline. Live connection required to record measurements.");
    }
    return request<{ reading: Reading }>("/api/readings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: string,
    data: UpdateReadingInput
  ): Promise<{ reading: Reading }> => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      throw new Error("Cannot update reading while offline. Live connection required.");
    }
    return request<{ reading: Reading }>(`/api/readings/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      throw new Error("Cannot delete reading while offline. Live connection required.");
    }
    return request<{ success: boolean }>(`/api/readings/${id}`, {
      method: "DELETE",
    });
  },
};

// Reports API (with offline cache fallback)
export const reportsApi = {
  daily: async (date: string): Promise<DailyReportResponse> => {
    const cacheKey = `sweety_cache_daily_${date}`;
    try {
      const data = await request<DailyReportResponse>(`/api/reports/daily?date=${date}`);
      setCachedData(cacheKey, data);
      return data;
    } catch (err: any) {
      const cached = getCachedData<DailyReportResponse>(cacheKey);
      if (cached && (err.status === 0 || err.status === 503 || err.code === "DATABASE_UNAVAILABLE" || err.code === "NETWORK_OFFLINE")) {
        return cached;
      }
      throw err;
    }
  },

  monthToDate: async (date: string): Promise<MonthlyReportResponse> => {
    const cacheKey = `sweety_cache_mtd_${date}`;
    try {
      const data = await request<MonthlyReportResponse>(`/api/reports/month-to-date?date=${date}`);
      setCachedData(cacheKey, data);
      return data;
    } catch (err: any) {
      const cached = getCachedData<MonthlyReportResponse>(cacheKey);
      if (cached && (err.status === 0 || err.status === 503 || err.code === "DATABASE_UNAVAILABLE" || err.code === "NETWORK_OFFLINE")) {
        return cached;
      }
      throw err;
    }
  },

  monthly: async (date: string): Promise<MonthlyReportResponse> => {
    const cacheKey = `sweety_cache_monthly_${date}`;
    try {
      const data = await request<MonthlyReportResponse>(`/api/reports/monthly?date=${date}`);
      setCachedData(cacheKey, data);
      return data;
    } catch (err: any) {
      const cached = getCachedData<MonthlyReportResponse>(cacheKey);
      if (cached && (err.status === 0 || err.status === 503 || err.code === "DATABASE_UNAVAILABLE" || err.code === "NETWORK_OFFLINE")) {
        return cached;
      }
      throw err;
    }
  },

  dashboard: async (): Promise<DashboardStatsResponse> => {
    const cacheKey = "sweety_cache_dashboard";
    try {
      const data = await request<DashboardStatsResponse>("/api/reports/dashboard");
      setCachedData(cacheKey, data);
      return data;
    } catch (err: any) {
      const cached = getCachedData<DashboardStatsResponse>(cacheKey);
      if (cached && (err.status === 0 || err.status === 503 || err.code === "DATABASE_UNAVAILABLE" || err.code === "NETWORK_OFFLINE")) {
        return cached;
      }
      throw err;
    }
  },
};

// React Query Hooks
export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: reportsApi.dashboard,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useReadings(params?: {
  date?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["readings", params],
    queryFn: () => readingsApi.list(params),
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useDailyReport(date: string) {
  return useQuery({
    queryKey: ["dailyReport", date],
    queryFn: () => reportsApi.daily(date),
    enabled: !!date,
    staleTime: 1000 * 60,
  });
}

export function useMonthToDateReport(date: string) {
  return useQuery({
    queryKey: ["monthToDateReport", date],
    queryFn: () => reportsApi.monthToDate(date),
    enabled: !!date,
    staleTime: 1000 * 60,
  });
}

export function useMonthlyReport(date: string) {
  return useQuery({
    queryKey: ["monthlyReport", date],
    queryFn: () => reportsApi.monthly(date),
    enabled: !!date,
    staleTime: 1000 * 60,
  });
}

export function useCreateReading() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: readingsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["readings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      queryClient.invalidateQueries({ queryKey: ["dailyReport"] });
      queryClient.invalidateQueries({ queryKey: ["monthToDateReport"] });
      queryClient.invalidateQueries({ queryKey: ["monthlyReport"] });
    },
  });
}

export function useUpdateReading() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReadingInput }) =>
      readingsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["readings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      queryClient.invalidateQueries({ queryKey: ["dailyReport"] });
      queryClient.invalidateQueries({ queryKey: ["monthToDateReport"] });
      queryClient.invalidateQueries({ queryKey: ["monthlyReport"] });
    },
  });
}

export function useDeleteReading() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: readingsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["readings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      queryClient.invalidateQueries({ queryKey: ["dailyReport"] });
      queryClient.invalidateQueries({ queryKey: ["monthToDateReport"] });
      queryClient.invalidateQueries({ queryKey: ["monthlyReport"] });
    },
  });
}
