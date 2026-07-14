<template>
  <section id="classes" class="relative w-full bg-[#F4F8FC] py-20">
    <MarketingDotPattern position="top-right" color="blue" class="opacity-60" />

    <div class="relative mx-auto max-w-[1200px] px-6">
      <RevealSection variant="blur">
        <MarketingSectionTitle :title="t('home.classes.title')" />
        <p class="mt-4 max-w-[720px] text-sm leading-7 text-slate-600">{{ t('home.classes.intro') }}</p>
      </RevealSection>

      <div class="mt-10 space-y-3">
        <RevealSection
          v-for="(item, i) in items"
          :key="item.id"
          variant="rise"
          :delay="60 + i * 90"
        >
          <div
            class="overflow-hidden rounded-2xl border-2 transition-[background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            :class="open === item.id ? [item.bgClass, 'border-transparent shadow-md'] : 'border-brandBlue bg-white'"
          >
            <button
              type="button"
              class="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-6 sm:py-5"
              :aria-expanded="open === item.id"
              @click="toggle(item.id)"
            >
              <span
                class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-[background-color,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                :class="open === item.id ? 'bg-white' : 'bg-brandBlue'"
                aria-hidden="true"
              >
                <component :is="item.icon" class="h-5 w-5 transition-colors duration-500" :class="open === item.id ? item.iconColor : 'text-white'" />
              </span>

              <span
                class="flex-1 text-sm font-bold uppercase tracking-wide transition-colors duration-500 sm:text-base"
                :class="open === item.id ? 'text-white' : 'text-brandBlue'"
              >
                {{ item.title }}
              </span>

              <svg
                viewBox="0 0 24 24"
                fill="none"
                class="h-5 w-5 shrink-0 transition-[transform,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                :class="[
                  open === item.id ? 'rotate-90 text-white' : 'rotate-0 text-brandBlue',
                ]"
                stroke="currentColor"
                stroke-width="2.5"
                aria-hidden="true"
              >
                <path
                  d="M9 6l6 6-6 6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>

            <div
              class="accordion-grid grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              :class="open === item.id ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
            >
              <div class="overflow-hidden">
                <div
                  class="accordion-panel border-t border-white/20 px-5 pb-5 pt-1 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-6 sm:pb-6"
                  :class="open === item.id ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'"
                >
                  <ul class="list-disc space-y-2 pl-5 text-sm leading-7 text-white/95 sm:text-[15px]">
                    <li v-for="(bullet, bi) in item.bullets" :key="bi">{{ bullet }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>

      <RevealSection
        extra-class="motion-card mt-12 overflow-hidden rounded-3xl bg-brandBlue px-8 py-10 text-white shadow-[0_20px_50px_rgba(33,110,194,0.25)] sm:px-12 sm:py-12"
        variant="blur"
        :delay="120"
      >
        <div class="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div class="max-w-[600px]">
            <h2 class="text-2xl font-bold tracking-tight sm:text-3xl">{{ t('home.vision.title') }}</h2>
            <div class="mt-2 h-[2px] w-24 bg-white/60" />
            <p class="mt-6 text-sm leading-7 text-white/90 sm:text-base">{{ t('home.vision.body') }}</p>
            <div class="mt-8">
              <NuxtLink
                class="motion-btn motion-btn--orange inline-flex h-11 items-center justify-center rounded-lg bg-brandOrange px-8 text-sm font-semibold text-white"
                to="/inscription"
              >
                {{ t('home.vision.cta') }}
              </NuxtLink>
            </div>
          </div>
          <div class="flex justify-center lg:justify-end">
            <img class="h-36 w-36 object-contain sm:h-44 sm:w-44" :src="partenariatImg" :alt="t('home.vision.imgAlt')" />
          </div>
        </div>
      </RevealSection>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { FunctionalComponent } from 'vue';
import partenariatImg from '~/assets/images/partenariat.png';

const { t, tm } = useI18n();
const open = ref<string | null>('graines');

function getBullets(key: 'graines' | 'pousses' | 'branches' | 'feuilles'): string[] {
  const raw = tm(`home.classes.items.${key}.bullets`);
  if (!Array.isArray(raw)) return [];
  return raw.map((_, index) => t(`home.classes.items.${key}.bullets.${index}`));
}

function toggle(id: string) {
  open.value = open.value === id ? null : id;
}

const IconBaby: FunctionalComponent = () =>
  h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('circle', { cx: '12', cy: '8', r: '4' }),
    h('path', { d: 'M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6', 'stroke-linecap': 'round' }),
  ]);

const IconBee: FunctionalComponent = () =>
  h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { d: 'M12 3c-2 3-6 4-6 9a6 6 0 0 0 12 0c0-5-4-6-6-9Z', 'stroke-linejoin': 'round' }),
    h('path', { d: 'M12 12v9', 'stroke-linecap': 'round' }),
  ]);

const IconGiraffe: FunctionalComponent = () =>
  h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('circle', { cx: '12', cy: '5', r: '2.5' }),
    h('path', { d: 'M12 7.5V20', 'stroke-linecap': 'round' }),
    h('path', { d: 'M9 12h6M9 16h5', 'stroke-linecap': 'round' }),
  ]);

const IconElephant: FunctionalComponent = () =>
  h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { d: 'M8 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z', transform: 'translate(4 0)' }),
    h('path', { d: 'M4 16c1.4 2.4 3.6 4 6 4s4.6-1.6 6-4', 'stroke-linecap': 'round' }),
    h('path', { d: 'M20 10v6', 'stroke-linecap': 'round' }),
  ]);

const itemStyles = {
  graines: { bgClass: 'bg-brandBlue', iconColor: 'text-brandBlue', icon: IconBaby },
  pousses: { bgClass: 'bg-brandGreen', iconColor: 'text-brandGreen', icon: IconBee },
  branches: { bgClass: 'bg-brandOrange', iconColor: 'text-brandOrange', icon: IconGiraffe },
  feuilles: { bgClass: 'bg-brandPurple', iconColor: 'text-brandPurple', icon: IconElephant },
} as const;

const items = computed(() =>
  (['graines', 'pousses', 'branches', 'feuilles'] as const).map((key) => ({
    id: key,
    title: t(`home.classes.items.${key}.title`),
    bullets: getBullets(key),
    ...itemStyles[key],
  })),
);
</script>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  .accordion-grid,
  .accordion-panel {
    transition: none !important;
  }
}
</style>
