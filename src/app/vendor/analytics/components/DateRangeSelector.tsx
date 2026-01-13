import React, { useState, ChangeEvent, useEffect } from "react";
import Button from "@/components/ui/new/Button";
import { LucideIconName } from "@/components/AppIcon";
import { revenueAnalytics } from "@/services/api"; // Assuming this is in your api.ts
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

type PredefinedRange = "7d" | "30d" | "90d" | "1y";
type SelectedRange = PredefinedRange | "custom";

interface RevenueSummary {
  currency: string;
  orders_count: number;
  pending_count: number;
  pending_revenue: number;
  total_revenue: number;
}

interface DateRangePayload {
  startDate: Date;
  endDate: Date;
  range: SelectedRange;
  data?: RevenueSummary; // Attach the fetched data to the payload
}

interface DateRangeSelectorProps {
  onDateRangeChange: (payload: DateRangePayload) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  onDateRangeChange,
}) => {
  const [selectedRange, setSelectedRange] = useState<SelectedRange>("7d");
  const [isCustomOpen, setIsCustomOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const predefinedRanges: { value: PredefinedRange; label: string }[] = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 3 months" },
    { value: "1y", label: "Last year" },
  ];

  // Function to fetch revenue from the live API
  const fetchRevenueData = async (
    start: Date,
    end: Date,
    range: SelectedRange
  ) => {
    setIsLoading(true);
    try {
      // Format dates to YYYY-MM-DD for the API
      const startStr = start.toISOString().split("T")[0];
      const endStr = end.toISOString().split("T")[0];

      // Note: You might need to update your service to accept params:
      // export const revenueAnalytics = (params: any) => apiClient.get("/vendor-orders/analytics/revenue", { params })
      const response = await revenueAnalytics({
        start_date: startStr,
        end_date: endStr,
      });

      const summary: RevenueSummary = response.data.summary;

      onDateRangeChange({
        startDate: start,
        endDate: end,
        range: range,
        data: summary,
      });
    } catch (error) {
      console.error("Revenue fetch error:", error);
      toast.error("Failed to fetch revenue analytics");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRangeSelect = (range: PredefinedRange): void => {
    setSelectedRange(range);
    setIsCustomOpen(false);

    const endDate = new Date();
    let startDate = new Date();

    switch (range) {
      case "7d":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(endDate.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(endDate.getDate() - 90);
        break;
      case "1y":
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    fetchRevenueData(startDate, endDate, range);
  };

  const handleCustomDateApply = (): void => {
    if (customStartDate && customEndDate) {
      setSelectedRange("custom");
      setIsCustomOpen(false);
      fetchRevenueData(
        new Date(customStartDate),
        new Date(customEndDate),
        "custom"
      );
    }
  };

  // Initial load for 7d
  useEffect(() => {
    handleRangeSelect("7d");
  }, []);

  return (
    <div className="w-full">
      {/* Desktop View - Horizontal Layout */}
      <div className="hidden md:flex relative items-center space-x-2 lg:space-x-4 overflow-x-auto pb-2">
        <div className="flex items-center space-x-2 flex-wrap">
          {predefinedRanges.map((range) => (
            <Button
              key={range.value}
              variant={selectedRange === range.value ? "default" : "outline"}
              size="sm"
              disabled={isLoading}
              onClick={() => handleRangeSelect(range.value)}
              className="whitespace-nowrap"
            >
              {range.label}
            </Button>
          ))}

          <Button
            variant={selectedRange === "custom" ? "default" : "outline"}
            size="sm"
            disabled={isLoading}
            onClick={() => setIsCustomOpen(!isCustomOpen)}
            iconName={"Calendar" as LucideIconName}
          >
            Custom Range
          </Button>
        </div>

        {isCustomOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-border rounded-lg shadow-xl p-4 z-50 w-96">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                />
              </div>
              <div className="flex items-end space-x-2">
                <Button
                  size="sm"
                  onClick={handleCustomDateApply}
                  disabled={!customStartDate || !customEndDate || isLoading}
                >
                  {isLoading ? "..." : "Apply"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCustomOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile View - Dropdown */}
      <div className="md:hidden relative flex items-center justify-center w-[350px]">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full px-4 py-3 bg-white border border-border rounded-lg flex items-center justify-between text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors"
          disabled={isLoading}
        >
          <span>
            {selectedRange === "custom"
              ? "Custom Range"
              : predefinedRanges.find((r) => r.value === selectedRange)
                  ?.label || "Select Range"}
          </span>
          <ChevronDown
            size={18}
            className={`transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-lg shadow-xl z-50">
            {/* Predefined Ranges */}
            {predefinedRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => {
                  handleRangeSelect(range.value);
                  setIsDropdownOpen(false);
                }}
                className={`w-full px-4 py-3 text-left text-sm border-b border-border last:border-b-0 transition-colors ${
                  selectedRange === range.value
                    ? "bg-slate-100 font-medium text-slate-900"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {range.label}
              </button>
            ))}

            {/* Custom Range Option */}
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                setIsCustomOpen(!isCustomOpen);
              }}
              className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                selectedRange === "custom"
                  ? "bg-slate-100 font-medium text-slate-900"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              📅 Custom Range
            </button>
          </div>
        )}

        {/* Mobile Custom Date Inputs */}
        {isCustomOpen && (
          <div className="mt-3 bg-white border border-border rounded-lg shadow-lg p-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-slate-900 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleCustomDateApply}
                disabled={!customStartDate || !customEndDate || isLoading}
                className="flex-1"
              >
                {isLoading ? "..." : "Apply"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCustomOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateRangeSelector;
