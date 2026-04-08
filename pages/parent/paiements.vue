<template>
  <div>
    <h1 class="mb-1 text-3xl font-bold text-brandBlue">Paiements</h1>
    <p class="mb-6 text-sm text-slate-500">Suivi des factures, échéances et règlements.</p>

    <section class="mb-6 rounded-3xl border border-[#bdd7ef] bg-white p-4 shadow-sm sm:p-5">
      <h2 class="mb-4 text-xl font-semibold text-slate-900">Gestion financière</h2>
      <div class="grid gap-4 lg:grid-cols-4">
        <div class="rounded-2xl border border-slate-200 bg-[#f6fbff] p-4 lg:col-span-1">
          <div class="mb-2 text-sm font-medium text-slate-700">Solde actuel</div>
          <div class="rounded-xl border border-[#9ec5e5] bg-[#d9ecfb] p-5 text-center">
            <p class="text-3xl font-bold text-slate-900">{{ formatXof(totalPaidCents) }}</p>
          </div>
        </div>

        <div class="rounded-2xl border border-slate-200 p-4 lg:col-span-3">
          <h3 class="mb-3 text-sm font-semibold text-slate-800">Factures récentes</h3>
          <div v-if="pending" class="text-sm text-slate-500">Chargement…</div>
          <ul v-else-if="recentInvoices.length" class="space-y-2">
            <li
              v-for="row in recentInvoices"
              :key="row.key"
              class="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
            >
              <div>
                <p class="text-sm font-semibold text-slate-800">{{ row.title }}</p>
                <p class="text-xs text-slate-500">{{ row.dateLabel }}</p>
              </div>
              <button
                type="button"
                class="rounded-lg bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700"
                disabled
                title="Document PDF — bientôt disponible"
              >
                Télécharger PDF
              </button>
            </li>
          </ul>
          <p v-else class="text-sm text-slate-500">Aucune facture récente.</p>
        </div>
      </div>
    </section>

    <div class="mb-4">
      <div class="max-w-sm rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
        <input
          v-model.trim="search"
          type="text"
          placeholder="Recherche"
          class="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        >
      </div>
    </div>

    <section class="rounded-3xl border border-[#bdd7ef] bg-white p-4 shadow-sm sm:p-5">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-2xl font-semibold text-slate-900">Historique</h2>
        <div class="flex items-center gap-2">
          <div v-if="showFilters" class="flex items-center gap-2">
            <label class="rounded-lg bg-brandBlue px-2 py-1 text-xs font-semibold text-white">
              <span class="mr-1">Date</span>
              <input
                v-model="selectedMonth"
                type="month"
                class="rounded border border-white/40 bg-brandBlue px-1 py-0.5 text-[11px] font-medium text-white outline-none [color-scheme:dark]"
              >
            </label>
            <label class="rounded-lg bg-brandBlue px-2 py-1 text-xs font-semibold text-white">
              <span class="mr-1">Enfant</span>
              <select
                v-model="selectedChild"
                class="rounded border border-white/40 bg-brandBlue px-1 py-0.5 text-[11px] font-medium text-white outline-none"
              >
                <option value="">Tous les enfants</option>
                <option v-for="name in childOptions" :key="name" :value="name">{{ name }}</option>
              </select>
            </label>
          </div>
          <button
            type="button"
            class="rounded-lg bg-brandBlue px-3 py-1.5 text-xs font-semibold text-white"
            @click="showFilters = !showFilters"
          >
            Filtre
          </button>
        </div>
      </div>

      <div v-if="pending" class="text-sm text-slate-500">Chargement…</div>
      <div v-else-if="filteredRows.length" class="overflow-x-auto rounded-xl border border-slate-200">
        <table class="min-w-full text-sm">
          <thead class="bg-brandBlue text-left text-white">
            <tr>
              <th class="px-3 py-2 font-semibold">Facture</th>
              <th class="px-3 py-2 font-semibold">Date</th>
              <th class="px-3 py-2 font-semibold">Montant</th>
              <th class="px-3 py-2 font-semibold">Statut</th>
              <th class="px-3 py-2 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in filteredRows" :key="row.key" class="border-t border-slate-100 bg-white">
              <td class="px-3 py-2 font-medium text-slate-800">{{ row.invoiceLabel }}</td>
              <td class="px-3 py-2 text-slate-600">{{ row.dateLabel }}</td>
              <td class="px-3 py-2 text-slate-800">{{ row.amountLabel }}</td>
              <td class="px-3 py-2 text-slate-600">{{ row.statusLabel }}</td>
              <td class="px-3 py-2">
                <div class="flex items-center gap-2">
                  <button
                    v-if="row.status === 'PENDING'"
                    type="button"
                    class="rounded-md bg-green-600 px-3 py-1 text-xs font-semibold text-white"
                    disabled
                    title="Paiement en ligne bientôt disponible"
                  >
                    Payer
                  </button>
                  <button
                    type="button"
                    class="rounded-md bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700"
                    disabled
                    title="Document PDF — bientôt disponible"
                  >
                    Télécharger PDF
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="text-sm text-slate-500">Aucune facture trouvée.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'parent',
  middleware: ['parent'],
});

type ChildRef = { firstName: string; lastName: string };

type LegacyPaymentRow = {
  id: string;
  year: number;
  month: number;
  status: string;
  amountCents?: number;
  enrollment: { id: string; schoolYear: string; child: ChildRef };
};

type TuitionRow = {
  id: string;
  schoolYear: string;
  amountCents: number;
  status: string;
  enrollment: { id: string; schoolYear: string; child: ChildRef };
};

type MonthlyRow = {
  id: string;
  year: number;
  month: number;
  totalAmountCents: number;
  status: string;
  enrollment: { id: string; schoolYear: string; child: ChildRef };
  lines?: { label: string; amountCents: number }[];
};

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

const { authFetch } = useParentAuth();

const legacyPayments = ref<LegacyPaymentRow[]>([]);
const tuitionCharges = ref<TuitionRow[]>([]);
const monthlyInstallments = ref<MonthlyRow[]>([]);
const totalPaidCents = ref(0);
const search = ref('');
const selectedMonth = ref('');
const selectedChild = ref('');
const showFilters = ref(false);
const pending = ref(true);

function childName(c: ChildRef) {
  return `${c.firstName} ${c.lastName}`;
}

function formatXof(cents: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

type DisplayRow = {
  key: string;
  invoiceLabel: string;
  title: string;
  childName: string;
  dateLabel: string;
  dateValue: string;
  amountLabel: string;
  status: string;
  statusLabel: string;
  sortValue: number;
};

function statusLabel(s: string) {
  if (s === 'PAID') return 'Payé';
  if (s === 'PENDING') return 'Non payé';
  if (s === 'FAILED') return 'Échec';
  if (s === 'CANCELLED') return 'Annulé';
  return s;
}

const allRows = computed((): DisplayRow[] => {
  const out: DisplayRow[] = [];
  let idx = 1;

  for (const t of tuitionCharges.value) {
    const startYear = Number(t.schoolYear.slice(0, 4));
    const month = 9;
    const year = Number.isFinite(startYear) ? startYear : new Date().getFullYear();
    out.push({
      key: `tuition-${t.id}`,
      invoiceLabel: `Facture N°${String(idx).padStart(3, '0')} Scolarité`,
      title: `Scolarité annuelle — ${childName(t.enrollment.child)} — ${t.schoolYear}`,
      childName: childName(t.enrollment.child),
      dateLabel: `${String(month).padStart(2, '0')}/${year}`,
      dateValue: `${year}-${String(month).padStart(2, '0')}`,
      amountLabel: formatXof(t.amountCents),
      status: t.status,
      statusLabel: statusLabel(t.status),
      sortValue: year * 100 + month,
    });
    idx += 1;
  }

  for (const m of monthlyInstallments.value) {
    const mo = MOIS[m.month - 1] ?? String(m.month);
    const hasService = !!m.lines?.some((l) => (l.label ?? '').toLowerCase() !== 'mensualité');
    out.push({
      key: `monthly-${m.id}`,
      invoiceLabel: `Facture N°${String(idx).padStart(3, '0')} ${hasService ? 'Cantine' : 'Scolarité'}`,
      title: `Mensualité — ${childName(m.enrollment.child)} — ${mo} ${m.year}`,
      childName: childName(m.enrollment.child),
      dateLabel: `${String(m.month).padStart(2, '0')}/${m.year}`,
      dateValue: `${m.year}-${String(m.month).padStart(2, '0')}`,
      amountLabel: formatXof(m.totalAmountCents),
      status: m.status,
      statusLabel: statusLabel(m.status),
      sortValue: m.year * 100 + m.month,
    });
    idx += 1;
  }

  for (const p of legacyPayments.value) {
    const cents = p.amountCents ?? 0;
    out.push({
      key: `legacy-${p.id}`,
      invoiceLabel: `Facture N°${String(idx).padStart(3, '0')} Scolarité`,
      title: `Ancien relevé — ${childName(p.enrollment.child)} — ${MOIS[p.month - 1] ?? p.month} ${p.year}`,
      childName: childName(p.enrollment.child),
      dateLabel: `${String(p.month).padStart(2, '0')}/${p.year}`,
      dateValue: `${p.year}-${String(p.month).padStart(2, '0')}`,
      amountLabel: cents ? formatXof(cents) : '-',
      status: p.status,
      statusLabel: statusLabel(p.status),
      sortValue: p.year * 100 + p.month,
    });
    idx += 1;
  }

  return out.sort((a, b) => b.sortValue - a.sortValue);
});

const filteredRows = computed(() => {
  const q = search.value.trim().toLowerCase();
  return allRows.value.filter((r) => {
    const bySearch =
      !q ||
      r.invoiceLabel.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.statusLabel.toLowerCase().includes(q) ||
      r.amountLabel.toLowerCase().includes(q);
    const byDate = !selectedMonth.value || r.dateValue === selectedMonth.value;
    const byChild = !selectedChild.value || r.childName === selectedChild.value;
    return bySearch && byDate && byChild;
  });
});

const childOptions = computed(() => {
  return [...new Set(allRows.value.map((r) => r.childName))].sort((a, b) => a.localeCompare(b, 'fr'));
});

const recentInvoices = computed(() => filteredRows.value.slice(0, 3));

onMounted(async () => {
  pending.value = true;
  try {
    const res = await authFetch<{
      legacyPayments?: LegacyPaymentRow[];
      tuitionCharges?: TuitionRow[];
      monthlyInstallments?: MonthlyRow[];
      payments?: LegacyPaymentRow[];
      totalPaidCents?: number;
    }>('/parent/payments');
    legacyPayments.value = res?.legacyPayments ?? res?.payments ?? [];
    tuitionCharges.value = res?.tuitionCharges ?? [];
    monthlyInstallments.value = res?.monthlyInstallments ?? [];
    totalPaidCents.value = Number.isFinite(res?.totalPaidCents) ? Number(res?.totalPaidCents) : 0;
  } catch {
    legacyPayments.value = [];
    tuitionCharges.value = [];
    monthlyInstallments.value = [];
    totalPaidCents.value = 0;
  } finally {
    pending.value = false;
  }
});
</script>
