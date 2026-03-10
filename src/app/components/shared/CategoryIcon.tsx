import {
  ArrowUpDown,
  Flame,
  Video,
  Zap,
  Droplets,
  Bell,
  Wifi,
  Building2,
  Package,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Ascensores: <ArrowUpDown size={16} />,
  Extintores: <Flame size={16} />,
  CCTV: <Video size={16} />,
  "Sistema Eléctrico": <Zap size={16} />,
  "Bombas de Agua": <Droplets size={16} />,
  "Alarmas CI": <Bell size={16} />,
  Internet: <Wifi size={16} />,
  "Áreas Comunes": <Building2 size={16} />,
};

export function CategoryIcon({ category, size = 16 }: { category: string; size?: number }) {
  // Re-create with custom size if needed
  const sized: Record<string, React.ReactNode> = {
    Ascensores: <ArrowUpDown size={size} />,
    Extintores: <Flame size={size} />,
    CCTV: <Video size={size} />,
    "Sistema Eléctrico": <Zap size={size} />,
    "Bombas de Agua": <Droplets size={size} />,
    "Alarmas CI": <Bell size={size} />,
    Internet: <Wifi size={size} />,
    "Áreas Comunes": <Building2 size={size} />,
  };
  return <>{sized[category] || <Package size={size} />}</>;
}
