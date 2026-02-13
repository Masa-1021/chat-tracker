/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SENTRY_DSN: string
  readonly VITE_SENTRY_ENVIRONMENT: string
  readonly VITE_STREAMING_CHAT_URL: string
  readonly VITE_TTS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
