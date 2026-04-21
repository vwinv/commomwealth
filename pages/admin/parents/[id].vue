<template>
  <div class="-mt-3 space-y-6 sm:-mt-4">
    <div class="mb-0 flex flex-wrap items-center gap-3">
      <NuxtLink to="/admin/parents" class="inline-flex h-10 w-10 items-center justify-center" aria-label="Retour à la liste">
        <svg class="h-6 w-6 text-[#216EC2]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M15.5 5.75 8.25 12l7.25 6.25V5.75Z" />
        </svg>
      </NuxtLink>
      <h1 class="min-w-0 flex-1 text-[1.65rem] font-bold tracking-tight text-[#216EC2] sm:text-[2.1rem]">Fiche parent</h1>
    </div>

    <p v-if="loadError" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{{ loadError }}</p>

    <div
      v-if="pending"
      class="flex min-h-[200px] items-center justify-center rounded-2xl border-2 border-[#216EC2]/15 bg-white text-slate-500 shadow-sm"
    >
      Chargement…
    </div>

    <article v-else-if="detail" class="space-y-6">
      <section class="overflow-hidden rounded-3xl border-2 border-[#216EC2]/30 bg-white px-6 py-6 shadow-sm sm:px-8">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="text-xl font-bold text-slate-900 sm:text-2xl">{{ detail.fullName }}</p>
            <p class="mt-1 text-sm text-slate-600">{{ detail.email }}</p>
            <span
              v-if="detail.relationLabel !== '—'"
              class="mt-3 inline-block rounded-lg bg-[#F9994B] px-3 py-1 text-xs font-bold text-white shadow-sm"
            >
              {{ detail.relationLabel }}
            </span>
          </div>
          <span
            class="rounded-full px-3 py-1 text-xs font-bold"
            :class="detail.blocked ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'"
          >
            {{ detail.blocked ? 'Compte bloqué' : 'Compte actif' }}
          </span>
        </div>
        <ul class="mt-6 space-y-3 text-sm">
          <li v-if="detail.phone" class="flex gap-2">
            <span class="font-semibold text-[#216EC2]">Tél.</span>
            <a :href="`tel:${phoneRaw}`" class="font-medium text-slate-900">{{ detail.phone }}</a>
          </li>
          <li v-if="detail.address" class="flex gap-2">
            <span class="font-semibold text-[#216EC2]">Adresse</span>
            <span class="text-slate-800">{{ detail.address }}</span>
          </li>
        </ul>
      </section>

      <section class="overflow-hidden rounded-3xl border-2 border-[#216EC2]/25 bg-white shadow-sm">
        <h2 class="border-b border-slate-100 px-6 py-4 text-lg font-bold text-slate-900">Enfants inscrits</h2>
        <ul class="divide-y divide-slate-100">
          <li v-for="c in detail.children" :key="c.childId" class="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
            <div>
              <p class="font-semibold text-slate-900">{{ c.name }}</p>
              <p class="text-sm text-slate-600">{{ c.className }} · {{ c.schoolYear }}</p>
            </div>
            <NuxtLink
              :to="`/admin/students/${c.childId}`"
              class="inline-flex items-center gap-1.5 rounded-xl border border-[#216EC2]/50 bg-[#216EC2]/10 px-3 py-2 text-xs font-bold text-[#216EC2] transition hover:bg-[#216EC2]/15"
            >
              Voir l’élève
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </NuxtLink>
          </li>
        </ul>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

type ParentDetailDto = {
  id: string
  email: string
  fullName: string
  phone: string | null
  address: string | null
  relationLabel: string
  blocked: boolean
  createdAt: string
  children: Array<{
    childId: string
    name: string
    className: string
    schoolYear: string
  }>
}

const route = useRoute()
const { token } = useAuth()
const config = useRuntimeConfig()

const parentId = computed(() => String(route.params.id ?? ''))
const detail = ref<ParentDetailDto | null>(null)
const loadError = ref<string | null>(null)
const pending = ref(true)

const phoneRaw = computed(() => (detail.value?.phone ?? '').replace(/\s/g, ''))

async function load() {
  pending.value = true
  loadError.value = null
  const t = token.value
  const id = parentId.value
  if (!t || !id) {
    pending.value = false
    detail.value = null
    return
  }
  try {
    detail.value = await $fetch<ParentDetailDto>(`${config.public.apiBase}/admin/parents/${id}`, {
      headers: { Authorization: `Bearer ${t}` },
    })
  } catch (e: unknown) {
    const err = e as { data?: { message?: string | string[] }; statusCode?: number }
    const raw = err?.data?.message
    loadError.value =
      err?.statusCode === 404
        ? 'Parent introuvable.'
        : typeof raw === 'string'
          ? raw
          : Array.isArray(raw)
            ? raw[0]
            : 'Impossible de charger la fiche.'
    detail.value = null
  } finally {
    pending.value = false
  }
}

watch(
  [token, parentId],
  () => {
    if (token.value) void load()
  },
  { immediate: true },
)
</script>
