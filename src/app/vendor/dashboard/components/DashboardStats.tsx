import React, { useEffect, useState } from "react";
import { DollarSign, Clock3, CalendarRange, BarChart3 } from "lucide-react";
import { vendorService } from "@/services/vendorService";

type RevenueSummary = {
  last_7_days?: number;
  last_30_days?: number;
  last_3_months?: number;
  last_1_year?: number;
};

interface StatCard {
  title: string;
  value: string;
  subtext: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

const formatCurrency = (value: number, currency: string) => {
  const amount = Number.isFinite(value) ? value : 0;
  return `${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const DashboardStats: React.FC = () => {
  const [summary, setSummary] = useState<RevenueSummary>({});
  const [currency, setCurrency] = useState<string>("NGN");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true);
        const res = await vendorService.getRevenueAnalytics();
        if (res?.status === "success" && res?.data?.revenue_summary) {
          setSummary(res.data.revenue_summary || {});
          setCurrency(res.data.currency || "NGN");
        } else {
          setError("Unable to load revenue analytics");
        }
      } catch (err) {
        setError("Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  const statCards: StatCard[] = [
    {
      title: "Revenue (7 days)",
      value: formatCurrency(summary.last_7_days || 0, currency),
      subtext: "Last 7 days",
      icon: DollarSign,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
    },
    {
      title: "Revenue (30 days)",
      value: formatCurrency(summary.last_30_days || 0, currency),
      subtext: "Last 30 days",
      icon: Clock3,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      title: "Revenue (3 months)",
      value: formatCurrency(summary.last_3_months || 0, currency),
      subtext: "Last 3 months",
      icon: CalendarRange,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
    },
    {
      title: "Revenue (1 year)",
      value: formatCurrency(summary.last_1_year || 0, currency),
      subtext: "Last 12 months",
      icon: BarChart3,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="font-semibold text-lg text-gray-900 mb-6">Business Overview</h2>

      {error && (
        <div className="text-sm text-red-600 mb-4">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {statCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                <IconComponent size={24} className={card.iconColor} />
              </div>

              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? "Loading..." : card.value}
                </p>
                <p className="text-sm text-gray-500">{card.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardStats;
