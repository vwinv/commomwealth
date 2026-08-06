<template>
  <div class="w-full bg-white" :class="{ 'page-motion-enter': pageReady, 'page-motion-ready': pageReady }">
    <MotionPageLoadCurtain />

    <MarketingHomeHeroSection />
    <div class="h-4 w-full bg-[#EFF2F7] sm:h-5" aria-hidden="true" />
    <MarketingHomeRentreeSection />
    <div class="h-4 w-full bg-[#EFF2F7] sm:h-5" aria-hidden="true" />
    <MarketingHomeAboutSection />
    <MarketingHomeClassesSection />
    <MarketingHomeApproachSection />
    <MarketingHomeValuesSection />
    <MarketingHomeWorkshopsSection />
    <MarketingHomeGallerySection />
    <MarketingHomePartnersSection />
    <MarketingHomeSuggestionsSection />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'marketing' });

const { t } = useI18n();
const { ready: pageReady } = usePageLoadMotion();

await loadLandingContent();

const pageTitle = computed(() => t('meta.homeTitle'));
const pageDescription = computed(() => t('meta.homeDescription'));

useHead({
  title: pageTitle,
  meta: [{ name: 'description', content: pageDescription }],
});
</script>
