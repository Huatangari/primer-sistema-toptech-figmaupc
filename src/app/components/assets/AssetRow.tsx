import React from "react";
import { ArrowRight } from "lucide-react";
import { AssetStatusBadge } from "../shared/StatusBadge";
import { CategoryIcon } from "../shared/CategoryIcon";
import { getCategoryColor, formatDate } from "../../../lib/utils";
import type { Asset } from "../../../lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AssetRowProps {
  asset: Asset;
  onClick: (id: string) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns a badge element if maintenance is due or overdue, null otherwise. */
function MaintenanceBadge({ nextMaintenance }: { nextMaintenance: string }) {
  if (!nextMaintenance) return null;

  const days = Math.ceil(
    (new Date(nextMaintenance).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  if (days <= 0) {
    return (
      <span className="text-xs font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
        Vencido
      </span>
    );
  }
  if (days <= 30) {
    return (
      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
        {days}d
      </span>
    );
  }
  return null;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Renders a single asset row inside the assets table.
 * Memoized to prevent re-renders when sibling rows change.
 */
export const AssetRow = React.memo(function AssetRow({ asset, onClick }: AssetRowProps) {
  const categoryColor = getCategoryColor(asset.category);

  return (
    <tr
      onClick={() => onClick(asset.id)}
      className="hover:bg-blue-50/40 cursor-pointer transition-colors"
    >
      {/* Name + code */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${categoryColor}`}
            aria-hidden="true"
          >
            <CategoryIcon category={asset.category} size={15} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{asset.name}</p>
            <p className="text-xs text-gray-400">{asset.code}</p>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-4 py-3.5 hidden sm:table-cell">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColor}`}>
          {asset.category}
        </span>
      </td>

      {/* Location */}
      <td className="px-4 py-3.5 hidden md:table-cell">
        <p className="text-sm text-gray-600">{asset.location}</p>
      </td>

      {/* Status */}
      <td className="px-4 py-3.5">
        <AssetStatusBadge status={asset.status} />
      </td>

      {/* Last maintenance */}
      <td className="px-4 py-3.5 hidden lg:table-cell">
        <p className="text-sm text-gray-600">{formatDate(asset.lastMaintenance)}</p>
      </td>

      {/* Next maintenance */}
      <td className="px-4 py-3.5 hidden lg:table-cell">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-600">{formatDate(asset.nextMaintenance)}</p>
          <MaintenanceBadge nextMaintenance={asset.nextMaintenance} />
        </div>
      </td>

      {/* Action */}
      <td className="px-4 py-3.5">
        <button
          type="button"
          aria-label={`Ver detalle de ${asset.name}`}
          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <ArrowRight size={15} aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
});
