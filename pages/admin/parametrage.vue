<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Paramétrage</h1>
      <p class="mt-1 text-sm text-slate-500">
        Gestion des niveaux (inscription et mensualité par année scolaire) et des classes.
      </p>
    </div>

    <p v-if="loadError" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{{ loadError }}</p>
    <p v-if="actionNotice" class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{{ actionNotice }}</p>

    <div class="flex flex-wrap gap-2 border-b border-slate-200">
      <button
        v-for="t in tabs"
        :key="t.id"
        type="button"
        class="relative px-4 py-2.5 text-sm font-semibold transition"
        :class="
          activeTab === t.id
            ? 'text-[#216EC2] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-[#216EC2]'
            : 'text-slate-500 hover:text-slate-800'
        "
        @click="activeTab = t.id"
      >
        {{ t.label }}
      </button>
    </div>

    <div class="rounded-2xl border-2 border-[#216EC2]/20 bg-white p-5 shadow-sm sm:p-6">
      <div class="mb-6 rounded-2xl border border-[#216EC2]/15 bg-[#216EC2]/[0.04] p-4">
        <h2 class="mb-3 text-base font-bold text-slate-800">Gestion des années scolaires</h2>
        <form class="grid gap-3 sm:grid-cols-4" @submit.prevent="createSchoolYear">
          <label class="block">
            <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Libellé</span>
            <input v-model.trim="newYear.label" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="2026-2027">
          </label>
          <label class="block">
            <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Début</span>
            <input v-model="newYear.startDate" type="date" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
          </label>
          <label class="block">
            <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Fin</span>
            <input v-model="newYear.endDate" type="date" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
          </label>
          <div class="flex items-end">
            <button
              type="submit"
              class="h-[40px] w-full rounded-xl bg-[#216EC2] px-4 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:opacity-50"
              :disabled="yearSubmitting"
            >
              {{ yearSubmitting ? 'Création…' : 'Ouvrir une année' }}
            </button>
          </div>
        </form>
        <div v-if="yearsPending" class="mt-3 text-sm text-slate-500">Chargement des années…</div>
        <ul v-else class="mt-3 space-y-2">
          <li
            v-for="y in schoolYears"
            :key="y.id"
            class="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <div>
              <span class="font-semibold text-slate-800">{{ y.label }}</span>
              <span class="ml-2 text-slate-500">({{ y.startDate.slice(0, 10) }} → {{ y.endDate.slice(0, 10) }})</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="rounded-full px-2 py-0.5 text-xs font-bold" :class="y.status === 'OPEN' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'">
                {{ y.status === 'OPEN' ? 'Ouverte' : 'Clôturée' }}
              </span>
              <button
                v-if="y.status === 'OPEN'"
                type="button"
                class="rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800"
                @click="closeYear(y.id)"
              >
                Terminer l'année
              </button>
              <button
                v-else
                type="button"
                class="rounded-lg border border-[#216EC2]/40 bg-[#216EC2]/10 px-2.5 py-1 text-xs font-semibold text-[#216EC2]"
                @click="openYear(y.id, y.label)"
              >
                Réouvrir
              </button>
            </div>
          </li>
        </ul>
      </div>

      <div class="mb-5 flex flex-wrap items-end gap-4">
        <label class="block min-w-[200px]">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Année scolaire</span>
          <input
            v-model.trim="schoolYear"
            type="text"
            class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none ring-[#216EC2]/20 focus:border-[#216EC2] focus:ring-2"
            placeholder="2025-2026"
            @change="reloadCatalog"
          >
        </label>
        <button
          type="button"
          class="rounded-xl bg-[#216EC2] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:opacity-50"
          :disabled="catalogPending"
          @click="reloadCatalog"
        >
          Actualiser
        </button>
      </div>

      <!-- Niveaux -->
      <div v-show="activeTab === 'levels'">
        <h2 class="mb-4 text-lg font-bold text-slate-800">Niveaux et tarifs</h2>
        <div v-if="catalogPending" class="py-8 text-center text-sm text-slate-500">Chargement…</div>
        <template v-else>
          <form
            class="mb-8 rounded-2xl border border-[#216EC2]/15 bg-gradient-to-br from-[#216EC2]/[0.06] to-slate-50/90 p-5 shadow-sm"
            @submit.prevent="submitNewLevel"
          >
            <h3 class="mb-4 text-sm font-semibold text-slate-800">Ajouter un niveau</h3>
            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <label class="block sm:col-span-2">
                <span class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#216EC2]/90">Nom du niveau</span>
                <div class="relative">
                  <span
                    class="pointer-events-none absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-[#216EC2]/10 text-[#216EC2]"
                    aria-hidden="true"
                  >
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2 2 7l10 5 10-5-10-5Z" stroke-linejoin="round" />
                      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                  <input
                    v-model.trim="newLevel.name"
                    required
                    type="text"
                    class="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-14 pr-4 text-sm font-medium text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#216EC2] focus:ring-2 focus:ring-[#216EC2]/20"
                    placeholder="Ex. Crèche, CP, CE1…"
                    autocomplete="off"
                  >
                </div>
              </label>
              <label class="block">
                <span class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Ordre (optionnel)</span>
                <input
                  v-model.number="newLevel.order"
                  type="number"
                  step="1"
                  class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-[#216EC2] focus:ring-2 focus:ring-[#216EC2]/20"
                  placeholder="1, 2, 3…"
                >
              </label>
              <label class="block">
                <span class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Inscription (XOF)</span>
                <input
                  v-model.number="newLevel.annualXof"
                  required
                  type="number"
                  min="0"
                  step="1"
                  class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-[#216EC2] focus:ring-2 focus:ring-[#216EC2]/20"
                >
              </label>
              <label class="block">
                <span class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Mensualité (XOF)</span>
                <input
                  v-model.number="newLevel.monthlyXof"
                  required
                  type="number"
                  min="0"
                  step="1"
                  class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-[#216EC2] focus:ring-2 focus:ring-[#216EC2]/20"
                >
              </label>
            </div>
            <div class="mt-3">
              <button
                type="submit"
                class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
                :disabled="levelSubmitting"
              >
                {{ levelSubmitting ? 'Enregistrement…' : 'Créer le niveau' }}
              </button>
            </div>
          </form>

          <div class="overflow-x-auto rounded-xl border border-slate-200">
            <table class="min-w-full text-left text-sm">
              <thead class="bg-[#216EC2] text-white">
                <tr>
                  <th class="px-3 py-2 font-semibold">Niveau</th>
                  <th class="px-3 py-2 font-semibold">Ordre</th>
                  <th class="px-3 py-2 font-semibold">Inscription (XOF)</th>
                  <th class="px-3 py-2 font-semibold">Mensualité (XOF)</th>
                  <th class="px-3 py-2 font-semibold" />
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 bg-white">
                <tr v-for="row in catalog?.levels ?? []" :key="row.id">
                  <td class="px-3 py-3">
                    <span
                      class="inline-flex max-w-full items-center gap-2 rounded-xl border border-[#216EC2]/25 bg-[#216EC2]/5 px-3 py-1.5 text-sm font-semibold text-[#216EC2]"
                    >
                      <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white text-[#216EC2] shadow-sm" aria-hidden="true">
                        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M12 2 2 7l10 5 10-5-10-5Z" stroke-linejoin="round" />
                          <path d="M2 17l10 5 10-5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </span>
                      <span class="truncate">{{ row.name }}</span>
                    </span>
                  </td>
                  <td class="px-3 py-2 text-slate-600">{{ row.order ?? '—' }}</td>
                  <td class="px-3 py-2">
                    <input
                      v-model.number="pricingDraft[row.id].annual"
                      type="number"
                      min="0"
                      step="1"
                      class="w-full min-w-[7.5rem] max-w-[11rem] rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm font-medium text-slate-800 outline-none transition focus:border-[#216EC2] focus:bg-white focus:ring-2 focus:ring-[#216EC2]/20"
                    >
                  </td>
                  <td class="px-3 py-2">
                    <input
                      v-model.number="pricingDraft[row.id].monthly"
                      type="number"
                      min="0"
                      step="1"
                      class="w-full min-w-[7.5rem] max-w-[11rem] rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm font-medium text-slate-800 outline-none transition focus:border-[#216EC2] focus:bg-white focus:ring-2 focus:ring-[#216EC2]/20"
                    >
                  </td>
                  <td class="px-3 py-2">
                    <div class="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        class="rounded-lg border border-[#216EC2] bg-[#216EC2]/5 px-3 py-1 text-xs font-bold text-[#216EC2] hover:bg-[#216EC2]/10 disabled:opacity-50"
                        :disabled="pricingSaving === row.id"
                        @click="savePricing(row.id)"
                      >
                        {{ pricingSaving === row.id ? '…' : row.pricing ? 'Mettre à jour' : 'Enregistrer le barème' }}
                      </button>
                      <button
                        type="button"
                        class="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 hover:bg-amber-100 disabled:opacity-50"
                        :disabled="pricingRegenerating === row.id"
                        @click="regeneratePricingInvoices(row.id)"
                      >
                        {{ pricingRegenerating === row.id ? '…' : 'Réactualiser les factures' }}
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!(catalog?.levels?.length)">
                  <td colspan="5" class="px-3 py-8 text-center text-slate-500">Aucun niveau pour le moment.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </div>

      <!-- Classes -->
      <div v-show="activeTab === 'classes'">
        <h2 class="mb-4 text-lg font-bold text-slate-800">Classes par niveau</h2>
        <div v-if="catalogPending" class="py-8 text-center text-sm text-slate-500">Chargement…</div>
        <template v-else>
          <form
            class="mb-8 rounded-2xl border border-[#216EC2]/15 bg-gradient-to-br from-[#216EC2]/[0.06] to-slate-50/90 p-5 shadow-sm"
            @submit.prevent="submitNewClass"
          >
            <p class="mb-4 text-sm font-semibold text-slate-800">Ajouter une classe</p>
            <div class="flex flex-col gap-4 lg:flex-row lg:items-end">
              <div class="min-w-0 flex-1 lg:max-w-md">
                <span class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#216EC2]/90">Niveau</span>
                <div class="relative">
                  <span
                    class="pointer-events-none absolute left-3 top-1/2 z-[1] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-[#216EC2]/10 text-[#216EC2]"
                    aria-hidden="true"
                  >
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2 2 7l10 5 10-5-10-5Z" stroke-linejoin="round" />
                      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                  <select
                    v-model="newClass.levelId"
                    required
                    class="w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-14 pr-12 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-[#216EC2] focus:ring-2 focus:ring-[#216EC2]/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                    :disabled="!(catalog?.levels?.length)"
                  >
                    <option value="" disabled>{{ (catalog?.levels?.length) ? 'Sélectionner un niveau' : 'Aucun niveau disponible' }}</option>
                    <option v-for="l in catalog?.levels ?? []" :key="l.id" :value="l.id">{{ l.name }}</option>
                  </select>
                  <span
                    class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  >
                    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
              <label class="block min-w-0 flex-1">
                <span class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Nom de la classe</span>
                <input
                  v-model.trim="newClass.name"
                  required
                  type="text"
                  class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#216EC2] focus:ring-2 focus:ring-[#216EC2]/20"
                  placeholder="Ex. Crèche A, CP B…"
                  autocomplete="off"
                >
              </label>
              <button
                type="submit"
                class="h-[46px] shrink-0 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50 lg:self-end"
                :disabled="classSubmitting || !(catalog?.levels?.length)"
              >
                {{ classSubmitting ? '…' : 'Ajouter la classe' }}
              </button>
            </div>
          </form>

          <div class="space-y-6">
            <div
              v-for="l in catalog?.levels ?? []"
              :key="l.id"
              class="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
            >
              <h3 class="mb-3 inline-flex items-center gap-2 text-sm font-bold text-slate-800">
                <span class="flex h-8 w-8 items-center justify-center rounded-xl bg-[#216EC2]/10 text-[#216EC2]">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2 2 7l10 5 10-5-10-5Z" stroke-linejoin="round" />
                    <path d="M2 17l10 5 10-5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
                {{ l.name }}
              </h3>
              <ul v-if="l.classes.length" class="flex flex-wrap gap-2">
                <li
                  v-for="c in l.classes"
                  :key="c.id"
                  class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
                >
                  {{ c.name }}
                </li>
              </ul>
              <p v-else class="text-sm text-slate-500">Aucune classe pour ce niveau.</p>
            </div>
            <p v-if="!(catalog?.levels?.length)" class="text-center text-sm text-slate-500">
              Créez d’abord un niveau dans l’onglet « Niveaux et tarifs ».
            </p>
          </div>
        </template>
      </div>

      <!-- Services -->
      <div v-show="activeTab === 'services'">
        <h2 class="mb-4 text-lg font-bold text-slate-800">Services (cantine, bus, etc.)</h2>
        <div class="mb-6 rounded-2xl border border-[#216EC2]/15 bg-[#216EC2]/[0.04] p-4">
          <h3 class="mb-3 text-sm font-semibold text-slate-800">Créer un service</h3>
          <form class="grid gap-3 sm:grid-cols-3" @submit.prevent="submitNewService">
            <label class="block">
              <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Code</span>
              <input
                v-model.trim="newService.code"
                type="text"
                class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="BUS"
                required
              >
            </label>
            <label class="block sm:col-span-2">
              <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Libellé</span>
              <input
                v-model.trim="newService.label"
                type="text"
                class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Transport scolaire"
                required
              >
            </label>
            <div class="sm:col-span-3">
              <button
                type="submit"
                class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
                :disabled="serviceSubmitting"
              >
                {{ serviceSubmitting ? 'Création…' : 'Ajouter le service' }}
              </button>
            </div>
          </form>
        </div>

        <div class="mb-4 flex flex-wrap items-end gap-3">
          <label class="block min-w-[240px]">
            <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Niveau</span>
            <select
              v-model="serviceLevelId"
              class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="" disabled>Sélectionner un niveau</option>
              <option v-for="l in catalog?.levels ?? []" :key="l.id" :value="l.id">
                {{ l.name }}
              </option>
            </select>
          </label>
          <button
            type="button"
            class="rounded-xl bg-[#216EC2] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:opacity-50"
            :disabled="servicePricesPending || !serviceLevelId"
            @click="loadServicePrices"
          >
            Actualiser les tarifs services
          </button>
        </div>

        <div v-if="servicesPending || servicePricesPending" class="py-8 text-center text-sm text-slate-500">Chargement…</div>
        <div v-else class="overflow-x-auto rounded-xl border border-slate-200">
          <table class="min-w-full text-left text-sm">
            <thead class="bg-[#216EC2] text-white">
              <tr>
                <th class="px-3 py-2 font-semibold">Code</th>
                <th class="px-3 py-2 font-semibold">Service</th>
                <th class="px-3 py-2 font-semibold">Tarif mensuel (XOF)</th>
                <th class="px-3 py-2 font-semibold" />
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr v-for="s in services" :key="s.id">
                <td class="px-3 py-2 font-semibold text-slate-700">{{ s.code }}</td>
                <td class="px-3 py-2 text-slate-700">{{ s.label }}</td>
                <td class="px-3 py-2">
                  <input
                    v-model.number="servicePriceDraft[s.id]"
                    type="number"
                    min="0"
                    step="1"
                    class="w-full min-w-[7.5rem] max-w-[11rem] rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm font-medium text-slate-800 outline-none transition focus:border-[#216EC2] focus:bg-white focus:ring-2 focus:ring-[#216EC2]/20"
                  >
                </td>
                <td class="px-3 py-2">
                  <div class="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      class="rounded-lg border border-[#216EC2] bg-[#216EC2]/5 px-3 py-1 text-xs font-bold text-[#216EC2] hover:bg-[#216EC2]/10 disabled:opacity-50"
                      :disabled="servicePriceSaving === s.id || !serviceLevelId"
                      @click="saveServicePrice(s.id)"
                    >
                      {{ servicePriceSaving === s.id ? '…' : 'Enregistrer le tarif' }}
                    </button>
                    <button
                      type="button"
                      class="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 hover:bg-amber-100 disabled:opacity-50"
                      :disabled="servicePriceRegenerating === s.id || !serviceLevelId"
                      @click="regenerateServiceInvoices(s.id)"
                    >
                      {{ servicePriceRegenerating === s.id ? '…' : 'Actualiser les factures' }}
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!services.length">
                <td colspan="4" class="px-3 py-8 text-center text-slate-500">Aucun service pour le moment.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="confirmModalOpen"
        class="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/45 px-4"
        role="dialog"
        aria-modal="true"
      >
        <div class="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
          <h3 class="text-base font-semibold text-slate-900">Confirmation</h3>
          <p class="mt-2 text-sm leading-relaxed text-slate-600">{{ confirmModalMessage }}</p>
          <div class="mt-5 flex justify-end gap-2">
            <button
              type="button"
              class="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              @click="resolveConfirmation(false)"
            >
              Non
            </button>
            <button
              type="button"
              class="rounded-lg bg-[#216EC2] px-3 py-1.5 text-sm font-semibold text-white hover:brightness-110"
              @click="resolveConfirmation(true)"
            >
              Oui
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';

definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
});

type CatalogLevel = {
  id: string;
  name: string;
  order: number | null;
  classes: { id: string; name: string }[];
  pricing: {
    id: string;
    annualTuitionCents: number;
    monthlyBaseCents: number;
  } | null;
};

type CatalogDto = {
  schoolYear: string;
  levels: CatalogLevel[];
};

type SchoolYearDto = {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  status: 'OPEN' | 'CLOSED';
};

const tabs = [
  { id: 'levels' as const, label: 'Niveaux et tarifs' },
  { id: 'classes' as const, label: 'Classes' },
  { id: 'services' as const, label: 'Services' },
];

const { token } = useAuth();
const config = useRuntimeConfig();

const activeTab = ref<(typeof tabs)[number]['id']>('levels');
const schoolYear = ref(defaultSchoolYear());
const catalog = ref<CatalogDto | null>(null);
const catalogPending = ref(true);
const loadError = ref<string | null>(null);
const actionNotice = ref<string | null>(null);
const schoolYears = ref<SchoolYearDto[]>([]);
const yearsPending = ref(false);
const yearSubmitting = ref(false);

const newYear = reactive({
  label: '',
  startDate: '',
  endDate: '',
});

const pricingDraft = reactive<Record<string, { annual: number; monthly: number }>>({});

const newLevel = reactive({
  name: '',
  order: null as number | null,
  annualXof: 0,
  monthlyXof: 0,
});

const newClass = reactive({
  levelId: '',
  name: '',
});

const levelSubmitting = ref(false);
const classSubmitting = ref(false);
const pricingSaving = ref<string | null>(null);
const pricingRegenerating = ref<string | null>(null);
const services = ref<Array<{ id: string; code: string; label: string; active: boolean }>>([]);
const servicesPending = ref(false);
const serviceLevelId = ref('');
const servicePricesPending = ref(false);
const servicePriceSaving = ref<string | null>(null);
const servicePriceRegenerating = ref<string | null>(null);
const servicePriceDraft = reactive<Record<string, number>>({});
const serviceSubmitting = ref(false);
const newService = reactive({
  code: '',
  label: '',
});
const confirmModalOpen = ref(false);
const confirmModalMessage = ref('');
const confirmResolve = ref<((ok: boolean) => void) | null>(null);

function defaultSchoolYear(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  if (m >= 9) return `${y}-${y + 1}`;
  return `${y - 1}-${y}`;
}

function defaultYearDates() {
  const d = new Date();
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const start = m >= 9 ? y : y - 1;
  const end = start + 1;
  return {
    label: `${start}-${end}`,
    startDate: `${start}-09-01`,
    endDate: `${end}-07-31`,
  };
}

function xofToCents(xof: number): number {
  if (!Number.isFinite(xof) || xof < 0) return 0;
  return Math.round(xof * 100);
}

function centsToXof(cents: number): number {
  return cents / 100;
}

function syncPricingDraft() {
  const levels = catalog.value?.levels ?? [];
  for (const l of levels) {
    pricingDraft[l.id] = {
      annual: l.pricing ? centsToXof(l.pricing.annualTuitionCents) : 0,
      monthly: l.pricing ? centsToXof(l.pricing.monthlyBaseCents) : 0,
    };
  }
}

const api = computed(() => ({
  headers: { Authorization: `Bearer ${token.value ?? ''}` },
}));

async function reloadCatalog() {
  const t = token.value;
  if (!t) {
    catalog.value = null;
    catalogPending.value = false;
    return;
  }
  catalogPending.value = true;
  loadError.value = null;
  const sy = schoolYear.value.trim() || defaultSchoolYear();
  schoolYear.value = sy;
  try {
    catalog.value = await $fetch<CatalogDto>(
      `${config.public.apiBase}/admin/settings/catalog`,
      {
        headers: api.value.headers,
        query: { schoolYear: sy },
      },
    );
    syncPricingDraft();
    if (!serviceLevelId.value) {
      serviceLevelId.value = catalog.value?.levels?.[0]?.id ?? '';
    }
  } catch (e: unknown) {
    const err = e as { data?: { message?: string | string[] } };
    const raw = err?.data?.message;
    loadError.value =
      typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : 'Impossible de charger le paramétrage.';
    catalog.value = null;
  } finally {
    catalogPending.value = false;
  }
}

async function loadSchoolYears() {
  const t = token.value;
  if (!t) return;
  yearsPending.value = true;
  try {
    const res = await $fetch<{ items: SchoolYearDto[] }>(
      `${config.public.apiBase}/admin/settings/school-years`,
      { headers: api.value.headers },
    );
    schoolYears.value = res.items ?? [];
    const active = schoolYears.value.find((y) => y.status === 'OPEN');
    if (active && !schoolYear.value) schoolYear.value = active.label;
  } catch (e: unknown) {
    const err = e as { data?: { message?: string | string[] } };
    const raw = err?.data?.message;
    loadError.value = typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : "Impossible de charger les années scolaires.";
  } finally {
    yearsPending.value = false;
  }
}

async function createSchoolYear() {
  const t = token.value;
  if (!t) return;
  yearSubmitting.value = true;
  loadError.value = null;
  try {
    await $fetch(`${config.public.apiBase}/admin/settings/school-years`, {
      method: 'POST',
      headers: api.value.headers,
      body: {
        label: newYear.label.trim(),
        startDate: newYear.startDate,
        endDate: newYear.endDate,
        openNow: true,
      },
    });
    const defaults = defaultYearDates();
    newYear.label = defaults.label;
    newYear.startDate = defaults.startDate;
    newYear.endDate = defaults.endDate;
    await loadSchoolYears();
    const active = schoolYears.value.find((y) => y.status === 'OPEN');
    if (active) {
      schoolYear.value = active.label;
      await reloadCatalog();
    }
  } catch (e: unknown) {
    const err = e as { data?: { message?: string | string[] } };
    const raw = err?.data?.message;
    loadError.value = typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : "Création de l'année impossible.";
  } finally {
    yearSubmitting.value = false;
  }
}

async function closeYear(id: string) {
  const t = token.value;
  if (!t) return;
  try {
    await $fetch(`${config.public.apiBase}/admin/settings/school-years/${id}/close`, {
      method: 'PATCH',
      headers: api.value.headers,
    });
    await loadSchoolYears();
  } catch {
    loadError.value = "Clôture de l'année impossible.";
  }
}

async function openYear(id: string, label: string) {
  const t = token.value;
  if (!t) return;
  try {
    await $fetch(`${config.public.apiBase}/admin/settings/school-years/${id}/open`, {
      method: 'PATCH',
      headers: api.value.headers,
    });
    schoolYear.value = label;
    await loadSchoolYears();
    await reloadCatalog();
  } catch {
    loadError.value = "Ouverture de l'année impossible.";
  }
}

async function submitNewLevel() {
  const t = token.value;
  if (!t) return;
  levelSubmitting.value = true;
  loadError.value = null;
  try {
    const body: Record<string, unknown> = {
      name: newLevel.name,
      schoolYear: schoolYear.value.trim(),
      annualTuitionCents: xofToCents(Number(newLevel.annualXof)),
      monthlyBaseCents: xofToCents(Number(newLevel.monthlyXof)),
    };
    if (newLevel.order !== null && newLevel.order !== undefined && !Number.isNaN(Number(newLevel.order))) {
      body.order = Number(newLevel.order);
    }
    await $fetch(`${config.public.apiBase}/admin/settings/levels`, {
      method: 'POST',
      headers: api.value.headers,
      body,
    });
    newLevel.name = '';
    newLevel.order = null;
    newLevel.annualXof = 0;
    newLevel.monthlyXof = 0;
    await reloadCatalog();
  } catch (e: unknown) {
    const err = e as { data?: { message?: string | string[] } };
    const raw = err?.data?.message;
    loadError.value =
      typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : 'Création du niveau impossible.';
  } finally {
    levelSubmitting.value = false;
  }
}

async function savePricing(levelId: string) {
  const t = token.value;
  if (!t) return;
  const d = pricingDraft[levelId];
  if (!d) return;
  const shouldRefreshInvoices = await askConfirmation(
    'Voulez vous que les factures des mensualites a venir soient mise a jour ?',
  );
  const effectiveSchoolYear =
    schoolYear.value.trim() ||
    catalog.value?.schoolYear ||
    schoolYears.value.find((y) => y.status === 'OPEN')?.label ||
    '';
  const knownYears = new Set((schoolYears.value ?? []).map((y) => y.label));
  if (!effectiveSchoolYear || (knownYears.size > 0 && !knownYears.has(effectiveSchoolYear))) {
    loadError.value = "Année scolaire invalide. Choisissez une année existante avant de mettre à jour le barème.";
    return;
  }
  schoolYear.value = effectiveSchoolYear;
  pricingSaving.value = levelId;
  loadError.value = null;
  actionNotice.value = null;
  try {
    const result = await $fetch<{
      pricing: { annualTuitionCents: number; monthlyBaseCents: number } | null;
      regeneration: {
        enrollmentsFound: number;
        enrollmentsProcessed: number;
        deleted: { tuitionCharges: number; monthlyInstallments: number };
        warnings: string[];
      } | null;
    }>(`${config.public.apiBase}/admin/settings/levels/${levelId}/pricing`, {
      method: 'PUT',
      headers: api.value.headers,
      body: {
        schoolYear: effectiveSchoolYear,
        annualTuitionCents: xofToCents(Number(d.annual)),
        monthlyBaseCents: xofToCents(Number(d.monthly)),
        regeneratePending: shouldRefreshInvoices,
      },
    });
    if (result.regeneration) {
      const warnPart = result.regeneration.warnings?.length
        ? ` Avertissements: ${result.regeneration.warnings.slice(0, 2).join(' | ')}${result.regeneration.warnings.length > 2 ? '…' : ''}`
        : '';
      actionNotice.value =
        `Barème mis à jour et factures réactualisées. Inscriptions traitées: ` +
        `${result.regeneration.enrollmentsProcessed}/${result.regeneration.enrollmentsFound}. ` +
        `Factures scolarité recréées: ${result.regeneration.deleted.tuitionCharges}. ` +
        `Mensualités recréées: ${result.regeneration.deleted.monthlyInstallments}.${warnPart}`;
    } else {
      actionNotice.value = 'Barème mis à jour.';
    }
    await reloadCatalog();
  } catch (e: unknown) {
    const err = e as { data?: { message?: string | string[] } };
    const raw = err?.data?.message;
    loadError.value =
      typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : 'Enregistrement du barème impossible.';
  } finally {
    pricingSaving.value = null;
  }
}

async function regeneratePricingInvoices(levelId: string) {
  const t = token.value;
  if (!t) return;
  pricingRegenerating.value = levelId;
  loadError.value = null;
  try {
    const result = await $fetch<{
      enrollmentsFound: number;
      enrollmentsProcessed: number;
      deleted: { tuitionCharges: number; monthlyInstallments: number };
      warnings: string[];
    }>(`${config.public.apiBase}/admin/settings/levels/${levelId}/pricing/regenerate`, {
      method: 'POST',
      headers: api.value.headers,
      body: { schoolYear: schoolYear.value.trim() },
    });
    const warnPart = result.warnings?.length
      ? `\nAvertissements: ${result.warnings.slice(0, 2).join(' | ')}${result.warnings.length > 2 ? '…' : ''}`
      : '';
    actionNotice.value =
      `Réactualisation terminée. Inscriptions traitées: ${result.enrollmentsProcessed}/${result.enrollmentsFound}. ` +
      `Factures scolarité recréées: ${result.deleted.tuitionCharges}. Mensualités recréées: ${result.deleted.monthlyInstallments}.` +
      (warnPart ? ` ${warnPart.replace(/\n/g, ' ')}` : '');
  } catch (e: unknown) {
    const err = e as { data?: { message?: string | string[] } };
    const raw = err?.data?.message;
    loadError.value =
      typeof raw === 'string'
        ? raw
        : Array.isArray(raw)
          ? raw[0]
          : 'Réactualisation des factures impossible.';
  } finally {
    pricingRegenerating.value = null;
  }
}

async function submitNewClass() {
  const t = token.value;
  if (!t || !newClass.levelId) return;
  classSubmitting.value = true;
  loadError.value = null;
  try {
    await $fetch(`${config.public.apiBase}/admin/settings/classes`, {
      method: 'POST',
      headers: api.value.headers,
      body: { levelId: newClass.levelId, name: newClass.name },
    });
    newClass.name = '';
    await reloadCatalog();
  } catch (e: unknown) {
    const err = e as { data?: { message?: string | string[] } };
    const raw = err?.data?.message;
    loadError.value =
      typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : 'Création de la classe impossible.';
  } finally {
    classSubmitting.value = false;
  }
}

async function loadServices() {
  const t = token.value;
  if (!t) return;
  servicesPending.value = true;
  try {
    const res = await $fetch<{ items: Array<{ id: string; code: string; label: string; active: boolean }> }>(
      `${config.public.apiBase}/admin/settings/services`,
      { headers: api.value.headers },
    );
    services.value = res.items ?? [];
  } catch (e: unknown) {
    const err = e as { data?: { message?: string | string[] } };
    const raw = err?.data?.message;
    loadError.value =
      typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : 'Impossible de charger les services.';
  } finally {
    servicesPending.value = false;
  }
}

async function loadServicePrices() {
  const t = token.value;
  if (!t || !serviceLevelId.value || !schoolYear.value.trim()) return;
  servicePricesPending.value = true;
  try {
    const res = await $fetch<{
      items: Array<{ id: string; code: string; label: string; monthlyAmountCents: number }>;
    }>(`${config.public.apiBase}/admin/settings/service-prices`, {
      headers: api.value.headers,
      query: { schoolYear: schoolYear.value.trim(), levelId: serviceLevelId.value },
    });
    for (const s of res.items ?? []) {
      servicePriceDraft[s.id] = centsToXof(s.monthlyAmountCents ?? 0);
    }
  } catch (e: unknown) {
    const err = e as { data?: { message?: string | string[] } };
    const raw = err?.data?.message;
    loadError.value =
      typeof raw === 'string'
        ? raw
        : Array.isArray(raw)
          ? raw[0]
          : 'Impossible de charger les tarifs des services.';
  } finally {
    servicePricesPending.value = false;
  }
}

async function submitNewService() {
  const t = token.value;
  if (!t) return;
  serviceSubmitting.value = true;
  loadError.value = null;
  try {
    await $fetch(`${config.public.apiBase}/admin/settings/services`, {
      method: 'POST',
      headers: api.value.headers,
      body: {
        code: newService.code.trim().toUpperCase(),
        label: newService.label.trim(),
      },
    });
    newService.code = '';
    newService.label = '';
    await loadServices();
    await loadServicePrices();
  } catch (e: unknown) {
    const err = e as { data?: { message?: string | string[] } };
    const raw = err?.data?.message;
    loadError.value =
      typeof raw === 'string'
        ? raw
        : Array.isArray(raw)
          ? raw[0]
          : 'Création du service impossible.';
  } finally {
    serviceSubmitting.value = false;
  }
}

async function saveServicePrice(serviceTariffId: string) {
  const t = token.value;
  if (!t || !serviceLevelId.value) return;
  servicePriceSaving.value = serviceTariffId;
  loadError.value = null;
  try {
    await $fetch(`${config.public.apiBase}/admin/settings/service-prices`, {
      method: 'PUT',
      headers: api.value.headers,
      body: {
        schoolYear: schoolYear.value.trim(),
        levelId: serviceLevelId.value,
        serviceTariffId,
        monthlyAmountCents: xofToCents(Number(servicePriceDraft[serviceTariffId] ?? 0)),
      },
    });
    const doRegen = await askConfirmation(
      'Tarif service mis à jour. Voulez-vous réactualiser les factures non payées concernées ?',
    );
    if (doRegen) {
      await regenerateServiceInvoices(serviceTariffId);
    }
  } catch (e: unknown) {
    const err = e as { data?: { message?: string | string[] } };
    const raw = err?.data?.message;
    loadError.value =
      typeof raw === 'string'
        ? raw
        : Array.isArray(raw)
          ? raw[0]
          : 'Enregistrement du tarif service impossible.';
  } finally {
    servicePriceSaving.value = null;
  }
}

async function regenerateServiceInvoices(serviceTariffId: string) {
  const t = token.value;
  if (!t || !serviceLevelId.value) return;
  servicePriceRegenerating.value = serviceTariffId;
  loadError.value = null;
  try {
    const result = await $fetch<{
      enrollmentsFound: number;
      enrollmentsProcessed: number;
      deleted: { tuitionCharges: number; monthlyInstallments: number };
      warnings: string[];
    }>(`${config.public.apiBase}/admin/settings/service-prices/regenerate`, {
      method: 'POST',
      headers: api.value.headers,
      body: {
        schoolYear: schoolYear.value.trim(),
        levelId: serviceLevelId.value,
        serviceTariffId,
      },
    });
    const warnPart = result.warnings?.length
      ? `\nAvertissements: ${result.warnings.slice(0, 2).join(' | ')}${result.warnings.length > 2 ? '…' : ''}`
      : '';
    actionNotice.value =
      `Réactualisation terminée. Inscriptions traitées: ${result.enrollmentsProcessed}/${result.enrollmentsFound}. ` +
      `Factures scolarité recréées: ${result.deleted.tuitionCharges}. Mensualités recréées: ${result.deleted.monthlyInstallments}.` +
      (warnPart ? ` ${warnPart.replace(/\n/g, ' ')}` : '');
  } catch (e: unknown) {
    const err = e as { data?: { message?: string | string[] } };
    const raw = err?.data?.message;
    loadError.value =
      typeof raw === 'string'
        ? raw
        : Array.isArray(raw)
          ? raw[0]
          : 'Réactualisation des factures services impossible.';
  } finally {
    servicePriceRegenerating.value = null;
  }
}

function askConfirmation(message: string): Promise<boolean> {
  confirmModalMessage.value = message;
  confirmModalOpen.value = true;
  return new Promise<boolean>((resolve) => {
    confirmResolve.value = resolve;
  });
}

function resolveConfirmation(ok: boolean) {
  confirmModalOpen.value = false;
  const resolver = confirmResolve.value;
  confirmResolve.value = null;
  if (resolver) resolver(ok);
}

watch(token, () => {
  void reloadCatalog();
});

watch(
  () => [activeTab.value, schoolYear.value, serviceLevelId.value],
  () => {
    if (activeTab.value !== 'services') return;
    void loadServices();
    if (!serviceLevelId.value) {
      serviceLevelId.value = catalog.value?.levels?.[0]?.id ?? '';
    }
    if (serviceLevelId.value) void loadServicePrices();
  },
);

onMounted(() => {
  const defaults = defaultYearDates();
  newYear.label = defaults.label;
  newYear.startDate = defaults.startDate;
  newYear.endDate = defaults.endDate;
  void loadSchoolYears();
  void reloadCatalog();
  void loadServices();
});
</script>
