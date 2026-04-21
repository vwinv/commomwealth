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
                <th class="px-4 py-3 font-semibold">Année en cours</th>
                <th class="px-4 py-3 font-semibold">Âge</th>
                <th class="px-4 py-3 font-semibold">Classe</th>
                <th class="px-4 py-3 font-semibold">Genre</th>
                <th class="px-4 py-3 font-semibold">Allergie</th>
                <th class="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-slate-100 bg-white">
                <td class="px-4 py-3 text-slate-800">{{ currentSchoolYearLabel }}</td>
                <td class="px-4 py-3 text-slate-800">{{ ageLabel(child.birthDate) }}</td>
                <td class="px-4 py-3 text-slate-800">{{ classLabel(child) }}</td>
                <td class="px-4 py-3 text-slate-800">{{ genderLabel(child.gender) }}</td>
                <td class="px-4 py-3 text-slate-800">{{ allergyDisplay(child) }}</td>
                <td class="px-4 py-3">
                  <div class="relative z-10 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      class="inline-flex items-center gap-1.5 rounded-lg border-2 px-3 py-2 text-xs font-bold shadow-sm"
                      :class="
                        canReEnroll
                          ? 'border-emerald-500 bg-white text-emerald-700 hover:bg-emerald-50'
                          : 'cursor-not-allowed border-slate-300 bg-slate-100 text-slate-400'
                      "
                      :disabled="!canReEnroll"
                      :title="
                        canReEnroll
                          ? 'Réinscrire cet enfant'
                          : 'La réinscription sera possible après la fin de l’année scolaire en cours.'
                      "
                      @click.stop="reEnroll(child)"
                    >
                      Réinscrire
                    </button>
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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

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
const config = useRuntimeConfig();

const children = ref<OverviewChild[] | null>(null);
const pending = ref(true);
const loadError = ref<string | null>(null);
const activeSchoolYear = ref<string | null>(null);
const currentSchoolYearLabel = ref<string>('—');
const isCurrentYearFinished = ref(false);
const canReEnroll = computed(() => isCurrentYearFinished.value && Boolean(activeSchoolYear.value));

function goModifier(childId: string) {
  if (!childId) return;
  void router.push(`/parent/enfants/${childId}/modifier`);
}

async function reEnroll(child: OverviewChild) {
  if (!canReEnroll.value) {
    loadError.value = "La réinscription s'ouvre à la fin de l'année scolaire en cours.";
    return;
  }
  const last = child.enrollments?.[0];
  if (!last?.level?.id) {
    loadError.value = 'Réinscription impossible: niveau introuvable.';
    return;
  }
  if (!activeSchoolYear.value) {
    loadError.value = "Aucune année scolaire ouverte pour la réinscription.";
    return;
  }
  try {
    await authFetch(`/parent/children/${child.id}/reenroll`, {
      method: 'POST',
      body: {
        schoolYear: activeSchoolYear.value,
        levelId: last.level.id,
        classId: last.class?.id ?? null,
      },
    });
    children.value = await authFetch<OverviewChild[]>('/parent/overview');
  } catch (e: any) {
    loadError.value = e?.data?.message ?? 'Réinscription impossible.';
  }
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

onMounted(async () => {
  pending.value = true;
  loadError.value = null;
  try {
    const sy = await $fetch<{ active: { label: string; startDate: string; endDate: string } | null }>(
      `${config.public.apiBase}/public/catalog/school-year/active`,
    ).catch(() => null);
    activeSchoolYear.value = sy?.active?.label ?? null;
    currentSchoolYearLabel.value = sy?.active?.label ?? 'Aucune année ouverte';
    if (sy?.active?.endDate) {
      isCurrentYearFinished.value = new Date().getTime() > new Date(sy.active.endDate).getTime();
    } else {
      isCurrentYearFinished.value = false;
    }
    children.value = await authFetch<OverviewChild[]>('/parent/overview');
    if (!sy?.active?.label && children.value?.length) {
      const years = children.value
        .flatMap((c) => c.enrollments.map((e) => e.schoolYear))
        .filter((v) => Boolean(v))
        .sort((a, b) => b.localeCompare(a));
      currentSchoolYearLabel.value = years[0] ?? 'Aucune année ouverte';
    }
  } catch {
    loadError.value = 'Impossible de charger la liste.';
  } finally {
    pending.value = false;
  }
});
</script>
