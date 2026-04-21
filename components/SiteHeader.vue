<template>
  <header class="w-full border-b border-slate-200 bg-white">
    <div
      class="mx-auto flex max-w-[1200px] items-center justify-between gap-4 py-3 pl-4 pr-4 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-6 lg:py-3 lg:pl-8 lg:pr-4"
    >
      <NuxtLink class="flex min-w-[120px] items-center sm:min-w-[140px] lg:-ml-4 lg:pl-0" to="/" :aria-label="t('header.home')">
        <img class="h-12 w-auto object-contain sm:h-16" :src="logoUrl" alt="Logo" />
      </NuxtLink>

      <nav class="hidden items-center justify-center gap-6 lg:flex xl:gap-8" :aria-label="t('header.navAria')">
        <NuxtLink class="px-2 py-2 text-[15px] font-normal text-slate-600 hover:text-slate-900" to="/">{{
          t('header.home')
        }}</NuxtLink>
        <NuxtLink class="px-2 py-2 text-[13px] font-normal text-slate-600 hover:text-slate-900" to="/#apropos">{{
          t('header.about')
        }}</NuxtLink>
        <NuxtLink class="px-2 py-2 text-[13px] font-normal text-slate-600 hover:text-slate-900" to="/#values">{{
          t('header.values')
        }}</NuxtLink>
        <NuxtLink class="px-2 py-2 text-[13px] font-normal text-slate-600 hover:text-slate-900" to="/#partenariat">{{
          t('header.partnership')
        }}</NuxtLink>
      </nav>

      <div class="hidden items-center justify-end gap-2 sm:gap-3 lg:flex">
        <NuxtLink
          class="inline-flex h-10 items-center justify-center rounded-lg border border-brandOrange bg-brandOrange px-3 text-sm font-semibold text-white sm:px-4"
          to="/inscription"
          >{{ t('header.register') }}</NuxtLink
        >
        <NuxtLink
          class="inline-flex h-10 items-center justify-center rounded-lg border border-brandBlue bg-brandBlue px-3 text-sm font-semibold text-white sm:px-4"
          to="/contact"
          >{{ t('header.contact') }}</NuxtLink
        >
        <NuxtLink
          class="inline-flex h-10 items-center justify-center rounded-lg border border-brandBlue bg-white px-3 text-sm font-semibold text-brandBlue sm:px-4"
          to="/parent"
          >{{ t('header.parentSpace') }}</NuxtLink
        >
        <button
          class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brandBlue bg-brandBlue text-white transition hover:brightness-110"
          type="button"
          :aria-label="langButtonLabel"
          @click="toggleLocale"
        >
          <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
            <path
              d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"
              stroke="currentColor"
              stroke-width="2"
            />
            <path d="M2 12h20" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <path
              d="M12 2c2.8 2.7 4.4 6.3 4.4 10S14.8 19.3 12 22c-2.8-2.7-4.4-6.3-4.4-10S9.2 4.7 12 2Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <button
        type="button"
        class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:bg-slate-50 lg:hidden"
        :aria-expanded="menuOpen"
        :aria-controls="mobileMenuId"
        aria-label="Menu"
        @click="menuOpen = !menuOpen"
      >
        <svg v-if="!menuOpen" viewBox="0 0 24 24" fill="none" class="h-6 w-6" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" class="h-6 w-6" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <!-- Menu mobile -->
    <div
      v-show="menuOpen"
      :id="mobileMenuId"
      class="border-t border-slate-200 bg-white lg:hidden"
    >
      <nav class="mx-auto flex max-w-[1200px] flex-col gap-1 px-4 py-4" :aria-label="t('header.navAria')">
        <NuxtLink
          class="rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50"
          to="/"
          @click="closeMenu"
          >{{ t('header.home') }}</NuxtLink
        >
        <NuxtLink
          class="rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50"
          to="/#apropos"
          @click="closeMenu"
          >{{ t('header.about') }}</NuxtLink
        >
        <NuxtLink
          class="rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50"
          to="/#values"
          @click="closeMenu"
          >{{ t('header.values') }}</NuxtLink
        >
        <NuxtLink
          class="rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50"
          to="/#partenariat"
          @click="closeMenu"
          >{{ t('header.partnership') }}</NuxtLink
        >
      </nav>
      <div class="mx-auto flex max-w-[1200px] flex-col gap-2 border-t border-slate-100 px-4 pb-6 pt-4">
        <NuxtLink
          class="inline-flex h-11 items-center justify-center rounded-lg border border-brandOrange bg-brandOrange text-sm font-semibold text-white"
          to="/inscription"
          @click="closeMenu"
          >{{ t('header.register') }}</NuxtLink
        >
        <NuxtLink
          class="inline-flex h-11 items-center justify-center rounded-lg border border-brandBlue bg-brandBlue text-sm font-semibold text-white"
          to="/contact"
          @click="closeMenu"
          >{{ t('header.contact') }}</NuxtLink
        >
        <NuxtLink
          class="inline-flex h-11 items-center justify-center rounded-lg border border-brandBlue bg-white text-sm font-semibold text-brandBlue"
          to="/parent"
          @click="closeMenu"
          >{{ t('header.parentSpace') }}</NuxtLink
        >
        <button
          type="button"
          class="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-brandBlue bg-brandBlue text-sm font-semibold text-white"
          :aria-label="langButtonLabel"
          @click="onMobileLang"
        >
          <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5 shrink-0" aria-hidden="true">
            <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" stroke="currentColor" stroke-width="2" />
            <path d="M2 12h20" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <path
              d="M12 2c2.8 2.7 4.4 6.3 4.4 10S14.8 19.3 12 22c-2.8-2.7-4.4-6.3-4.4-10S9.2 4.7 12 2Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linejoin="round"
            />
          </svg>
          {{ locale === 'fr' ? 'English' : 'Français' }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import logoUrl from '~/assets/images/logo.png';

const { locale, setLocale, t } = useI18n();
const route = useRoute();

const menuOpen = ref(false);
const mobileMenuId = 'site-header-mobile-menu';

const langButtonLabel = computed(() => (locale.value === 'fr' ? t('header.langToEn') : t('header.langToFr')));

function closeMenu() {
  menuOpen.value = false;
}

function toggleLocale() {
  setLocale(locale.value === 'fr' ? 'en' : 'fr');
}

function onMobileLang() {
  toggleLocale();
  closeMenu();
}

watch(
  () => route.fullPath,
  () => {
    closeMenu();
  },
);
</script>
