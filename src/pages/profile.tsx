import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context.js";
import { useTheme, type Theme } from "../context/theme-context.js";
import { formatDateDisplay } from "../lib/utils.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card.js";
import { Button } from "../components/ui/button.js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog.js";
import { useToast } from "../hooks/use-toast.js";
import {
  CustomMailIcon,
  CustomCalendarIcon,
  CustomGlobeIcon,
  CustomSunIcon,
  CustomMoonIcon,
  CustomSystemIcon,
  CustomGlucoseGaugeIcon,
  CustomShieldSecurityIcon,
  CustomLogoutIcon,
  CustomCheckIcon,
  CustomPulseIcon,
  CustomUserBadgeIcon,
} from "../components/icons/custom-icons.js";

export function ProfilePage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Signed out",
        description: "You have securely signed out of your Sweety journal.",
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

  const memberSince = user?.createdAt
    ? formatDateDisplay(user.createdAt.split("T")[0])
    : "Recently joined";

  const themeOptions: Array<{
    id: Theme;
    label: string;
    sublabel: string;
    icon: React.ElementType;
  }> = [
    {
      id: "light",
      label: "Light",
      sublabel: "Linen canvas & forest",
      icon: CustomSunIcon,
    },
    {
      id: "dark",
      label: "Dark",
      sublabel: "Deep forest slate",
      icon: CustomMoonIcon,
    },
    {
      id: "system",
      label: "System",
      sublabel: "Match device theme",
      icon: CustomSystemIcon,
    },
  ];

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="space-y-6 pb-16 w-full">
      {/* Page Title & Clinical Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Account & Preferences
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Manage your personal patient profile, display settings, and active session.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Patient Account</span>
          </span>
        </div>
      </div>

      {/* Main 2-Column Balanced Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
        {/* Left Column: Patient Identity & Session Management (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Patient Profile Card */}
          <Card className="shadow-sm border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#1D2621]">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
                  <CustomUserBadgeIcon className="h-5 w-5 text-primary dark:text-[#73B99A]" />
                  <span>Patient Identity</span>
                </CardTitle>
                <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                  Profile
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Avatar + Main Info Strip */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-[#242F29] border border-neutral-200/60 dark:border-neutral-700/60">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 dark:bg-primary/20 text-xl font-bold text-primary dark:text-[#73B99A] border border-primary/20 dark:border-primary/30 shadow-xs">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50 truncate">
                    {user?.name || "Sweety Patient"}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mt-1 truncate">
                    <CustomMailIcon className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                </div>
              </div>

              {/* Patient Metadata Grid */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-150 dark:border-neutral-800 bg-white dark:bg-[#1D2621]">
                  <div className="flex items-center gap-2.5">
                    <CustomCalendarIcon className="h-4 w-4 text-primary dark:text-[#73B99A]" />
                    <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                      Member Since
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 font-mono">
                    {memberSince}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-150 dark:border-neutral-800 bg-white dark:bg-[#1D2621]">
                  <div className="flex items-center gap-2.5">
                    <CustomGlobeIcon className="h-4 w-4 text-primary dark:text-[#73B99A]" />
                    <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                      Journal Timezone
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    Asia/Kolkata (IST)
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-150 dark:border-neutral-800 bg-white dark:bg-[#1D2621]">
                  <div className="flex items-center gap-2.5">
                    <CustomPulseIcon className="h-4 w-4 text-primary dark:text-[#73B99A]" />
                    <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                      Daily Rhythm Quota
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 font-mono">
                    Up to 4 slots / day
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Session & Logout Card */}
          <Card className="shadow-sm border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#1D2621]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
                <CustomLogoutIcon className="h-4 w-4 text-rose-500" />
                <span>Session Management</span>
              </CardTitle>
              <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                Sign out of your account on this device when you are finished.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => setLogoutDialogOpen(true)}
                className="w-full text-xs font-semibold text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-2 h-10"
              >
                <CustomLogoutIcon className="h-4 w-4" />
                <span>Sign Out of Sweety</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Preferences, Units, & Privacy Governance (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Preferences Card */}
          <Card className="shadow-sm border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#1D2621]">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
                Display & Journal Preferences
              </CardTitle>
              <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                Personalize your visual theme and verify clinical measurement scales.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Appearance Theme Selector */}
              <div>
                <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 block mb-3">
                  Appearance Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {themeOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = theme === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setTheme(opt.id)}
                        className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all relative ${
                          isSelected
                            ? "border-primary bg-primary/5 dark:bg-primary/15 ring-2 ring-primary/20 text-neutral-900 dark:text-neutral-50 shadow-xs"
                            : "border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-[#242F29]/60 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100/70 dark:hover:bg-neutral-800/70"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-2">
                          <div
                            className={`p-2 rounded-lg ${
                              isSelected
                                ? "bg-primary text-white dark:bg-[#73B99A] dark:text-[#151B18]"
                                : "bg-neutral-200/70 dark:bg-neutral-700/70 text-neutral-600 dark:text-neutral-300"
                            }`}
                          >
                            <Icon size={18} />
                          </div>
                          {isSelected && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary dark:bg-[#73B99A] text-white dark:text-[#151B18]">
                              <CustomCheckIcon size={12} />
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                          {opt.label}
                        </span>
                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                          {opt.sublabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Clinical Units & Physiological Scale */}
              <div className="pt-5 border-t border-neutral-150 dark:border-neutral-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-[#242F29] border border-neutral-200/60 dark:border-neutral-700/60">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-[#73B99A] shrink-0 mt-0.5">
                      <CustomGlucoseGaugeIcon size={20} />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 block">
                        Blood Glucose Unit
                      </span>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                        Standard clinical measurement unit enforced across all log entries and analytical reports.
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-white dark:bg-[#1D2621] text-primary dark:text-[#73B99A] border border-primary/20 dark:border-primary/30 shadow-2xs self-start sm:self-center shrink-0">
                    mg/dL
                  </span>
                </div>

                <div className="flex items-center justify-between px-3 py-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <span>Physiological Tracking Range:</span>
                  <span className="font-mono font-medium text-neutral-700 dark:text-neutral-300">
                    40 – 600 mg/dL
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Data Ownership Card */}
          <Card className="shadow-sm border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#1D2621]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
                <CustomShieldSecurityIcon className="h-5 w-5 text-primary dark:text-[#73B99A]" />
                <span>Privacy & Data Sovereignty</span>
              </CardTitle>
              <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                Your medical journal entries are private and securely isolated.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5">
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                All blood glucose measurements and daily journal entries are partitioned strictly by your unique user identity. Your data is encrypted in transit using industry-standard TLS/HTTPS protocols.
              </p>
              <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-[#242F29] border border-neutral-200/60 dark:border-neutral-700/60 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                <strong className="text-neutral-800 dark:text-neutral-200 font-semibold">
                  Personal Journal Notice:
                </strong>{" "}
                Sweety serves as an autonomous personal record for tracking your blood glucose measurements. It does not provide automated diagnostic prescriptions. Always consult your certified endocrinologist for clinical therapy adjustments.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out of Sweety?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to end your current session? You will need your
              email and password to access your blood glucose journal again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
