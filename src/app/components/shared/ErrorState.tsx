import { AlertTriangle, RefreshCw } from "lucide-react";
import styles from "./ErrorState.module.css";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "No se pudieron cargar los datos.", onRetry }: ErrorStateProps) {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <AlertTriangle size={20} aria-hidden="true" />
        </div>
        <p className={styles.title}>Error al cargar datos</p>
        <p className={styles.message}>{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className={styles.retryButton}
          >
            <RefreshCw size={13} aria-hidden="true" />
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}
