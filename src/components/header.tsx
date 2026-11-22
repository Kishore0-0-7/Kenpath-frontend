import * as React from "react";
import { useLocation } from "react-router-dom";
import { Menu, Plus } from "lucide-react";
import { formatDateLong, getTodayKolkata } from "../lib/utils.js";
import { Button } from "./ui/button.js";
import { ReadingModal } from "./reading-modal.js";
import { ThemeToggle } from "./theme-toggle.js";
import { ProfileDropdown } from "./profile-dropdown.js";

interface HeaderProps {
  onMenuClick?: () => void;
}

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Daily Journal",
    subtitle: "Daily rhythm and glucose overview",
  },
  "/readings": {
    title: "Reading History",
    subtitle: "Historical measurements and records",
  },
  "/reports": {
    title: "Reports & Analytics",
    subtitle: "Clinical trends, statistics & line chart",
  },
  "/profile": {
    title: "Account & Profile",
    subtitle: "Personal account, preferences & session",
  },
};

export function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const pageInfo = PAGE_TITLES[location.pathname] || {
    title: "Sweety Journal",
    subtitle: "Blood glucose management",
  };

  const todayStr = getTodayKolkata();
  const formattedToday = formatDateLong(todayStr);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-surface/90 px-4 backdrop-blur-md sm:px-8 transition-colors">
        {/* Left: Mobile Nav Toggle + Page Title & Context */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground-secondary hover:bg-muted hover:text-foreground md:hidden flex-shrink-0"
            aria-label="Open mobile navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-base font-semibold tracking-tight text-foreground sm:text-lg truncate">
              {pageInfo.title}
            </h1>
            <p className="hidden text-xs text-foreground-secondary sm:block truncate">
              {pageInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Date, Theme Toggle, Primary Action, Profile Dropdown */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
          {/* Today's Date Pill */}
          <div className="hidden rounded-full border border-border bg-muted/60 px-3.5 py-1 text-xs font-medium text-foreground-secondary lg:block">
            {formattedToday}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Primary Record Reading Action */}
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Record Reading</span>
            <span className="sm:hidden">Record</span>
          </Button>

          {/* Functional Profile Dropdown */}
          <ProfileDropdown />
        </div>
      </header>

      {/* Global Record Reading Dialog */}
      <ReadingModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        defaultDate={todayStr}
      />
    </>
  );
}
