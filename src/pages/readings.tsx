import * as React from "react";
import {
  Activity,
  Plus,
  Pencil,
  Trash2,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  FilterX,
  Clock,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";
import { useReadings, useDeleteReading } from "../lib/api.js";
import {
  TIME_SLOT_LABELS,
  TIME_SLOT_DESCRIPTIONS,
  formatDateDisplay,
  formatDateLong,
  formatTimeDisplay,
  getTodayKolkata,
} from "../lib/utils.js";
import type { Reading } from "../types/api.js";
import { Button } from "../components/ui/button.js";
import { Input } from "../components/ui/input.js";
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

export function ReadingsPage() {
  const { toast } = useToast();
  const todayStr = getTodayKolkata();

  // Filter State: selectedDate can be a specific date YYYY-MM-DD or "" for all dates
  const [selectedDate, setSelectedDate] = React.useState<string>(todayStr);
  const [page, setPage] = React.useState<number>(1);
  const limit = 20;

  // React Query Hook
  const { data, isLoading } = useReadings({
    date: selectedDate ? selectedDate : undefined,
    page: selectedDate ? undefined : page,
    limit,
  });

  const deleteMutation = useDeleteReading();

  // Modals & Dialogs
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingReading, setEditingReading] = React.useState<Reading | null>(null);

  const [deleteReadingId, setDeleteReadingId] = React.useState<string | null>(null);
  const [deleteDescription, setDeleteDescription] = React.useState<string>("");

  const readings = data?.readings || [];
  const pagination = data?.pagination;

  // Day Navigation handlers
  const handleShiftDate = (days: number) => {
    if (!selectedDate) {
      setSelectedDate(todayStr);
      return;
    }
    const [y, m, d] = selectedDate.split("-").map(Number);
    const dateObj = new Date(Date.UTC(y, m - 1, d));
    dateObj.setUTCDate(dateObj.getUTCDate() + days);
    const newDateStr = dateObj.toISOString().split("T")[0];
    if (newDateStr <= todayStr) {
      setSelectedDate(newDateStr);
    }
  };

  const isToday = selectedDate === todayStr;

  const handleOpenAddModal = () => {
    setEditingReading(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (reading: Reading) => {
    setEditingReading(reading);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteReadingId) return;
    try {
      await deleteMutation.mutateAsync(deleteReadingId);
      toast({
        title: "Reading deleted",
        description: `${deleteDescription} has been permanently deleted.`,
        type: "success",
      });
      setDeleteReadingId(null);
    } catch (err: any) {
      toast({
        title: "Failed to delete reading",
        description: err.message || "An error occurred.",
        type: "error",
      });
    }
  };

  const recordedSlotsCount = readings.length;
  const remainingSlots = Math.max(0, 4 - recordedSlotsCount);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header Strip */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Reading Journal
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Log, inspect, and maintain up to 4 clinical glucose measurements per day.
          </p>
        </div>

        <Button
          onClick={handleOpenAddModal}
          className="gap-2 shadow-sm self-start sm:self-auto bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          <span>Record Reading</span>
        </Button>
      </div>

      {/* Date Navigation & Filter Controls Bar */}
      <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#1D2621] p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Date Selector with Step Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-[#242F29] p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShiftDate(-1)}
              disabled={!selectedDate}
              className="h-8 w-8 p-0 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30"
              title="Previous day"
              aria-label="Previous day"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="relative flex items-center">
              <CalendarDays className="absolute left-2.5 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
              <Input
                type="date"
                max={todayStr}
                value={selectedDate}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val && val > todayStr) {
                    setSelectedDate(todayStr);
                  } else {
                    setSelectedDate(val);
                  }
                  setPage(1);
                }}
                className="h-8 pl-8 pr-2 border-none bg-transparent text-xs font-medium focus-visible:ring-0 w-[140px] text-neutral-800 dark:text-neutral-100"
              />
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShiftDate(1)}
              disabled={isToday || !selectedDate}
              className="h-8 w-8 p-0 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30"
              title="Next day"
              aria-label="Next day"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {!isToday && selectedDate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(todayStr)}
              className="h-9 text-xs text-primary dark:text-[#73B99A] border-primary/20 dark:border-[#73B99A]/30 hover:bg-primary/5"
            >
              Jump to Today
            </Button>
          )}

          {selectedDate ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedDate("");
                setPage(1);
              }}
              className="h-9 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              title="Show all recorded readings across all dates"
            >
              <FilterX className="h-3.5 w-3.5 mr-1.5" />
              Show all dates
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(todayStr)}
              className="h-9 text-xs text-primary dark:text-[#73B99A] border-primary/20 dark:border-[#73B99A]/30 hover:bg-primary/5"
            >
              <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
              Filter by date
            </Button>
          )}
        </div>

        {/* Selected Date Summary Pill */}
        {selectedDate && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-500 dark:text-neutral-400 font-medium">
              {formatDateLong(selectedDate)}:
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium ${
                recordedSlotsCount === 4
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  : "bg-neutral-100 text-neutral-700 dark:bg-[#242F29] dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
              }`}
            >
              {recordedSlotsCount === 4 ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : null}
              <span>{recordedSlotsCount} of 4 slots logged</span>
              {remainingSlots > 0 && (
                <span className="text-neutral-400 dark:text-neutral-500">
                  ({remainingSlots} open)
                </span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Reading History Table / Empty State */}
      {isLoading ? (
        <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#1D2621] p-16 text-center text-sm text-neutral-500 dark:text-neutral-400">
          Loading reading journal…
        </div>
      ) : readings.length === 0 ? (
        <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#1D2621] p-12 text-center shadow-sm">
          <Activity className="mx-auto h-12 w-12 text-neutral-400/60 dark:text-neutral-600 mb-3" />
          <h4 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            {selectedDate
              ? `No readings recorded on ${formatDateDisplay(selectedDate)}`
              : "No readings recorded yet"}
          </h4>
          <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
            {selectedDate
              ? "No measurements have been logged for this day. You can record up to 4 clinical slots (Morning fasting, After breakfast, After lunch, After dinner)."
              : "Your glucose journal is empty. Record your first blood glucose measurement to begin tracking your personal baseline."}
          </p>
          <Button
            onClick={handleOpenAddModal}
            className="mt-5 gap-2"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            <span>Record First Reading</span>
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#1D2621] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 dark:bg-[#242F29] text-neutral-600 dark:text-neutral-300 font-semibold border-b border-neutral-200 dark:border-neutral-800 text-xs uppercase tracking-wider">
                <tr>
                  {!selectedDate && <th className="px-5 py-3.5">Date</th>}
                  <th className="px-5 py-3.5">Clinical Slot</th>
                  <th className="px-5 py-3.5">Logged Time</th>
                  <th className="px-5 py-3.5">Glucose Measurement</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-150 dark:divide-neutral-800">
                {readings.map((reading) => {
                  return (
                    <tr
                      key={reading.id}
                      className="hover:bg-neutral-50/70 dark:hover:bg-[#242F29]/60 transition-colors"
                    >
                      {!selectedDate && (
                        <td className="px-5 py-4 font-medium text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                          {formatDateDisplay(reading.readingDate)}
                        </td>
                      )}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {TIME_SLOT_LABELS[reading.timeSlot]}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 font-normal mt-0.5">
                          {TIME_SLOT_DESCRIPTIONS[reading.timeSlot]}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-neutral-400" />
                          {formatTimeDisplay(reading.createdAt)}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-lg tabular-nums text-neutral-900 dark:text-neutral-50">
                          {reading.glucoseValue}
                        </span>
                        <span className="ml-1 text-xs font-normal text-neutral-500 dark:text-neutral-400">
                          mg/dL
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditModal(reading)}
                            className="h-8 px-2.5 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          >
                            <Pencil className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setDeleteReadingId(reading.id);
                              setDeleteDescription(
                                `${TIME_SLOT_LABELS[reading.timeSlot]} (${reading.glucoseValue} mg/dL)`
                              );
                            }}
                            className="h-8 px-2.5 text-neutral-600 dark:text-neutral-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls for "All Dates" mode */}
          {!selectedDate && pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#242F29] text-xs text-neutral-500 dark:text-neutral-400">
              <div>
                Page <strong className="text-neutral-800 dark:text-neutral-200">{pagination.page}</strong>{" "}
                of <strong className="text-neutral-800 dark:text-neutral-200">{pagination.totalPages}</strong>{" "}
                ({pagination.total} entries)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-8 px-3 text-xs"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-8 px-3 text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!deleteReadingId}
        onOpenChange={(open) => !open && setDeleteReadingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Glucose Reading?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deleteDescription}? This entry will
              be permanently removed from your historical record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete Reading"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reading CRUD Modal */}
      <ReadingModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialReading={editingReading}
        defaultDate={selectedDate || todayStr}
        existingReadings={readings}
      />
    </div>
  );
}
