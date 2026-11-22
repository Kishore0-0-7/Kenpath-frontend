import * as React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar.js";
import { Header } from "./header.js";
import { OfflineBanner } from "./offline-banner.js";
import { X } from "lucide-react";

export function Layout() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors">
      {/* 1. Desktop Sidebar */}
      <div className="hidden md:block flex-shrink-0">
        <div
          className={`sticky top-0 h-screen transition-all duration-200 ${
            isCollapsed ? "w-18" : "w-64"
          }`}
        >
          <Sidebar
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
          />
        </div>
      </div>

      {/* 2. Mobile Drawer / Sheet Backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-surface shadow-2xl transition-transform animate-in slide-in-from-left duration-200">
            <div className="absolute right-3 top-3">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-foreground-secondary hover:bg-muted hover:text-foreground"
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Sidebar onItemClick={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* 3. Main Body: Header + Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setMobileOpen(true)} />
        <OfflineBanner />
        <main className="flex-1 px-4 py-6 sm:px-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
