import * as Sentry from "@sentry/react";

interface FallbackProps {
  error: unknown;
  resetError: () => void;
}

function ErrorFallback({ error, resetError }: FallbackProps) {
  const message =
    error instanceof Error && error.message
      ? error.message
      : "Error inesperado. El equipo ha sido notificado.";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold text-destructive">
        Algo salió mal
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      <button
        type="button"
        onClick={resetError}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Reintentar
      </button>
    </div>
  );
}

/**
 * Top-level error boundary powered by Sentry.
 * Wraps the entire app so unhandled React render errors are captured
 * and the user sees a recoverable fallback instead of a blank screen.
 */
function PassThrough({ children }: { children: React.ReactNode }) {
  return children;
}

export const ErrorBoundary = Sentry.withErrorBoundary(PassThrough, {
    fallback: (props) => <ErrorFallback {...props} />,
    onError(error, componentStack) {
      // Additional context logged alongside the Sentry event
      console.error("[ErrorBoundary]", error, componentStack);
    },
  },
);
