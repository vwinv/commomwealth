import type { NavigationGuard } from 'vue-router'
export type MiddlewareKey = "admin-guest" | "admin" | "parent"
declare module 'nuxt/app' {
  interface PageMeta {
    middleware?: MiddlewareKey | NavigationGuard | Array<MiddlewareKey | NavigationGuard>
  }
}