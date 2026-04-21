<template>
  <div>
    <h1 class="mb-2 text-3xl font-bold text-brandBlue">Documents</h1>
    <p class="mb-8 text-sm text-slate-500">
      Documents à destination de votre famille : ceux liés aux niveaux de vos enfants et les ressources générales de l’école.
    </p>

    <div class="space-y-8">
      <!-- Bloc toujours visible : Administratifs -->
      <section class="rounded-3xl border border-[#bdd7ef] bg-white p-4 shadow-sm sm:p-6">
        <h2 class="mb-4 text-3xl font-semibold text-slate-900">Administratifs</h2>
        <div v-if="pending" class="text-sm text-slate-500">Chargement…</div>
        <template v-else>
          <ul v-if="adminDocs.length" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <li v-for="doc in adminDocs" :key="doc.id">
              <a
                :href="resolveDocumentUrl(doc.url)"
                target="_blank"
                rel="noopener noreferrer"
                class="flex h-full flex-col rounded-2xl border border-sky-100 bg-[#d9eaf7] p-4 text-center transition hover:border-brandBlue/40 hover:shadow-sm"
              >
                <span class="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-brandBlue">
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                  </svg>
                </span>
                <span class="flex-1 text-sm font-semibold leading-snug text-slate-900">{{ doc.title }}</span>
                <span class="mt-3 text-sm font-semibold text-brandBlue">Ouvrir →</span>
              </a>
            </li>
          </ul>
          <p v-else class="text-sm text-slate-500">Aucun document administratif pour le moment.</p>
        </template>
      </section>

      <!-- Bloc toujours visible : Scolaire -->
      <section class="rounded-3xl border border-[#bdd7ef] bg-white p-4 shadow-sm sm:p-6">
        <h2 class="mb-4 text-3xl font-semibold text-slate-900">Scolaire</h2>
        <div v-if="pending" class="text-sm text-slate-500">Chargement…</div>
        <template v-else>
          <ul v-if="schoolDocs.length" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <li v-for="doc in schoolDocs" :key="doc.id">
              <a
                :href="resolveDocumentUrl(doc.url)"
                target="_blank"
                rel="noopener noreferrer"
                class="flex h-full flex-col rounded-2xl border border-sky-100 bg-[#d9eaf7] p-4 text-center transition hover:border-brandBlue/40 hover:shadow-sm"
              >
                <span class="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-brandBlue">
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                  </svg>
                </span>
                <span class="flex-1 text-sm font-semibold leading-snug text-slate-900">{{ doc.title }}</span>
                <span class="mt-3 text-sm font-semibold text-brandBlue">Ouvrir →</span>
              </a>
            </li>
          </ul>
          <p v-else class="text-sm text-slate-500">Aucun document scolaire pour le moment.</p>
        </template>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

definePageMeta({
  layout: 'parent',
  middleware: ['parent'],
});

type ApiDoc = { id: string; title: string; url: string; kind?: 'SCHOOL' | 'ADMIN' };

const { authFetch } = useParentAuth();
const { resolveDocumentUrl } = useParentDocumentUrl();

const apiDocs = ref<ApiDoc[]>([]);
const pending = ref(true);

function rowKind(d: ApiDoc): 'SCHOOL' | 'ADMIN' {
  return d.kind === 'ADMIN' ? 'ADMIN' : 'SCHOOL';
}

const adminDocs = computed(() =>
  apiDocs.value
    .filter((d) => rowKind(d) === 'ADMIN')
    .sort((a, b) => a.title.localeCompare(b.title, 'fr')),
);
const schoolDocs = computed(() =>
  apiDocs.value
    .filter((d) => rowKind(d) === 'SCHOOL')
    .sort((a, b) => a.title.localeCompare(b.title, 'fr')),
);

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
