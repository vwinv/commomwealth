<template>
  <div>
    <div class="mb-8 sm:mb-10">
      <h1 class="text-3xl font-bold text-brandBlue sm:text-[2rem]">
        Bonjour<span v-if="greetingName"> {{ greetingName }}</span>,
      </h1>
      <p class="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-[15px]">
        Bienvenue dans votre espace personnel. Retrouvez ici les informations utiles sur la scolarité de
        vos enfants, les avis de l’école et l’état de vos démarches administratives et financières.
      </p>
    </div>

    <div v-if="pending" class="rounded-2xl bg-white/80 px-6 py-10 text-center text-slate-500 shadow-sm">
      Chargement…
    </div>
    <div v-else-if="loadError" class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      {{ loadError }}
    </div>

    <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Dernière notification -->
      <section class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:p-6">
        <div class="mb-4 flex items-center gap-2">
          <span class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-brandBlue">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12l-4-3H6a2 2 0 0 1-2-2V6Z"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <h2 class="text-lg font-semibold text-slate-900">Dernière notification</h2>
        </div>
        <div
          v-if="latestNotification"
          class="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3"
          :class="!latestNotification.readAt ? 'border-brandBlue/25 bg-sky-50/90' : ''"
        >
          <span class="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-brandBlue">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 4h16v12H8l-4 4V4Z"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-baseline justify-between gap-2">
              <span class="font-semibold text-slate-900">{{ latestNotification.title }}</span>
              <span class="text-xs text-slate-400">{{ formatNotifTime(latestNotification.createdAt) }}</span>
            </div>
            <p class="mt-1 text-sm leading-snug text-slate-600">{{ latestNotification.body }}</p>
            <p class="mt-3 text-xs text-slate-500">
              Consultez l’icône cloche en haut à droite pour l’historique complet.
            </p>
          </div>
        </div>
        <div v-else class="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-8 text-center text-sm text-slate-500">
          Aucune notification pour le moment.
        </div>
      </section>

      <!-- Tableau de bord -->
      <section class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:p-6">
        <div class="mb-4 flex items-center gap-2">
          <span class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-brandBlue">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 4h7v7H4V4ZM13 4h7v7h-7V4ZM4 13h7v7H4v-7ZM13 13h7v7h-7v-7Z"
                stroke="currentColor"
                stroke-width="1.75"
              />
            </svg>
          </span>
          <h2 class="text-lg font-semibold text-slate-900">Tableau de bord</h2>
        </div>
        <div class="grid gap-3">
          <div class="rounded-xl bg-sky-100/90 px-4 py-3 text-sm text-slate-800">
            <span class="font-semibold text-brandBlue">Événement</span>
            — {{ eventTeaser }}
          </div>
          <div class="rounded-xl bg-emerald-100/90 px-4 py-3 text-sm text-slate-800">
            <span class="font-semibold text-emerald-800">Dernier paiement</span>
            — {{ lastPaymentTeaser }}
          </div>
          <div class="rounded-xl bg-amber-50/95 px-4 py-3 text-sm text-slate-800">
            <span class="font-semibold text-amber-900/90">Mot de l’école</span>
            — Nous vous remercions pour votre confiance. L’équipe pédagogique reste disponible pour tout
            complément d’information.
          </div>
        </div>
      </section>

      <!-- Gestion financière -->
      <section class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:p-6 lg:col-span-1">
        <h2 class="mb-5 text-lg font-semibold text-slate-900">Gestion financière</h2>
        <div class="grid gap-6 lg:grid-cols-2">
          <div>
            <h3 class="mb-3 text-sm font-semibold text-slate-700">Paiement sécurisé</h3>
            <button
              type="button"
              class="inline-flex h-12 w-full max-w-xs items-center justify-center rounded-xl px-4 text-sm font-bold text-white shadow-sm transition"
              :class="canPayTuition ? 'bg-emerald-500 hover:bg-emerald-600' : 'cursor-not-allowed bg-slate-300'"
              :disabled="!canPayTuition"
              :title="
                canPayTuition
                  ? undefined
                  : 'Aucune échéance impayée avec montant : vérifiez le paramétrage (niveau + année), que l’inscription est validée, puis rechargez la page.'
              "
              @click="goPaymentScreen"
            >
              Payer la scolarité
            </button>
            <p class="mt-3 text-xs text-slate-500">Paiement en ligne — moyens acceptés (selon activation) :</p>
            <div class="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold">
              <span class="rounded-md bg-[#00D4AA] px-2 py-1 text-white">Wave</span>
              <span class="rounded-md bg-[#FF6600] px-2 py-1 text-white">OM</span>
              <span class="rounded-md bg-[#5B2C91] px-2 py-1 text-white">Wizall</span>
              <span class="rounded-md bg-[#FFDD00] px-2 py-1 text-[#1a1a1a]">Western Union</span>
            </div>
          </div>
          <div>
            <h3 class="mb-3 text-sm font-semibold text-slate-700">Prochaine facture à payer</h3>
            <div
              v-if="nextInvoiceToPay"
              class="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3 text-sm"
            >
              <div class="min-w-0 flex-1">
                <p class="font-medium text-slate-800">{{ nextInvoiceToPay.label }}</p>
                <p v-if="nextInvoiceToPay.amountLabel" class="mt-0.5 text-xs font-semibold text-brandBlue">
                  {{ nextInvoiceToPay.amountLabel }}
                </p>
              </div>
              <NuxtLink
                to="/parent/paiements"
                class="shrink-0 rounded-lg border border-brandBlue bg-white px-2.5 py-1 text-xs font-semibold text-brandBlue hover:bg-sky-50"
              >
                Télécharger PDF
              </NuxtLink>
            </div>
            <p v-else class="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-3 py-6 text-center text-sm text-slate-500">
              Aucune facture à payer pour le moment.
            </p>
          </div>
        </div>
      </section>

      <!-- Documents -->
      <section class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:p-6">
        <div class="mb-4 flex items-center gap-2">
          <span class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-brandBlue">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linejoin="round"
              />
              <path d="M14 2v6h6" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" />
            </svg>
          </span>
          <h2 class="text-lg font-semibold text-slate-900">Espace documents</h2>
        </div>
        <div class="grid gap-3 sm:grid-cols-3">
          <template v-for="doc in documentCards" :key="doc.key">
            <a
              v-if="doc.href.startsWith('http')"
              :href="doc.href"
              target="_blank"
              rel="noopener noreferrer"
              class="flex flex-col items-center rounded-xl border border-sky-100 bg-sky-50/80 px-3 py-4 text-center transition hover:border-brandBlue/40 hover:bg-sky-50"
            >
              <span class="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-brandBlue shadow-sm">
                <ParentDocCardIcon :name="doc.icon" />
              </span>
              <span class="text-xs font-semibold text-slate-800">{{ doc.title }}</span>
              <span class="mt-2 text-xs font-medium text-brandBlue">Télécharger</span>
            </a>
            <NuxtLink
              v-else
              to="/parent/documents"
              class="flex flex-col items-center rounded-xl border border-sky-100 bg-sky-50/80 px-3 py-4 text-center transition hover:border-brandBlue/40 hover:bg-sky-50"
            >
              <span class="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-brandBlue shadow-sm">
                <ParentDocCardIcon :name="doc.icon" />
              </span>
              <span class="text-xs font-semibold text-slate-800">{{ doc.title }}</span>
              <span class="mt-2 text-xs font-medium text-brandBlue">Télécharger</span>
            </NuxtLink>
          </template>
        </div>
        <NuxtLink to="/parent/documents" class="mt-4 inline-block text-sm font-medium text-brandBlue hover:underline">
          Voir tous les documents →
        </NuxtLink>
      </section>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

type EnrollmentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

type Me = {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
};

type Notif = {
  id: string;
  title: string;
  body: string;
  kind: string | null;
  readAt: string | null;
  createdAt: string;
  enrollmentId: string | null;
};

type NotificationsPayload = {
  items: Notif[];
  unreadCount: number;
  latest: Notif | null;
};

type ChildRef = { firstName: string; lastName: string };

type LegacyPaymentRow = {
  id: string;
  year: number;
  month: number;
  status: string;
  enrollment: { child: ChildRef };
};

type TuitionRow = {
  id: string;
  schoolYear: string;
  amountCents: number;
  status: string;
  enrollment: { child: ChildRef };
};

type MonthlyRow = {
  id: string;
  year: number;
  month: number;
  totalAmountCents: number;
  status: string;
  enrollment: { child: ChildRef };
};

type OverviewChild = {
  id: string;
  firstName: string;
  lastName: string;
  enrollments: Array<{
    id: string;
    schoolYear: string;
    status: EnrollmentStatus;
    validationNote: string | null;
  }>;
};

type ApiDoc = { id: string; title: string; url: string; kind?: 'SCHOOL' | 'ADMIN' };

const MOIS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];

definePageMeta({
  layout: 'parent',
  middleware: ['parent'],
});

const { authFetch } = useParentAuth();
const { resolveDocumentUrl } = useParentDocumentUrl();

const me = ref<Me | null>(null);
const children = ref<OverviewChild[] | null>(null);
const notifPayload = ref<NotificationsPayload | null>(null);
const legacyPayments = ref<LegacyPaymentRow[]>([]);
const tuitionCharges = ref<TuitionRow[]>([]);
const monthlyInstallments = ref<MonthlyRow[]>([]);
const apiDocs = ref<ApiDoc[]>([]);
const pending = ref(true);
const loadError = ref<string | null>(null);

function centsPositive(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function isPendingStatus(s: unknown): boolean {
  return String(s ?? '').toUpperCase() === 'PENDING';
}

/** Scolarité annuelle ou mensualités encore dues (montant > 0), après synchro API. */
const canPayTuition = computed(() => {
  const tuitionOk = tuitionCharges.value.some(
    (t) => isPendingStatus(t.status) && centsPositive(t.amountCents) > 0,
  );
  const monthlyOk = monthlyInstallments.value.some(
    (m) => isPendingStatus(m.status) && centsPositive(m.totalAmountCents) > 0,
  );
  return tuitionOk || monthlyOk;
});

const latestNotification = computed(() => notifPayload.value?.latest ?? null);

const greetingName = computed(() => {
  const n = me.value?.fullName?.trim();
  if (!n) return '';
  return n.split(/\s+/)[0] ?? '';
});

const eventTeaser = computed(() => {
  const approved = children.value?.flatMap((c) => c.enrollments).find((e) => e.status === 'APPROVED');
  if (approved?.validationNote) {
    const line = approved.validationNote.split('\n')[0];
    if (line && line.length < 80) return line;
  }
  return 'Pique-nique de Pâques — date communiquée par l’école.';
});

function childLabel(c: ChildRef) {
  return `${c.firstName} ${c.lastName}`;
}

function periodKeyTuition(schoolYear: string): number {
  const m = schoolYear.trim().match(/^(\d{4})-/);
  return m ? parseInt(m[1]!, 10) * 100 + 9 : 0;
}

const lastPaymentTeaser = computed(() => {
  type Cand = { key: number; text: string };
  const cands: Cand[] = [];
  for (const p of legacyPayments.value) {
    if (p.status !== 'PAID') continue;
    cands.push({
      key: p.year * 100 + p.month,
      text: `Ancien relevé ${MOIS[p.month - 1] ?? p.month} ${p.year} — Payé (${childLabel(p.enrollment.child)})`,
    });
  }
  for (const t of tuitionCharges.value) {
    if (t.status !== 'PAID') continue;
    cands.push({
      key: periodKeyTuition(t.schoolYear),
      text: `Scolarité annuelle ${t.schoolYear} — Payée (${childLabel(t.enrollment.child)})`,
    });
  }
  for (const m of monthlyInstallments.value) {
    if (m.status !== 'PAID') continue;
    cands.push({
      key: m.year * 100 + m.month,
      text: `Mensualité ${MOIS[m.month - 1] ?? m.month} ${m.year} — Payée (${childLabel(m.enrollment.child)})`,
    });
  }
  if (!cands.length) return 'Aucun paiement enregistré pour le moment.';
  cands.sort((a, b) => b.key - a.key);
  return cands[0]!.text;
});

function formatXofFromCents(cents: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

/** Une seule ligne : la prochaine échéance impayée (la plus proche dans le temps). */
const nextInvoiceToPay = computed((): { id: string; label: string; amountLabel: string } | null => {
  type Cand = { sort: number; id: string; label: string; cents: number };
  const cands: Cand[] = [];

  const anyTuitionPending = tuitionCharges.value.some(
    (t) => isPendingStatus(t.status) && centsPositive(t.amountCents) > 0,
  );

  for (const t of tuitionCharges.value) {
    if (!isPendingStatus(t.status) || centsPositive(t.amountCents) <= 0) continue;
    cands.push({
      sort: periodKeyTuition(t.schoolYear),
      id: `t-${t.id}`,
      label: `Scolarité annuelle — ${childLabel(t.enrollment.child)} — ${t.schoolYear}`,
      cents: Number(t.amountCents),
    });
  }
  if (!anyTuitionPending) {
    for (const m of monthlyInstallments.value) {
      if (!isPendingStatus(m.status) || centsPositive(m.totalAmountCents) <= 0) continue;
      const mo = MOIS[m.month - 1] ?? String(m.month);
      cands.push({
        sort: m.year * 100 + m.month,
        id: `m-${m.id}`,
        label: `Mensualité — ${childLabel(m.enrollment.child)} — ${mo} ${m.year}`,
        cents: Number(m.totalAmountCents),
      });
    }
    for (const p of legacyPayments.value) {
      const amt = centsPositive(p.amountCents ?? 0);
      if (!isPendingStatus(p.status) || amt <= 0) continue;
      cands.push({
        sort: p.year * 100 + p.month,
        id: `l-${p.id}`,
        label: `Ancien relevé — ${childLabel(p.enrollment.child)} — ${MOIS[p.month - 1] ?? p.month} ${p.year}`,
        cents: amt,
      });
    }
  }

  if (!cands.length) return null;
  cands.sort((a, b) => a.sort - b.sort);
  const first = cands[0]!;
  return {
    id: first.id,
    label: first.label,
    amountLabel: formatXofFromCents(first.cents),
  };
});

type DocIcon = 'supplies' | 'schedule' | 'holidays';

const documentCards = computed(() => {
  if (apiDocs.value.length) {
    const icons: DocIcon[] = ['supplies', 'schedule', 'holidays'];
    return apiDocs.value.slice(0, 3).map((d, i) => ({
      key: d.id,
      title: d.title,
      href: resolveDocumentUrl(d.url),
      icon: icons[i % 3]!,
    }));
  }
  return [
    { key: 'supplies', title: 'Liste fournitures', href: '', icon: 'supplies' as const },
    { key: 'schedule', title: 'Horaire scolaire', href: '', icon: 'schedule' as const },
    { key: 'holidays', title: 'Vacances', href: '', icon: 'holidays' as const },
  ];
});

function goPaymentScreen() {
  void navigateTo('/parent/paiements/payer');
}

function formatNotifTime(iso: string) {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return '';
  const diff = Date.now() - t;
  if (diff < 90_000) return 'Maintenant';
  if (diff < 3_600_000) return `Il y a ${Math.floor(diff / 60_000)} min`;
  if (diff < 86_400_000) return `Il y a ${Math.floor(diff / 3_600_000)} h`;
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

onMounted(async () => {
  pending.value = true;
  loadError.value = null;
  try {
    const [meRes, overview, notifRes, payRes, docsRes] = await Promise.all([
      authFetch<Me>('/parent/me'),
      authFetch<OverviewChild[]>('/parent/overview'),
      authFetch<NotificationsPayload>('/parent/notifications'),
      authFetch<{
        legacyPayments?: LegacyPaymentRow[];
        tuitionCharges?: TuitionRow[];
        monthlyInstallments?: MonthlyRow[];
        payments?: LegacyPaymentRow[];
      }>('/parent/payments'),
      authFetch<ApiDoc[]>('/parent/documents'),
    ]);
    me.value = meRes;
    children.value = overview;
    notifPayload.value = notifRes ?? null;
    legacyPayments.value = payRes?.legacyPayments ?? payRes?.payments ?? [];
    tuitionCharges.value = payRes?.tuitionCharges ?? [];
    monthlyInstallments.value = payRes?.monthlyInstallments ?? [];
    apiDocs.value = docsRes ?? [];
  } catch {
    loadError.value = 'Impossible de charger vos données. Réessayez ou reconnectez-vous.';
  } finally {
    pending.value = false;
  }
});
</script>
