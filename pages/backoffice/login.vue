<template>
  <div class="container" style="padding: 34px 0">
    <div class="card" style="max-width: 520px; margin: 0 auto">
      <h2 style="margin: 0 0 8px">Connexion backoffice</h2>
      <p class="muted" style="margin: 0 0 16px">Scaffold front-only (remplacera une vraie auth plus tard).</p>

      <form style="display: grid; gap: 12px" @submit.prevent="onSubmit">
        <label style="display: grid; gap: 6px">
          <span class="muted" style="font-size: 12px">Identifiant</span>
          <input v-model="username" class="input" autocomplete="username" />
        </label>

        <label style="display: grid; gap: 6px">
          <span class="muted" style="font-size: 12px">Mot de passe</span>
          <input v-model="password" class="input" type="password" autocomplete="current-password" />
        </label>

        <div style="display: flex; gap: 10px; justify-content: flex-end">
          <NuxtLink class="btn" to="/">Retour vitrine</NuxtLink>
          <button class="btn primary" type="submit">Se connecter</button>
        </div>

        <div v-if="error" class="muted" style="color: #ffb4b4">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const auth = useAuth()
const username = ref('')
const password = ref('')
const error = ref<string | null>(null)

function onSubmit() {
  error.value = null
  const ok = auth.login(username.value, password.value)
  if (!ok) {
    error.value = 'Identifiant et mot de passe requis.'
    return
  }
  return navigateTo('/backoffice')
}
</script>

<style scoped>
.input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.06);
  color: var(--text);
  outline: none;
}
.input:focus {
  border-color: rgba(124, 92, 255, 0.6);
}
</style>

