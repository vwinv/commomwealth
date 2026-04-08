<template>
  <div
    ref="root"
    :class="[visible ? 'reveal-in' : 'reveal-init', extraClass]"
    :style="visible ? `transition-delay:${delay}ms` : ''"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    delay?: number;
    extraClass?: string;
    threshold?: number;
  }>(),
  {
    delay: 0,
    extraClass: '',
    /** Plus bas = déclenchement plus tôt pendant le scroll (moins brusque). */
    threshold: 0.12,
  },
);

const root = ref<HTMLElement | null>(null);
const visible = ref(false);

onMounted(() => {
  const el = root.value;
  if (!el) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    visible.value = true;
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;
      visible.value = true;
      observer.disconnect();
    },
    {
      threshold: props.threshold,
      /** Zone d’intersection élargie vers le bas : l’anim démarre plus tôt, courbe plus longue à l’œil. */
      rootMargin: '0px 0px 18% 0px',
    },
  );

  observer.observe(el);
});
</script>
