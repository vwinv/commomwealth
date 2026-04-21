<template>
  <div class="w-full bg-white">
    <!-- HERO -->
    <section class="w-full">
      <RevealSection extra-class="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-24 lg:px-0 lg:py-36">
        <div class="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-10">
          <!-- Mobile / tablette : images en premier ; lg+ : colonne droite -->
          <div class="order-1 flex items-center justify-center lg:order-2">
            <div class="animate-hero-bounce relative isolate w-full max-w-[340px]">
              <img
                class="pointer-events-none absolute -right-8 -top-8 z-0 h-28 w-28 object-cover sm:-right-12 sm:-top-12 sm:h-36 sm:w-36 lg:-right-16 lg:-top-16 lg:h-40 lg:w-40"
                :src="image5"
                alt=""
                aria-hidden="true"
              />

              <div class="relative z-10 grid grid-cols-2 gap-3">
                <div class="overflow-hidden rounded-2xl">
                  <img class="h-full w-full object-cover" :src="image1" alt="" />
                </div>
                <div class="overflow-hidden rounded-2xl">
                  <img class="h-full w-full object-cover" :src="image2" alt="" />
                </div>
                <div class="overflow-hidden rounded-2xl">
                  <img class="h-full w-full object-cover" :src="image3" alt="" />
                </div>
                <div class="overflow-hidden rounded-2xl">
                  <img class="h-full w-full object-cover" :src="image4" alt="" />
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile / tablette : texte en dessous + marge gauche ; lg+ : colonne gauche -->
          <div class="order-2 ml-4 sm:ml-8 lg:order-1 lg:ml-0 lg:-ml-20 lg:pl-0">
            <h1 class="leading-[1.05]">
              <span class="relative inline-block text-[32px] font-extrabold tracking-tight text-brandBlue sm:text-[40px] lg:text-[46px] xl:text-[54px]">
                The Commonwealth School
                <img
                  class="pointer-events-none absolute left-16 top-full mt-2 w-[140px] sm:left-24 sm:w-[180px] lg:left-32 lg:w-[220px]"
                  :src="traitImg"
                  alt=""
                  aria-hidden="true"
                />
              </span>
              <span class="block text-[28px] font-light tracking-tight text-brandBlue/90 sm:text-[36px] lg:text-[42px] xl:text-[50px]">
                {{ t('home.hero.subtitle') }}
              </span>
            </h1>

            <p class="mt-6 text-base font-normal text-slate-800 sm:text-lg">{{ t('home.hero.tagline') }}</p>

            <div class="mt-10">
              <button
                class="inline-flex h-10 items-center justify-center rounded-md bg-brandOrange px-6 text-sm font-semibold text-white shadow-sm"
                type="button"
              >
                {{ t('home.hero.cta') }}
              </button>
            </div>

            <div class="mt-12 flex items-center gap-3">
              <span class="h-2 w-2 rounded-full bg-slate-400" aria-hidden="true" />
              <span class="h-2 w-2 rounded-full bg-brandBlue" aria-hidden="true" />
              <span class="h-2 w-2 rounded-full bg-slate-200" aria-hidden="true" />
            </div>
          </div>
        </div>
      </RevealSection>
    </section>

    <!-- PARTENARIAT -->
    <section id="partenariat" class="w-full bg-[#EFF2F7] py-20">
      <div class="relative w-full px-0">
        <div
          class="pointer-events-none absolute -bottom-6 right-10 hidden h-[70px] w-[70px] lg:block"
          aria-hidden="true"
          style="
            background-image: radial-gradient(rgba(249, 155, 75, 0.9) 2px, transparent 2px);
            background-size: 14px 14px;
          "
        />

        <RevealSection
          extra-class="reveal-smooth-up mx-auto w-full max-w-[1200px] rounded-2xl bg-brandBlue px-10 py-10 text-white shadow-[0_16px_40px_rgba(2,6,23,0.12)]"
          :delay="120"
        >
          <div class="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div class="max-w-[620px]">
              <div class="text-2xl font-semibold tracking-tight">
                {{ t('home.partnership.title') }}
                <div class="mt-2 h-[2px] w-28 bg-white/70" aria-hidden="true" />
              </div>

              <p class="mt-6 text-sm leading-6 text-white/90">
                {{ t('home.partnership.body') }}
              </p>

              <div class="mt-8">
                <button
                  class="inline-flex h-10 items-center justify-center rounded-md bg-brandOrange px-6 text-sm font-semibold text-white shadow-sm"
                  type="button"
                >
                  {{ t('home.partnership.cta') }}
                </button>
              </div>
            </div>

            <div class="relative -translate-x-2 lg:-translate-x-6">
              <img class="h-[150px] w-[150px] object-contain" :src="partenariatImg" :alt="t('home.partnership.imgAlt')" />
              <div
                class="pointer-events-none absolute -right-6 -top-2 hidden h-[110px] w-[44px] lg:block"
                aria-hidden="true"
                style="
                  background-image: radial-gradient(rgba(255, 255, 255, 0.9) 2px, transparent 2px);
                  background-size: 14px 14px;
                "
              />
            </div>
          </div>
        </RevealSection>
      </div>
    </section>

    <!-- A PROPOS -->
    <section id="apropos" class="w-full bg-white py-20">
      <RevealSection extra-class="mx-auto w-full max-w-[1200px] px-6" :delay="120">
        <div class="mb-10">
          <div class="relative inline-block text-xl font-semibold text-brandBlue">
            {{ t('home.about.title') }}
            <img
              class="pointer-events-none absolute left-0 top-full mt-2 w-[150px]"
              :src="traitImg"
              alt=""
              aria-hidden="true"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_1fr]">
          <div class="relative overflow-hidden rounded-2xl bg-slate-100">
            <img class="h-full w-full object-cover" :src="aproposImg" alt="" />

           
          </div>

          <div class="text-[13px] leading-6 text-slate-500 lg:pt-4">
            <p class="text-center">
              {{ t('home.about.p1') }}
            </p>

            <p class="mt-10 text-center">
              {{ t('home.about.p2') }}
            </p>
          </div>
        </div>
      </RevealSection>
    </section>

    <!-- NOS VALEURS -->
    <section id="values" class="w-full bg-[#EFF2F7] py-20">
      <RevealSection extra-class="mx-auto w-full max-w-[1200px] px-6" :delay="140">
        <div class="relative inline-block text-xl font-semibold text-brandBlue">
          {{ t('home.values.title') }}
          <img
            class="pointer-events-none absolute left-0 top-full mt-2 w-[140px]"
            :src="traitImg"
            alt=""
            aria-hidden="true"
          />
        </div>

        <p class="mt-8 max-w-[980px] text-sm leading-6 text-slate-700">
          {{ t('home.values.intro') }}
        </p>

        <div class="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <RevealSection extra-class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" :delay="170">
            <div class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brandBlue text-white">
              <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                <path
                  d="M12 21s7-4.6 7-11V6l-7-3-7 3v4c0 6.4 7 11 7 11Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div class="font-semibold text-slate-900">{{ t('home.values.courageTitle') }}</div>
            <div class="mt-2 text-sm text-slate-500">{{ t('home.values.courageBody') }}</div>
          </RevealSection>

          <RevealSection extra-class="rounded-2xl bg-brandBlue p-6 text-white shadow-sm" :delay="210">
            <div class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white">
              <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                <path
                  d="M12 2a7 7 0 0 0-4 12.7V18a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-3.3A7 7 0 0 0 12 2Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
                <path d="M9 22h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </div>
            <div class="font-semibold">{{ t('home.values.curiosityTitle') }}</div>
            <div class="mt-2 text-sm text-white/85">{{ t('home.values.curiosityBody') }}</div>
          </RevealSection>

          <RevealSection extra-class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" :delay="250">
            <div class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brandBlue text-white">
              <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                <path
                  d="M8 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z"
                  stroke="currentColor"
                  stroke-width="2"
                  transform="translate(4 0)"
                />
                <path
                  d="M20 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z"
                  stroke="currentColor"
                  stroke-width="2"
                  transform="translate(4 0)"
                />
                <path
                  d="M8 16c1.4 2.4 3.6 4 6 4s4.6-1.6 6-4"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            <div class="font-semibold text-slate-900">{{ t('home.values.collabTitle') }}</div>
            <div class="mt-2 text-sm text-slate-500">
              {{ t('home.values.collabBody') }}
            </div>
          </RevealSection>
        </div>
      </RevealSection>
    </section>

    <!-- GALLERIE PHOTOS -->
    <section id="gallery" class="w-full bg-[#EFF2F7] py-20">
      <RevealSection extra-class="mx-auto w-full max-w-[1200px] px-6" :delay="160">
        <div class="flex items-start justify-between gap-6">
          <div class="relative inline-block text-xl font-semibold text-brandBlue">
            {{ t('home.gallery.title') }}
            <img
              class="pointer-events-none absolute left-0 top-full mt-2 w-[140px]"
              :src="traitImg"
              alt=""
              aria-hidden="true"
            />
          </div>

          <div
            class="pointer-events-none mt-1 hidden h-[88px] w-[88px] lg:block"
            aria-hidden="true"
            style="
              background-image: radial-gradient(rgba(249, 155, 75, 0.9) 2px, transparent 2px);
              background-size: 14px 14px;
            "
          />
        </div>

        <div class="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <RevealSection extra-class="overflow-hidden rounded-2xl bg-white shadow-sm" :delay="180">
            <img class="h-[260px] w-full object-cover object-center" :src="photo1" alt="" />
          </RevealSection>
          <RevealSection extra-class="overflow-hidden rounded-2xl bg-white shadow-sm" :delay="220">
            <img class="h-[260px] w-full object-cover object-center" :src="photo2" alt="" />
          </RevealSection>
          <RevealSection extra-class="overflow-hidden rounded-2xl bg-white shadow-sm" :delay="260">
            <img class="h-[260px] w-full object-cover object-center" :src="photo3" alt="" />
          </RevealSection>

          <RevealSection extra-class="overflow-hidden rounded-2xl bg-white shadow-sm lg:col-span-3" :delay="300">
            <img class="h-[420px] w-full object-cover object-center" :src="photo4" alt="" />
          </RevealSection>
        </div>
      </RevealSection>
    </section>
  </div>
</template>

<script setup lang="ts">
import image1 from '~/assets/images/image1.png';
import image2 from '~/assets/images/image2.png';
import image3 from '~/assets/images/image3.png';
import image4 from '~/assets/images/image4.png';
import image5 from '~/assets/images/image5.jpg';
import partenariatImg from '~/assets/images/partenariat.png';
import aproposImg from '~/assets/images/apropos.png';
import traitImg from '~/assets/images/trait.png';
import photo1 from '~/assets/images/photo1.png';
import photo2 from '~/assets/images/photo2.png';
import photo3 from '~/assets/images/photo3.png';
import photo4 from '~/assets/images/photo4.png';

definePageMeta({
  layout: 'marketing',
});

const { t } = useI18n();

const pageTitle = computed(() => t('meta.homeTitle'));
const pageDescription = computed(() => t('meta.homeDescription'));

useHead({
  title: pageTitle,
  meta: [{ name: 'description', content: pageDescription }],
});
</script>

<style scoped>
/* Rebond infini : pic puis amortissements avant de reposer. */
@keyframes hero-bounce {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  38% {
    transform: translate3d(0, -18px, 0);
  }
  54% {
    transform: translate3d(0, -10px, 0);
  }
  68% {
    transform: translate3d(0, -4px, 0);
  }
  82% {
    transform: translate3d(0, -1px, 0);
  }
}

.animate-hero-bounce {
  animation: hero-bounce 2.2s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .animate-hero-bounce {
    animation: none;
  }
}
</style>

