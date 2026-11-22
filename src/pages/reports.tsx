import * as React from "react";
import {
  BarChart3,
  Calendar,
  Activity,
  ShieldAlert,
  ArrowUp,
  ArrowDown,
  Scale,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  useDailyReport,
  useMonthToDateReport,
  useMonthlyReport,
} from "../lib/api.js";
import {
  TIME_SLOT_LABELS,
  TIME_SLOT_DESCRIPTIONS,
  formatDateDisplay,
  formatDateLong,
  formatTimeDisplay,
  getTodayKolkata,
} from "../lib/utils.js";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.js";
import { Input } from "../components/ui/input.js";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs.js";
import { useTheme } from "../context/theme-context.js";

type ReportType = "daily" | "mtd" | "previous-month";

const SHORT_SLOT_LABELS: Record<string, string> = {
  MORNING_FASTING: "Fasting",
  AFTER_BREAKFAST: "Breakfast",
  AFTER_LUNCH: "Lunch",
  AFTER_DINNER: "Dinner",
};

function CustomChartTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const item = payload[0];
    const data = item.payload;
    const title = data.fullName || label;
    return (
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#1D2621] p-3 shadow-lg text-xs">
        <p className="font-semibold text-neutral-900 dark:text-neutral-50">{title}</p>
        <div className="mt-1.5 flex items-baseline gap-1.5 text-primary dark:text-[#73B99A]">
          <span className="font-bold font-mono text-base tabular-nums">
            {item.value}
          </span>
          <span className="text-neutral-500 dark:text-neutral-400">mg/dL</span>
        </div>
        {data.count !== undefined && (
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            {data.count} reading{data.count > 1 ? "s" : ""} recorded
          </p>
        )}
        {data.highest !== undefined && data.lowest !== undefined && (
          <p className="text-neutral-400 dark:text-neutral-500 mt-0.5 text-[11px]">
            Range: {data.lowest} – {data.highest} mg/dL
          </p>
        )}
      </div>
    );
  }
  return null;
}

export function ReportsPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const todayStr = getTodayKolkata();
  const [selectedDate, setSelectedDate] = React.useState<string>(todayStr);
  const [activeTab, setActiveTab] = React.useState<ReportType>("daily");

  // Report Queries
  const dailyQuery = useDailyReport(activeTab === "daily" ? selectedDate : "");
  const mtdQuery = useMonthToDateReport(activeTab === "mtd" ? selectedDate : "");
  const monthlyQuery = useMonthlyReport(
    activeTab === "previous-month" ? selectedDate : ""
  );

  const currentQuery =
    activeTab === "daily"
      ? dailyQuery
      : activeTab === "mtd"
      ? mtdQuery
      : monthlyQuery;

  const isLoading = currentQuery.isLoading;

  // Extract Summary
  const summary = currentQuery.data?.summary || {
    highest: null,
    lowest: null,
    average: null,
    count: 0,
  };

  // Date Range Descriptions
  let rangeSubtitle = "";
  if (activeTab === "daily") {
    rangeSubtitle = formatDateLong(selectedDate);
  } else if (activeTab === "mtd") {
    const mtdData = mtdQuery.data;
    if (mtdData) {
      rangeSubtitle = `${formatDateDisplay(mtdData.startDate)} to ${formatDateDisplay(mtdData.endDate)}`;
    } else {
      rangeSubtitle = `1st of current month to ${formatDateDisplay(selectedDate)}`;
    }
  } else {
    const prevData = monthlyQuery.data;
    if (prevData) {
      rangeSubtitle = `${formatDateDisplay(prevData.startDate)} to ${formatDateDisplay(prevData.endDate)}`;
    } else {
      rangeSubtitle = "Full previous calendar month";
    }
  }

  // Build Chart Data
  let chartData: Array<{
    name: string;
    fullName?: string;
    value: number | null;
    count?: number;
    highest?: number | null;
    lowest?: number | null;
  }> = [];

  if (activeTab === "daily" && dailyQuery.data?.readings) {
    chartData = dailyQuery.data.readings.map((r) => ({
      name: SHORT_SLOT_LABELS[r.timeSlot] || TIME_SLOT_LABELS[r.timeSlot],
      fullName: TIME_SLOT_LABELS[r.timeSlot],
      value: r.glucoseValue,
      count: 1,
    }));
  } else if (
    (activeTab === "mtd" || activeTab === "previous-month") &&
    currentQuery.data &&
    "dailyBreakdown" in currentQuery.data
  ) {
    chartData = currentQuery.data.dailyBreakdown.map((d) => ({
      name: formatDateDisplay(d.date),
      value: d.summary.average,
      count: d.summary.count,
      highest: d.summary.highest,
      lowest: d.summary.lowest,
    }));
  }

  // Theme-aware Chart Palette
  const chartStroke = isDark ? "#73B99A" : "#286B55";
  const gridStroke = isDark ? "#28342D" : "#E5E9E3";
  const axisColor = isDark ? "#8A998E" : "#6E7A73";
  const dotFill = isDark ? "#73B99A" : "#286B55";
  const dotStroke = isDark ? "#1D2621" : "#FFFFFF";

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Report Navigation */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Analytics & Reports
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Review historical measurements, calculate arithmetic averages, and track glycemic patterns.
          </p>
        </div>

        {/* Reference Date Selector */}
        <div className="flex items-center gap-2 self-start lg:self-auto rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#1D2621] px-3 py-1.5 shadow-sm">
          <Calendar className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
            Reference Date:
          </span>
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
            }}
            className="h-7 w-auto border-none bg-transparent text-xs font-semibold focus-visible:ring-0 p-0 text-neutral-900 dark:text-neutral-100"
          />
        </div>
      </div>

      {/* Segmented Period Tabs Bar */}
      <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#1D2621] p-3 shadow-sm">
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as ReportType)}
        >
          <TabsList className="grid grid-cols-3 w-full max-w-xl mx-auto bg-neutral-100 dark:bg-[#242F29]">
            <TabsTrigger value="daily" className="text-xs sm:text-sm">
              Daily Report
            </TabsTrigger>
            <TabsTrigger value="mtd" className="text-xs sm:text-sm">
              Month-to-Date
            </TabsTrigger>
            <TabsTrigger value="previous-month" className="text-xs sm:text-sm">
              Previous Month
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Query Error Alert Banner */}
      {currentQuery.isError && (
        <div
          className="p-4 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl font-medium"
          role="alert"
        >
          {(currentQuery.error as Error)?.message || "Failed to load report data."}
        </div>
      )}

      {/* Consolidated Summary Strip (replaces 4 identical cards) */}
      <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#1D2621] p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-neutral-150 dark:border-neutral-800 gap-1">
          <div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
              {activeTab === "daily"
                ? "Daily Clinical Overview"
                : activeTab === "mtd"
                ? "Month-to-Date Glycemic Progress"
                : "Previous Calendar Month Overview"}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Period: {rangeSubtitle}
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
            {summary.count} measurement{summary.count === 1 ? "" : "s"} logged
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 divide-y sm:divide-y-0 sm:divide-x divide-neutral-150 dark:divide-neutral-800">
          {/* Average */}
          <div className="pt-2 sm:pt-0 sm:px-4 first:pl-0">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              <Scale className="h-3.5 w-3.5 text-primary dark:text-[#73B99A]" />
              <span>Average Glucose</span>
            </div>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="font-mono text-2xl font-bold tabular-nums text-neutral-900 dark:text-neutral-50">
                {summary.average !== null ? summary.average : "—"}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                mg/dL
              </span>
            </div>
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 block mt-0.5">
              Arithmetic mean
            </span>
          </div>

          {/* Highest (replaces Peak) */}
          <div className="pt-2 sm:pt-0 sm:px-4">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              <ArrowUp className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span>Highest Reading</span>
            </div>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="font-mono text-2xl font-bold tabular-nums text-neutral-900 dark:text-neutral-50">
                {summary.highest !== null ? summary.highest : "—"}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                mg/dL
              </span>
            </div>
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 block mt-0.5">
              Maximum observed
            </span>
          </div>

          {/* Lowest (replaces Nadir) */}
          <div className="pt-2 sm:pt-0 sm:px-4">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              <ArrowDown className="h-3.5 w-3.5 text-primary dark:text-[#73B99A]" />
              <span>Lowest Reading</span>
            </div>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="font-mono text-2xl font-bold tabular-nums text-neutral-900 dark:text-neutral-50">
                {summary.lowest !== null ? summary.lowest : "—"}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                mg/dL
              </span>
            </div>
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 block mt-0.5">
              Minimum observed
            </span>
          </div>

          {/* Total Count */}
          <div className="pt-2 sm:pt-0 sm:px-4">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              <Activity className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-300" />
              <span>Total Entries</span>
            </div>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="font-mono text-2xl font-bold tabular-nums text-neutral-900 dark:text-neutral-50">
                {summary.count}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                readings
              </span>
            </div>
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 block mt-0.5">
              In selected window
            </span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <Card className="shadow-sm border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#1D2621]">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div>
              <CardTitle className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
                {activeTab === "daily"
                  ? "Daily Slot Measurements"
                  : "Daily Average Glycemic Trend"}
              </CardTitle>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {activeTab === "daily"
                  ? "Discrete blood glucose values across the 4 clinical slots"
                  : "Daily arithmetic mean over the reporting period"}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center text-xs text-neutral-500 dark:text-neutral-400">
              Loading visualization…
            </div>
          ) : summary.count === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6">
              <BarChart3 className="h-9 w-9 text-neutral-400/50 dark:text-neutral-600 mb-2" />
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                No data available to plot for this period
              </p>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 max-w-sm leading-relaxed">
                Log readings for these dates to visualize your glucose curves and trends.
              </p>
            </div>
          ) : (
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    stroke={axisColor}
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: gridStroke }}
                  />
                  <YAxis
                    stroke={axisColor}
                    fontSize={11}
                    domain={[
                      (dataMin: number) =>
                        Math.max(0, Math.min(40, Math.floor((dataMin || 70) - 15))),
                      (dataMax: number) =>
                        Math.max(160, Math.ceil((dataMax || 140) + 20)),
                    ]}
                    tickLine={false}
                    axisLine={{ stroke: gridStroke }}
                    unit=" mg/dL"
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={chartStroke}
                    strokeWidth={2.5}
                    connectNulls
                    dot={{
                      r: 4.5,
                      fill: dotFill,
                      stroke: dotStroke,
                      strokeWidth: 2,
                    }}
                    activeDot={{
                      r: 6.5,
                      fill: chartStroke,
                      stroke: dotStroke,
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Itemized Table Breakdown */}
      <Card className="shadow-sm border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#1D2621] overflow-hidden">
        <CardHeader className="border-b border-neutral-150 dark:border-neutral-800 pb-4">
          <CardTitle className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
            {activeTab === "daily"
              ? "Day Measurement Details"
              : "Daily Aggregate Breakdown"}
          </CardTitle>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {activeTab === "daily"
              ? "Itemized slots logged on the selected date"
              : "Summary metrics calculated for each day with readings"}
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {summary.count === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
              No entries recorded during this reporting window.
            </div>
          ) : activeTab === "daily" && dailyQuery.data?.readings ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 dark:bg-[#242F29] text-neutral-600 dark:text-neutral-300 font-semibold border-b border-neutral-200 dark:border-neutral-800 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Logged Time</th>
                    <th className="px-5 py-3.5">Clinical Slot</th>
                    <th className="px-5 py-3.5">Glucose Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-150 dark:divide-neutral-800">
                  {dailyQuery.data.readings.map((r) => {
                    return (
                      <tr
                        key={r.id}
                        className="hover:bg-neutral-50/70 dark:hover:bg-[#242F29]/60 transition-colors"
                      >
                        <td className="px-5 py-4 font-mono text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                          {formatTimeDisplay(r.createdAt)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                            {TIME_SLOT_LABELS[r.timeSlot]}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400 font-normal mt-0.5">
                            {TIME_SLOT_DESCRIPTIONS[r.timeSlot]}
                          </div>
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-base tabular-nums text-neutral-900 dark:text-neutral-50">
                          {r.glucoseValue}{" "}
                          <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">
                            mg/dL
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 dark:bg-[#242F29] text-neutral-600 dark:text-neutral-300 font-semibold border-b border-neutral-200 dark:border-neutral-800 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Entries Logged</th>
                    <th className="px-5 py-3.5">Daily Average</th>
                    <th className="px-5 py-3.5">Highest Reading</th>
                    <th className="px-5 py-3.5">Lowest Reading</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-150 dark:divide-neutral-800">
                  {"dailyBreakdown" in (currentQuery.data || {}) &&
                    [...(currentQuery.data as any).dailyBreakdown]
                      .reverse()
                      .map((d: any) => {
                        return (
                          <tr
                            key={d.date}
                            className="hover:bg-neutral-50/70 dark:hover:bg-[#242F29]/60 transition-colors"
                          >
                            <td className="px-5 py-4 font-medium text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                              {formatDateDisplay(d.date)}
                            </td>
                            <td className="px-5 py-4 text-neutral-600 dark:text-neutral-400 font-mono text-xs">
                              {d.summary.count} slot{d.summary.count > 1 ? "s" : ""}
                            </td>
                            <td className="px-5 py-4 font-mono font-bold text-base tabular-nums text-neutral-900 dark:text-neutral-50">
                              {d.summary.average !== null ? (
                                <span>{d.summary.average} mg/dL</span>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="px-5 py-4 font-mono text-sm tabular-nums text-neutral-700 dark:text-neutral-300">
                              {d.summary.highest !== null
                                ? `${d.summary.highest} mg/dL`
                                : "—"}
                            </td>
                            <td className="px-5 py-4 font-mono text-sm tabular-nums text-neutral-700 dark:text-neutral-300">
                              {d.summary.lowest !== null
                                ? `${d.summary.lowest} mg/dL`
                                : "—"}
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clinical Journal Notice */}
      <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/60 dark:bg-[#1D2621]/60 p-4 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-neutral-500 dark:text-neutral-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          <strong className="font-semibold text-neutral-900 dark:text-neutral-200">
            Clinical Journal Notice:
          </strong>{" "}
          Sweety provides personal journaling and arithmetic reporting of patient-recorded blood glucose values. It does not provide automated diagnostic conclusions or medical treatment plans. Always discuss your personal glycemic targets and test results with your certified healthcare provider.
        </div>
      </div>
    </div>
  );
}
