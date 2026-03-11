import { ReactNode } from 'react';
import styles from './PageContainer.module.css';

interface PageContainerProps {
  title?: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  fullWidth?: boolean;
}

/**
 * PageContainer Component
 * 
 * Consistent layout wrapper for all page content.
 * - Provides max-width constraint
 * - Handles spacing and padding
 * - Optional header with title and actions
 */
export function PageContainer({
  title,
  description,
  children,
  actions,
  fullWidth = false,
}: PageContainerProps) {
  return (
    <div className={`${styles.container} ${fullWidth ? styles.fullWidth : ''}`}>
      {(title || actions) && (
        <div className={styles.header}>
          <div>
            {title && <h1 className={styles.title}>{title}</h1>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      )}

      <div className={styles.content}>{children}</div>
    </div>
  );
}
