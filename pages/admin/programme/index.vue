<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-[#216EC2] sm:text-4xl">Programme de l'année</h1>
        <p class="mt-1 flex items-center gap-2 text-sm font-medium text-slate-500">
          <svg class="h-4 w-4 text-[#216EC2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          Année scolaire {{ schoolYearLabel }}
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-xl bg-[#216EC2] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-105"
        @click="openFormModal()"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke-linecap="round" />
        </svg>
        Ajouter un programme
      </button>
    </div>

    <p v-if="loadError" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{{ loadError }}</p>

    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="card in statCards"
        :key="card.key"
        class="rounded-2xl border-2 border-[#216EC2]/30 bg-white p-5 shadow-sm"
      >
        <div class="mb-3 flex items-start justify-between gap-2">
          <h2 class="text-sm font-semibold leading-snug text-slate-700">{{ card.title }}</h2>
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            :class="card.iconBg"
            aria-hidden="true"
          >
            <span v-html="card.icon" />
          </span>
        </div>
        <p class="text-3xl font-bold tracking-tight text-slate-900">
          <span v-if="pending" class="inline-block h-9 w-16 animate-pulse rounded bg-slate-200" />
          <template v-else>{{ card.value }}</template>
        </p>
      </article>
    </section>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="chip in filterChips"
        :key="chip.value"
        type="button"
        class="rounded-full px-4 py-2 text-sm font-semibold transition"
        :class="
          activeCategory === chip.value
            ? 'bg-[#216EC2] text-white shadow-sm'
            : 'border border-slate-200 bg-white text-slate-600 hover:border-[#216EC2]/40 hover:text-[#216EC2]'
        "
        @click="activeCategory = chip.value"
      >
        {{ chip.label }}
      </button>
    </div>

    <div v-if="pending" class="space-y-6">
      <div v-for="n in 2" :key="n" class="space-y-3">
        <div class="h-6 w-40 animate-pulse rounded bg-slate-200" />
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div v-for="s in 2" :key="s" class="h-36 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </div>
    </div>

    <div v-else-if="!filteredGroups.length" class="rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      <p class="text-lg font-semibold text-slate-700">Aucun programme pour le moment</p>
      <p class="mt-1 text-sm text-slate-500">Ajoutez une sortie, une réunion ou un atelier pour l'année scolaire.</p>
      <button
        type="button"
        class="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#216EC2] px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-105"
        @click="openFormModal()"
      >
        Ajouter un programme
      </button>
    </div>

    <div v-else class="space-y-8">
      <section v-for="group in filteredGroups" :key="group.monthLabel" class="space-y-4">
        <h2 class="text-lg font-bold text-slate-800">{{ group.monthLabel }}</h2>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <article
            v-for="event in group.events"
            :key="event.id"
            class="flex w-full overflow-hidden rounded-2xl border bg-white shadow-sm"
            :style="{
              borderColor: `${categoryTheme(event.category).iconColor}40`,
              boxShadow: `0 1px 3px ${categoryTheme(event.category).iconColor}14`,
            }"
          >
            <div
              class="flex w-16 shrink-0 flex-col items-center justify-center border-r py-4 text-center"
              :style="{
                backgroundColor: categoryTheme(event.category).iconBg,
                color: categoryTheme(event.category).iconColor,
                borderColor: `${categoryTheme(event.category).iconColor}30`,
              }"
            >
              <span class="text-2xl font-bold leading-none">{{ event.dayNum }}</span>
              <span class="mt-1 text-xs font-bold tracking-wide opacity-80">{{ event.dayAbbr }}</span>
            </div>

            <div class="min-w-0 flex-1 p-4 sm:p-5">
              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-bold"
                  :style="{
                    backgroundColor: categoryTheme(event.category).iconBg,
                    color: categoryTheme(event.category).iconColor,
                  }"
                >
                  <span
                    class="inline-flex h-4 w-4 shrink-0 items-center justify-center"
                    :style="{ color: categoryTheme(event.category).iconColor }"
                    aria-hidden="true"
                    v-html="categoryTheme(event.category).icon"
                  />
                  {{ event.categoryLabel }}
                </span>
                <span
                  class="rounded-full px-3 py-0.5 text-xs font-bold"
                  :style="{
                    backgroundColor: statusTheme(event.status).bg,
                    color: statusTheme(event.status).color,
                  }"
                >
                  {{ event.statusLabel }}
                </span>
              </div>

              <h3 class="mt-2 text-lg font-bold text-slate-900">{{ event.title }}</h3>
              <p v-if="event.description" class="mt-1 text-sm leading-relaxed text-slate-600">{{ event.description }}</p>

              <div class="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                <span class="inline-flex items-center gap-1.5">
                  <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  {{ event.dateLabel }}
                </span>
                <span v-if="event.location" class="inline-flex items-center gap-1.5">
                  <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {{ event.location }}
                </span>
                <span v-if="event.assignedStaff" class="inline-flex items-center gap-1.5">
                  <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  {{ event.assignedStaff }}
                </span>
              </div>

              <div v-if="event.levelLabels.length" class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="label in event.levelLabels"
                  :key="label"
                  class="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600"
                >
                  {{ label }}
                </span>
              </div>

              <div class="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-[#216EC2]/40 hover:text-[#216EC2]"
                  title="Modifier"
                  :disabled="actionId === event.id"
                  @click="openFormModal(event)"
                >
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50"
                  title="Supprimer"
                  :disabled="actionId === event.id"
                  @click="removeEvent(event)"
                >
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>

    <Teleport to="body">
      <div
        v-if="formOpen"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-[#216EC2]/25 p-4 backdrop-blur-md supports-[backdrop-filter]:bg-[#216EC2]/20"
        role="dialog"
        aria-modal="true"
        aria-labelledby="programme-form-title"
        @click.self="formOpen = false"
      >
        <div class="relative z-[201] max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/60 bg-white shadow-2xl shadow-[#216EC2]/20">
          <div class="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white px-6 py-5">
            <div class="flex items-start gap-3">
              <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#216EC2]/10 text-[#216EC2]">
                <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </span>
              <div>
                <h2 id="programme-form-title" class="text-lg font-bold text-[#1e3a6e]">
                  {{ editingId ? 'Modifier le programme' : 'Nouveau programme' }}
                </h2>
                <p class="mt-0.5 text-sm text-slate-500">
                  Planifiez une activité de l'année et précisez le responsable et le public.
                </p>
              </div>
            </div>
            <button
              type="button"
              class="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Fermer"
              @click="formOpen = false"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p v-if="formError" class="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{{ formError }}</p>

          <form class="space-y-5 px-6 py-5" @submit.prevent="submitForm">
            <label class="block">
              <span class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Intitulé</span>
              <input
                v-model.trim="form.title"
                type="text"
                required
                class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#216EC2] focus:ring-2 focus:ring-[#216EC2]/20"
                placeholder="Ex. Sortie au musée"
              >
            </label>

            <div>
              <span class="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Catégorie</span>
              <div class="grid grid-cols-2 gap-3">
                <button
                  v-for="cat in categoryOptions"
                  :key="cat.value"
                  type="button"
                  class="flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition"
                  :class="
                    form.category === cat.value
                      ? 'border-[#216EC2] bg-[#216EC2]/5 text-[#216EC2]'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  "
                  @click="form.category = cat.value"
                >
                  <span
                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    :style="{ backgroundColor: cat.iconBg, color: cat.iconColor }"
                    aria-hidden="true"
                    v-html="cat.icon"
                  />
                  {{ cat.label }}
                </button>
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <label class="block">
                <span class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Date de début</span>
                <input
                  v-model="form.eventDate"
                  type="date"
                  required
                  :max="form.endDate || undefined"
                  class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#216EC2] focus:ring-2 focus:ring-[#216EC2]/20"
                >
              </label>
              <label class="block">
                <span class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Date de fin (optionnel)</span>
                <input
                  v-model="form.endDate"
                  type="date"
                  :min="form.eventDate || undefined"
                  :disabled="!form.eventDate"
                  class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#216EC2] focus:ring-2 focus:ring-[#216EC2]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                >
              </label>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <label class="block">
                <span class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Lieu</span>
                <input
                  v-model.trim="form.location"
                  type="text"
                  class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#216EC2] focus:ring-2 focus:ring-[#216EC2]/20"
                  placeholder="Ex. Salle d'éveil"
                >
              </label>
              <label class="block">
                <span class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Responsable</span>
                <div class="relative">
                  <select
                    v-model="form.assignedStaff"
                    class="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-10 text-sm text-slate-800 outline-none transition focus:border-[#216EC2] focus:ring-2 focus:ring-[#216EC2]/20"
                  >
                    <option value="">— Sélectionner —</option>
                    <option v-for="s in staffOptions" :key="s.id" :value="s.label">{{ s.label }}</option>
                  </select>
                  <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </div>
              </label>
            </div>

            <div>
              <span class="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Statut</span>
              <div class="inline-flex w-full rounded-xl border border-slate-200 bg-slate-50 p-1 sm:w-auto">
                <button
                  v-for="st in statusOptions"
                  :key="st.value"
                  type="button"
                  class="flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition sm:flex-none sm:min-w-[7rem]"
                  :class="
                    form.status === st.value
                      ? 'bg-[#216EC2] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  "
                  @click="form.status = st.value"
                >
                  {{ st.label }}
                </button>
              </div>
            </div>

            <fieldset>
              <legend class="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Public visé</legend>
              <div v-if="catalogPending" class="text-xs text-slate-500">Chargement des niveaux…</div>
              <div v-else class="flex flex-wrap gap-2">
                <button
                  v-for="lv in catalogLevels"
                  :key="lv.id"
                  type="button"
                  class="rounded-full border px-3.5 py-1.5 text-sm font-semibold transition"
                  :class="
                    form.levelIds.includes(lv.id)
                      ? 'border-[#216EC2] bg-[#216EC2] text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-[#216EC2]/50'
                  "
                  @click="toggleLevel(lv.id)"
                >
                  {{ lv.name }}
                </button>
              </div>
            </fieldset>

            <label class="block">
              <span class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Description</span>
              <textarea
                v-model.trim="form.description"
                rows="4"
                class="w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#216EC2] focus:ring-2 focus:ring-[#216EC2]/20"
                placeholder="Détails de l'activité…"
              />
            </label>

            <div class="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                class="rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                @click="formOpen = false"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="inline-flex items-center gap-2 rounded-xl bg-[#216EC2] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-105 disabled:opacity-50"
                :disabled="formSubmitting"
              >
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                {{ editingId ? 'Enregistrer' : 'Créer le programme' }}
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

type ProgramStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED'
type ProgramCategory = 'SORTIE_SCOLAIRE' | 'PARENTS' | 'PROFESSEURS' | 'SKILLS_EVEIL'

type ProgramEvent = {
  id: string
  title: string
  description: string
  eventDate: string
  endDate: string | null
  dateLabel: string
  dayNum: number
  dayAbbr: string
  monthKey: string
  location: string
  assignedStaff: string
  category: ProgramCategory
  categoryLabel: string
  status: ProgramStatus
  statusLabel: string
  levelLabels: string[]
  levelIds: string[]
}

type OverviewDto = {
  schoolYear: string
  staffOptions: Array<{ id: string; label: string }>
  stats: { total: number; upcoming: number; inProgress: number; completed: number }
  groups: Array<{ monthLabel: string; events: ProgramEvent[] }>
  items: ProgramEvent[]
}

type CatalogLevel = { id: string; name: string }

type CategoryTheme = {
  label: string
  iconBg: string
  iconColor: string
  badgeClass: string
  icon: string
}

const CATEGORY_THEMES: Record<ProgramCategory, CategoryTheme> = {
  SORTIE_SCOLAIRE: {
    label: 'Sortie scolaire',
    iconBg: '#E8F5E9',
    iconColor: '#43A047',
    badgeClass: 'bg-[#E8F5E9] text-[#2E7D32]',
    icon: `<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16"/><path d="M4 10h16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6z"/><path d="M8 18v2M16 18v2"/><circle cx="8" cy="18" r="1" fill="currentColor" stroke="none"/><circle cx="16" cy="18" r="1" fill="currentColor" stroke="none"/></svg>`,
  },
  PARENTS: {
    label: 'Parents',
    iconBg: '#FFF3E0',
    iconColor: '#F9994B',
    badgeClass: 'bg-[#FFF3E0] text-[#F9994B]',
    icon: `<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  },
  PROFESSEURS: {
    label: 'Professeurs',
    iconBg: '#EDE7F6',
    iconColor: '#7E57C2',
    badgeClass: 'bg-[#EDE7F6] text-[#7E57C2]',
    icon: `<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  },
  SKILLS_EVEIL: {
    label: 'Skills & éveil',
    iconBg: '#F3E5F5',
    iconColor: '#AB47BC',
    badgeClass: 'bg-[#F3E5F5] text-[#8E24AA]',
    icon: `<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"/></svg>`,
  },
}

const CATEGORY_ORDER: ProgramCategory[] = ['SORTIE_SCOLAIRE', 'PARENTS', 'PROFESSEURS', 'SKILLS_EVEIL']

const categoryOptions = CATEGORY_ORDER.map((value) => ({
  value,
  ...CATEGORY_THEMES[value],
}))

function categoryTheme(category: ProgramCategory) {
  return CATEGORY_THEMES[category]
}

const statusOptions = [
  { value: 'PLANNED' as const, label: 'Planifié' },
  { value: 'IN_PROGRESS' as const, label: 'En cours' },
  { value: 'COMPLETED' as const, label: 'Terminé' },
]

const STATUS_THEMES: Record<ProgramStatus, { label: string; bg: string; color: string }> = {
  PLANNED: { label: 'Planifié', bg: '#F1F5F9', color: '#64748B' },
  IN_PROGRESS: { label: 'En cours', bg: '#FFF3E0', color: '#F9994B' },
  COMPLETED: { label: 'Terminé', bg: '#E8F5E9', color: '#2E7D32' },
}

function statusTheme(status: ProgramStatus) {
  return STATUS_THEMES[status]
}

const { token } = useAuth()
const config = useRuntimeConfig()

const overview = ref<OverviewDto | null>(null)
const loadError = ref<string | null>(null)
const pending = ref(true)
const actionId = ref<string | null>(null)
const activeCategory = ref<'ALL' | ProgramCategory>('ALL')
const intFr = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 })

const formOpen = ref(false)
const formError = ref<string | null>(null)
const formSubmitting = ref(false)
const editingId = ref<string | null>(null)
const catalogLevels = ref<CatalogLevel[]>([])
const catalogPending = ref(false)
const staffOptions = ref<OverviewDto['staffOptions']>([])

const form = reactive({
  title: '',
  description: '',
  eventDate: '',
  endDate: '',
  location: '',
  assignedStaff: '',
  category: 'SORTIE_SCOLAIRE' as ProgramCategory,
  status: 'PLANNED' as ProgramStatus,
  levelIds: [] as string[],
})

const filterChips = [
  { value: 'ALL' as const, label: 'Tous' },
  ...CATEGORY_ORDER.map((value) => ({ value, label: CATEGORY_THEMES[value].label })),
]

const schoolYearLabel = computed(() => overview.value?.schoolYear ?? '—')

const statCards = computed(() => {
  const s = overview.value?.stats
  return [
    {
      key: 'total',
      title: 'Programmes',
      value: s != null ? intFr.format(s.total) : '—',
      iconBg: 'bg-[#216EC2]/10 text-[#216EC2]',
      icon: `<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`,
    },
    {
      key: 'upcoming',
      title: 'À venir',
      value: s != null ? intFr.format(s.upcoming) : '—',
      iconBg: 'bg-violet-100 text-violet-600',
      icon: `<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
    },
    {
      key: 'inProgress',
      title: 'En cours',
      value: s != null ? intFr.format(s.inProgress) : '—',
      iconBg: 'bg-amber-100 text-amber-600',
      icon: `<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`,
    },
    {
      key: 'completed',
      title: 'Terminés',
      value: s != null ? intFr.format(s.completed) : '—',
      iconBg: 'bg-emerald-100 text-emerald-600',
      icon: `<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>`,
    },
  ]
})

const filteredGroups = computed(() => {
  if (activeCategory.value === 'ALL') return overview.value?.groups ?? []
  return (overview.value?.groups ?? [])
    .map((g) => ({
      ...g,
      events: g.events.filter((e) => e.category === activeCategory.value),
    }))
    .filter((g) => g.events.length > 0)
})

function todayIso() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function toggleLevel(id: string) {
  const i = form.levelIds.indexOf(id)
  if (i >= 0) form.levelIds.splice(i, 1)
  else form.levelIds.push(id)
}

function isoDateInput(iso: string) {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

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
  } finally {
    catalogPending.value = false
  }
}

function resetForm() {
  form.title = ''
  form.description = ''
  form.eventDate = todayIso()
  form.endDate = ''
  form.location = ''
  form.assignedStaff = ''
  form.category = 'SORTIE_SCOLAIRE'
  form.status = 'PLANNED'
  form.levelIds = []
  editingId.value = null
}

function openFormModal(event?: ProgramEvent) {
  formError.value = null
  resetForm()
  if (event) {
    editingId.value = event.id
    form.title = event.title
    form.description = event.description
    form.eventDate = isoDateInput(event.eventDate)
    form.endDate = event.endDate ? isoDateInput(event.endDate) : ''
    form.location = event.location
    form.assignedStaff = event.assignedStaff
    form.category = event.category
    form.status = event.status
    form.levelIds = [...event.levelIds]
  }
  formOpen.value = true
  void loadCatalogLevels()
}

async function submitForm() {
  formError.value = null
  const t = token.value
  if (!t) return
  formSubmitting.value = true
  try {
    const body = {
      title: form.title,
      description: form.description,
      eventDate: form.eventDate,
      endDate: form.endDate || null,
      location: form.location,
      assignedStaff: form.assignedStaff,
      category: form.category,
      status: form.status,
      levelIds: form.levelIds,
    }
    if (editingId.value) {
      await $fetch(`${config.public.apiBase}/admin/programme/${editingId.value}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${t}` },
        body,
      })
    } else {
      await $fetch(`${config.public.apiBase}/admin/programme`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${t}` },
        body,
      })
    }
    formOpen.value = false
    await loadOverview()
  } catch (e: unknown) {
    const err = e as { data?: { message?: string | string[] } }
    const raw = err?.data?.message
    formError.value =
      typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : 'Impossible d’enregistrer le programme.'
  } finally {
    formSubmitting.value = false
  }
}

async function removeEvent(event: ProgramEvent) {
  if (!confirm(`Supprimer « ${event.title} » ?`)) return
  const t = token.value
  if (!t) return
  actionId.value = event.id
  try {
    await $fetch(`${config.public.apiBase}/admin/programme/${event.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${t}` },
    })
    await loadOverview()
  } catch {
    loadError.value = 'Impossible de supprimer ce programme.'
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
    const data = await $fetch<OverviewDto>(`${config.public.apiBase}/admin/programme`, {
      headers: { Authorization: `Bearer ${t}` },
    })
    overview.value = data
    staffOptions.value = data.staffOptions ?? []
  } catch (e: unknown) {
    const err = e as { data?: { message?: string | string[] } }
    const raw = err?.data?.message
    loadError.value =
      typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : 'Impossible de charger le programme.'
    overview.value = null
  } finally {
    pending.value = false
  }
}

watch(token, () => {
  if (token.value) void loadOverview()
}, { immediate: true })

watch(() => form.eventDate, (start) => {
  if (!start || !form.endDate) return
  if (form.endDate < start) form.endDate = start
})
</script>
