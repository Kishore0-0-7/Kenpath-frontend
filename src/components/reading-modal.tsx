import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog.js";
import { Button } from "./ui/button.js";
import { Input } from "./ui/input.js";
import { Label } from "./ui/label.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select.js";
import { useCreateReading, useUpdateReading, useReadings } from "../lib/api.js";
import { useToast } from "../hooks/use-toast.js";
import {
  TIME_SLOT_LABELS,
  ALL_TIME_SLOTS,
  getTodayKolkata,
  isFutureDate,
} from "../lib/utils.js";
import type { TimeSlot, Reading } from "../types/api.js";

interface ReadingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialReading?: Reading | null;
  defaultSlot?: TimeSlot;
  defaultDate?: string;
  existingReadings?: Reading[];
}

export function ReadingModal({
  open,
  onOpenChange,
  initialReading,
  defaultSlot,
  defaultDate,
  existingReadings = [],
}: ReadingModalProps) {
  const isEditing = !!initialReading;
  const { toast } = useToast();
  const createMutation = useCreateReading();
  const updateMutation = useUpdateReading();

  const [date, setDate] = React.useState<string>(defaultDate || getTodayKolkata());
  const [timeSlot, setTimeSlot] = React.useState<TimeSlot>(
    defaultSlot || "MORNING_FASTING"
  );
  const [glucoseValue, setGlucoseValue] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Fetch readings for the currently selected date if not provided in props
  const { data: dateReadingsData } = useReadings({ date });

  const activeReadings = React.useMemo(() => {
    if (existingReadings && existingReadings.length > 0) {
      const matching = existingReadings.filter((r) => r.readingDate === date);
      if (matching.length > 0) return matching;
    }
    return dateReadingsData?.readings || [];
  }, [existingReadings, dateReadingsData, date]);

  const takenSlots = React.useMemo(() => {
    return new Set(
      activeReadings
        .filter((r) => !isEditing || r.id !== initialReading?.id)
        .map((r) => r.timeSlot)
    );
  }, [activeReadings, isEditing, initialReading]);

  const allSlotsFull = !isEditing && takenSlots.size >= 4;

  React.useEffect(() => {
    if (initialReading) {
      setDate(initialReading.readingDate);
      setTimeSlot(initialReading.timeSlot);
      setGlucoseValue(String(initialReading.glucoseValue));
    } else {
      const targetDate = defaultDate || getTodayKolkata();
      setDate(targetDate);
      if (defaultSlot) {
        setTimeSlot(defaultSlot);
      } else {
        const available = ALL_TIME_SLOTS.find((s) => !takenSlots.has(s));
        setTimeSlot(available || "MORNING_FASTING");
      }
      setGlucoseValue("");
    }
    setErrorMessage(null);
  }, [initialReading, defaultSlot, defaultDate, open]);

  const validate = (): string | null => {
    // 1. Missing value
    const trimmed = glucoseValue.trim();
    if (!trimmed) {
      return "Please enter a glucose value.";
    }

    // 2. Whole number and range 40 - 600
    const num = Number(trimmed);
    if (!/^\d+$/.test(trimmed) || isNaN(num) || num < 40 || num > 600) {
      return "Value must be between 40 and 600 mg/dl.";
    }

    // 3. Future date
    if (isFutureDate(date)) {
      return "Date cannot be in the future.";
    }

    // 4. Maximum 4 readings per day limit
    if (!isEditing && activeReadings.filter((r) => r.readingDate === date).length >= 4) {
      return "You can add only 4 readings per day.";
    }

    // 5. Duplicate slot for this date (excluding current reading if editing)
    const duplicate = activeReadings.find(
      (r) =>
        r.readingDate === date &&
        r.timeSlot === timeSlot &&
        (!isEditing || r.id !== initialReading?.id)
    );
    if (duplicate) {
      const slotLabel = TIME_SLOT_LABELS[timeSlot].toLowerCase();
      return `You already have an ${slotLabel} reading for this date.`;
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setErrorMessage("You are currently offline. Reconnect to the internet to save measurements.");
      return;
    }

    const error = validate();
    if (error) {
      setErrorMessage(error);
      return;
    }

    setErrorMessage(null);
    const parsedValue = parseInt(glucoseValue.trim(), 10);

    try {
      if (isEditing && initialReading) {
        await updateMutation.mutateAsync({
          id: initialReading.id,
          data: {
            readingDate: date,
            timeSlot,
            glucoseValue: parsedValue,
          },
        });
        toast({
          title: "Reading updated",
          description: `${TIME_SLOT_LABELS[timeSlot]} updated to ${parsedValue} mg/dL`,
          type: "success",
        });
      } else {
        await createMutation.mutateAsync({
          readingDate: date,
          timeSlot,
          glucoseValue: parsedValue,
        });
        toast({
          title: "Reading recorded",
          description: `${TIME_SLOT_LABELS[timeSlot]} logged as ${parsedValue} mg/dL`,
          type: "success",
        });
      }
      onOpenChange(false);
    } catch (err: any) {
      const msg = err.message || "Failed to save reading";
      setErrorMessage(msg);
      toast({
        title: "Could not save reading",
        description: msg,
        type: "error",
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditing ? "Edit Blood Glucose Reading" : "Record Blood Glucose"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modify the measurement value or time slot for this entry."
              : "Log a new blood glucose reading for your daily journal."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-4 pt-2">
          {errorMessage && (
            <div
              className="p-3 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg font-medium"
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          {allSlotsFull && !errorMessage && (
            <div
              className="p-3 text-xs text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-[#242F29] border border-neutral-200 dark:border-neutral-700 rounded-lg"
              role="status"
            >
              All 4 clinical slots have been recorded for this date (daily maximum reached).
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="readingDate">Date</Label>
            <Input
              id="readingDate"
              type="date"
              max={getTodayKolkata()}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setErrorMessage(null);
              }}
              disabled={isPending}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="timeSlot">Clinical Time Slot</Label>
            <Select
              value={timeSlot}
              onValueChange={(val) => {
                setTimeSlot(val as TimeSlot);
                setErrorMessage(null);
              }}
              disabled={isPending || allSlotsFull}
            >
              <SelectTrigger id="timeSlot">
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent>
                {ALL_TIME_SLOTS.map((slot) => {
                  const isTaken = takenSlots.has(slot);
                  return (
                    <SelectItem key={slot} value={slot}>
                      <span className="flex items-center justify-between w-full">
                        <span>{TIME_SLOT_LABELS[slot]}</span>
                        {isTaken && (
                          <span className="text-[11px] text-[#5F6B64] italic ml-2">
                            (Logged)
                          </span>
                        )}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="glucoseValue">Glucose Measurement</Label>
            <div className="relative">
              <Input
                id="glucoseValue"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="e.g. 110"
                value={glucoseValue}
                onChange={(e) => {
                  setGlucoseValue(e.target.value);
                  setErrorMessage(null);
                }}
                className="pr-16 text-lg font-mono tabular-nums"
                disabled={isPending || allSlotsFull}
                autoFocus
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-neutral-400 select-none">
                mg/dL
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Physiological tracking range: 40 to 600 mg/dL.
            </p>
          </div>

          <DialogFooter className="pt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || allSlotsFull}>
              {isPending
                ? "Saving…"
                : isEditing
                ? "Save changes"
                : "Record reading"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
