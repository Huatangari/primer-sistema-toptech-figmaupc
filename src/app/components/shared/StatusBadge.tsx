import {
  getAssetStatusColors,
  getIncidentPriorityColors,
  getIncidentStatusColors,
  getDocumentTypeColors,
  getProviderStatusColors,
} from "../../../lib/utils";
import { AssetStatus, IncidentPriority, IncidentStatus, DocumentType, ProviderStatus } from "../../../lib/types";

interface BadgeProps {
  label: string;
  variant?: "default" | "dot";
  className?: string;
}

function Badge({ label, bg, text, dot, variant = "default", className = "" }: BadgeProps & { bg: string; text: string; dot?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text} ${className}`}
    >
      {variant === "dot" && dot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
      {label}
    </span>
  );
}

export function AssetStatusBadge({ status }: { status: AssetStatus }) {
  const colors = getAssetStatusColors(status);
  return <Badge label={status} bg={colors.bg} text={colors.text} dot={colors.dot} variant="dot" />;
}

export function IncidentPriorityBadge({ priority }: { priority: IncidentPriority }) {
  const colors = getIncidentPriorityColors(priority);
  return <Badge label={priority} bg={colors.bg} text={colors.text} />;
}

export function IncidentStatusBadge({ status }: { status: IncidentStatus }) {
  const colors = getIncidentStatusColors(status);
  return <Badge label={status} bg={colors.bg} text={colors.text} />;
}

export function DocumentTypeBadge({ type }: { type: DocumentType }) {
  const colors = getDocumentTypeColors(type);
  return <Badge label={type} bg={colors.bg} text={colors.text} />;
}

export function ProviderStatusBadge({ status }: { status: ProviderStatus }) {
  const colors = getProviderStatusColors(status);
  return <Badge label={status} bg={colors.bg} text={colors.text} variant="dot" />;
}
