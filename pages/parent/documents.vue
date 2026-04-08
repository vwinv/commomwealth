<template>
  <div>
    <h1 class="mb-2 text-3xl font-bold text-brandBlue">Documents</h1>
    <p class="mb-8 text-sm text-slate-500">
      Ressources associées aux niveaux de vos enfants, et documents utiles de l'ecole.
    </p>

    <div v-if="pending" class="text-sm text-slate-500">Chargement…</div>
    <div v-else class="space-y-6">
      <section class="rounded-3xl border border-[#bdd7ef] bg-white p-4 shadow-sm sm:p-5">
        <h2 class="mb-4 text-3xl font-semibold text-slate-900">Administrative</h2>
        <div class="grid gap-3 sm:grid-cols-3">
          <article v-for="card in adminCards" :key="card.key" class="rounded-2xl bg-[#d9eaf7] p-5 text-center">
            <div class="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-brandBlue">
              <ParentDocCardIcon :name="card.icon" />
            </div>
            <p class="font-semibold text-slate-900">{{ card.title }}</p>
            <button
              type="button"
              class="mt-2 text-sm font-semibold text-brandBlue hover:underline"
              @click="downloadOne(card.group)"
            >
              Télécharger
            </button>
          </article>
        </div>
      </section>

      <section class="rounded-3xl border border-[#bdd7ef] bg-white p-4 shadow-sm sm:p-5">
        <h2 class="mb-4 text-3xl font-semibold text-slate-900">Scolaire</h2>
        <div class="grid gap-3 sm:grid-cols-3">
          <article v-for="card in schoolCards" :key="card.key" class="rounded-2xl bg-[#d9eaf7] p-5 text-center">
            <div class="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-brandBlue">
              <ParentDocCardIcon :name="card.icon" />
            </div>
            <p class="font-semibold text-slate-900">{{ card.title }}</p>
            <button
              type="button"
              class="mt-2 text-sm font-semibold text-brandBlue hover:underline"
              @click="card.action === 'view' ? viewGroup(card.group, card.title) : downloadOne(card.group)"
            >
              {{ card.action === 'view' ? 'Voir' : 'Télécharger' }}
            </button>
          </article>
        </div>
      </section>
    </div>

    <div v-if="modal.open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div class="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
        <h3 class="text-lg font-semibold text-slate-900">{{ modal.title }}</h3>
        <p v-if="modal.message" class="mt-2 text-sm text-slate-600">{{ modal.message }}</p>

        <ul v-if="modal.docs.length" class="mt-4 space-y-2">
          <li v-for="doc in modal.docs" :key="doc.id" class="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2">
            <span class="text-sm text-slate-700">{{ doc.title }}</span>
            <a
              :href="doc.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm font-semibold text-brandBlue hover:underline"
            >
              Ouvrir
            </a>
          </li>
        </ul>

        <div class="mt-5 flex justify-end">
          <button type="button" class="rounded-lg bg-brandBlue px-4 py-2 text-sm font-semibold text-white" @click="closeModal">
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

definePageMeta({
  layout: 'parent',
  middleware: ['parent'],
});

type ApiDoc = { id: string; title: string; url: string };

const { authFetch } = useParentAuth();

type GroupKey = 'rules' | 'brochure' | 'magazine' | 'supplies' | 'schedule' | 'vacances';
type IconName = 'supplies' | 'schedule' | 'holidays';

type DocCard = {
  key: string;
  title: string;
  group: GroupKey;
  icon: IconName;
  action: 'download' | 'view';
};

const apiDocs = ref<ApiDoc[]>([]);
const pending = ref(true);
const modal = ref<{ open: boolean; title: string; message: string; docs: ApiDoc[] }>({
  open: false,
  title: '',
  message: '',
  docs: [],
});

const adminCards: DocCard[] = [
  { key: 'rules', title: "Règlement de l'établissement", group: 'rules', icon: 'schedule', action: 'download' },
  { key: 'brochure', title: 'Brochure', group: 'brochure', icon: 'supplies', action: 'download' },
  { key: 'magazine', title: 'Magazine', group: 'magazine', icon: 'holidays', action: 'download' },
];

const schoolCards: DocCard[] = [
  { key: 'supplies', title: 'Liste des fournitures', group: 'supplies', icon: 'supplies', action: 'view' },
  { key: 'schedule', title: 'Horaire scolaire', group: 'schedule', icon: 'schedule', action: 'download' },
  { key: 'vacances', title: 'Vacances', group: 'vacances', icon: 'holidays', action: 'view' },
];

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function docsForGroup(group: GroupKey) {
  return apiDocs.value.filter((d) => {
    const t = normalize(d.title);
    if (group === 'rules') return t.includes('reglement') || t.includes('administratif');
    if (group === 'brochure') return t.includes('brochure');
    if (group === 'magazine') return t.includes('magazine');
    if (group === 'supplies') return t.includes('fourniture') || t.includes('liste');
    if (group === 'schedule') return t.includes('horaire') || t.includes('emploi du temps');
    return t.includes('vacance') || t.includes('calendrier');
  });
}

function closeModal() {
  modal.value = { open: false, title: '', message: '', docs: [] };
}

function openMissingModal() {
  modal.value = {
    open: true,
    title: 'Document non disponible',
    message: 'Aucun document n’est disponible pour le moment dans cette catégorie.',
    docs: [],
  };
}

function downloadOne(group: GroupKey) {
  const docs = docsForGroup(group);
  if (!docs.length) return openMissingModal();
  window.open(docs[0]!.url, '_blank', 'noopener,noreferrer');
}

function viewGroup(group: GroupKey, title: string) {
  const docs = docsForGroup(group);
  if (!docs.length) return openMissingModal();
  modal.value = {
    open: true,
    title,
    message: 'Choisissez un document à ouvrir.',
    docs,
  };
}

onMounted(async () => {
  pending.value = true;
  try {
    apiDocs.value = await authFetch<ApiDoc[]>('/parent/documents');
  } catch {
    apiDocs.value = [];
  } finally {
    pending.value = false;
  }
});
</script>
