<template>
  <!--
  === LANDING PAGE (désactivée — mode maintenance) ===
  <div class="w-full bg-white" :class="{ 'page-motion-enter': pageReady, 'page-motion-ready': pageReady }">
    <MotionPageLoadCurtain />

    <MarketingHomeHeroSection />
    <div class="h-4 w-full bg-[#EFF2F7] sm:h-5" aria-hidden="true" />
    <MarketingHomeRentreeSection />
    <div class="h-4 w-full bg-[#EFF2F7] sm:h-5" aria-hidden="true" />
    <MarketingHomeAboutSection />
    <MarketingHomeApproachSection />
    <MarketingHomeValuesSection />
    <MarketingHomeWorkshopsSection />
    <MarketingHomeGallerySection />
    <MarketingHomePartnersSection />
    <MarketingHomeSuggestionsSection />
  </div>
  === fin LANDING PAGE ===
  -->

  <div
    class="flex min-h-screen flex-col items-center justify-center bg-brandBlue px-6 text-center text-white"
  >
    <p class="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Commonwealth</p>
    <h1 class="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
      Site en maintenance
    </h1>
    <p class="mt-4 max-w-md text-base text-white/85 sm:text-lg">
      Nous revenons très bientôt. Merci de votre compréhension.
    </p>
  </div>
</template>

<script setup lang="ts">
/** Mode maintenance : layout marketing désactivé (header / footer). Remettre `layout: 'marketing'` pour restaurer la landing. */
definePageMeta({ layout: false });

/*
=== LANDING PAGE (désactivée — mode maintenance) ===
definePageMeta({ layout: 'marketing' });

const { t } = useI18n();
const { ready: pageReady } = usePageLoadMotion();
const config = useRuntimeConfig();
const siteUrl = String(config.public.siteUrl || 'https://www.commonwealth-school.com').replace(/\/$/, '');

await loadLandingContent();

const pageTitle = computed(() => t('meta.homeTitle'));
const pageDescription = computed(() => t('meta.homeDescription'));

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogUrl: `${siteUrl}/`,
  ogImage: `${siteUrl}/logo.png`,
  ogImageAlt: 'Commonwealth',
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
  twitterImage: `${siteUrl}/logo.png`,
});

useHead({
  title: pageTitle,
  link: [{ rel: 'canonical', href: `${siteUrl}/` }],
});
=== fin LANDING PAGE ===
*/

useSeoMeta({
  title: 'Site en maintenance — Commonwealth',
  description: 'Le site est temporairement en maintenance. Merci de votre compréhension.',
  robots: 'noindex, nofollow',
});

useHead({
  title: 'Site en maintenance — Commonwealth',
});
</script>
