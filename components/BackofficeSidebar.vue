<template>
  <div>
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 10px">
      <div>
        <div style="font-weight: 800">Backoffice</div>
        <div class="muted" style="font-size: 12px">Espace administration</div>
      </div>
      <button class="btn" type="button" @click="logout">Déconnexion</button>
    </div>

    <div style="display: grid; gap: 10px">
      <NuxtLink class="btn" to="/backoffice">Dashboard</NuxtLink>
      <NuxtLink class="btn" to="/backoffice/students">Élèves</NuxtLink>
      <NuxtLink class="btn" to="/backoffice/classes">Classes</NuxtLink>
      <NuxtLink class="btn" to="/backoffice/settings">Paramètres</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuth()

function logout() {
  auth.logout()
  return navigateTo('/backoffice/login')
}
</script>

