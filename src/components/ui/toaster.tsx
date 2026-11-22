import { useToast } from "../../hooks/use-toast.js";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "../../lib/utils.js";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg bg-white transition-all transform duration-200 animate-in slide-in-from-bottom-5",
            t.type === "success" && "border-[#D1E3D6] bg-[#FFFFFF]",
            t.type === "error" && "border-[#F3CFBF] bg-[#FFFFFF]",
            t.type === "default" && "border-[#E5E9E3] bg-[#FFFFFF]"
          )}
        >
          <div className="mt-0.5 flex-shrink-0">
            {t.type === "success" && (
              <CheckCircle className="h-5 w-5 text-[#286B55]" />
            )}
            {t.type === "error" && (
              <AlertCircle className="h-5 w-5 text-[#BB754C]" />
            )}
            {t.type === "default" && (
              <Info className="h-5 w-5 text-[#5F6B64]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-[#1C2923]">{t.title}</h4>
            {t.description && (
              <p className="mt-1 text-xs text-[#5F6B64] leading-relaxed">
                {t.description}
              </p>
            )}
          </div>
          <button
            onClick={() => dismiss(t.id)}
            className="flex-shrink-0 text-[#5F6B64] hover:text-[#1C2923] p-0.5 rounded transition-colors"
            aria-label="Dismiss toast"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
