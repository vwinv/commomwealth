<template>
  <section id="gallery" class="w-full bg-[#EFF2F7] pb-10 pt-2">
    <div class="mx-auto max-w-[1200px] px-6">
      <RevealSection variant="blur">
        <MarketingSectionTitle :title="t('home.gallery.title')" />
      </RevealSection>

      <div class="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <RevealSection extra-class="motion-img-wrap overflow-hidden rounded-2xl shadow-sm sm:row-span-1" variant="pop" :delay="40">
          <img class="h-[220px] w-full object-cover sm:h-[260px]" :src="photo1" alt="" />
        </RevealSection>
        <RevealSection extra-class="motion-img-wrap overflow-hidden rounded-2xl shadow-sm" variant="pop" :delay="110">
          <img class="h-[220px] w-full object-cover sm:h-[260px]" :src="photo2" alt="" />
        </RevealSection>
        <RevealSection extra-class="motion-img-wrap overflow-hidden rounded-2xl shadow-sm" variant="pop" :delay="180">
          <img class="h-[220px] w-full object-cover sm:h-[260px]" :src="photo3" alt="" />
        </RevealSection>
        <RevealSection extra-class="motion-img-wrap overflow-hidden rounded-2xl shadow-sm sm:col-span-2" variant="blur" :delay="250">
          <img class="h-[220px] w-full object-cover sm:h-[280px]" :src="photo4" alt="" />
        </RevealSection>
        <RevealSection extra-class="motion-img-wrap overflow-hidden rounded-2xl shadow-sm" variant="pop" :delay="320">
          <img class="h-[220px] w-full object-cover sm:h-[280px]" :src="aproposImg" alt="" />
        </RevealSection>
      </div>

      <RevealSection extra-class="mt-10 flex justify-center" variant="up" :delay="360">
        <button type="button" class="motion-btn motion-btn--orange inline-flex h-11 items-center justify-center rounded-lg bg-brandOrange px-8 text-sm font-semibold text-white">
          {{ t('home.gallery.cta') }}
        </button>
      </RevealSection>
    </div>
  </section>
</template>

<script setup lang="ts">
import photo1 from '~/assets/images/photo1.png';
import photo2 from '~/assets/images/photo2.png';
import photo3 from '~/assets/images/photo3.png';
import photo4 from '~/assets/images/photo4.png';
import aproposImg from '~/assets/images/apropos.png';

const { t } = useI18n();
</script>
