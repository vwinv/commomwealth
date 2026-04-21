<template>
  <div class="w-full bg-white">
    <section class="w-full bg-white py-10">
      <RevealSection extra-class="mx-auto w-full max-w-[920px] px-6">
        <div class="rounded-2xl bg-brandBlue px-6 py-6 text-center text-white shadow-[0_16px_40px_rgba(2,6,23,0.12)]">
          <div class="text-lg font-semibold">Formulaire inscription Commonwealth School</div>
        </div>

        <div class="mt-10 text-center">
          <div class="text-sm font-semibold text-slate-500">
            {{ stepTitle }}
          </div>
          <p class="mx-auto mt-4 max-w-[520px] text-xs leading-5 text-slate-400">
            Korem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum.
          </p>
        </div>

        <div class="mx-auto mt-10 max-w-[520px]">
          <div class="flex items-center justify-center text-[10px]">
            <div class="flex flex-col items-center gap-2">
              <div :class="stepCircleClass(1)">
                <template v-if="isDone(1)">
                  <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
                    <path
                      d="M20 6 9 17l-5-5"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </template>
                <template v-else>01</template>
              </div>
              <div class="text-center" :class="stepLabelClass(1)">Informations de l'élève</div>
            </div>

            <div
              class="mx-6 h-px w-16"
              :class="isDone(1) ? 'bg-brandBlue' : 'bg-slate-300'"
              aria-hidden="true"
            />

            <div class="flex flex-col items-center gap-2">
              <div :class="stepCircleClass(2)">
                <template v-if="isDone(2)">
                  <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
                    <path
                      d="M20 6 9 17l-5-5"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </template>
                <template v-else>02</template>
              </div>
              <div class="text-center" :class="stepLabelClass(2)">Informations des parents</div>
            </div>

            <div
              class="mx-6 h-px w-16"
              :class="isDone(2) ? 'bg-brandBlue' : 'bg-slate-300'"
              aria-hidden="true"
            />

            <div class="flex flex-col items-center gap-2">
              <div :class="stepCircleClass(3)">
                <template v-if="isDone(3)">
                  <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
                    <path
                      d="M20 6 9 17l-5-5"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </template>
                <template v-else>03</template>
              </div>
              <div class="text-center" :class="stepLabelClass(3)">Options et messages</div>
            </div>
          </div>

          <div class="mt-6 border-t border-slate-200" />

          <form v-if="!submitted" class="mt-8 space-y-5" @submit.prevent="onSubmit">
            <div
              v-if="submitError"
              class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {{ submitError }}
            </div>
            <template v-if="step === 1">
              <div v-if="students.length" class="rounded-xl border border-slate-200 bg-white p-3">
                <div class="text-[11px] font-semibold text-slate-500">Élèves ajoutés</div>
                <div class="mt-2 grid grid-cols-1 gap-2">
                  <div
                    v-for="(s, idx) in students"
                    :key="idx"
                    class="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                  >
                    <div class="min-w-0">
                      <div class="truncate text-xs font-semibold text-slate-700">
                        {{ s.lastName }} {{ s.firstName }}
                      </div>
                      <div class="mt-0.5 text-[10px] text-slate-500">
                        {{ s.levelName }} · {{ s.gender }}
                      </div>
                    </div>
                    <button
                      class="ml-3 inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-brandBlue bg-white px-3 text-[11px] font-semibold text-brandBlue hover:bg-blue-50"
                      type="button"
                      @click="editStudent(idx)"
                    >
                      Modifier
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label class="mb-2 block text-xs font-semibold text-slate-600">Nom de l'enfant</label>
                <input
                  v-model.trim="form.studentLastName"
                  class="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm text-slate-700 outline-none ring-0 focus:border-brandBlue"
                  placeholder="Nom de l'enfant"
                  type="text"
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-semibold text-slate-600">Prénom de l'enfant</label>
                <input
                  v-model.trim="form.studentFirstName"
                  class="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm text-slate-700 outline-none ring-0 focus:border-brandBlue"
                  placeholder="Prénom de l'enfant"
                  type="text"
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-semibold text-slate-600">Date de naissance</label>
                <input
                  v-model="form.studentBirthDate"
                  class="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm text-slate-700 outline-none ring-0 focus:border-brandBlue [color-scheme:light]"
                  type="date"
                  :max="todayIso"
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-semibold text-slate-600">Genre</label>
                <select
                  v-model="form.studentGender"
                  class="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none ring-0 focus:border-brandBlue [color-scheme:light]"
                >
                  <option value="Fille">Fille</option>
                  <option value="Garçon">Garçon</option>
                </select>
              </div>

              <div>
                <label class="mb-2 block text-xs font-semibold text-slate-600">Classe souhaitée</label>
                <select
                  v-model="selectedLevelId"
                  class="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none ring-0 focus:border-brandBlue [color-scheme:light]"
                  :disabled="!levels.length"
                >
                  <option v-if="!levels.length" value="">Chargement des niveaux…</option>
                  <option v-for="l in levels" :key="l.id" :value="l.id">
                    {{ l.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="mb-2 block text-xs font-semibold text-slate-600">Établissement actuel / précédent</label>
                <input
                  v-model.trim="form.previousSchool"
                  class="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm text-slate-700 outline-none ring-0 focus:border-brandBlue"
                  placeholder="Amadi Shool"
                  type="text"
                />
              </div>
            </template>

            <template v-else-if="step === 2">
              <div>
                <label class="mb-2 block text-xs font-semibold text-slate-600">Nom du parent</label>
                <input
                  v-model.trim="form.parentLastName"
                  class="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm text-slate-700 outline-none ring-0 focus:border-brandBlue"
                  placeholder="Nom"
                  type="text"
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-semibold text-slate-600">Prénom du parent</label>
                <input
                  v-model.trim="form.parentFirstName"
                  class="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm text-slate-700 outline-none ring-0 focus:border-brandBlue"
                  placeholder="Prénom"
                  type="text"
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-semibold text-slate-600">Vous êtes</label>
                <select
                  v-model="form.parentRelation"
                  class="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none ring-0 focus:border-brandBlue [color-scheme:light]"
                  required
                >
                  <option value="" disabled>Choisir</option>
                  <option value="FATHER">Le père</option>
                  <option value="MOTHER">La mère</option>
                </select>
              </div>

              <div>
                <label class="mb-2 block text-xs font-semibold text-slate-600">Téléphone</label>
                <input
                  v-model.trim="form.parentPhone"
                  class="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm text-slate-700 outline-none ring-0 focus:border-brandBlue"
                  placeholder="(123) 456-7890"
                  type="tel"
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-semibold text-slate-600">Email</label>
                <input
                  v-model.trim="form.parentEmail"
                  class="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm text-slate-700 outline-none ring-0 focus:border-brandBlue"
                  placeholder="email@exemple.com"
                  type="email"
                />
              </div>

              <div>
                <label class="mb-2 block text-xs font-semibold text-slate-600"
                  >Adresse du domicile (famille / enfants)</label
                >
                <textarea
                  v-model.trim="form.parentAddress"
                  class="min-h-[88px] w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none ring-0 focus:border-brandBlue"
                  placeholder="Rue, ville, pays…"
                  rows="3"
                />
              </div>
            </template>

            <template v-else>
              <div class="space-y-3">
                <div class="text-xs font-semibold text-slate-600">Services souhaités</div>
                <label class="flex items-center gap-3 text-xs text-slate-600">
                  <input v-model="form.services" class="h-4 w-4 rounded border-slate-300" type="checkbox" value="cantine" />
                  Cantine
                </label>
                <label class="flex items-center gap-3 text-xs text-slate-600">
                  <input v-model="form.services" class="h-4 w-4 rounded border-slate-300" type="checkbox" value="bus" />
                  Bus scolaire
                </label>
                <label class="flex items-center gap-3 text-xs text-slate-600">
                  <input v-model="form.services" class="h-4 w-4 rounded border-slate-300" type="checkbox" value="garderie" />
                  Garderie
                </label>
              </div>

              <div>
                <label class="mb-2 block text-xs font-semibold text-slate-600">Commentaire particulier</label>
                <textarea
                  v-model.trim="form.comment"
                  class="min-h-[160px] w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none ring-0 focus:border-brandBlue"
                  placeholder="Votre commentaire ici"
                />
              </div>
            </template>

            <div class="pt-6">
              <div v-if="step === 1" class="flex items-center justify-between gap-6">
                <button
                  class="inline-flex h-10 min-w-[200px] items-center justify-center rounded-md bg-brandBlue px-10 text-sm font-semibold text-white hover:brightness-95"
                  type="button"
                  @click="addOrUpdateStudent"
                >
                  Ajouter un eleve
                </button>

                <button
                  class="inline-flex h-10 min-w-[140px] items-center justify-center rounded-md bg-brandOrange px-10 text-sm font-semibold text-white hover:brightness-95"
                  type="button"
                  @click="next"
                >
                  Suivant
                </button>
              </div>

              <div v-else class="flex items-center justify-between gap-6">
                <button
                  class="inline-flex h-10 min-w-[140px] items-center justify-center rounded-md border border-brandOrange bg-white px-10 text-sm font-semibold text-brandOrange"
                  type="button"
                  @click="prev"
                >
                  Retour
                </button>

                <button
                  v-if="step === 2"
                  class="inline-flex h-10 min-w-[180px] items-center justify-center rounded-md bg-brandOrange px-10 text-sm font-semibold text-white hover:brightness-95"
                  type="button"
                  @click="next"
                >
                  Suivant
                </button>

                <button
                  v-else
                  class="inline-flex h-10 min-w-[260px] items-center justify-center rounded-md bg-brandBlue px-10 text-sm font-semibold text-white hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                  type="submit"
                  :disabled="submitting"
                >
                  {{ submitting ? 'Envoi…' : 'Envoyer la Demande' }}
                </button>
              </div>
            </div>
          </form>

          <div v-else class="py-14 text-center">
            <p class="mx-auto max-w-[560px] text-sm leading-6 text-slate-500">
              Merci ! Votre demande a été enregistrée. L'administration vous rappellera sous 48h. cependant vous recevrez un e-mail avec
              le récapitulatif de votre demande.
            </p>
          </div>
        </div>
      </RevealSection>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'marketing',
});

useHead({
  title: 'Inscription',
});

type FormState = {
  studentLastName: string;
  studentFirstName: string;
  studentBirthDate: string;
  studentGender: 'Fille' | 'Garçon';
  previousSchool: string;
  parentLastName: string;
  parentFirstName: string;
  parentRelation: '' | 'FATHER' | 'MOTHER';
  parentPhone: string;
  parentEmail: string;
  parentAddress: string;
  services: Array<'cantine' | 'bus' | 'garderie'>;
  comment: string;
};

type StudentDraft = {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: FormState['studentGender'];
  levelId: string;
  levelName: string;
  previousSchool: string;
};

const step = ref<1 | 2 | 3>(1);

const form = reactive<FormState>({
  studentLastName: '',
  studentFirstName: '',
  studentBirthDate: '',
  studentGender: 'Fille',
  previousSchool: '',
  parentLastName: '',
  parentFirstName: '',
  parentRelation: '',
  parentPhone: '',
  parentEmail: '',
  parentAddress: '',
  services: [],
  comment: '',
});

const stepTitle = computed(() => {
  if (step.value === 1) return "L'Élève (Qui souhaitez-vous inscrire ?)";
  if (step.value === 2) return 'Parents (Qui devons nous contacter ?)';
  return 'Options et messages';
});

const submitted = ref(false);
const submitting = ref(false);
const submitError = ref('');

const students = ref<StudentDraft[]>([]);
const editingStudentIndex = ref<number | null>(null);

type ApiLevel = { id: string; name: string };

const config = useRuntimeConfig();

/** Format local YYYY-MM-DD for `<input type="date">` (max = aujourd'hui). */
const todayIso = computed(() => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
});

const levels = ref<ApiLevel[]>([]);
const selectedLevelId = ref<string>('');

const selectedLevel = computed(() => levels.value.find((l) => l.id === selectedLevelId.value) ?? null);

const fetchLevels = async () => {
  const data = await $fetch<ApiLevel[]>(`${config.public.apiBase}/public/catalog/levels`);
  levels.value = (data ?? []).map(({ id, name }) => ({ id, name }));

  if (!selectedLevelId.value && levels.value[0]) {
    selectedLevelId.value = levels.value[0].id;
  }
};

onMounted(() => {
  fetchLevels().catch(() => {
    // ignore UI blocking on first load
  });
});

const isDone = (n: 1 | 2 | 3) => submitted.value || step.value > n;

const stepCircleClass = (n: 1 | 2 | 3) => {
  const base = 'inline-flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-semibold';
  if (isDone(n)) return `${base} border-brandBlue bg-brandBlue text-white`;
  return `${base} border-slate-300 bg-white text-slate-500`;
};

const stepLabelClass = (n: 1 | 2 | 3) => {
  if (isDone(n)) return 'font-semibold text-brandBlue';
  return 'text-slate-400';
};

const next = () => {
  submitError.value = '';
  if (step.value === 2) {
    if (!form.parentRelation) {
      submitError.value = 'Indiquez si vous êtes le père ou la mère.';
      return;
    }
    if (!form.parentAddress.trim()) {
      submitError.value = 'L’adresse du domicile est obligatoire.';
      return;
    }
  }
  step.value = (Math.min(3, step.value + 1) as 1 | 2 | 3);
};

const prev = () => {
  step.value = (Math.max(1, step.value - 1) as 1 | 2 | 3);
};

/** Année scolaire type 2025-2026 (rentrée en septembre). */
const currentSchoolYear = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = d.getMonth();
  if (m >= 8) return `${y}-${y + 1}`;
  return `${y - 1}-${y}`;
};

const onSubmit = async () => {
  submitError.value = '';

  if (students.value.length === 0) {
    submitError.value = 'Ajoutez au moins un élève avant d’envoyer la demande.';
    return;
  }

  const email = form.parentEmail.trim().toLowerCase();
  if (!email) {
    submitError.value = 'L’e-mail du parent est obligatoire.';
    return;
  }
  if (form.parentRelation !== 'FATHER' && form.parentRelation !== 'MOTHER') {
    submitError.value = 'Indiquez si vous êtes le père ou la mère.';
    return;
  }
  if (!form.parentAddress.trim()) {
    submitError.value = 'L’adresse du domicile est obligatoire.';
    return;
  }

  submitting.value = true;
  try {
    await $fetch(`${config.public.apiBase}/public/enrollments/batch`, {
      method: 'POST',
      body: {
        parent: {
          email,
          phone: form.parentPhone.trim() || undefined,
          firstName: form.parentFirstName.trim(),
          lastName: form.parentLastName.trim(),
          relation: form.parentRelation,
          address: form.parentAddress.trim(),
        },
        schoolYear: currentSchoolYear(),
        children: students.value.map((s) => ({
          firstName: s.firstName,
          lastName: s.lastName,
          birthDate: s.birthDate || undefined,
          gender: s.gender,
          levelId: s.levelId,
          previousSchool: s.previousSchool || undefined,
        })),
        options: {
          services: form.services.length ? form.services : undefined,
          comment: form.comment.trim() || undefined,
        },
      },
    });
    submitted.value = true;
  } catch (e: unknown) {
    const err = e as { data?: { message?: string | string[] }; message?: string };
    const m = err?.data?.message ?? err?.message;
    submitError.value = Array.isArray(m) ? m.join(' ') : m || 'Envoi impossible. Vérifiez que l’API est démarrée et réessayez.';
  } finally {
    submitting.value = false;
  }
};

const resetStudentForm = () => {
  form.studentLastName = '';
  form.studentFirstName = '';
  form.studentBirthDate = '';
  form.studentGender = 'Fille';
  form.previousSchool = '';
  editingStudentIndex.value = null;
};

const addOrUpdateStudent = () => {
  const lastName = form.studentLastName.trim();
  const firstName = form.studentFirstName.trim();
  if (!lastName || !firstName) return;
  if (!selectedLevelId.value || !selectedLevel.value) return;

  const draft: StudentDraft = {
    lastName,
    firstName,
    birthDate: form.studentBirthDate.trim(),
    gender: form.studentGender,
    levelId: selectedLevelId.value,
    levelName: selectedLevel.value.name,
    previousSchool: form.previousSchool.trim(),
  };

  if (editingStudentIndex.value !== null) {
    students.value.splice(editingStudentIndex.value, 1, draft);
  } else {
    students.value.push(draft);
  }

  resetStudentForm();
};

const editStudent = (idx: number) => {
  const s = students.value[idx];
  if (!s) return;
  editingStudentIndex.value = idx;
  form.studentLastName = s.lastName;
  form.studentFirstName = s.firstName;
  form.studentBirthDate = s.birthDate;
  form.studentGender = s.gender;
  selectedLevelId.value = s.levelId;
  form.previousSchool = s.previousSchool;
};
</script>

