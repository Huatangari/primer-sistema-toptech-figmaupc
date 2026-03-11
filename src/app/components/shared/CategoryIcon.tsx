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

export function CategoryIcon({ category, size = 16 }: { category: string; size?: number }) {
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
  return sized[category] || <Package size={size} />;
}
