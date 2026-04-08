<template>
  <header class="w-full border-b border-slate-200 bg-white">
    <div class="w-full grid grid-cols-[auto_1fr_auto] items-center gap-6 py-3 pl-8">
      <NuxtLink class="flex min-w-[140px] items-center pl-0 -ml-4" to="/" :aria-label="t('header.home')">
        <img class="h-16 w-auto object-contain" :src="logoUrl" alt="Logo" />
      </NuxtLink>

      <nav class="flex items-center justify-center gap-8" :aria-label="t('header.navAria')">
        <NuxtLink class="px-2 py-2 text-[15px] font-normal text-slate-600 hover:text-slate-900" to="/">{{
          t('header.home')
        }}</NuxtLink>
        <NuxtLink
          class="px-2 py-2 text-[13px] font-normal text-slate-600 hover:text-slate-900"
          to="/#apropos"
          >{{ t('header.about') }}</NuxtLink
        >
        <NuxtLink
          class="px-2 py-2 text-[13px] font-normal text-slate-600 hover:text-slate-900"
          to="/#values"
          >{{ t('header.values') }}</NuxtLink
        >
        <NuxtLink
          class="px-2 py-2 text-[13px] font-normal text-slate-600 hover:text-slate-900"
          to="/#partenariat"
          >{{ t('header.partnership') }}</NuxtLink
        >
      </nav>

      <div class="flex items-center justify-end gap-3 pr-4">
        <NuxtLink
          class="inline-flex h-10 items-center justify-center rounded-lg border border-brandOrange bg-brandOrange px-4 text-sm font-semibold text-white"
          to="/inscription"
          >{{ t('header.register') }}</NuxtLink
        >
        <NuxtLink
          class="inline-flex h-10 items-center justify-center rounded-lg border border-brandBlue bg-brandBlue px-4 text-sm font-semibold text-white"
          to="/contact"
          >{{ t('header.contact') }}</NuxtLink
        >
        <NuxtLink
          class="inline-flex h-10 items-center justify-center rounded-lg border border-brandBlue bg-white px-4 text-sm font-semibold text-brandBlue"
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
            <path
              d="M2 12h20"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M12 2c2.8 2.7 4.4 6.3 4.4 10S14.8 19.3 12 22c-2.8-2.7-4.4-6.3-4.4-10S9.2 4.7 12 2Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import logoUrl from '~/assets/images/logo.png';

const { locale, setLocale, t } = useI18n();

const langButtonLabel = computed(() => (locale.value === 'fr' ? t('header.langToEn') : t('header.langToFr')));

function toggleLocale() {
  setLocale(locale.value === 'fr' ? 'en' : 'fr');
}
</script>
