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
      <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <button
          v-for="m in methodsForCountry"
          :key="m.id"
          type="button"
          class="flex min-h-[68px] items-center justify-center rounded-xl border-2 px-3 py-2 text-center text-xs font-bold uppercase tracking-wide shadow-sm transition"
          :class="[m.style, paymentMethod === m.id ? m.ring : 'border-transparent opacity-90 hover:opacity-100']"
          @click="paymentMethod = m.id"
        >
          <img :src="m.logo" :alt="m.label" class="h-10 w-auto object-contain sm:h-11" />
        </button>
        <button
          v-if="phoneCountry === '+225'"
          type="button"
          class="flex min-h-[68px] flex-col items-center justify-center rounded-xl border-2 border-[#ffcc00] bg-[#ffcc00] px-2 py-2 text-center text-[11px] font-extrabold uppercase leading-tight text-black shadow-sm transition"
          :class="paymentMethod === 'mtn_money' ? 'ring-2 ring-[#c9a100] ring-offset-2' : 'border-transparent opacity-95 hover:opacity-100'"
          @click="paymentMethod = 'mtn_money'"
        >
          MTN CI
        </button>
        <button
          v-if="phoneCountry === '+225'"
          type="button"
          class="flex min-h-[68px] flex-col items-center justify-center rounded-xl border-2 border-[#0066b3] bg-[#0066b3] px-2 py-2 text-center text-[11px] font-extrabold uppercase leading-tight text-white shadow-sm transition"
          :class="paymentMethod === 'moov_money' ? 'ring-2 ring-[#004a82] ring-offset-2' : 'border-transparent opacity-95 hover:opacity-100'"
          @click="paymentMethod = 'moov_money'"
        >
          Moov CI
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

      <div v-if="paymentMethod === 'orange_money' && phoneCountry === '+225'" class="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
        Orange Money CI : composez <strong>#144*82#</strong> puis option <strong>2</strong> pour obtenir le code de paiement, puis saisissez-le ci-dessous.
      </div>
      <div v-if="paymentMethod === 'orange_money' && phoneCountry === '+225'" class="mt-2">
        <input
          v-model.trim="orangeMoneyCiOtp"
          type="text"
          inputmode="numeric"
          maxlength="8"
          placeholder="Code de paiement Orange CI"
          class="w-full max-w-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
        >
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
import { computed, onMounted, ref, watch } from 'vue';
import waveLogo from '~/assets/images/wave.png';
import omLogo from '~/assets/images/om.png';
import wizallLogo from '~/assets/images/wizall.png';
import westernLogo from '~/assets/images/western.png';

type EnrollmentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
type OverviewChild = { id: string; firstName: string; lastName: string; enrollments: Array<{ id: string; schoolYear: string; status: EnrollmentStatus }> };
type Me = { phone: string | null; fullName?: string | null; email?: string | null };
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
const paymentMethod = ref<
  'wave' | 'orange_money' | 'wizall' | 'western_union' | 'mtn_money' | 'moov_money' | 'card' | null
>(null);
const orangeMoneyCiOtp = ref('');
const parentEmail = ref('');
const cardNumber = ref('');
const cardExpiry = ref('');
const cardCvv = ref('');
const feedback = ref('');
const errorMsg = ref('');
const overview = ref<OverviewChild[] | null>(null);
const monthlyAmountXof = ref(0);

const methodsAll = [
  { id: 'wave' as const, label: 'Wave', logo: waveLogo, style: 'bg-[#4AD2FA] text-white', ring: 'ring-2 ring-[#30a7ca] ring-offset-2' },
  { id: 'orange_money' as const, label: 'OM', logo: omLogo, style: 'bg-black text-white', ring: 'ring-2 ring-black ring-offset-2' },
  { id: 'wizall' as const, label: 'Wizall', logo: wizallLogo, countries: ['+221'] as const, style: 'bg-[#00BACF] text-white', ring: 'ring-2 ring-[#008d9c] ring-offset-2' },
  { id: 'western_union' as const, label: 'Western union', logo: westernLogo, style: 'bg-black text-white', ring: 'ring-2 ring-black ring-offset-2' },
];

const methodsForCountry = computed(() => {
  const cc = phoneCountry.value;
  return methodsAll.filter((m) => !('countries' in m) || (m as { countries?: readonly string[] }).countries?.includes(cc));
});

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
  if (paymentMethod.value === 'orange_money' && phoneCountry.value === '+225') {
    if (!orangeMoneyCiOtp.value.trim()) return false;
  }
  return !!firstName.value.trim() && !!lastName.value.trim() && !!phoneLocal.value.trim();
});
const displayAmount = computed(() => `${new Intl.NumberFormat('fr-FR').format(monthlyAmountXof.value)} XOF`);
const fullPhoneForWallet = computed(() => `${phoneCountry.value}${phoneLocal.value.replace(/\s+/g, '')}`);

watch(phoneCountry, () => {
  if (paymentMethod.value === 'wizall' && phoneCountry.value === '+225') paymentMethod.value = null;
  if ((paymentMethod.value === 'mtn_money' || paymentMethod.value === 'moov_money') && phoneCountry.value !== '+225') {
    paymentMethod.value = null;
  }
});

function stripCountry(phone: string, dial: '+221' | '+225'): string {
  const p = phone.replace(/\s+/g, '');
  if (p.startsWith(dial)) return p.slice(dial.length);
  if (dial === '+221' && p.startsWith('221')) return p.slice(3);
  if (dial === '+225' && p.startsWith('225')) return p.slice(3);
  return p.replace(/^\+/, '');
}

/** Extrait le token depuis une URL PayDunya (live ou sandbox, avec ou sans segment `checkout`). */
function tokenFromPaydunyaInvoiceUrl(s: string): string {
  const m = s.trim().match(/\/invoice\/([^/?#]+)/i);
  return (m?.[1] ?? '').trim();
}

function extractCheckoutToken(checkout: Record<string, unknown>): string {
  const data = checkout?.data as Record<string, unknown> | undefined;
  const direct = String(checkout?.token ?? data?.token ?? '').trim();
  if (direct) return direct;
  const rt = checkout?.response_text ?? data?.response_text;
  if (typeof rt === 'object' && rt != null) {
    const o = rt as Record<string, unknown>;
    const nested = String(o.token ?? o.checkout_invoice_token ?? '').trim();
    if (nested) return nested;
  }
  if (typeof rt === 'string') {
    const fromUrl = tokenFromPaydunyaInvoiceUrl(rt);
    if (fromUrl) return fromUrl;
  }
  return '';
}

function buildSoftpayPayload(
  provider: string,
  token: string,
  opts: { fullName: string; email: string; phoneLocalDigits: string; dial: '+221' | '+225'; orangeOtp?: string },
): Record<string, unknown> {
  const fn = opts.fullName.trim() || 'Parent';
  const email = opts.email.trim() || 'parent@commonwealth-school.local';
  const local = opts.phoneLocalDigits.replace(/\D/g, '');

  switch (provider) {
    case 'wave_sn':
      return {
        wave_senegal_fullName: fn,
        wave_senegal_email: email,
        wave_senegal_phone: local,
        wave_senegal_payment_token: token,
      };
    case 'wave_ci':
      return {
        wave_ci_fullName: fn,
        wave_ci_email: email,
        wave_ci_phone: local,
        wave_ci_payment_token: token,
      };
    case 'orange_sn':
      return {
        customer_name: fn,
        customer_email: email,
        phone_number: local,
        invoice_token: token,
      };
    case 'orange_ci':
      return {
        orange_money_ci_customer_fullname: fn,
        orange_money_ci_email: email,
        orange_money_ci_phone_number: local.startsWith('0') ? local : `0${local}`,
        orange_money_ci_otp: String(opts.orangeOtp ?? '').trim(),
        payment_token: token,
      };
    case 'wizall_sn':
      return {
        customer_name: fn,
        customer_email: email,
        phone_number: local,
        invoice_token: token,
      };
    case 'mtn_ci':
      return {
        mtn_ci_customer_fullname: fn,
        mtn_ci_email: email,
        mtn_ci_phone_number: local,
        mtn_ci_wallet_provider: 'MTNCI',
        payment_token: token,
      };
    case 'moov_ci':
      return {
        moov_ci_customer_fullname: fn,
        moov_ci_email: email,
        moov_ci_phone_number: local,
        payment_token: token,
      };
    case 'paydunya':
      return {
        customer_name: fn,
        customer_email: email,
        phone_phone: local,
        password: '00000000',
        invoice_token: token,
      };
    default:
      return { payment_token: token, invoice_token: token };
  }
}

function invoiceStatusFromConfirm(verify: Record<string, unknown>): string {
  const data = verify?.data as Record<string, unknown> | undefined;
  const inv = (data?.invoice ?? verify?.invoice) as Record<string, unknown> | undefined;
  if (inv && typeof inv.status !== 'undefined') return String(inv.status);
  return '';
}

function isCheckoutPaidPayload(verify: Record<string, unknown>): boolean {
  const invStatus = invoiceStatusFromConfirm(verify).toLowerCase();
  if (invStatus === 'completed' || invStatus === 'paid') return true;
  const rt = verify?.response_text;
  const rtObj = typeof rt === 'object' && rt != null ? (rt as Record<string, unknown>) : null;
  const statusRaw = String(
    verify?.status ??
      rtObj?.status ??
      rtObj?.payment_status ??
      rtObj?.payment_status_text ??
      (verify?.data as Record<string, unknown> | undefined)?.status ??
      '',
  ).toLowerCase();
  return (
    statusRaw.includes('completed') ||
    statusRaw.includes('paid') ||
    statusRaw.includes('success') ||
    statusRaw.includes('successfully paid') ||
    statusRaw === 'completed'
  );
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function waitCheckoutPaid(checkoutToken: string, hadRedirectUrl: boolean): Promise<boolean> {
  const attempts = hadRedirectUrl ? 14 : 5;
  const delayMs = hadRedirectUrl ? 2500 : 900;
  for (let i = 0; i < attempts; i++) {
    const verify = await authFetch<Record<string, unknown>>(
      `/backoffice/paydunya/checkout-invoice/${encodeURIComponent(checkoutToken)}/status`,
    );
    if (isCheckoutPaidPayload(verify)) return true;
    if (i < attempts - 1) await sleep(delayMs);
  }
  return false;
}

function paydunyaErrorMessage(e: unknown): string {
  const x = e as {
    data?: { message?: string | string[]; response_text?: string };
    message?: string;
    statusMessage?: string;
  };
  const rt = x?.data?.response_text;
  if (typeof rt === 'string' && rt.trim()) return rt.trim();
  const m = x?.data?.message;
  if (typeof m === 'string') return m;
  if (Array.isArray(m) && m[0]) return String(m[0]);
  if (typeof x?.statusMessage === 'string' && x.statusMessage.trim()) return x.statusMessage;
  if (typeof x?.message === 'string' && x.message.trim()) return x.message;
  if (e instanceof Error && e.message.trim()) return e.message;
  return 'Enregistrement du paiement impossible.';
}

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
    parentEmail.value = String(me?.email ?? '').trim() || 'parent@commonwealth-school.local';
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

    const pm = paymentMethod.value;
    if (!pm) return;

    const providerByChannel: Record<
      'wave' | 'orange_money' | 'wizall' | 'western_union' | 'mtn_money' | 'moov_money',
      Partial<Record<'+221' | '+225', string>>
    > = {
      wave: { '+221': 'wave_sn', '+225': 'wave_ci' },
      orange_money: { '+221': 'orange_sn', '+225': 'orange_ci' },
      wizall: { '+221': 'wizall_sn' },
      western_union: { '+221': 'paydunya', '+225': 'paydunya' },
      mtn_money: { '+225': 'mtn_ci' },
      moov_money: { '+225': 'moov_ci' },
    };

    const provider = providerByChannel[pm as keyof typeof providerByChannel]?.[phoneCountry.value];
    if (!provider) {
      throw new Error('Combinaison moyen de paiement / pays non supportée.');
    }

    const checkout = await authFetch<Record<string, unknown>>('/backoffice/paydunya/checkout-invoice', {
      method: 'POST',
      body: {
        total_amount: monthlyAmountXof.value,
        description: 'Paiement scolarité',
        custom_data: {
          source: 'parent_portal',
          childIds: [...selectedIds.value],
          channel: pm,
          countryCode: phoneCountry.value,
        },
      },
    });

    const checkoutToken = extractCheckoutToken(checkout);
    if (!checkoutToken) {
      throw new Error('Token de checkout PayDunya introuvable.');
    }

    const dial = phoneCountry.value;
    const phoneDigits = stripCountry(fullPhoneForWallet.value, dial);
    const fullName = `${firstName.value.trim()} ${lastName.value.trim()}`.trim();
    const softBody = buildSoftpayPayload(provider, checkoutToken, {
      fullName,
      email: parentEmail.value,
      phoneLocalDigits: phoneDigits,
      dial,
      orangeOtp: pm === 'orange_money' && dial === '+225' ? orangeMoneyCiOtp.value : undefined,
    });

    const softpay = await authFetch<Record<string, unknown>>(`/backoffice/paydunya/softpay/${provider}`, {
      method: 'POST',
      body: softBody,
    });

    if (softpay && typeof softpay === 'object' && softpay.success === false) {
      throw new Error(String(softpay.message ?? 'Paiement refusé par PayDunya.'));
    }

    const otherUrl = softpay?.other_url as Record<string, unknown> | undefined;
    const deepLink = String(
      softpay?.url ??
        otherUrl?.om_url ??
        otherUrl?.maxit_url ??
        (softpay?.response_text as Record<string, unknown> | undefined)?.url ??
        '',
    ).trim();
    const hadRedirectUrl = !!deepLink;
    if (deepLink) {
      window.open(deepLink, '_blank', 'noopener,noreferrer');
    }

    const paid = await waitCheckoutPaid(checkoutToken, hadRedirectUrl);
    if (!paid) {
      feedback.value =
        'Si vous avez validé le paiement sur votre téléphone ou dans la page ouverte, patientez quelques secondes puis cliquez à nouveau sur « Payer » pour finaliser. Sinon, complétez d’abord le paiement depuis le lien ou l’application.';
      return;
    }

    const res = await authFetch<{ results: Array<{ ok: boolean; message?: string; kind?: string }> }>('/parent/payments/complete', {
      method: 'POST',
      body: {
        childIds: [...selectedIds.value],
        phone: fullPhoneForWallet.value,
        channel: pm,
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
      },
    });
    const ok = (res?.results ?? []).filter((r) => r.ok).length;
    feedback.value = `Paiement enregistré pour ${ok} élève${ok > 1 ? 's' : ''}.`;
    emit('completed');
  } catch (e: unknown) {
    errorMsg.value = paydunyaErrorMessage(e);
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  void loadData();
});
</script>
