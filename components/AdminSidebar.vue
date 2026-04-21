<template>
  <aside class="flex h-full min-h-0 w-[260px] max-w-full flex-col bg-white">
    <div class="relative flex items-center justify-center border-b border-slate-100 px-4 py-6">
      <img :src="logoUrl" alt="Commonwealth" class="h-14 w-auto object-contain" width="140" height="56" />
      <button
        type="button"
        class="absolute right-3 top-1/2 z-[1] -translate-y-1/2 rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 xl:hidden"
        aria-label="Fermer le menu"
        @click="closeDrawer"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <nav class="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 py-4" aria-label="Navigation admin">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold text-slate-600 transition hover:bg-slate-50"
        :class="navActive(item) ? 'border border-[#F9994B] bg-orange-50/50 text-[#F9994B]' : 'border border-transparent'"
        @click="closeDrawer"
      >
        <span class="flex h-9 w-9 shrink-0 items-center justify-center text-current" aria-hidden="true" v-html="item.icon" />
        {{ item.label }}
      </NuxtLink>
    </nav>

    <div class="border-t border-slate-100 p-3">
      <button
        type="button"
        class="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[14px] font-bold text-red-600 transition hover:bg-red-50"
        @click="logout"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Déconnexion
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import logoUrl from '~/assets/images/logo.png'

const route = useRoute()
const auth = useAuth()
const menuOpen = useState('admin_menu_open', () => false)

function closeDrawer() {
  menuOpen.value = false
}

const navItems = [
  {
    to: '/admin',
    label: 'Home',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  },
  {
    to: '/admin/inscriptions',
    label: 'Inscriptions',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  },
  {
    to: '/admin/students',
    label: 'Élèves',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  },
  {
    to: '/admin/parents',
    label: 'Parents',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  },
  {
    to: '/admin/payments',
    label: 'Paiements',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>`,
  },
  {
    to: '/admin/documents',
    label: 'Documents',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>`,
  },
  {
    to: '/admin/parametrage',
    label: 'Paramétrage',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
  },
]

function navActive(item: { to: string }) {
  if (item.to === '/admin') return route.path === '/admin'
  return route.path === item.to || route.path.startsWith(`${item.to}/`)
}

function logout() {
  auth.logout()
  return navigateTo('/admin/login')
}
</script>
