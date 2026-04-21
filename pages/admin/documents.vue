<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <h1 class="text-2xl font-bold text-[#216EC2] sm:text-4xl">Gestion Documents</h1>
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl bg-[#1e3a6e] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110"
          @click="openAddModal"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M12 18v-6M9 15h6" />
          </svg>
          Ajouter un document
        </button>
      </div>
    </div>

    <p v-if="loadError" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{{ loadError }}</p>

    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="card in statCards"
        :key="card.key"
        class="rounded-2xl border-2 border-[#216EC2]/30 bg-white p-5 shadow-sm"
      >
        <div class="mb-3 flex items-start justify-between gap-2">
          <h2 class="text-sm font-semibold leading-snug text-slate-700">{{ card.title }}</h2>
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#216EC2]/10 text-[#216EC2]"
            aria-hidden="true"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
          </span>
        </div>
        <p class="text-3xl font-bold tracking-tight text-slate-900">
          <span v-if="pending" class="inline-block h-9 w-16 animate-pulse rounded bg-slate-200" />
          <template v-else>{{ card.value }}</template>
        </p>
        <p class="mt-1 text-xs font-medium text-slate-400">Total cumulé</p>
      </article>
    </section>

    <div class="relative max-w-2xl">
      <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" stroke-linecap="round" />
        </svg>
      </span>
      <input
        v-model="searchInput"
        type="search"
        class="w-full rounded-2xl border border-[#216EC2]/30 bg-white py-3 pl-12 pr-4 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[#216EC2] focus:ring-2 focus:ring-[#216EC2]/20"
        placeholder="Rechercher…"
        autocomplete="off"
      />
    </div>

    <section class="overflow-hidden rounded-2xl border-2 border-[#216EC2]/25 bg-white shadow-sm">
      <div class="flex items-center justify-between px-5 pb-3 pt-4">
        <h2 class="text-3xl font-bold tracking-tight text-slate-800">Documents</h2>
        <select
          v-model="sort"
          class="rounded-xl border-2 border-[#F9994B] bg-[#F9994B] px-4 py-2.5 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-[#F9994B]/30"
          @change="page = 1"
        >
          <option value="date_desc">Trier par</option>
          <option value="date_asc">Plus ancien</option>
          <option value="title_asc">Titre A → Z</option>
          <option value="title_desc">Titre Z → A</option>
          <option value="kind_asc">Type</option>
        </select>
      </div>

      <div class="overflow-x-auto px-4 pb-3">
        <table class="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr class="bg-[#216EC2] text-white">
              <th class="px-4 py-3 font-semibold">Date</th>
              <th class="px-4 py-3 font-semibold">Titre</th>
              <th class="px-4 py-3 font-semibold">Type</th>
              <th class="px-4 py-3 font-semibold">Classe</th>
              <th class="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white">
            <template v-if="pending">
              <tr v-for="n in 7" :key="'s-' + n">
                <td v-for="c in 5" :key="c" class="px-4 py-3">
                  <span class="inline-block h-4 w-full max-w-[7rem] animate-pulse rounded bg-slate-200" />
                </td>
              </tr>
            </template>
            <tr v-else-if="!rows.length">
              <td colspan="5" class="px-4 py-12 text-center text-slate-500">Aucun document.</td>
            </tr>
            <tr v-for="row in rows" v-else :key="row.id" class="text-slate-700">
              <td class="whitespace-nowrap px-4 py-3">{{ row.dateLabel }}</td>
              <td class="px-4 py-3 font-semibold">{{ row.title }}</td>
              <td class="px-4 py-3">{{ row.kindLabel }}</td>
              <td class="max-w-[220px] px-4 py-3 text-slate-600">
                {{ row.levelLabels.length ? row.levelLabels.join(', ') : 'Tous les niveaux' }}
              </td>
              <td class="px-4 py-3">
                <div class="flex flex-wrap items-center gap-2">
                  <button
                    v-if="!row.published"
                    type="button"
                    class="inline-flex items-center gap-1 rounded-lg border border-[#216EC2]/50 bg-[#216EC2]/10 px-2.5 py-1.5 text-xs font-bold text-[#216EC2] transition hover:bg-[#216EC2]/15"
                    :disabled="actionId === row.id"
                    @click="togglePublish(row, true)"
                  >
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6" />
                      <path d="M12 18v-6M9 15h6" />
                    </svg>
                    Publier
                  </button>
                  <button
                    v-else
                    type="button"
                    class="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                    :disabled="actionId === row.id"
                    @click="togglePublish(row, false)"
                  >
                    Dépublier
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100"
                    :disabled="actionId === row.id"
                    @click="removeRow(row)"
                  >
                    <span class="text-base leading-none">×</span>
                    Supprimer
                  </button>
                  <a
                    :href="documentPublicUrl(row.url)"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#216EC2]/40 bg-[#216EC2]/5 text-[#216EC2] transition hover:bg-[#216EC2]/10"
                    title="Ouvrir"
                  >
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="!pending && overview && overview.total > 0"
        class="flex flex-wrap items-center justify-end gap-4 border-t border-slate-100 px-5 py-4"
      >
        <span class="text-sm font-medium text-slate-600">
          {{ pageStart }} – {{ pageEnd }} pour {{ intFr.format(overview.total) }}
        </span>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="page <= 1"
            @click="page--"
          >
            ‹
          </button>
          <button
            type="button"
            class="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="pageEnd >= overview.total"
            @click="page++"
          >
            ›
          </button>
        </div>
      </div>
    </section>

    <!-- Modal ajout -->
    <Teleport to="body">
      <div
        v-if="addOpen"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-[#216EC2]/25 p-4 backdrop-blur-md supports-[backdrop-filter]:bg-[#216EC2]/20"
        role="dialog"
        aria-modal="true"
        aria-labelledby="doc-add-title"
        @click.self="addOpen = false"
      >
        <div
          class="relative z-[201] max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/60 bg-white p-6 shadow-2xl shadow-[#216EC2]/20"
        >
          <div class="flex items-start justify-between gap-3">
            <h2 id="doc-add-title" class="text-lg font-bold text-[#1e3a6e]">Ajouter un Document</h2>
            <button
              type="button"
              class="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label="Fermer"
              @click="addOpen = false"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p v-if="addError" class="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{{ addError }}</p>
          <form class="mt-5 space-y-4" @submit.prevent="submitAdd">
            <label class="block">
              <span class="mb-1 block text-sm font-semibold text-[#1e3a6e]">Nom du document</span>
              <input
                v-model.trim="addForm.title"
                type="text"
                required
                class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none ring-[#216EC2]/20 focus:border-[#216EC2] focus:ring-2"
                placeholder="Brochure Commonwealth"
              >
            </label>
            <label class="block">
              <span class="mb-1 block text-sm font-semibold text-[#1e3a6e]">Catégories</span>
              <div class="relative">
                <select
                  v-model="addForm.kind"
                  class="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-10 text-sm text-slate-800 outline-none ring-[#216EC2]/20 focus:border-[#216EC2] focus:ring-2"
                >
                  <option value="ADMIN">Administratif</option>
                  <option value="SCHOOL">Scolaire</option>
                </select>
                <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </div>
            </label>
            <label class="block">
              <span class="mb-1 block text-sm font-semibold text-[#1e3a6e]">Niveau <span class="font-normal text-slate-500">(optionnel)</span></span>
              <div class="relative">
                <select
                  v-model="addForm.levelId"
                  class="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-10 text-sm text-slate-800 outline-none ring-[#216EC2]/20 focus:border-[#216EC2] focus:ring-2"
                  :disabled="catalogPending"
                >
                  <option value="">— Aucun rattachement —</option>
                  <option v-for="lv in catalogLevels" :key="lv.id" :value="lv.id">{{ lv.name }}</option>
                </select>
                <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </div>
              <p v-if="catalogPending" class="mt-1 text-xs text-slate-500">Chargement des niveaux…</p>
            </label>
            <div>
              <span class="mb-2 block text-sm font-semibold text-[#1e3a6e]">Document</span>
              <input
                ref="fileInputRef"
                type="file"
                class="sr-only"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                @change="onFileInput"
              >
              <button
                type="button"
                class="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#216EC2]/50 bg-[#216EC2]/[0.04] px-4 py-10 text-center transition hover:border-[#216EC2] hover:bg-[#216EC2]/[0.07]"
                @click="fileInputRef?.click()"
                @dragover.prevent
                @drop.prevent="onDrop"
              >
                <svg class="h-10 w-10 text-[#216EC2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span class="text-sm font-medium text-[#1e3a6e]">Upload PDF, DOCX/DOC (Word)</span>
                <span v-if="addFileName" class="text-xs font-semibold text-[#216EC2]">{{ addFileName }}</span>
              </button>
              <p class="mt-2 text-xs text-slate-500">Ou indiquez une URL externe (optionnel si vous uploadez un fichier).</p>
              <input
                v-model.trim="addForm.url"
                type="url"
                class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-[#216EC2]/20 focus:border-[#216EC2] focus:ring-2"
                placeholder="https://…"
              >
            </div>
            <div class="flex justify-center pt-2">
              <button
                type="submit"
                class="inline-flex min-w-[200px] items-center justify-center gap-1 rounded-xl bg-[#F9994B] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-105 disabled:opacity-50"
                :disabled="addSubmitting"
              >
                Ajouter +
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

type OverviewDto = {
  stats: { total: number; administratif: number; scolaire: number }
  items: Array<{
    id: string
    title: string
    url: string
    kind: string
    kindLabel: string
    published: boolean
    dateLabel: string
    levelLabels: string[]
  }>
  total: number
  page: number
  limit: number
}

type CatalogLevel = { id: string; name: string }

const { token } = useAuth()
const config = useRuntimeConfig()

const searchInput = ref('')
const debouncedSearch = ref('')
const sort = ref('date_desc')
const page = ref(1)
const limit = ref(10)

const overview = ref<OverviewDto | null>(null)
const loadError = ref<string | null>(null)
const pending = ref(true)
const actionId = ref<string | null>(null)
const intFr = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 })

const addOpen = ref(false)
const addError = ref<string | null>(null)
const addSubmitting = ref(false)
const catalogLevels = ref<CatalogLevel[]>([])
const catalogPending = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const addFile = ref<File | null>(null)
const addFileName = computed(() => addFile.value?.name ?? '')
const addForm = reactive({
  title: '',
  url: '',
  kind: 'ADMIN' as 'SCHOOL' | 'ADMIN',
  levelId: '',
})

function documentPublicUrl(url: string) {
  if (!url) return '#'
  if (/^https?:\/\//i.test(url)) return url
  const base = String(config.public.apiBase ?? '').replace(/\/api\/?$/, '')
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`
}

function onFileInput(e: Event) {
  const input = e.target as HTMLInputElement
  const f = input.files?.[0]
  addFile.value = f ?? null
  if (f) addForm.url = ''
}

function onDrop(e: DragEvent) {
  const f = e.dataTransfer?.files?.[0]
  if (f && /\.(pdf|doc|docx)$/i.test(f.name)) {
    addFile.value = f
    addForm.url = ''
  }
}

let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(searchInput, (v) => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    debouncedSearch.value = v
    page.value = 1
  }, 350)
})

const statCards = computed(() => {
  const s = overview.value?.stats
  return [
    { key: 'total', title: 'Total document', value: s != null ? intFr.format(s.total) : '—' },
    { key: 'adm', title: 'Documents administratif', value: s != null ? intFr.format(s.administratif) : '—' },
    { key: 'school', title: 'Documents scolaire', value: s != null ? intFr.format(s.scolaire) : '—' },
  ]
})

const rows = computed(() => overview.value?.items ?? [])
const pageStart = computed(() => {
  if (!overview.value?.total) return 0
  return (overview.value.page - 1) * overview.value.limit + 1
})
const pageEnd = computed(() => {
  if (!overview.value?.total) return 0
  return Math.min(overview.value.page * overview.value.limit, overview.value.total)
})

async function loadCatalogLevels() {
  const t = token.value
  if (!t) return
  catalogPending.value = true
  try {
    const data = await $fetch<{ levels: CatalogLevel[] }>(`${config.public.apiBase}/admin/settings/levels`, {
      headers: { Authorization: `Bearer ${t}` },
    })
    catalogLevels.value = data.levels
  } catch {
    catalogLevels.value = []
    addError.value = 'Impossible de charger les niveaux.'
  } finally {
    catalogPending.value = false
  }
}

function openAddModal() {
  addError.value = null
  addForm.title = ''
  addForm.url = ''
  addForm.kind = 'ADMIN'
  addForm.levelId = ''
  addFile.value = null
  if (fileInputRef.value) fileInputRef.value.value = ''
  addOpen.value = true
  void loadCatalogLevels()
}

async function submitAdd() {
  addError.value = null
  const t = token.value
  if (!t) return
  addSubmitting.value = true
  try {
    let url = addForm.url.trim()
    if (addFile.value) {
      const fd = new FormData()
      fd.append('file', addFile.value)
      const up = await $fetch<{ url: string }>(`${config.public.apiBase}/admin/documents/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${t}` },
        body: fd,
      })
      url = up.url
    }
    if (!url) {
      addError.value = 'Ajoutez un fichier (PDF, DOC, DOCX) ou une URL.'
      return
    }
    const body: Record<string, unknown> = {
      title: addForm.title,
      url,
      kind: addForm.kind,
      published: false,
    }
    if (addForm.levelId) body.levelId = addForm.levelId

    await $fetch(`${config.public.apiBase}/admin/documents`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${t}` },
      body,
    })
    addOpen.value = false
    page.value = 1
    await loadOverview()
  } catch (e: unknown) {
    const err = e as { data?: { message?: string | string[] } }
    const raw = err?.data?.message
    addError.value =
      typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : 'Impossible d’enregistrer le document.'
  } finally {
    addSubmitting.value = false
  }
}

async function togglePublish(row: OverviewDto['items'][0], published: boolean) {
  const t = token.value
  if (!t) return
  actionId.value = row.id
  try {
    await $fetch(`${config.public.apiBase}/admin/documents/${row.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${t}` },
      body: { published },
    })
    await loadOverview()
  } catch {
    loadError.value = 'Impossible de mettre à jour la publication.'
  } finally {
    actionId.value = null
  }
}

async function removeRow(row: OverviewDto['items'][0]) {
  if (!confirm(`Supprimer « ${row.title} » ?`)) return
  const t = token.value
  if (!t) return
  actionId.value = row.id
  try {
    await $fetch(`${config.public.apiBase}/admin/documents/${row.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${t}` },
    })
    await loadOverview()
  } catch {
    loadError.value = 'Impossible de supprimer ce document.'
  } finally {
    actionId.value = null
  }
}

async function loadOverview() {
  pending.value = true
  loadError.value = null
  const t = token.value
  if (!t) {
    pending.value = false
    overview.value = null
    return
  }
  try {
    overview.value = await $fetch<OverviewDto>(`${config.public.apiBase}/admin/documents`, {
      headers: { Authorization: `Bearer ${t}` },
      query: {
        page: page.value,
        limit: limit.value,
        search: debouncedSearch.value.trim() || undefined,
        sort: sort.value,
      },
    })
  } catch (e: unknown) {
    const err = e as { data?: { message?: string | string[] } }
    const raw = err?.data?.message
    loadError.value =
      typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : 'Impossible de charger les documents.'
    overview.value = null
  } finally {
    pending.value = false
  }
}

watch(
  [token, page, limit, debouncedSearch, sort],
  () => {
    if (token.value) void loadOverview()
  },
  { immediate: true },
)
</script>
