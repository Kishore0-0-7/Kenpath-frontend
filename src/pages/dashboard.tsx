import * as React from "react";
import {
  Pencil,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
} from "lucide-react";
import { useAuth } from "../context/auth-context.js";
import { useDashboardStats, useDeleteReading } from "../lib/api.js";
import {
  ALL_TIME_SLOTS,
  TIME_SLOT_LABELS,
  TIME_SLOT_DESCRIPTIONS,
  formatDateLong,
  formatTimeDisplay,
  getTodayKolkata,
} from "../lib/utils.js";
import type { Reading, TimeSlot } from "../types/api.js";
import { Button } from "../components/ui/button.js";
import { ReadingModal } from "../components/reading-modal.js";
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

export function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const todayStr = getTodayKolkata();
  const formattedDate = formatDateLong(todayStr);

  const { data, isLoading } = useDashboardStats();
  const deleteMutation = useDeleteReading();

  // Modal State
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingReading, setEditingReading] = React.useState<Reading | null>(null);
  const [targetSlot, setTargetSlot] = React.useState<TimeSlot | undefined>(undefined);

  // Delete Dialog State
  const [deleteReading, setDeleteReading] = React.useState<Reading | null>(null);

  const readings = data?.readings || [];
  const summary = data?.summary || {
    highest: null,
    lowest: null,
    average: null,
    count: 0,
  };

  const loggedCount = readings.length;
  const progressPercent = Math.min(100, Math.round((loggedCount / 4) * 100));

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const handleOpenAddModal = (slot?: TimeSlot) => {
    setEditingReading(null);
    setTargetSlot(slot);
    setModalOpen(true);
  };

  const handleOpenEditModal = (reading: Reading) => {
    setEditingReading(reading);
    setTargetSlot(reading.timeSlot);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteReading) return;
    try {
      await deleteMutation.mutateAsync(deleteReading.id);
      const slotLabel = TIME_SLOT_LABELS[deleteReading.timeSlot];
      toast({
        title: "Reading removed",
        description: `The ${slotLabel} reading of ${deleteReading.glucoseValue} mg/dL has been deleted.`,
        type: "success",
      });
      setDeleteReading(null);
    } catch (err: any) {
      toast({
        title: "Failed to remove reading",
        description: err.message || "An error occurred while deleting.",
        type: "error",
      });
    }
  };

  const firstName = user?.name ? user.name.split(" ")[0] : "there";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs font-medium text-foreground-secondary">
            Loading today's journal…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* =========================================================================
          SECTION 1: Daily Overview (Greeting, Date, Progress)
          Compact & informative without duplicating the header Record button.
         ========================================================================= */}
      <div className="rounded-xl border border-border bg-surface p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {getGreeting()}, {firstName}
            </h2>
            <p className="text-sm text-foreground-secondary flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
              <span className="opacity-40">&bull;</span>
              <span>Asia/Kolkata</span>
            </p>
          </div>

          {/* Daily Progress Tracker */}
          <div className="flex items-center gap-4 bg-muted/50 border border-border/60 rounded-xl px-4 py-3 sm:min-w-[240px]">
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">Daily Progress</span>
                <span className="font-semibold text-primary font-mono tabular-nums">
                  {loggedCount} of 4 slots
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-border/60 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            {loggedCount === 4 && (
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: Coherent 4-Column Reading Schedule
          Unified timeline component separating Morning, Breakfast, Lunch, Dinner.
         ========================================================================= */}
      <div className="rounded-xl border border-border bg-surface p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Today&rsquo;s Clinical Schedule
            </h3>
            <p className="text-xs text-foreground-secondary">
              Four prescribed daily monitoring intervals
            </p>
          </div>
          <span className="text-xs font-medium text-foreground-secondary">
            {loggedCount}/4 Complete
          </span>
        </div>

        {/* 4 Structured Slots Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ALL_TIME_SLOTS.map((slot) => {
            const reading = readings.find((r) => r.timeSlot === slot);
            const isRecorded = !!reading;

            return (
              <div
                key={slot}
                className={`flex flex-col justify-between rounded-xl p-4 transition-all border ${
                  isRecorded
                    ? "bg-surface border-border shadow-xs"
                    : "border-dashed border-border/80 bg-muted/20"
                }`}
              >
                {/* Slot Header */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground tracking-tight">
                      {TIME_SLOT_LABELS[slot]}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        isRecorded
                          ? "bg-primary-soft text-primary font-medium"
                          : "text-foreground-secondary/70 bg-muted"
                      }`}
                    >
                      {isRecorded ? "Recorded" : "Pending"}
                    </span>
                  </div>
                  <p className="text-[11px] text-foreground-secondary leading-tight line-clamp-1">
                    {TIME_SLOT_DESCRIPTIONS[slot]}
                  </p>
                </div>

                {/* Slot Content */}
                <div className="my-4">
                  {isRecorded && reading ? (
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-bold font-mono tabular-nums text-foreground tracking-tight">
                          {reading.glucoseValue}
                        </span>
                        <span className="text-xs font-medium text-foreground-secondary">
                          mg/dL
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-foreground-secondary">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeDisplay(reading.createdAt)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 text-center text-foreground-secondary/60">
                      <p className="text-xs font-medium">Awaiting entry</p>
                    </div>
                  )}
                </div>

                {/* Slot Action */}
                <div className="pt-2 border-t border-border/40">
                  {isRecorded && reading ? (
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditModal(reading)}
                        className="h-8 px-2.5 text-xs text-foreground-secondary hover:text-foreground"
                        aria-label={`Edit ${TIME_SLOT_LABELS[slot]} reading`}
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteReading(reading)}
                        className="h-8 px-2.5 text-xs text-destructive hover:bg-destructive/10"
                        aria-label={`Delete ${TIME_SLOT_LABELS[slot]} reading`}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenAddModal(slot)}
                      className="w-full text-xs h-8 border-dashed border-border hover:border-primary hover:text-primary hover:bg-primary-soft/30"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      <span>Log Reading</span>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: Consolidated Daily Summary Strip
          Refined strip with typography and separators instead of 4 KPI cards.
         ========================================================================= */}
      <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-4">
          Today&rsquo;s Measurement Summary
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
          {/* 1. Daily Average */}
          <div className="pt-2 sm:pt-0 sm:px-4 first:pl-0 space-y-1">
            <span className="text-xs font-medium text-foreground-secondary">
              Daily Average
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono tabular-nums text-foreground">
                {summary.average !== null ? summary.average.toFixed(1) : "--"}
              </span>
              {summary.average !== null && (
                <span className="text-xs text-foreground-secondary">mg/dL</span>
              )}
            </div>
            <p className="text-[11px] text-foreground-secondary/70">
              Mean of recorded values
            </p>
          </div>

          {/* 2. Highest */}
          <div className="pt-2 sm:pt-0 sm:px-4 space-y-1">
            <span className="text-xs font-medium text-foreground-secondary">
              Highest Recorded
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono tabular-nums text-foreground">
                {summary.highest !== null ? summary.highest : "--"}
              </span>
              {summary.highest !== null && (
                <span className="text-xs text-foreground-secondary">mg/dL</span>
              )}
            </div>
            <p className="text-[11px] text-foreground-secondary/70">
              Maximum reading today
            </p>
          </div>

          {/* 3. Lowest */}
          <div className="pt-2 sm:pt-0 sm:px-4 space-y-1">
            <span className="text-xs font-medium text-foreground-secondary">
              Lowest Recorded
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono tabular-nums text-foreground">
                {summary.lowest !== null ? summary.lowest : "--"}
              </span>
              {summary.lowest !== null && (
                <span className="text-xs text-foreground-secondary">mg/dL</span>
              )}
            </div>
            <p className="text-[11px] text-foreground-secondary/70">
              Minimum reading today
            </p>
          </div>

          {/* 4. Number of Readings */}
          <div className="pt-2 sm:pt-0 sm:px-4 space-y-1">
            <span className="text-xs font-medium text-foreground-secondary">
              Total Logged
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono tabular-nums text-foreground">
                {summary.count}
              </span>
              <span className="text-xs text-foreground-secondary">
                / 4 slots
              </span>
            </div>
            <p className="text-[11px] text-foreground-secondary/70">
              {4 - summary.count} remaining today
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 4: Measurement Log Table
          Clean table without invented clinical categories.
         ========================================================================= */}
      <div className="rounded-xl border border-border bg-surface p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Today&rsquo;s Measurement Log
            </h3>
            <p className="text-xs text-foreground-secondary">
              Chronological records for {formattedDate}
            </p>
          </div>
          {readings.length > 0 && (
            <span className="text-xs font-mono tabular-nums text-foreground-secondary">
              {readings.length} record{readings.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {readings.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground-secondary">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <p className="text-sm font-medium text-foreground">
                No readings recorded for today
              </p>
              <p className="text-xs text-foreground-secondary leading-relaxed">
                Log your fasting morning measurement or post-meal reading using the schedule above or the header button.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs font-medium text-foreground-secondary">
                  <th scope="col" className="pb-3 pl-2 font-medium">Time</th>
                  <th scope="col" className="pb-3 font-medium">Clinical Slot</th>
                  <th scope="col" className="pb-3 font-medium text-right pr-6">Glucose Value</th>
                  <th scope="col" className="pb-3 pr-2 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {readings.map((reading) => (
                  <tr
                    key={reading.id}
                    className="hover:bg-muted/40 transition-colors group"
                  >
                    <td className="py-3.5 pl-2 text-xs font-mono tabular-nums text-foreground-secondary">
                      {formatTimeDisplay(reading.createdAt)}
                    </td>
                    <td className="py-3.5 font-medium text-foreground">
                      {TIME_SLOT_LABELS[reading.timeSlot]}
                    </td>
                    <td className="py-3.5 text-right pr-6">
                      <span className="font-mono text-base font-bold tabular-nums text-foreground">
                        {reading.glucoseValue}
                      </span>
                      <span className="ml-1 text-xs text-foreground-secondary font-normal">
                        mg/dL
                      </span>
                    </td>
                    <td className="py-3.5 pr-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditModal(reading)}
                          className="h-8 w-8 p-0 text-foreground-secondary hover:text-foreground"
                          title="Edit reading"
                          aria-label={`Edit ${TIME_SLOT_LABELS[reading.timeSlot]} reading`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteReading(reading)}
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                          title="Delete reading"
                          aria-label={`Delete ${TIME_SLOT_LABELS[reading.timeSlot]} reading`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record / Edit Dialog */}
      <ReadingModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialReading={editingReading}
        defaultSlot={targetSlot}
        defaultDate={todayStr}
      />

      {/* Contextual Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteReading}
        onOpenChange={(open) => !open && setDeleteReading(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blood Glucose Reading?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteReading && (
                <>
                  You are about to delete the{" "}
                  <strong className="text-foreground">
                    {TIME_SLOT_LABELS[deleteReading.timeSlot]}
                  </strong>{" "}
                  reading of{" "}
                  <strong className="text-foreground">
                    {deleteReading.glucoseValue} mg/dL
                  </strong>{" "}
                  for {formattedDate}. This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete reading"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
