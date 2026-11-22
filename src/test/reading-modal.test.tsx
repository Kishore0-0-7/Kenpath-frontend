import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReadingModal } from "../components/reading-modal.js";
import { ToastProvider } from "../hooks/use-toast.js";

// Mock API functions
vi.mock("../lib/api.js", () => {
  return {
    useCreateReading: () => ({
      mutateAsync: vi.fn().mockResolvedValue({ reading: { id: "1" } }),
      isPending: false,
    }),
    useUpdateReading: () => ({
      mutateAsync: vi.fn().mockResolvedValue({ reading: { id: "1" } }),
      isPending: false,
    }),
    useReadings: () => ({
      data: undefined,
      isLoading: false,
    }),
    getStoredToken: () => "mock-token",
  };
});

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{ui}</ToastProvider>
    </QueryClientProvider>
  );
}

describe("ReadingModal Component", () => {
  it("should render dialog with correct titles when opened", () => {
    renderWithProviders(
      <ReadingModal open={true} onOpenChange={() => {}} defaultDate="2026-11-21" />
    );

    expect(screen.getByText("Record Blood Glucose")).toBeInTheDocument();
    expect(screen.getByLabelText(/Glucose Measurement/i)).toBeInTheDocument();
    expect(screen.getByText("mg/dL")).toBeInTheDocument();
  });

  it("should show validation error when submitting empty value", async () => {
    renderWithProviders(
      <ReadingModal open={true} onOpenChange={() => {}} defaultDate="2026-11-21" />
    );

    const submitBtn = screen.getByRole("button", { name: /Record reading/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Please enter a glucose value."
      );
    });
  });

  it("should reject glucose value below 40 mg/dL", async () => {
    renderWithProviders(
      <ReadingModal open={true} onOpenChange={() => {}} defaultDate="2026-11-21" />
    );

    const input = screen.getByLabelText(/Glucose Measurement/i);
    fireEvent.change(input, { target: { value: "35" } });

    const submitBtn = screen.getByRole("button", { name: /Record reading/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Value must be between 40 and 600 mg/dl."
      );
    });
  });

  it("should reject glucose value above 600 mg/dL", async () => {
    renderWithProviders(
      <ReadingModal open={true} onOpenChange={() => {}} defaultDate="2026-11-21" />
    );

    const input = screen.getByLabelText(/Glucose Measurement/i);
    fireEvent.change(input, { target: { value: "650" } });

    const submitBtn = screen.getByRole("button", { name: /Record reading/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Value must be between 40 and 600 mg/dl."
      );
    });
  });

  it("should reject decimal glucose values", async () => {
    renderWithProviders(
      <ReadingModal open={true} onOpenChange={() => {}} defaultDate="2026-11-21" />
    );

    const input = screen.getByLabelText(/Glucose Measurement/i);
    fireEvent.change(input, { target: { value: "115.5" } });

    const submitBtn = screen.getByRole("button", { name: /Record reading/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Value must be between 40 and 600 mg/dl."
      );
    });
  });

  it("should reject future date", async () => {
    renderWithProviders(
      <ReadingModal open={true} onOpenChange={() => {}} defaultDate="2099-01-01" />
    );

    const input = screen.getByLabelText(/Glucose Measurement/i);
    fireEvent.change(input, { target: { value: "110" } });

    const submitBtn = screen.getByRole("button", { name: /Record reading/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Date cannot be in the future."
      );
    });
  });

  it("should reject duplicate time slot on the same date", async () => {
    const existing = [
      {
        id: "r1",
        userId: "u1",
        readingDate: "2026-11-21",
        timeSlot: "MORNING_FASTING" as const,
        glucoseValue: 95,
        createdAt: "2026-11-21T08:00:00Z",
        updatedAt: "2026-11-21T08:00:00Z",
      },
    ];

    renderWithProviders(
      <ReadingModal
        open={true}
        onOpenChange={() => {}}
        defaultDate="2026-11-21"
        defaultSlot="MORNING_FASTING"
        existingReadings={existing}
      />
    );

    const input = screen.getByLabelText(/Glucose Measurement/i);
    fireEvent.change(input, { target: { value: "110" } });

    const submitBtn = screen.getByRole("button", { name: /Record reading/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "You already have an morning (fasting) reading for this date."
      );
    });
  });

  it("should prevent logging more than 4 readings per day", async () => {
    const existing = [
      {
        id: "r1",
        userId: "u1",
        readingDate: "2026-11-21",
        timeSlot: "MORNING_FASTING" as const,
        glucoseValue: 95,
        createdAt: "2026-11-21T08:00:00Z",
        updatedAt: "2026-11-21T08:00:00Z",
      },
      {
        id: "r2",
        userId: "u1",
        readingDate: "2026-11-21",
        timeSlot: "AFTER_BREAKFAST" as const,
        glucoseValue: 120,
        createdAt: "2026-11-21T10:00:00Z",
        updatedAt: "2026-11-21T10:00:00Z",
      },
      {
        id: "r3",
        userId: "u1",
        readingDate: "2026-11-21",
        timeSlot: "AFTER_LUNCH" as const,
        glucoseValue: 130,
        createdAt: "2026-11-21T14:00:00Z",
        updatedAt: "2026-11-21T14:00:00Z",
      },
      {
        id: "r4",
        userId: "u1",
        readingDate: "2026-11-21",
        timeSlot: "AFTER_DINNER" as const,
        glucoseValue: 125,
        createdAt: "2026-11-21T20:00:00Z",
        updatedAt: "2026-11-21T20:00:00Z",
      },
    ];

    renderWithProviders(
      <ReadingModal
        open={true}
        onOpenChange={() => {}}
        defaultDate="2026-11-21"
        existingReadings={existing}
      />
    );

    // Verify status alert banner is displayed indicating daily max
    expect(
      screen.getByText(/All 4 clinical slots have been recorded for this date/i)
    ).toBeInTheDocument();

    const submitBtn = screen.getByRole("button", { name: /Record reading/i });
    expect(submitBtn).toBeDisabled();
  });
});
