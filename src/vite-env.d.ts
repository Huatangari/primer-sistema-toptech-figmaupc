/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_ALLOW_DEMO_MODE?: "true" | "false";
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_APP_ENV?: "development" | "staging" | "production" | "preview";
  readonly VITE_APP_VERSION?: string;
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}
