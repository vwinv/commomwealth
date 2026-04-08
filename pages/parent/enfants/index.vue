<template>
  <div>
    <h1 class="mb-2 text-2xl font-bold text-brandBlue sm:text-3xl">Mes enfants</h1>
    <p class="mb-8 max-w-3xl text-sm leading-relaxed text-slate-600">
      Retrouvez la fiche synthétique de chaque enfant rattaché à votre compte. Utilisez
      <strong>Modifier</strong> pour mettre à jour les informations de l’élève.
    </p>

    <div v-if="pending" class="text-sm text-slate-500">Chargement…</div>
    <div v-else-if="loadError" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      {{ loadError }}
    </div>
    <div
      v-else-if="!children?.length"
      class="rounded-2xl border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-600"
    >
      Aucun enfant enregistré pour ce compte pour l’instant.
    </div>
    <div v-else class="space-y-6">
      <article
        v-for="(child, idx) in children"
        :key="child.id"
        class="overflow-hidden rounded-2xl border-2 border-brandBlue/25 bg-white shadow-sm"
      >
        <h2 class="border-b border-slate-100 bg-white px-5 py-4 text-base font-bold text-slate-900 sm:px-6">
          {{ child.firstName }} {{ child.lastName }}
          <span class="font-semibold text-slate-500">(enfant n°{{ idx + 1 }})</span>
        </h2>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr class="bg-brandBlue text-white">
                <th class="px-4 py-3 font-semibold">Âge</th>
                <th class="px-4 py-3 font-semibold">Classe</th>
                <th class="px-4 py-3 font-semibold">Genre</th>
                <th class="px-4 py-3 font-semibold">Allergie</th>
                <th class="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-slate-100 bg-white">
                <td class="px-4 py-3 text-slate-800">{{ ageLabel(child.birthDate) }}</td>
                <td class="px-4 py-3 text-slate-800">{{ classLabel(child) }}</td>
                <td class="px-4 py-3 text-slate-800">{{ genderLabel(child.gender) }}</td>
                <td class="px-4 py-3 text-slate-800">{{ allergyDisplay(child) }}</td>
                <td class="px-4 py-3">
                  <div class="relative z-10 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      class="inline-flex items-center gap-1.5 rounded-lg bg-brandOrange px-3 py-2 text-xs font-bold text-white shadow-sm hover:opacity-95"
                      @click.stop="goModifier(child.id)"
                    >
                      Modifier
                      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      class="inline-flex items-center gap-1.5 rounded-lg border-2 border-brandBlue bg-white px-3 py-2 text-xs font-bold text-brandBlue shadow-sm hover:bg-sky-50"
                      @click="openView(child)"
                    >
                      Voir
                      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linejoin="round"
                        />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <div class="flex justify-center pt-2">
        <NuxtLink
          to="/inscription"
          class="inline-flex w-full max-w-xl items-center justify-center rounded-2xl bg-brandOrange px-6 py-3.5 text-center text-sm font-bold lowercase text-white shadow-md transition hover:opacity-95 sm:text-base"
        >
          Demande d’inscription pour un autre enfant
        </NuxtLink>
      </div>
    </div>

    <!-- Modale détail -->
    <Teleport to="body">
      <div
        v-if="viewOpen && selectedChild"
        class="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-slate-900/45 p-4 sm:items-center"
        role="presentation"
        @click.self="closeView"
      >
        <div
          ref="dialogPanel"
          class="mb-0 w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl sm:mb-auto"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="'child-detail-title'"
          tabindex="-1"
          @click.stop
        >
          <div class="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h3 id="child-detail-title" class="text-lg font-bold text-slate-900">
                {{ selectedChild.firstName }} {{ selectedChild.lastName }}
              </h3>
              <p class="mt-0.5 text-xs text-slate-500">Fiche complète</p>
            </div>
            <button
              type="button"
              class="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              aria-label="Fermer"
              @click="closeView"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </button>
          </div>

          <div class="max-h-[min(70vh,520px)] overflow-y-auto px-5 py-4 sm:px-6">
            <dl class="grid gap-3 text-sm">
              <div class="flex justify-between gap-4 border-b border-slate-50 pb-2">
                <dt class="text-slate-500">Date de naissance</dt>
                <dd class="text-right font-medium text-slate-900">{{ birthDateFormatted(selectedChild.birthDate) }}</dd>
              </div>
              <div class="flex justify-between gap-4 border-b border-slate-50 pb-2">
                <dt class="text-slate-500">Âge</dt>
                <dd class="text-right font-medium text-slate-900">{{ ageLabel(selectedChild.birthDate) }}</dd>
              </div>
              <div class="flex justify-between gap-4 border-b border-slate-50 pb-2">
                <dt class="text-slate-500">Genre</dt>
                <dd class="text-right font-medium text-slate-900">{{ genderLabel(selectedChild.gender) }}</dd>
              </div>
              <div class="flex justify-between gap-4 border-b border-slate-50 pb-2">
                <dt class="text-slate-500">Allergie(s)</dt>
                <dd class="text-right font-medium text-slate-900">{{ allergyDisplay(selectedChild) }}</dd>
              </div>
            </dl>

            <h4 class="mb-2 mt-6 text-xs font-bold uppercase tracking-wide text-slate-500">
              Inscriptions
            </h4>
            <ul v-if="selectedChild.enrollments?.length" class="space-y-3">
              <li
                v-for="enr in selectedChild.enrollments"
                :key="enr.id"
                class="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-sm"
              >
                <div class="font-semibold text-slate-900">
                  {{ enr.level?.name }}
                  <span v-if="enr.class"> — {{ enr.class.name }}</span>
                </div>
                <div class="mt-1 text-xs text-slate-600">Année scolaire {{ enr.schoolYear }}</div>
                <div class="mt-1.5">
                  <span class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium" :class="statusClass(enr.status)">
                    {{ statusLabel(enr.status) }}
                  </span>
                </div>
                <p v-if="enr.validationNote" class="mt-2 whitespace-pre-wrap text-xs text-slate-600">
                  {{ enr.validationNote }}
                </p>
              </li>
            </ul>
            <p v-else class="text-sm text-slate-500">Aucune inscription enregistrée.</p>
          </div>

          <div class="border-t border-slate-100 px-5 py-4 sm:px-6">
            <button
              type="button"
              class="w-full rounded-xl bg-brandBlue py-2.5 text-sm font-semibold text-white hover:opacity-95"
              @click="closeView"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

type EnrollmentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
type Gender = 'FEMALE' | 'MALE' | 'UNSPECIFIED';

definePageMeta({
  layout: 'parent',
  middleware: ['parent'],
});

type OverviewChild = {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string | null;
  gender: Gender;
  allergies: string | null;
  enrollments: Array<{
    id: string;
    schoolYear: string;
    status: EnrollmentStatus;
    validationNote: string | null;
    level: { id: string; name: string };
    class: { id: string; name: string } | null;
  }>;
};

const router = useRouter();
const { authFetch } = useParentAuth();

const children = ref<OverviewChild[] | null>(null);
const pending = ref(true);
const loadError = ref<string | null>(null);

const viewOpen = ref(false);
const selectedChild = ref<OverviewChild | null>(null);
const dialogPanel = ref<HTMLElement | null>(null);

function goModifier(childId: string) {
  if (!childId) return;
  void router.push(`/parent/enfants/${childId}/modifier`);
}

function allergyDisplay(child: Pick<OverviewChild, 'allergies'>) {
  const a = child.allergies?.trim();
  return a || 'Aucune';
}

function ageLabel(iso: string | null): string {
  if (!iso) return '—';
  const birth = new Date(iso);
  if (Number.isNaN(birth.getTime())) return '—';
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) years--;
  if (years < 0) return '—';
  if (years === 0) {
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth();
    if (months <= 0) return 'Né(e) récemment';
    return months === 1 ? '1 mois' : `${months} mois`;
  }
  return years === 1 ? '1 an' : `${years} ans`;
}

function birthDateFormatted(iso: string | null): string {
  if (!iso) return 'Non renseigné';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function genderLabel(g: Gender): string {
  if (g === 'FEMALE') return '♀ Fille';
  if (g === 'MALE') return '♂ Garçon';
  return '—';
}

function classLabel(child: OverviewChild): string {
  const enr = child.enrollments?.[0];
  if (!enr) return '—';
  if (enr.class?.name) return enr.class.name;
  return enr.level?.name ?? '—';
}

function statusLabel(s: EnrollmentStatus) {
  const m: Record<string, string> = {
    PENDING: 'En attente de validation',
    APPROVED: 'Validée',
    REJECTED: 'Refusée',
  };
  return m[s] ?? s;
}

function statusClass(s: EnrollmentStatus) {
  if (s === 'APPROVED') return 'bg-emerald-100 text-emerald-800';
  if (s === 'REJECTED') return 'bg-red-100 text-red-800';
  return 'bg-amber-100 text-amber-900';
}

function openView(child: OverviewChild) {
  selectedChild.value = child;
  viewOpen.value = true;
}

function closeView() {
  viewOpen.value = false;
  selectedChild.value = null;
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && viewOpen.value) closeView();
}

watch(viewOpen, async (open) => {
  if (!import.meta.client) return;
  if (open) {
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    await nextTick();
    dialogPanel.value?.focus();
  } else {
    document.body.style.overflow = '';
    window.removeEventListener('keydown', onKeyDown);
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', onKeyDown);
    document.body.style.overflow = '';
  }
});

onMounted(async () => {
  pending.value = true;
  loadError.value = null;
  try {
    children.value = await authFetch<OverviewChild[]>('/parent/overview');
  } catch {
    loadError.value = 'Impossible de charger la liste.';
  } finally {
    pending.value = false;
  }
});
</script>
