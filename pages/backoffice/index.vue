<template>
  <div>
    <h2 style="margin: 0 0 6px">Dashboard</h2>
    <p class="muted" style="margin: 0 0 16px">Bienvenue. Cette zone est protégée par le middleware `backoffice`.</p>

    <div class="grid">
      <div class="card" style="grid-column: span 4">
        <div style="font-weight: 800">Élèves</div>
        <div class="muted">0</div>
      </div>
      <div class="card" style="grid-column: span 4">
        <div style="font-weight: 800">Classes</div>
        <div class="muted">0</div>
      </div>
      <div class="card" style="grid-column: span 4">
        <div style="font-weight: 800">Alertes</div>
        <div class="muted">0</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'backoffice',
  middleware: ['backoffice']
})
</script>

