import { useTheme } from "../context/theme-context.js";
import { Button } from "./ui/button.js";
import { CustomSunIcon, CustomMoonIcon } from "./icons/custom-icons.js";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className={`h-9 w-9 p-0 rounded-lg border-border text-foreground-secondary hover:text-foreground ${className || ""}`}
      title={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} theme`}
      aria-label={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} theme`}
    >
      {resolvedTheme === "light" ? (
        <CustomSunIcon size={16} className="transition-transform hover:rotate-45 text-neutral-600 dark:text-neutral-300" />
      ) : (
        <CustomMoonIcon size={16} className="transition-transform hover:-rotate-12 text-[#73B99A]" />
      )}
    </Button>
  );
}
