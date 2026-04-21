<template>
  <footer class="w-full bg-brandBlue text-white">
    <div class="mx-auto w-full max-w-[1200px] px-6 py-10">
      <div class="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <div class="flex items-start gap-4">
          <img class="h-16 w-16 rounded-2xl bg-white p-2" :src="logoImg" alt="Logo" />
        </div>

        <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div class="space-y-3">
            <div class="flex items-start gap-3 text-sm text-white/90">
              <span class="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
                  <path
                    d="M12 21s7-4.6 7-11a7 7 0 1 0-14 0c0 6.4 7 11 7 11Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                </svg>
              </span>
              <div>
                <div class="font-semibold text-white">2110 Thornridge Cir, Syracuse, Connecticut 35624</div>
              </div>
            </div>

            <div class="flex items-start gap-3 text-sm text-white/90">
              <span class="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
                  <path
                    d="M6.5 3h3l1.2 5-2 1.6c1.2 2.4 3.1 4.3 5.5 5.5l1.6-2 5 1.2v3c0 1.1-.9 2-2 2C10.6 20.5 3.5 13.4 3.5 4.8c0-1 .9-1.8 2-1.8Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <div class="font-semibold text-white">(123) 456-7890</div>
            </div>
          </div>

          <div class="space-y-3">
            <div class="text-sm font-semibold text-white/90">{{ t('footer.social') }}</div>
            <div class="flex items-center gap-4 text-white/90">
              <a class="hover:text-white" href="#" aria-label="Facebook">f</a>
              <a class="hover:text-white" href="#" aria-label="LinkedIn">in</a>
              <a class="hover:text-white" href="#" aria-label="Instagram">ig</a>
              <a class="hover:text-white" href="#" aria-label="Google">g+</a>
            </div>
          </div>

          <div class="flex items-end justify-start lg:justify-end">
            <div class="text-xs text-white/60">
              Copyright © {{ year }}
              <a
                href="https://www.mega-sn.com/"
                target="_blank"
                rel="noopener noreferrer"
                class="font-semibold text-white hover:underline"
              >
                MEGA
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-10 border-t border-white/20 pt-6">
        <nav class="flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-semibold tracking-wide text-white/80">
          <NuxtLink class="hover:text-white" to="/">{{ t('footer.navHome').toUpperCase() }}</NuxtLink>
          <NuxtLink class="hover:text-white" to="/#apropos">{{ t('footer.navAbout').toUpperCase() }}</NuxtLink>
          <NuxtLink class="hover:text-white" to="/#partenariat">{{ t('footer.navPartnerships').toUpperCase() }}</NuxtLink>
          <NuxtLink class="hover:text-white" to="/#contact">{{ t('footer.navContact').toUpperCase() }}</NuxtLink>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import logoImg from '~/assets/images/logo.png';

const year = new Date().getFullYear();
const { t } = useI18n();
</script>
