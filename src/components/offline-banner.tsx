import * as React from "react";
import { CustomWifiOffIcon, CustomWifiOnIcon } from "./icons/custom-icons.js";

export function OfflineBanner() {
  const [isOnline, setIsOnline] = React.useState<boolean>(() => {
    return typeof navigator !== "undefined" ? navigator.onLine : true;
  });
  const [wasOffline, setWasOffline] = React.useState<boolean>(false);
  const [showRestored, setShowRestored] = React.useState<boolean>(false);

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setShowRestored(true);
        const timer = setTimeout(() => {
          setShowRestored(false);
          setWasOffline(false);
        }, 3500);
        return () => clearTimeout(timer);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      setShowRestored(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [wasOffline]);

  if (isOnline && !showRestored) {
    return null;
  }

  if (showRestored) {
    return (
      <div className="bg-emerald-600 dark:bg-emerald-700 text-white px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 shadow-sm transition-all animate-in fade-in slide-in-from-top-1">
        <CustomWifiOnIcon size={15} />
        <span>Connection Restored — Cloud sync active. Your journal is up to date.</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="bg-amber-600 dark:bg-amber-700 text-white px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 shadow-sm transition-all animate-in fade-in slide-in-from-top-1"
    >
      <CustomWifiOffIcon size={15} />
      <span>
        Offline Mode — Internet connection unavailable. Displaying cached patient journal records.
      </span>
    </div>
  );
}
