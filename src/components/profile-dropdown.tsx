import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context.js";
import { useTheme, type Theme } from "../context/theme-context.js";
import { useToast } from "../hooks/use-toast.js";
import {
  CustomUserBadgeIcon,
  CustomSunIcon,
  CustomMoonIcon,
  CustomSystemIcon,
  CustomLogoutIcon,
} from "./icons/custom-icons.js";

export function ProfileDropdown() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Close on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  const handleSignOut = async () => {
    setOpen(false);
    try {
      await logout();
      toast({
        title: "Signed out",
        description: "You have securely signed out.",
        type: "success",
      });
      navigate("/login");
    } catch (err: any) {
      toast({
        title: "Error signing out",
        description: err.message || "Failed to sign out.",
        type: "error",
      });
    }
  };

  return (
    <div className="relative inline-block text-left">
      {/* Avatar Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="User account menu"
        className="flex items-center gap-2 rounded-full p-0.5 border border-border hover:border-primary focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
          {initials}
        </div>
      </button>

      {/* Dropdown Menu Popover */}
      {open && (
        <div
          ref={dropdownRef}
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl border border-border bg-surface p-2 shadow-xl ring-1 ring-black/5 focus:outline-none z-50 animate-in fade-in-50 zoom-in-95 duration-150 text-foreground"
        >
          {/* 1. Account Section */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground leading-tight">
                {user?.name || "Patient Journal"}
              </p>
              <p className="truncate text-xs text-foreground-secondary leading-tight mt-0.5">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="my-1.5 h-px bg-border" />

          {/* 2. Navigation Items */}
          <div className="space-y-0.5 py-1">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground rounded-lg hover:bg-muted transition-colors font-medium"
            >
              <CustomUserBadgeIcon size={16} className="text-foreground-secondary" />
              <span>My Profile & Preferences</span>
            </Link>
          </div>

          <div className="my-1.5 h-px bg-border" />

          {/* 3. Appearance Controls */}
          <div className="px-3 py-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground-secondary block mb-1.5">
              Appearance
            </span>
            <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1 border border-border">
              {(
                [
                  { key: "light", label: "Light", icon: CustomSunIcon },
                  { key: "dark", label: "Dark", icon: CustomMoonIcon },
                  { key: "system", label: "Auto", icon: CustomSystemIcon },
                ] as const
              ).map((opt) => {
                const Icon = opt.icon;
                const isSelected = theme === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setTheme(opt.key as Theme)}
                    className={`flex items-center justify-center gap-1.5 py-1 text-xs rounded-md font-medium transition-all ${
                      isSelected
                        ? "bg-surface text-foreground shadow-sm"
                        : "text-foreground-secondary hover:text-foreground"
                    }`}
                  >
                    <Icon size={12} />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="my-1.5 h-px bg-border" />

          {/* 4. Session Action */}
          <div className="py-1">
            <button
              type="button"
              onClick={handleSignOut}
              role="menuitem"
              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-destructive rounded-lg hover:bg-destructive/10 transition-colors font-medium text-left"
            >
              <CustomLogoutIcon size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
