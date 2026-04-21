<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center gap-3">
      <NuxtLink
        to="/admin/inscriptions"
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
        aria-label="Retour à la liste"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m15 18-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </NuxtLink>
      <h1 class="text-2xl font-bold text-[#216EC2]">Suivi de la demande d'inscription</h1>
    </div>

    <p v-if="loadError" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{{ loadError }}</p>
    <p v-if="actionMessage" class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
      {{ actionMessage }}
    </p>
    <p v-if="actionError" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{{ actionError }}</p>

    <Teleport to="body">
      <div v-if="confirmModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4" role="presentation">
        <div
          class="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
          aria-hidden="true"
          @click="closeConfirmModal"
        />
        <div
          role="dialog"
          aria-modal="true"
          :aria-labelledby="confirmModal === 'approve' ? 'confirm-approve-title' : 'confirm-reject-title'"
          class="relative w-full max-w-[420px] rounded-[28px] bg-white px-7 pb-8 pt-6 shadow-xl"
          @click.stop
        >
          <div class="mb-5 flex items-start justify-between gap-4">
            <h2
              v-if="confirmModal === 'approve'"
              id="confirm-approve-title"
              class="text-xl font-bold tracking-tight text-slate-900"
            >
              Valider la demande
            </h2>
            <h2 v-else id="confirm-reject-title" class="text-xl font-bold tracking-tight text-slate-900">
              Rejeter la demande
            </h2>
            <button
              type="button"
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#216EC2]/25 bg-[#216EC2]/10 text-[#216EC2] transition hover:bg-[#216EC2]/15"
              aria-label="Fermer"
              @click="closeConfirmModal"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
              </svg>
            </button>
          </div>

          <p v-if="confirmModal === 'approve'" class="mb-6 text-center text-[15px] leading-relaxed text-slate-500">
            Voulez-vous vraiment valider cette inscription&nbsp;? La facturation sera générée si les barèmes sont
            configurés.
          </p>
          <template v-else>
            <p class="mb-4 text-center text-[15px] leading-relaxed text-slate-500">
              Voulez-vous vraiment rejeter cette demande&nbsp;?
            </p>
            <label class="mb-6 block">
              <span class="mb-1.5 block text-left text-xs font-semibold text-slate-500">Motif du refus (optionnel)</span>
              <textarea
                v-model="rejectNote"
                rows="3"
                class="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#216EC2] focus:ring-2 focus:ring-[#216EC2]/20"
                placeholder="Précisez le motif…"
              />
            </label>
          </template>

          <div class="flex gap-3 sm:gap-4">
            <template v-if="confirmModal === 'approve'">
              <button
                type="button"
                class="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#216EC2] py-3.5 text-sm font-bold text-white shadow-sm transition hover:brightness-105 disabled:opacity-50"
                :disabled="actionLoading"
                @click="submitApprove"
              >
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                Valider
              </button>
              <button
                type="button"
                class="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#3B71CA] py-3.5 text-sm font-bold text-white shadow-sm transition hover:brightness-105"
                :disabled="actionLoading"
                @click="closeConfirmModal"
              >
                Annuler
                <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="9" cy="7" r="4" />
                  <path d="M3 21v-2a4 4 0 0 1 4-4h4" />
                  <line x1="17" y1="8" x2="22" y2="13" stroke-linecap="round" />
                  <line x1="22" y1="8" x2="17" y2="13" stroke-linecap="round" />
                </svg>
              </button>
            </template>
            <template v-else>
              <button
                type="button"
                class="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#FDE8E4] py-3.5 text-sm font-bold text-[#D93025] shadow-sm transition hover:opacity-90 disabled:opacity-50"
                :disabled="actionLoading"
                @click="submitReject"
              >
                Rejeter
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-[#D93025] text-white">
                  <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
                  </svg>
                </span>
              </button>
              <button
                type="button"
                class="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#3B71CA] py-3.5 text-sm font-bold text-white shadow-sm transition hover:brightness-105"
                :disabled="actionLoading"
                @click="closeConfirmModal"
              >
                Annuler
                <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="9" cy="7" r="4" />
                  <path d="M3 21v-2a4 4 0 0 1 4-4h4" />
                  <line x1="17" y1="8" x2="22" y2="13" stroke-linecap="round" />
                  <line x1="22" y1="8" x2="17" y2="13" stroke-linecap="round" />
                </svg>
              </button>
            </template>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Cartes statistiques (alignées liste) -->
    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="card in statCards"
        :key="card.key"
        class="rounded-2xl border-2 border-[#216EC2]/30 bg-white p-5 shadow-sm"
      >
        <div class="mb-3 flex items-start justify-between gap-2">
          <h2 class="text-sm font-semibold leading-snug text-slate-600">{{ card.title }}</h2>
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            :class="card.iconBg"
            v-html="card.icon"
          />
        </div>
        <p class="text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.65rem]">
          <span v-if="pending" class="inline-block h-8 w-16 animate-pulse rounded bg-slate-200" />
          <template v-else>{{ card.value }}</template>
        </p>
        <p class="mt-1 text-xs font-medium text-slate-400">Total cumulé</p>
      </article>
    </section>

    <template v-if="!pending && enrollment">
      <section>
        <div class="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-xl font-bold text-[#216EC2] sm:text-2xl">Informations de la demande</h2>
          <div v-if="enrollment.status === 'PENDING'" class="flex flex-wrap gap-3">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-xl bg-[#216EC2] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-105 disabled:opacity-50"
              :disabled="actionLoading"
              @click="openApproveModal"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              Valider
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 px-5 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
              :disabled="actionLoading"
              @click="openRejectModal"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
              </svg>
              Rejeter
            </button>
          </div>
          <p v-else class="text-sm font-semibold text-slate-600">
            <span v-if="enrollment.status === 'APPROVED'" class="text-emerald-700">Inscription validée</span>
            <span v-else-if="enrollment.status === 'REJECTED'" class="text-red-700">Inscription rejetée</span>
          </p>
        </div>

        <div class="grid gap-4 p-5 lg:grid-cols-3">
          <!-- Élève -->
          <div class="rounded-2xl border-2 border-[#216EC2]/35 bg-white p-5 shadow-sm">
            <h3 class="mb-4 text-sm font-bold text-[#216EC2]">Informations de l'élève</h3>
            <ul class="space-y-4 text-sm text-slate-700">
              <li class="flex gap-3">
                <span class="mt-0.5 shrink-0 text-slate-400" aria-hidden="true">
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                </span>
                <div>
                  <p class="text-xs font-medium text-[#216EC2]">Demandé le</p>
                  <p class="font-medium">{{ formatDate(enrollment.createdAt) }}</p>
                </div>
              </li>
              <li class="flex gap-3">
                <span class="mt-0.5 shrink-0 text-slate-400" aria-hidden="true">
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                </span>
                <div>
                  <p class="text-xs font-medium text-[#216EC2]">Date de naissance</p>
                  <p class="font-medium">{{ birthDisplay }}</p>
                </div>
              </li>
              <li class="flex gap-3">
                <span class="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full" :class="genderDotClass" aria-hidden="true" />
                <div>
                  <p class="text-xs font-medium text-[#216EC2]">Genre</p>
                  <p class="font-medium">{{ genderLabel }}</p>
                </div>
              </li>
              <li class="flex gap-3">
                <span class="mt-0.5 shrink-0 text-slate-400" aria-hidden="true">
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                  </svg>
                </span>
                <div>
                  <p class="text-xs font-medium text-[#216EC2]">Classe demandée</p>
                  <p class="font-medium">{{ classOrLevelName }}</p>
                </div>
              </li>
              <li class="flex gap-3">
                <span class="mt-0.5 shrink-0 text-slate-400" aria-hidden="true">
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </span>
                <div>
                  <p class="text-xs font-medium text-[#216EC2]">Année scolaire demandée</p>
                  <p class="font-medium">{{ schoolYearLabel }}</p>
                </div>
              </li>
            </ul>
          </div>

          <!-- Parent -->
          <div class="rounded-2xl border-2 border-[#216EC2]/35 bg-white p-5 shadow-sm">
            <h3 class="mb-4 text-sm font-bold text-[#216EC2]">Information du parent inscripteur</h3>
            <div class="mb-4 flex flex-wrap items-center gap-2">
              <p class="text-xl font-bold text-slate-900">{{ parentName }}</p>
              <span
                v-if="parentRelationLabel !== '—'"
                class="rounded-full bg-[#216EC2]/10 px-2.5 py-0.5 text-xs font-semibold text-[#216EC2]"
                >{{ parentRelationLabel }}</span
              >
            </div>
            <div v-if="parentPhone || parentEmail" class="mb-4 flex gap-2">
              <a
                v-if="parentPhone"
                :href="`tel:${parentPhoneRaw}`"
                class="flex h-11 w-11 items-center justify-center rounded-xl bg-[#216EC2] text-white transition hover:brightness-105"
                aria-label="Appeler"
              >
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"
                  />
                </svg>
              </a>
              <a
                v-if="parentEmail"
                :href="`mailto:${parentEmail}`"
                class="flex h-11 w-11 items-center justify-center rounded-xl bg-[#216EC2] text-white transition hover:brightness-105"
                aria-label="Envoyer un message"
              >
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z" />
                  <path d="m22 6-10 7L2 6" />
                </svg>
              </a>
            </div>
            <ul class="space-y-4 text-sm text-slate-700">
              <li class="flex gap-3">
                <span class="mt-0.5 shrink-0 text-slate-400" aria-hidden="true">
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <div>
                  <p class="text-xs font-medium text-[#216EC2]">Adresse</p>
                  <p class="font-medium">{{ parentAddress }}</p>
                </div>
              </li>
              <li class="flex gap-3">
                <span class="mt-0.5 shrink-0 text-slate-400" aria-hidden="true">
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <div>
                  <p class="text-xs font-medium text-[#216EC2]">E-mail</p>
                  <p class="font-medium break-all">{{ parentEmail || '—' }}</p>
                </div>
              </li>
              <li class="flex gap-3">
                <span class="mt-0.5 shrink-0 text-slate-400" aria-hidden="true">
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path
                      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"
                    />
                  </svg>
                </span>
                <div>
                  <p class="text-xs font-medium text-[#216EC2]">Numéro de téléphone</p>
                  <p class="font-medium">{{ parentPhone || '—' }}</p>
                </div>
              </li>
            </ul>
          </div>

          <!-- Statut -->
          <div class="rounded-2xl border-2 border-[#216EC2]/35 bg-white p-5 shadow-sm">
            <h3 class="mb-4 text-sm font-bold text-[#216EC2]">Statut de la demande</h3>
            <ol class="space-y-4">
              <li v-for="step in timelineSteps" :key="step.key" class="flex gap-3">
                <span
                  class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  :class="step.iconWrap"
                  v-html="step.iconSvg"
                />
                <div class="min-w-0 pt-1">
                  <p class="text-sm font-semibold" :class="step.textClass">{{ step.label }}</p>
                  <p v-if="step.sub" class="text-xs text-slate-500">{{ step.sub }}</p>
                </div>
              </li>
            </ol>
            <button
              type="button"
              class="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#216EC2] py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-105"
              @click="shareByEmail"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m22 2-7 20-4-9-9-4Z" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M22 2 11 13" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              Partager par E-mail
            </button>
          </div>
        </div>

        <div v-if="enrollment.status === 'APPROVED'" class="border-t border-slate-100 px-5 pb-5 pt-2">
          <div class="rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50/90 to-white p-5 shadow-sm">
            <div class="mb-3 flex flex-wrap items-start gap-3">
              <span
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800"
                aria-hidden="true"
              >
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                </svg>
              </span>
              <div class="min-w-0 flex-1">
                <h3 class="text-sm font-bold text-slate-900">Facturation</h3>
                <p class="mt-1 text-sm leading-relaxed text-slate-600">
                  Supprime les lignes <strong class="text-slate-800">non payées</strong> (scolarité annuelle et mensualités
                  en attente), puis les recrée selon le <strong class="text-slate-800">paramétrage actuel</strong> des
                  niveaux. Les paiements déjà encaissés ne sont pas modifiés.
                </p>
              </div>
            </div>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-sm font-bold text-amber-900 shadow-sm transition hover:bg-amber-50 disabled:opacity-50"
              :disabled="billingLoading"
              @click="regenerateBilling"
            >
              <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M21 21v-5h-5" />
              </svg>
              {{ billingLoading ? 'Régénération…' : 'Supprimer et régénérer la facturation' }}
            </button>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

type Stats = { total: number; pending: number; approved: number; rejected: number }

type EnrollmentDetail = {
  id: string
  status: string
  createdAt: string
  schoolYear: string
  pendingParentEmail: string | null
  pendingParentFirstName: string | null
  pendingParentLastName: string | null
  pendingParentPhone: string | null
  pendingParentRelation: 'FATHER' | 'MOTHER' | null
  pendingParentAddress: string | null
  child: {
    firstName: string
    lastName: string
    birthDate: string | null
    gender: string
    parent: {
      fullName: string | null
      email: string
      phone: string | null
      parentRelation: 'FATHER' | 'MOTHER' | null
      address: string | null
    } | null
  }
  level: { name: string }
  class: { name: string } | null
}

type DetailDto = {
  stats: Stats
  enrollment: EnrollmentDetail
}

const route = useRoute()
const { token } = useAuth()
const config = useRuntimeConfig()

const id = computed(() => String(route.params.id ?? ''))

const detail = ref<DetailDto | null>(null)
const loadError = ref<string | null>(null)
const pending = ref(true)

const actionLoading = ref(false)
const actionError = ref<string | null>(null)
const actionMessage = ref<string | null>(null)
const billingLoading = ref(false)

const confirmModal = ref<null | 'approve' | 'reject'>(null)
const rejectNote = ref('')

function closeConfirmModal() {
  confirmModal.value = null
}

function openApproveModal() {
  confirmModal.value = 'approve'
}

function openRejectModal() {
  rejectNote.value = ''
  confirmModal.value = 'reject'
}

const intFr = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 })

const enrollment = computed(() => detail.value?.enrollment ?? null)

const statCards = computed(() => {
  const s = detail.value?.stats
  return [
    {
      key: 'total',
      title: 'Total Inscriptions',
      value: s != null ? intFr.format(s.total) : '—',
      iconBg: 'bg-[#216EC2]/10 text-[#216EC2]',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    },
    {
      key: 'pending',
      title: 'Inscriptions en cours',
      value: s != null ? intFr.format(s.pending) : '—',
      iconBg: 'bg-amber-100 text-amber-600',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    },
    {
      key: 'approved',
      title: 'Inscriptions retenues',
      value: s != null ? intFr.format(s.approved) : '—',
      iconBg: 'bg-emerald-100 text-emerald-600',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8l3 3-6 6"/><path d="M22 11l-3-3"/></svg>`,
    },
    {
      key: 'rejected',
      title: 'Inscriptions rejetées',
      value: s != null ? intFr.format(s.rejected) : '—',
      iconBg: 'bg-red-100 text-red-600',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4"/><line x1="17" y1="8" x2="22" y2="13" stroke-linecap="round"/><line x1="22" y1="8" x2="17" y2="13" stroke-linecap="round"/></svg>`,
    },
  ]
})

function formatSchoolYearLabel(schoolYear: string): string {
  const s = schoolYear.trim()
  if (s.includes('-') && s.length >= 9) return s.replace(/(\d{4})-(\d{4})/, '$1 - $2')
  return s
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
}

function ageLabelDetailed(birthDate: string | null): string {
  if (!birthDate) return '—'
  const bd = new Date(birthDate)
  if (Number.isNaN(bd.getTime())) return '—'
  const now = new Date()
  let months = (now.getFullYear() - bd.getFullYear()) * 12 + (now.getMonth() - bd.getMonth())
  if (now.getDate() < bd.getDate()) months -= 1
  if (months < 0) return '—'
  if (months < 12) {
    if (months === 0) return '< 1 mois'
    return `${months} mois`
  }
  const years = Math.floor(months / 12)
  return `${years} an${years > 1 ? 's' : ''}`
}

const schoolYearLabel = computed(() =>
  enrollment.value ? formatSchoolYearLabel(enrollment.value.schoolYear) : '—',
)

const classOrLevelName = computed(() => {
  const e = enrollment.value
  if (!e) return '—'
  return e.class?.name ?? e.level.name
})

const genderLabel = computed(() => {
  const g = enrollment.value?.child.gender
  if (g === 'FEMALE') return 'Fille'
  if (g === 'MALE') return 'Garçon'
  return '—'
})

const genderDotClass = computed(() => {
  const g = enrollment.value?.child.gender
  if (g === 'FEMALE') return 'bg-pink-500'
  if (g === 'MALE') return 'bg-blue-500'
  return 'bg-slate-300'
})

const birthDisplay = computed(() => {
  const e = enrollment.value?.child
  if (!e?.birthDate) return ageLabelDetailed(null)
  const d = new Date(e.birthDate)
  if (Number.isNaN(d.getTime())) return '—'
  const dateStr = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(d)
  return `${dateStr} (${ageLabelDetailed(e.birthDate)})`
})

const parentName = computed(() => {
  const e = enrollment.value
  if (!e) return '—'
  const p = e.child.parent
  if (p?.fullName?.trim()) return p.fullName.trim()
  const parts = [e.pendingParentFirstName, e.pendingParentLastName].filter(Boolean) as string[]
  if (parts.length) return parts.join(' ')
  return '—'
})

const parentRelationLabel = computed(() => {
  const e = enrollment.value
  if (!e) return '—'
  const rel = e.pendingParentRelation ?? e.child.parent?.parentRelation
  if (rel === 'FATHER') return 'Père'
  if (rel === 'MOTHER') return 'Mère'
  return '—'
})

const parentEmail = computed(() => {
  const e = enrollment.value
  if (!e) return ''
  return (e.child.parent?.email ?? e.pendingParentEmail ?? '').trim()
})

const parentPhone = computed(() => {
  const e = enrollment.value
  if (!e) return ''
  return (e.child.parent?.phone ?? e.pendingParentPhone ?? '').trim()
})

const parentPhoneRaw = computed(() => parentPhone.value.replace(/\s/g, ''))

const parentAddress = computed(() => {
  const e = enrollment.value
  if (!e) return '—'
  const fromUser = e.child.parent?.address?.trim()
  if (fromUser) return fromUser
  const pending = e.pendingParentAddress?.trim()
  return pending || '—'
})

const timelineSteps = computed(() => {
  const st = enrollment.value?.status
  const steps = [
    {
      key: 'process',
      label: 'Demande en cours de traitement',
      sub: '',
      done: true,
      current: false,
      tone: 'blue' as const,
    },
    {
      key: 'wait',
      label: 'Demande en attente',
      sub: '',
      done: st === 'PENDING' || st === 'APPROVED' || st === 'REJECTED',
      current: st === 'PENDING',
      tone: 'orange' as const,
    },
    {
      key: 'ok',
      label: 'Demande validée',
      sub: '',
      done: st === 'APPROVED',
      current: st === 'APPROVED',
      tone: 'green' as const,
    },
    {
      key: 'no',
      label: 'Demande rejetée',
      sub: '',
      done: st === 'REJECTED',
      current: st === 'REJECTED',
      tone: 'red' as const,
    },
  ]

  return steps.map((s) => {
    let iconWrap = 'bg-slate-100 text-slate-400'
    let textClass = 'text-slate-400'
    if (s.current) {
      if (s.tone === 'blue') {
        iconWrap = 'bg-[#216EC2]/15 text-[#216EC2]'
        textClass = 'text-[#216EC2]'
      } else if (s.tone === 'orange') {
        iconWrap = 'bg-amber-100 text-amber-700'
        textClass = 'text-amber-800'
      } else if (s.tone === 'green') {
        iconWrap = 'bg-emerald-100 text-emerald-700'
        textClass = 'text-emerald-800'
      } else {
        iconWrap = 'bg-red-100 text-red-700'
        textClass = 'text-red-800'
      }
    } else if (s.done && !s.current) {
      iconWrap = 'bg-slate-200 text-slate-600'
      textClass = 'text-slate-700'
    }

    const icons: Record<string, string> = {
      process: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>`,
      wait: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
      ok: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>`,
      no: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>`,
    }

    return {
      key: s.key,
      label: s.label,
      sub: s.sub,
      iconWrap,
      textClass,
      iconSvg: icons[s.key] ?? '',
    }
  })
})

function shareByEmail() {
  const e = enrollment.value
  if (!e) return
  const child = `${e.child.firstName} ${e.child.lastName}`.trim()
  const subject = encodeURIComponent(`Demande d'inscription — ${child}`)
  const body = encodeURIComponent(
    [
      `Élève : ${child}`,
      `Classe : ${classOrLevelName.value}`,
      `Année : ${schoolYearLabel.value}`,
      `Statut : ${e.status}`,
      `Demandé le : ${formatDate(e.createdAt)}`,
      '',
      parentEmail.value
        ? `Parent : ${parentName.value}${parentRelationLabel.value !== '—' ? ` (${parentRelationLabel.value})` : ''} (${parentEmail.value})`
        : `Parent : ${parentName.value}${parentRelationLabel.value !== '—' ? ` (${parentRelationLabel.value})` : ''}`,
    ].join('\n'),
  )
  window.location.href = `mailto:?subject=${subject}&body=${body}`
}

async function loadDetail() {
  pending.value = true
  loadError.value = null
  const t = token.value
  const eid = id.value
  if (!t || !eid) {
    pending.value = false
    detail.value = null
    return
  }
  try {
    detail.value = await $fetch<DetailDto>(`${config.public.apiBase}/admin/enrollments/${eid}`, {
      headers: { Authorization: `Bearer ${t}` },
    })
  } catch (e: unknown) {
    const err = e as { data?: { message?: string | string[] }; statusCode?: number }
    const raw = err?.data?.message
    loadError.value =
      err?.statusCode === 404
        ? 'Demande introuvable.'
        : typeof raw === 'string'
          ? raw
          : Array.isArray(raw)
            ? raw[0]
            : 'Impossible de charger la demande.'
    detail.value = null
  } finally {
    pending.value = false
  }
}

async function submitApprove() {
  actionError.value = null
  actionMessage.value = null
  actionLoading.value = true
  closeConfirmModal()
  const t = token.value
  const eid = id.value
  if (!t || !eid) {
    actionLoading.value = false
    return
  }
  try {
    await $fetch(`${config.public.apiBase}/admin/enrollments/${eid}/approve`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${t}` },
      body: {},
    })
    actionMessage.value = 'Inscription validée.'
    await loadDetail()
  } catch (e: unknown) {
    const err = e as { data?: { message?: string | string[] } }
    const raw = err?.data?.message
    actionError.value =
      typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : 'La validation a échoué.'
  } finally {
    actionLoading.value = false
  }
}

type BillingRegenerateDto = {
  deleted: { tuitionCharges: number; monthlyInstallments: number }
  tuitionCreated: boolean
  monthsGenerated: number
  warnings: string[]
}

async function regenerateBilling() {
  const e = enrollment.value
  const t = token.value
  const eid = id.value
  if (!e || e.status !== 'APPROVED' || !t || !eid) return

  const ok = window.confirm(
    'Supprimer les factures non payées (scolarité + mensualités en attente) et les recréer selon le paramétrage actuel ? Les paiements déjà encaissés seront conservés.',
  )
  if (!ok) return

  billingLoading.value = true
  actionError.value = null
  actionMessage.value = null
  try {
    const res = await $fetch<BillingRegenerateDto>(
      `${config.public.apiBase}/admin/enrollments/${eid}/billing/regenerate`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${t}` },
      },
    )
    const del = res.deleted
    const delMsg =
      del.tuitionCharges > 0 || del.monthlyInstallments > 0
        ? ` ${del.tuitionCharges} ligne(s) de scolarité et ${del.monthlyInstallments} mensualité(s) en attente supprimées, puis recréées.`
        : ' Aucune ligne en attente à supprimer ; barème appliqué.'
    const warnMsg =
      res.warnings?.length && res.warnings.some((w) => w.trim())
        ? ` ${res.warnings.join(' ')}`
        : ''
    actionMessage.value = `Facturation mise à jour.${delMsg}${warnMsg}`
  } catch (err: unknown) {
    const e2 = err as { data?: { message?: string | string[] } }
    const raw = e2?.data?.message
    actionError.value =
      typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : 'La régénération a échoué.'
  } finally {
    billingLoading.value = false
  }
}

async function submitReject() {
  actionError.value = null
  actionMessage.value = null
  actionLoading.value = true
  const note = rejectNote.value.trim()
  closeConfirmModal()
  const t = token.value
  const eid = id.value
  if (!t || !eid) {
    actionLoading.value = false
    return
  }
  try {
    await $fetch(`${config.public.apiBase}/admin/enrollments/${eid}/reject`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${t}` },
      body: { note: note || undefined },
    })
    actionMessage.value = 'Inscription rejetée.'
    await loadDetail()
  } catch (e: unknown) {
    const err = e as { data?: { message?: string | string[] } }
    const raw = err?.data?.message
    actionError.value =
      typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : 'Le refus a échoué.'
  } finally {
    actionLoading.value = false
  }
}

function onModalEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') closeConfirmModal()
}

watch(confirmModal, (open) => {
  if (!import.meta.client) return
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) {
    window.addEventListener('keydown', onModalEscape)
  } else {
    window.removeEventListener('keydown', onModalEscape)
  }
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  window.removeEventListener('keydown', onModalEscape)
  document.body.style.overflow = ''
})

watch(
  [token, id],
  () => {
    if (token.value) void loadDetail()
  },
  { immediate: true },
)
</script>
