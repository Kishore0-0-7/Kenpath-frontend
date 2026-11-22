import * as React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/auth-context.js";
import { ThemeProvider } from "./context/theme-context.js";
import { ToastProvider } from "./hooks/use-toast.js";
import { Toaster } from "./components/ui/toaster.js";
import { App } from "./App.js";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2, // 2 minutes fresh
      gcTime: 1000 * 60 * 60 * 24, // 24 hours cache persistence
      networkMode: "offlineFirst", // Serve cached data immediately when offline
      retry: (failureCount, error: any) => {
        if (typeof navigator !== "undefined" && !navigator.onLine) {
          return false;
        }
        if (error?.status === 401 || error?.status === 404) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      networkMode: "online",
      retry: 0,
    },
  },
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <App />
            <Toaster />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
