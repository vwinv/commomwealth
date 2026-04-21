<template>
  <div class="mb-6 rounded-[24px] border border-[#9ec5e5] bg-white p-4 shadow-sm sm:p-6">
    <div class="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 class="text-[30px] font-bold text-brandBlue">Paiement</h2>
      </div>
      <button
        type="button"
        class="rounded-lg px-2 py-1 text-xl font-semibold leading-none text-[#c56b5f] hover:bg-slate-100"
        @click="emit('close')"
      >
        ×
      </button>
    </div>

    <div v-if="loading" class="py-10 text-center text-sm text-slate-500">Chargement…</div>
    <template v-else>
      <label class="mb-4 block">
        <span class="mb-1.5 block text-sm font-semibold text-slate-800">Montant</span>
        <input
          :value="displayAmount"
          type="text"
          readonly
          class="w-full rounded-[10px] border border-[#4a8cbe] bg-white px-4 py-2.5 text-sm text-[#3f6f95] outline-none"
        >
      </label>

      <p class="mb-2 text-sm font-semibold text-slate-800">Moyens de paiement</p>
      <div class="grid grid-cols-2 gap-2 sm:grid-cols-5">
        <button
          v-for="m in methods"
          :key="m.id"
          type="button"
          class="flex min-h-[68px] items-center justify-center rounded-xl border-2 px-3 py-2 text-center text-xs font-bold uppercase tracking-wide shadow-sm transition"
          :class="[m.style, paymentMethod === m.id ? m.ring : 'border-transparent opacity-90 hover:opacity-100']"
          @click="paymentMethod = m.id"
        >
          <img :src="m.logo" :alt="m.label" class="h-10 w-auto object-contain sm:h-11" />
        </button>
        <button
          type="button"
          class="flex min-h-[68px] items-center justify-center rounded-xl border-2 px-3 py-2 text-center text-xs font-bold uppercase tracking-wide shadow-sm transition"
          :class="paymentMethod === 'card' ? 'border-[#1e5ea1] bg-[#2f77c2] text-white ring-2 ring-[#1e5ea1] ring-offset-2' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'"
          @click="paymentMethod = 'card'"
        >
          Carte bancaire
        </button>
      </div>

      <div v-if="paymentMethod !== 'card'" class="mt-4 grid gap-2 sm:grid-cols-2">
        <input
          v-model.trim="firstName"
          type="text"
          placeholder="Prénom"
          class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
        >
        <input
          v-model.trim="lastName"
          type="text"
          placeholder="Nom"
          class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
        >
        <div class="grid grid-cols-1 gap-2 sm:col-span-2 sm:grid-cols-3">
          <select
            v-model="phoneCountry"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
          >
            <option value="+221">Sénégal (+221)</option>
            <option value="+225">Côte d'Ivoire (+225)</option>
          </select>
          <input
            v-model.trim="phoneLocal"
            type="tel"
            placeholder="Téléphone"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400 sm:col-span-2"
          >
        </div>
      </div>

      <div v-else class="mt-4">
        <p class="mb-2 text-sm font-semibold text-slate-800">Carte Bancaire</p>
        <input
          v-model.trim="cardNumber"
          type="text"
          placeholder="Numéro de la carte"
          class="mb-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
        >
        <div class="grid grid-cols-2 gap-2">
          <input
            v-model.trim="cardExpiry"
            type="text"
            placeholder="Date d'expiration"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
          >
          <input
            v-model.trim="cardCvv"
            type="text"
            placeholder="CVV"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
          >
        </div>
      </div>

      <p v-if="feedback" class="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
        {{ feedback }}
      </p>
      <p v-if="errorMsg" class="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
        {{ errorMsg }}
      </p>

      <div class="mt-5">
        <button
          type="button"
          class="flex w-full items-center justify-center rounded-[9px] bg-[#1ea20a] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="loading || submitting || !canSubmit"
          @click="submit"
        >
          {{ submitting ? 'Envoi…' : 'Payer' }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import waveLogo from '~/assets/images/wave.png';
import omLogo from '~/assets/images/om.png';
import wizallLogo from '~/assets/images/wizall.png';
import westernLogo from '~/assets/images/western.png';

type EnrollmentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
type OverviewChild = { id: string; firstName: string; lastName: string; enrollments: Array<{ id: string; schoolYear: string; status: EnrollmentStatus }> };
type Me = { phone: string | null; fullName?: string | null };
type ChildRef = { firstName: string; lastName: string };
type TuitionRow = { amountCents: number; status: string; schoolYear: string; enrollment: { child: ChildRef } };
type MonthlyRow = { totalAmountCents: number; status: string; year: number; month: number; enrollment: { child: ChildRef } };
type LegacyPaymentRow = { amountCents?: number; status: string; year: number; month: number; enrollment: { child: ChildRef } };

const emit = defineEmits<{ completed: []; close: [] }>();
const { authFetch } = useParentAuth();
const loading = ref(false);
const submitting = ref(false);
const firstName = ref('');
const lastName = ref('');
const phoneCountry = ref<'+221' | '+225'>('+221');
const phoneLocal = ref('');
const selectedIds = ref<string[]>([]);
const paymentMethod = ref<'wave' | 'orange_money' | 'wizall' | 'western_union' | 'card' | null>(null);
const cardNumber = ref('');
const cardExpiry = ref('');
const cardCvv = ref('');
const feedback = ref('');
const errorMsg = ref('');
const overview = ref<OverviewChild[] | null>(null);
const monthlyAmountXof = ref(0);

const methods = [
  { id: 'wave' as const, label: 'Wave', logo: waveLogo, style: 'bg-[#4AD2FA] text-white', ring: 'ring-2 ring-[#30a7ca] ring-offset-2' },
  { id: 'orange_money' as const, label: 'OM', logo: omLogo, style: 'bg-black text-white', ring: 'ring-2 ring-black ring-offset-2' },
  { id: 'wizall' as const, label: 'Wizall', logo: wizallLogo, style: 'bg-[#00BACF] text-white', ring: 'ring-2 ring-[#008d9c] ring-offset-2' },
  { id: 'western_union' as const, label: 'Western union', logo: westernLogo, style: 'bg-black text-white', ring: 'ring-2 ring-black ring-offset-2' },
];

const rows = computed(() =>
  (overview.value ?? []).map((c) => {
    const latest = c.enrollments?.[0];
    const label = `${c.firstName} ${c.lastName}`.trim();
    if (!latest) return { childId: c.id, label, schoolYear: '', canPay: false, blockReason: 'Aucune inscription.' };
    const schoolYear = latest.schoolYear ? `Année scolaire ${latest.schoolYear}` : '';
    if (latest.status === 'APPROVED') return { childId: c.id, label, schoolYear, canPay: true, blockReason: '' };
    if (latest.status === 'PENDING') return { childId: c.id, label, schoolYear, canPay: false, blockReason: 'Inscription non validée.' };
    return { childId: c.id, label, schoolYear, canPay: false, blockReason: 'Inscription refusée.' };
  }),
);

const canSubmit = computed(() => {
  if (!selectedIds.value.length || !paymentMethod.value) return false;
  if (paymentMethod.value === 'card') {
    return !!cardNumber.value.trim() && !!cardExpiry.value.trim() && !!cardCvv.value.trim();
  }
  return !!firstName.value.trim() && !!lastName.value.trim() && !!phoneLocal.value.trim();
});
const displayAmount = computed(() => `${new Intl.NumberFormat('fr-FR').format(monthlyAmountXof.value)} XOF`);
const fullPhoneForWallet = computed(() => `${phoneCountry.value}${phoneLocal.value.replace(/\s+/g, '')}`);

function toXof(cents: number): number {
  const n = Number(cents);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n / 100);
}

function periodKeyFromSchoolYear(schoolYear: string): number {
  const m = schoolYear.trim().match(/^(\d{4})-/);
  return m ? parseInt(m[1]!, 10) * 100 + 9 : 0;
}

function isPendingStatus(s: unknown): boolean {
  return String(s ?? '').toUpperCase() === 'PENDING';
}

function isMonthlyInvoiceVisible(year: number, month: number): boolean {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  if (year < currentYear || (year === currentYear && month < currentMonth)) return true;
  if (year > currentYear || month > currentMonth) return false;
  const lastDay = new Date(year, month, 0).getDate();
  const thresholdDay = Math.max(1, lastDay - 9);
  return now.getDate() >= thresholdDay;
}

function resolveAmountXofFromPayments(data: {
  tuitionCharges?: TuitionRow[];
  monthlyInstallments?: MonthlyRow[];
  legacyPayments?: LegacyPaymentRow[];
  payments?: LegacyPaymentRow[];
}): number {
  const tuition = (data.tuitionCharges ?? [])
    .filter((t) => isPendingStatus(t.status) && Number(t.amountCents) > 0)
    .sort((a, b) => periodKeyFromSchoolYear(a.schoolYear) - periodKeyFromSchoolYear(b.schoolYear));
  if (tuition.length) return toXof(tuition[0]!.amountCents);

  const monthly = (data.monthlyInstallments ?? [])
    .filter((m) => isPendingStatus(m.status) && Number(m.totalAmountCents) > 0 && isMonthlyInvoiceVisible(m.year, m.month))
    .sort((a, b) => (a.year * 100 + a.month) - (b.year * 100 + b.month));
  if (monthly.length) return toXof(monthly[0]!.totalAmountCents);

  const legacy = (data.legacyPayments ?? data.payments ?? [])
    .filter((p) => isPendingStatus(p.status) && Number(p.amountCents ?? 0) > 0)
    .sort((a, b) => (a.year * 100 + a.month) - (b.year * 100 + b.month));
  if (legacy.length) return toXof(Number(legacy[0]!.amountCents ?? 0));

  return 0;
}

async function loadData() {
  loading.value = true;
  errorMsg.value = '';
  feedback.value = '';
  try {
    const [ov, me, payments] = await Promise.all([
      authFetch<OverviewChild[]>('/parent/overview'),
      authFetch<Me>('/parent/me'),
      authFetch<{
        legacyPayments?: LegacyPaymentRow[];
        tuitionCharges?: TuitionRow[];
        monthlyInstallments?: MonthlyRow[];
        payments?: LegacyPaymentRow[];
      }>('/parent/payments'),
    ]);
    overview.value = ov ?? [];
    monthlyAmountXof.value = resolveAmountXofFromPayments(payments ?? {});
    const fullName = String(me?.fullName ?? '').trim();
    if (fullName) {
      const [first, ...rest] = fullName.split(/\s+/);
      firstName.value = first ?? '';
      lastName.value = rest.join(' ');
    }
    const p = String(me?.phone ?? '').trim();
    if (p.startsWith('+225')) {
      phoneCountry.value = '+225';
      phoneLocal.value = p.slice(4).trim();
    } else if (p.startsWith('+221')) {
      phoneCountry.value = '+221';
      phoneLocal.value = p.slice(4).trim();
    } else {
      phoneCountry.value = '+221';
      phoneLocal.value = p;
    }
    selectedIds.value = rows.value.filter((r) => r.canPay).map((r) => r.childId);
  } catch {
    overview.value = [];
    errorMsg.value = 'Impossible de charger les élèves.';
  } finally {
    loading.value = false;
  }
}

async function submit() {
  if (!canSubmit.value) return;
  submitting.value = true;
  errorMsg.value = '';
  feedback.value = '';
  try {
    if (paymentMethod.value === 'card') {
      errorMsg.value = 'Le paiement par carte bancaire sera bientôt disponible.';
      return;
    }

    if (monthlyAmountXof.value <= 0) {
      throw new Error('Aucune facture impayée disponible pour paiement.');
    }

    const providerByChannelAndCountry: Record<string, Record<string, string>> = {
      wave: { '+221': 'wave_sn', '+225': 'wave_ci' },
      orange_money: { '+221': 'orange_sn', '+225': 'orange_ci' },
      wizall: { '+221': 'wizall_sn', '+225': 'wizall_ci' },
      western_union: { '+221': 'paydunya', '+225': 'paydunya' },
    };
    const provider = providerByChannelAndCountry[paymentMethod.value]?.[phoneCountry.value];
    if (!provider) {
      throw new Error('Combinaison moyen de paiement / pays non supportée.');
    }

    const checkout = await authFetch<Record<string, any>>('/backoffice/paydunya/checkout-invoice', {
      method: 'POST',
      body: {
        total_amount: monthlyAmountXof.value,
        description: 'Paiement scolarité',
        custom_data: {
          source: 'parent_portal',
          childIds: [...selectedIds.value],
          channel: paymentMethod.value,
          countryCode: phoneCountry.value,
        },
      },
    });

    const checkoutToken =
      String(checkout?.token ?? checkout?.response_text?.token ?? checkout?.response_text?.checkout_invoice_token ?? '').trim();
    if (!checkoutToken) {
      throw new Error('Token de checkout PayDunya introuvable.');
    }

    const softpay = await authFetch<Record<string, any>>(`/backoffice/paydunya/softpay/${provider}`, {
      method: 'POST',
      body: {
        invoice_token: checkoutToken,
        token: checkoutToken,
        phone_number: fullPhoneForWallet.value,
      },
    });

    const deepLink = String(
      softpay?.url ??
        softpay?.response_text?.url ??
        softpay?.response_text?.deeplink ??
        softpay?.response_text?.deep_link ??
        '',
    ).trim();
    if (deepLink) {
      window.open(deepLink, '_blank', 'noopener,noreferrer');
    }

    const verify = await authFetch<Record<string, any>>(`/backoffice/paydunya/checkout-invoice/${encodeURIComponent(checkoutToken)}/status`);
    const statusRaw = String(
      verify?.status ??
        verify?.response_text?.status ??
        verify?.response_text?.payment_status ??
        verify?.response_text?.payment_status_text ??
        '',
    ).toLowerCase();
    const isPaid =
      statusRaw.includes('completed') ||
      statusRaw.includes('paid') ||
      statusRaw.includes('success') ||
      statusRaw.includes('successfully paid');

    if (!isPaid) {
      feedback.value = 'Demande PayDunya envoyée. Confirmez le paiement sur votre téléphone, puis réessayez pour finaliser.';
      return;
    }

    const res = await authFetch<{ results: Array<{ ok: boolean; message?: string; kind?: string }> }>('/parent/payments/complete', {
      method: 'POST',
      body: {
        childIds: [...selectedIds.value],
        phone: fullPhoneForWallet.value,
        channel: paymentMethod.value,
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
      },
    });
    const ok = (res?.results ?? []).filter((r) => r.ok).length;
    feedback.value = `Paiement enregistré pour ${ok} élève${ok > 1 ? 's' : ''}.`;
    emit('completed');
  } catch (e: any) {
    errorMsg.value = e?.data?.message ?? 'Enregistrement du paiement impossible.';
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  void loadData();
});
</script>
