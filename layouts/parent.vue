<template>
  <div class="flex min-h-screen flex-col bg-[#e8edf4]">
    <header class="sticky top-0 z-30 border-b border-slate-200/80 bg-white shadow-sm">
      <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <NuxtLink to="/parent" class="flex shrink-0 items-center gap-2" aria-label="Espace parent — accueil">
          <img class="h-11 w-auto object-contain" :src="logoUrl" alt="" />
        </NuxtLink>

        <nav class="order-3 flex w-full justify-center gap-6 text-[15px] md:order-2 md:w-auto md:justify-center md:gap-10" aria-label="Espace parent">
          <NuxtLink
            to="/parent"
            class="py-1 font-medium transition-colors"
            :class="isAccueil ? 'text-brandOrange' : 'text-slate-600 hover:text-brandBlue'"
          >
            Accueil
          </NuxtLink>
          <NuxtLink
            to="/parent/enfants"
            class="py-1 font-medium transition-colors"
            :class="isEnfants ? 'text-brandOrange' : 'text-slate-600 hover:text-brandBlue'"
          >
            Mes enfants
          </NuxtLink>
          <NuxtLink
            to="/parent/paiements"
            class="py-1 font-medium transition-colors"
            :class="isPaiements ? 'text-brandOrange' : 'text-slate-600 hover:text-brandBlue'"
          >
            Paiements
          </NuxtLink>
          <NuxtLink
            to="/parent/documents"
            class="py-1 font-medium transition-colors"
            :class="isDocuments ? 'text-brandOrange' : 'text-slate-600 hover:text-brandBlue'"
          >
            Documents
          </NuxtLink>
        </nav>

        <div class="order-2 flex items-center gap-2 md:order-3 md:gap-3">
          <NuxtLink
            to="/contact"
            class="inline-flex h-10 w-10 items-center justify-center rounded-full text-brandBlue hover:bg-slate-100"
            aria-label="Aide — contact"
          >
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.75" />
              <path
                d="M9.5 9.5a2.5 2.5 0 1 1 4 2c0 2-2 1.75-2 3.5"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
              />
              <circle cx="12" cy="16.5" r="0.9" fill="currentColor" />
            </svg>
          </NuxtLink>
          <NuxtLink
            to="/parent"
            class="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-brandBlue hover:bg-slate-100"
            aria-label="Notifications"
          >
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 7H3s3 0 3-7Z"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linejoin="round"
              />
              <path d="M10.3 21a1.8 1.8 0 0 0 3.4 0" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
            </svg>
            <span
              v-if="notifCount > 0"
              class="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brandBlue px-1 text-[10px] font-bold text-white"
            >
              {{ notifCount > 9 ? '9+' : notifCount }}
            </span>
          </NuxtLink>
          <div class="relative flex items-center gap-2" @click.stop>
            <button
              type="button"
              class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-sm font-semibold text-slate-700 ring-2 ring-white"
              :aria-label="`Profil ${initials}`"
              @click="menuOpen = !menuOpen"
            >
              <img v-if="false" alt="" class="h-full w-full object-cover" />
              <span v-else>{{ initials }}</span>
            </button>
            <div
              v-if="menuOpen"
              class="absolute right-0 top-11 z-40 min-w-[180px] rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
            >
              <button
                type="button"
                class="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                @click="onLogout"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
      <slot />
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import logoUrl from '~/assets/images/logo.png';

const route = useRoute();
const { authFetch, logout } = useParentAuth();

const pathNorm = computed(() => {
  const p = route.path.replace(/\/$/, '');
  return p || '/';
});

const isAccueil = computed(() => pathNorm.value === '/parent');
const isEnfants = computed(
  () => pathNorm.value === '/parent/enfants' || pathNorm.value.startsWith('/parent/enfants/'),
);
const isPaiements = computed(() => pathNorm.value === '/parent/paiements');
const isDocuments = computed(() => pathNorm.value === '/parent/documents');

const me = ref<{ fullName: string | null; email: string } | null>(null);
const notifCount = ref(0);
const menuOpen = ref(false);

const initials = computed(() => {
  const n = me.value?.fullName?.trim();
  if (n) {
    const parts = n.split(/\s+/).filter(Boolean);
    const a = parts[0]?.[0];
    const b = parts[1]?.[0];
    return ((a ?? '') + (b ?? a ?? '')).toUpperCase().slice(0, 2) || '?';
  }
  const e = me.value?.email?.[0];
  return e?.toUpperCase() ?? '?';
});

async function refreshShell() {
  try {
    me.value = await authFetch<{ fullName: string | null; email: string }>('/parent/me');
  } catch {
    me.value = null;
  }
  try {
    const list = await authFetch<Array<{ id: string }>>('/parent/notifications');
    notifCount.value = Array.isArray(list) ? list.length : 0;
  } catch {
    notifCount.value = 0;
  }
}

function onLogout() {
  menuOpen.value = false;
  logout();
  return navigateTo('/parent/login');
}

function onDocClick() {
  menuOpen.value = false;
}

onMounted(() => {
  void refreshShell();
  document.addEventListener('click', onDocClick);
});

onUnmounted(() => {
  document.removeEventListener('click', onDocClick);
});

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false;
    void refreshShell();
  },
);
</script>
