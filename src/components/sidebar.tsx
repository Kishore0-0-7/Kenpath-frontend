import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  BarChart3,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SweetyBrandIcon } from "./icons/custom-icons.js";
import { cn } from "../lib/utils.js";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Readings", href: "/readings", icon: Activity },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Profile", href: "/profile", icon: User },
];

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onItemClick?: () => void;
}

export function Sidebar({
  className,
  isCollapsed = false,
  onToggleCollapse,
  onItemClick,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-surface border-r border-border p-4 select-none transition-all duration-200",
        isCollapsed ? "w-18 px-2" : "w-64",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-1 py-2 mb-6">
        <div className="flex items-center gap-3 overflow-hidden">
          <SweetyBrandIcon size={36} withBackground className="flex-shrink-0" />
          {!isCollapsed && (
            <div className="min-w-0 transition-opacity duration-200">
              <span className="font-semibold text-lg tracking-tight text-foreground block leading-tight">
                Sweety
              </span>
              <p className="text-[11px] text-foreground-secondary tracking-wide truncate">
                Blood Glucose Journal
              </p>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden md:flex h-7 w-7 items-center justify-center rounded-md border border-border text-foreground-secondary hover:bg-muted hover:text-foreground transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onItemClick}
              end={item.href === "/"}
              title={isCollapsed ? item.name : undefined}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                  isActive
                    ? "bg-primary-soft text-primary font-semibold shadow-xs"
                    : "text-foreground-secondary hover:bg-muted hover:text-foreground",
                  isCollapsed && "justify-center px-0 h-10 w-full"
                )
              }
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Health Rhythm Note */}
      {!isCollapsed && (
        <div className="pt-4 border-t border-border text-[11px] text-foreground-secondary leading-relaxed px-2">
          <p className="font-medium text-foreground">Clinical Rhythm Journal</p>
          <p className="mt-0.5 opacity-80">
            4 slots per day &bull; Asia/Kolkata
          </p>
        </div>
      )}
    </aside>
  );
}
