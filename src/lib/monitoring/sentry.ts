import * as Sentry from "@sentry/react";

const DSN = import.meta.env.VITE_SENTRY_DSN as string | undefined;
const ENV = import.meta.env.VITE_APP_ENV ?? "development";
const RELEASE = import.meta.env.VITE_APP_VERSION as string | undefined;

export function initSentry() {
  if (!DSN) return; // no DSN → silently skip (dev / demo mode)

  Sentry.init({
    dsn: DSN,
    environment: ENV,
    release: RELEASE,
    // Capture 100 % of transactions in staging, 10 % in prod
    tracesSampleRate: ENV === "production" ? 0.1 : 1.0,
    // Capture replays only on errors in prod, always in staging
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: ENV === "production" ? 0.05 : 0,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
  });
}

/** Capture a handled exception with optional context */
export function captureError(
  error: unknown,
  context?: Record<string, unknown>,
) {
  if (context) Sentry.setContext("extra", context);
  Sentry.captureException(error);
}

/** Set the authenticated user for subsequent events */
export function identifyUser(id: string, email?: string) {
  Sentry.setUser({ id, email });
}

/** Clear user on sign-out */
export function clearUser() {
  Sentry.setUser(null);
}
