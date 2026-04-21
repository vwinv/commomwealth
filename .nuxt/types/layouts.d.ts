import type { ComputedRef, MaybeRef } from 'vue'

type ComponentProps<T> = T extends new(...args: any) => { $props: infer P } ? NonNullable<P>
  : T extends (props: infer P, ...args: any) => any ? P
  : {}

declare module 'nuxt/app' {
  interface NuxtLayouts {
    admin: ComponentProps<typeof import("/Users/mac/Desktop/commonwealth/commomwealth/layouts/admin.vue").default>,
    default: ComponentProps<typeof import("/Users/mac/Desktop/commonwealth/commomwealth/layouts/default.vue").default>,
    marketing: ComponentProps<typeof import("/Users/mac/Desktop/commonwealth/commomwealth/layouts/marketing.vue").default>,
    parent: ComponentProps<typeof import("/Users/mac/Desktop/commonwealth/commomwealth/layouts/parent.vue").default>,
}
  export type LayoutKey = keyof NuxtLayouts extends never ? string : keyof NuxtLayouts
  interface PageMeta {
    layout?: MaybeRef<LayoutKey | false> | ComputedRef<LayoutKey | false>
  }
}