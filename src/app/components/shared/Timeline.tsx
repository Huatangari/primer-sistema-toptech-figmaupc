import { Wrench, AlertTriangle, Package, Eye, RefreshCw, MessageSquare, CheckCircle, XCircle, UserPlus, PlusCircle } from "lucide-react";
import { formatDate, formatDateTime } from "../../../lib/utils";
import styles from "./Timeline.module.css";

type EventType =
  | "Mantenimiento"
  | "Incidencia"
  | "Instalación"
  | "Inspección"
  | "Reemplazo"
  | "Creación"
  | "Actualización"
  | "Asignación"
  | "Resolución"
  | "Cierre"
  | "Comentario";

interface TimelineEvent {
  id: string;
  date: string;
  type: EventType;
  title: string;
  description: string;
  author?: string;
  technician?: string;
}

const eventConfig: Record<EventType, { icon: React.ReactNode; color: string; bg: string }> = {
  Mantenimiento: { icon: <Wrench size={14} />, color: "text-blue-600", bg: "bg-blue-100" },
  Incidencia: { icon: <AlertTriangle size={14} />, color: "text-red-600", bg: "bg-red-100" },
  Instalación: { icon: <Package size={14} />, color: "text-violet-600", bg: "bg-violet-100" },
  Inspección: { icon: <Eye size={14} />, color: "text-amber-600", bg: "bg-amber-100" },
  Reemplazo: { icon: <RefreshCw size={14} />, color: "text-cyan-600", bg: "bg-cyan-100" },
  Creación: { icon: <PlusCircle size={14} />, color: "text-blue-600", bg: "bg-blue-100" },
  Actualización: { icon: <RefreshCw size={14} />, color: "text-amber-600", bg: "bg-amber-100" },
  Asignación: { icon: <UserPlus size={14} />, color: "text-violet-600", bg: "bg-violet-100" },
  Resolución: { icon: <CheckCircle size={14} />, color: "text-emerald-600", bg: "bg-emerald-100" },
  Cierre: { icon: <XCircle size={14} />, color: "text-gray-600", bg: "bg-gray-100" },
  Comentario: { icon: <MessageSquare size={14} />, color: "text-indigo-600", bg: "bg-indigo-100" },
};

interface TimelineProps {
  events: TimelineEvent[];
  dateFormat?: "date" | "datetime";
}

export function Timeline({ events, dateFormat = "date" }: TimelineProps) {
  if (events.length === 0) {
    return <p className="text-gray-400 text-sm text-center py-8">Sin eventos registrados</p>;
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events.map((event, idx) => {
          const config = eventConfig[event.type] || eventConfig["Comentario"];
          const isLast = idx === events.length - 1;

          return (
            <li key={event.id}>
              <div className="relative pb-8">
                {!isLast && (
                  <span
                    className="absolute left-4 top-8 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex items-start space-x-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${config.bg} ${config.color} flex-shrink-0 ring-4 ring-white`}
                  >
                    {config.icon}
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p className={styles.eventTitle}>{event.title}</p>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {dateFormat === "datetime" ? formatDateTime(event.date) : formatDate(event.date)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    {(event.technician || event.author) && (
                      <p className="text-xs text-gray-400 mt-1">
                        {event.technician || event.author}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
