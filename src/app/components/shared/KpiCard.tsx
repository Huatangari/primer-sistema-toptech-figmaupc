import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg?: string;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  onClick?: () => void;
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  iconBg = "bg-blue-100",
  trend,
  trendLabel,
  onClick,
}: KpiCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 ${
        onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        {trend && trendLabel && (
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              trend === "up"
                ? "bg-emerald-50 text-emerald-600"
                : trend === "down"
                ? "bg-red-50 text-red-600"
                : "bg-gray-50 text-gray-500"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp size={11} />
            ) : trend === "down" ? (
              <TrendingDown size={11} />
            ) : (
              <Minus size={11} />
            )}
            {trendLabel}
          </div>
        )}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-gray-900 mt-0.5" style={{ fontSize: "28px", fontWeight: 700, lineHeight: "1.2" }}>
          {value}
        </p>
        {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
