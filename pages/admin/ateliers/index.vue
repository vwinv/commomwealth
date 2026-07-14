<template>
  <div class="space-y-5">
    <h1 class="text-[28px] font-bold leading-tight text-[#216EC2] sm:text-[34px]">Gestion des Ateliers</h1>

    <p v-if="loadError" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ loadError }}</p>
    <p v-if="loading" class="text-sm text-slate-500">Chargement des ateliers…</p>

    <!-- Stats -->
    <section class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <article
        v-for="card in statCards"
        :key="card.key"
        class="rounded-xl border-2 border-[#216EC2]/30 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <h2 class="text-[13px] font-semibold text-slate-600">{{ card.title }}</h2>
            <p class="mt-2 text-[28px] font-bold leading-none tracking-tight text-slate-900">{{ card.value }}</p>
            <p class="mt-1.5 text-[11px] font-medium text-slate-400">{{ card.hint }}</p>
          </div>
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            :class="card.iconBg"
            aria-hidden="true"
            v-html="card.icon"
          />
        </div>
      </article>
    </section>

    <!-- Tabs + CTA -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="inline-flex items-center rounded-full border-2 border-[#216EC2]/30 bg-white p-1 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition"
          :class="tab === 'ateliers' ? 'bg-[#216EC2] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'"
          @click="tab = 'ateliers'"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
          Ateliers
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition"
          :class="tab === 'reservations' ? 'bg-[#216EC2] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'"
          @click="tab = 'reservations'"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M3 7h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
            <path d="M3 7l2.5-3h13L21 7" />
            <path d="M9 12h6" stroke-linecap="round" />
          </svg>
          Réservations
        </button>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-xl bg-[#216EC2] px-5 py-2.5 text-sm font-bold text-white shadow-[0_1px_2px_rgba(33,110,194,0.25)] transition hover:brightness-110"
        @click="openCreateForm"
      >
        <span class="text-lg leading-none">+</span>
        Nouvelle Atelier
      </button>
    </div>

    <!-- Filters -->
    <section class="rounded-xl border-2 border-[#216EC2]/30 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-4">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div class="relative min-w-0 flex-1">
          <span class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" stroke-linecap="round" />
            </svg>
          </span>
          <input
            v-model="search"
            type="search"
            class="w-full rounded-xl border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#216EC2] focus:ring-2 focus:ring-[#216EC2]/15"
            placeholder="Search"
            autocomplete="off"
          />
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <label class="inline-flex h-[42px] items-center overflow-hidden rounded-xl border border-[#216EC2] bg-white text-sm shadow-sm">
            <span class="inline-flex h-full items-center gap-1.5 bg-[#216EC2] px-3 font-semibold text-white">
              Du
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </span>
            <input
              v-model="dateFrom"
              type="date"
              class="h-full min-w-[9.5rem] bg-white px-3 text-sm font-medium text-slate-600 outline-none"
            />
          </label>
          <label class="inline-flex h-[42px] items-center overflow-hidden rounded-xl border border-[#216EC2] bg-white text-sm shadow-sm">
            <span class="inline-flex h-full items-center gap-1.5 bg-[#216EC2] px-3 font-semibold text-white">
              Au
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </span>
            <input
              v-model="dateTo"
              type="date"
              class="h-full min-w-[9.5rem] bg-white px-3 text-sm font-medium text-slate-600 outline-none"
            />
          </label>
          <select
            v-model="sort"
            class="h-[42px] rounded-xl border border-[#F9994B] bg-[#F9994B] px-4 text-sm font-bold text-white outline-none"
          >
            <option value="date_desc">Trier par</option>
            <option value="date_asc">Plus ancien</option>
            <option value="name_asc">Nom A → Z</option>
            <option value="status">Statut</option>
          </select>
        </div>
      </div>
    </section>

    <!-- Ateliers tab -->
    <section v-if="tab === 'ateliers'" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="atelier in filteredAteliers"
        :key="atelier.id"
        class="overflow-hidden rounded-xl border-2 border-[#216EC2]/30 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:shadow-md"
      >
        <div class="h-40 overflow-hidden bg-slate-100">
          <img class="h-full w-full object-cover" :src="mediaUrl(atelier.image)" :alt="atelier.title" />
        </div>
        <div class="p-4">
          <div class="flex items-start justify-between gap-2">
            <div>
              <h3 class="text-base font-bold text-slate-900">{{ atelier.title }}</h3>
              <p class="mt-1 text-xs text-slate-500">{{ atelier.description }}</p>
            </div>
            <span class="rounded-full bg-[#216EC2]/10 px-2.5 py-1 text-[10px] font-bold text-[#216EC2]">
              {{ atelier.ageLabel }}
            </span>
          </div>
          <div class="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold">
            <span class="rounded-md bg-[#FFF1E8] px-2 py-1 text-[#E87A3A]">{{ atelier.dateLabel }}</span>
            <span class="rounded-md bg-[#E8F1FB] px-2 py-1 text-[#216EC2]">{{ atelier.timeLabel }}</span>
            <span class="rounded-md bg-[#F3EBFA] px-2 py-1 text-[#7B4DB8]">{{ atelier.priceLabel }}</span>
          </div>
          <div class="mt-4 flex items-center justify-between gap-2 border-t border-[#E2E8F0] pt-3 text-xs text-slate-500">
            <span>{{ atelier.booked }}/{{ atelier.capacity }} places</span>
            <div class="flex items-center gap-1.5">
              <span :class="atelier.published ? 'font-semibold text-emerald-600' : 'font-semibold text-amber-600'">
                {{ atelier.published ? 'Publié' : 'Brouillon' }}
              </span>
              <button
                type="button"
                class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#BFDBFE] bg-[#EFF6FF] text-[#216EC2] transition hover:bg-[#DBEAFE] disabled:opacity-50"
                title="Modifier"
                :disabled="actionId === atelier.id"
                @click="openEditForm(atelier)"
              >
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M12 20h9" stroke-linecap="round" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" stroke-linejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#FDE68A] bg-[#FFFBEB] text-[#B45309] transition hover:bg-[#FEF3C7] disabled:opacity-50"
                :title="atelier.published ? 'Dépublier' : 'Publier'"
                :disabled="actionId === atelier.id"
                @click="togglePublish(atelier)"
              >
                <svg v-if="atelier.published" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.02-2.89 2.98-5.18 5.47-6.53" stroke-linecap="round" />
                  <path d="M1 1l22 22" stroke-linecap="round" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c5 0 9.27 3.11 11 8a11.5 11.5 0 0 1-2.16 3.19" stroke-linecap="round" />
                  <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" stroke-linecap="round" />
                </svg>
                <svg v-else class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
              <button
                type="button"
                class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                title="Supprimer"
                :disabled="actionId === atelier.id"
                @click="deleteAtelier(atelier)"
              >
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M3 6h18" stroke-linecap="round" />
                  <path d="M8 6V4h8v2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M19 6l-1 14H6L5 6" stroke-linejoin="round" />
                  <path d="M10 11v6M14 11v6" stroke-linecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </article>
      <p v-if="!filteredAteliers.length" class="col-span-full rounded-xl border-2 border-dashed border-[#216EC2]/30 bg-white px-6 py-12 text-center text-sm text-slate-500">
        Aucun atelier trouvé.
      </p>
    </section>

    <!-- Réservations tab -->
    <section v-else class="overflow-hidden rounded-xl border-2 border-[#216EC2]/30 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[1100px] text-left text-sm">
          <thead>
            <tr class="bg-[#216EC2] text-white">
              <th class="px-4 py-3.5 text-[12px] font-semibold tracking-wide">Reservation ID</th>
              <th class="px-4 py-3.5 text-[12px] font-semibold tracking-wide">Ateliers</th>
              <th class="px-4 py-3.5 text-[12px] font-semibold tracking-wide">Enfants</th>
              <th class="px-4 py-3.5 text-[12px] font-semibold tracking-wide">Parents / contact</th>
              <th class="px-4 py-3.5 text-[12px] font-semibold tracking-wide">Date &amp; Heure</th>
              <th class="px-4 py-3.5 text-[12px] font-semibold tracking-wide">Places</th>
              <th class="px-4 py-3.5 text-[12px] font-semibold tracking-wide">Statut</th>
              <th class="px-4 py-3.5 text-[12px] font-semibold tracking-wide">Réservé le</th>
              <th class="px-4 py-3.5 text-[12px] font-semibold tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#EEF2F7]">
            <tr v-if="!filteredReservations.length">
              <td colspan="9" class="px-4 py-12 text-center text-slate-500">Aucune réservation.</td>
            </tr>
            <tr v-for="row in filteredReservations" :key="row.id" class="bg-white text-slate-700">
              <td class="whitespace-nowrap px-4 py-3.5">
                <span class="inline-flex rounded-md bg-[#E8F1FB] px-2.5 py-1 text-[12px] font-bold text-[#216EC2]">
                  {{ row.code }}
                </span>
              </td>
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-3">
                  <img class="h-11 w-11 rounded-lg object-cover ring-1 ring-[#E2E8F0]" :src="mediaUrl(row.atelierImage)" :alt="row.atelierTitle" />
                  <div class="min-w-0">
                    <p class="truncate text-[13px] font-bold text-slate-900">{{ row.atelierTitle }}</p>
                    <p class="truncate text-[11px] text-slate-400">{{ row.atelierSubtitle }}</p>
                  </div>
                </div>
              </td>
              <td class="whitespace-nowrap px-4 py-3.5">
                <p class="text-[13px] font-bold text-slate-900">{{ row.childName }}</p>
                <p class="text-[11px] text-slate-400">{{ row.childAge }}ans</p>
              </td>
              <td class="px-4 py-3.5">
                <p class="text-[13px] font-bold text-slate-900">{{ row.parentName }}</p>
                <p class="text-[11px] text-slate-400">{{ row.parentPhone }}</p>
              </td>
              <td class="whitespace-nowrap px-4 py-3.5 text-[13px] text-slate-700">{{ row.sessionLabel }}</td>
              <td class="whitespace-nowrap px-4 py-3.5 text-[13px] font-semibold text-slate-800">{{ row.places }}</td>
              <td class="whitespace-nowrap px-4 py-3.5">
                <span class="inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold" :class="statusClass(row.status)">
                  {{ statusLabel(row.status) }}
                </span>
              </td>
              <td class="whitespace-nowrap px-4 py-3.5 text-[12px] text-slate-500">{{ row.reservedAt }}</td>
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#BFDBFE] bg-[#EFF6FF] text-[#216EC2] transition hover:bg-[#DBEAFE]"
                    title="Voir"
                    @click="selectedReservation = row"
                  >
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#BFDBFE] bg-[#EFF6FF] text-[#216EC2] transition hover:bg-[#DBEAFE]"
                    title="Plus"
                  >
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="5" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="12" cy="19" r="1.5" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Popup nouvel atelier -->
    <Teleport to="body">
      <div
        v-if="addOpen"
        class="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-[#216EC2]/25 p-4 backdrop-blur-md supports-[backdrop-filter]:bg-[#216EC2]/20 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="atelier-form-title"
        @click.self="closeForm"
      >
        <form
          class="my-4 w-full max-w-[1100px] space-y-4 rounded-2xl border-2 border-[#216EC2]/25 bg-[#F4F8FC] p-4 shadow-2xl sm:my-8 sm:p-6"
          @submit.prevent="saveAtelier"
        >
          <div class="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <!-- Informations générales -->
            <section class="rounded-xl border-2 border-[#216EC2]/30 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
              <h2 id="atelier-form-title" class="text-lg font-bold text-[#216EC2]">
                {{ editingId ? 'Modifier l’atelier' : 'Informations générale' }}
              </h2>

              <div class="mt-5 space-y-4">
                <div>
                  <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                    Titre de l'atelier <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.title"
                    required
                    type="text"
                    placeholder="Ex: Peinture en famille"
                    class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#216EC2] focus:ring-2 focus:ring-[#216EC2]/15"
                  />
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                    Tranche d'âge <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.ageRange"
                    required
                    class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#216EC2] focus:ring-2 focus:ring-[#216EC2]/15"
                  >
                    <option disabled value="">Sélectionner une tranche d'âge</option>
                    <option v-for="opt in ageRangeOptions" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                    Courte description <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    v-model="form.description"
                    required
                    rows="3"
                    placeholder="Décrivez brièvement l'atelier en une ou deux phrases"
                    class="w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#216EC2] focus:ring-2 focus:ring-[#216EC2]/15"
                  />
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                    Image de l'atelier <span v-if="!editingId" class="text-red-500">*</span>
                  </label>
                  <input
                    ref="imageInput"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    class="sr-only"
                    @change="onImageSelected"
                  />
                  <button
                    type="button"
                    class="flex min-h-[160px] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#216EC2]/50 bg-[#F4F8FC] px-4 py-8 text-center transition hover:border-[#216EC2] hover:bg-[#EAF3FB]"
                    @click="imageInput?.click()"
                  >
                    <template v-if="form.imagePreview">
                      <img class="max-h-36 rounded-lg object-contain" :src="form.imagePreview" alt="Aperçu atelier" />
                      <span class="text-xs font-medium text-[#216EC2]">Cliquer pour changer l'image</span>
                    </template>
                    <template v-else>
                      <span class="flex h-12 w-12 items-center justify-center rounded-full bg-[#216EC2]/10 text-[#216EC2]" aria-hidden="true">
                        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </span>
                      <p class="text-sm font-semibold text-[#216EC2]">Cliquer pour télécharger ou glisser déposer</p>
                      <p class="text-xs text-slate-500">PNG JPG ou WEBP (Max 2MO)</p>
                    </template>
                  </button>
                  <p v-if="imageError" class="mt-2 text-xs font-medium text-red-600">{{ imageError }}</p>
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                    Informations importantes
                  </label>
                  <textarea
                    v-model="form.importantInfo"
                    rows="4"
                    placeholder="Décrivez brièvement l'atelier en une ou deux phrases"
                    class="w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#216EC2] focus:ring-2 focus:ring-[#216EC2]/15"
                  />
                </div>
              </div>
            </section>

            <div class="space-y-5">
              <!-- Informations pratiques -->
              <section class="rounded-xl border-2 border-[#216EC2]/30 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
                <h2 class="text-lg font-bold text-[#216EC2]">Informations pratiques</h2>
                <div class="mt-5 space-y-4">
                  <div>
                    <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                      Date <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <input
                        v-model="form.date"
                        required
                        type="date"
                        class="w-full rounded-xl border border-slate-200 px-3 py-2.5 pr-10 text-sm outline-none transition focus:border-[#216EC2] focus:ring-2 focus:ring-[#216EC2]/15"
                      />
                      <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#216EC2]" aria-hidden="true">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div>
                    <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                      Lieu <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <input
                        v-model="form.location"
                        required
                        type="text"
                        placeholder="Sélectionner un lieu"
                        class="w-full rounded-xl border border-slate-200 px-3 py-2.5 pl-10 text-sm outline-none transition focus:border-[#216EC2] focus:ring-2 focus:ring-[#216EC2]/15"
                      />
                      <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#216EC2]" aria-hidden="true">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M12 21s7-4.6 7-11a7 7 0 1 0-14 0c0 6.4 7 11 7 11Z" />
                          <circle cx="12" cy="10" r="2.5" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div class="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                        Heure de début <span class="text-red-500">*</span>
                      </label>
                      <div class="relative">
                        <input
                          v-model="form.startTime"
                          required
                          type="time"
                          class="w-full rounded-xl border border-slate-200 px-3 py-2.5 pr-10 text-sm outline-none transition focus:border-[#216EC2] focus:ring-2 focus:ring-[#216EC2]/15"
                        />
                        <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#216EC2]" aria-hidden="true">
                          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 7v5l3 2" stroke-linecap="round" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div>
                      <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                        Heure de fin <span class="text-red-500">*</span>
                      </label>
                      <div class="relative">
                        <input
                          v-model="form.endTime"
                          required
                          type="time"
                          class="w-full rounded-xl border border-slate-200 px-3 py-2.5 pr-10 text-sm outline-none transition focus:border-[#216EC2] focus:ring-2 focus:ring-[#216EC2]/15"
                        />
                        <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#216EC2]" aria-hidden="true">
                          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 7v5l3 2" stroke-linecap="round" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                      Âge recommandé <span class="text-red-500">*</span>
                    </label>
                    <select
                      v-model="form.recommendedAge"
                      required
                      class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#216EC2] focus:ring-2 focus:ring-[#216EC2]/15"
                    >
                      <option disabled value="">Sélectionner l'âge recommandé</option>
                      <option v-for="opt in recommendedAgeOptions" :key="opt" :value="opt">{{ opt }}</option>
                    </select>
                  </div>
                </div>
              </section>

              <!-- Places et tarification -->
              <section class="rounded-xl border-2 border-[#216EC2]/30 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
                <h2 class="text-lg font-bold text-[#216EC2]">Places et tarification</h2>
                <div class="mt-5 space-y-4">
                  <div>
                    <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                      Nombre total de places <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model.number="form.capacity"
                      required
                      type="number"
                      min="1"
                      placeholder="Ex: 12"
                      class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#216EC2] focus:ring-2 focus:ring-[#216EC2]/15"
                    />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-semibold text-slate-700">Atelier gratuit</label>
                    <select
                      v-model="form.isFree"
                      class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#216EC2] focus:ring-2 focus:ring-[#216EC2]/15"
                    >
                      <option :value="true">Oui — atelier gratuit</option>
                      <option :value="false">Non — atelier payant</option>
                    </select>
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                      Prix de l'atelier <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="form.price"
                      :required="!form.isFree"
                      :disabled="form.isFree"
                      type="text"
                      placeholder="Ex: 250 000 FCFA"
                      class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#216EC2] focus:ring-2 focus:ring-[#216EC2]/15 disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-end gap-3 pt-1">
            <p v-if="formError" class="mr-auto text-sm font-medium text-red-600">{{ formError }}</p>
            <button
              type="button"
              class="rounded-xl border-2 border-[#216EC2] bg-white px-6 py-2.5 text-sm font-bold text-[#216EC2] transition hover:bg-[#216EC2]/5"
              :disabled="submitting"
              @click="closeForm"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="inline-flex items-center gap-2 rounded-xl bg-[#216EC2] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110 disabled:opacity-60"
              :disabled="submitting"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M12 20h9" stroke-linecap="round" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" stroke-linejoin="round" />
              </svg>
              {{ submitting ? 'Enregistrement…' : editingId ? 'Mettre à jour' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </Teleport>

    <!-- Detail réservation -->
    <Teleport to="body">
      <div
        v-if="selectedReservation"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-[#216EC2]/25 p-4 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        @click.self="selectedReservation = null"
      >
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <h2 class="text-xl font-bold text-[#216EC2]">{{ selectedReservation.code }}</h2>
          <dl class="mt-4 space-y-3 text-sm">
            <div><dt class="text-xs font-semibold text-slate-400">Atelier</dt><dd class="font-medium">{{ selectedReservation.atelierTitle }}</dd></div>
            <div><dt class="text-xs font-semibold text-slate-400">Enfant</dt><dd>{{ selectedReservation.childName }}, {{ selectedReservation.childAge }} ans</dd></div>
            <div><dt class="text-xs font-semibold text-slate-400">Parent</dt><dd>{{ selectedReservation.parentName }} — {{ selectedReservation.parentPhone }}</dd></div>
            <div><dt class="text-xs font-semibold text-slate-400">Session</dt><dd>{{ selectedReservation.sessionLabel }}</dd></div>
            <div><dt class="text-xs font-semibold text-slate-400">Statut</dt><dd>{{ statusLabel(selectedReservation.status) }}</dd></div>
          </dl>
          <div class="mt-6 flex justify-end">
            <button type="button" class="rounded-xl bg-[#216EC2] px-4 py-2.5 text-sm font-bold text-white" @click="selectedReservation = null">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

useHead({ title: 'Gestion des Ateliers' })

type TabKey = 'ateliers' | 'reservations'
type ReservationStatus = 'VALIDEE' | 'EN_ATTENTE' | 'ANNULEE'

type Atelier = {
  id: string
  title: string
  description: string
  importantInfo?: string
  image: string
  dateLabel: string
  dateValue: string
  timeLabel: string
  startTime?: string
  endTime?: string
  location?: string
  ageLabel: string
  ageRange?: string
  recommendedAge?: string
  priceLabel: string
  isFree?: boolean
  capacity: number
  booked: number
  published: boolean
}

type Reservation = {
  id: string
  code: string
  atelierTitle: string
  atelierSubtitle: string
  atelierImage: string
  childName: string
  childAge: number
  parentName: string
  parentPhone: string
  sessionLabel: string
  sessionDate: string
  places: string
  ageRange: string
  status: ReservationStatus
  reservedAt: string
}

type OverviewDto = {
  stats: {
    total: number
    today: number
    validated: number
    pending: number
    cancelled: number
    validatedPct: number
    pendingPct: number
    cancelledPct: number
  }
  ateliers: Atelier[]
  reservations: Reservation[]
}

const { token } = useAuth()
const config = useRuntimeConfig()

const tab = ref<TabKey>('ateliers')
const search = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const sort = ref('date_desc')
const addOpen = ref(false)
const editingId = ref<string | null>(null)
const existingImageUrl = ref('')
const actionId = ref<string | null>(null)
const selectedReservation = ref<Reservation | null>(null)
const imageInput = ref<HTMLInputElement | null>(null)
const imageError = ref('')
const imageFile = ref<File | null>(null)
const formError = ref<string | null>(null)
const submitting = ref(false)
const loading = ref(true)
const loadError = ref<string | null>(null)
const overview = ref<OverviewDto | null>(null)

const ageRangeOptions = ['6-18 mois', '18 mois - 3 ans', '3-4 ans', '4-6 ans', '2 à 6 ans']
const recommendedAgeOptions = ['6 mois+', '18 mois+', '2 ans+', '3 ans+', '4 ans+', 'Tous âges']

const form = reactive({
  title: '',
  ageRange: '',
  description: '',
  importantInfo: '',
  imagePreview: '' as string,
  date: '',
  location: '',
  startTime: '',
  endTime: '',
  recommendedAge: '',
  capacity: 12,
  isFree: true,
  price: '',
})

function authHeaders() {
  const t = token.value
  if (!t) throw new Error('Session expirée. Reconnectez-vous.')
  return { Authorization: `Bearer ${t}` }
}

function mediaUrl(url: string) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url
  const base = String(config.public.apiBase ?? '').replace(/\/api\/?$/, '')
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`
}

function resetForm() {
  form.title = ''
  form.ageRange = ''
  form.description = ''
  form.importantInfo = ''
  form.imagePreview = ''
  form.date = ''
  form.location = ''
  form.startTime = ''
  form.endTime = ''
  form.recommendedAge = ''
  form.capacity = 12
  form.isFree = true
  form.price = ''
  imageError.value = ''
  imageFile.value = null
  formError.value = null
  editingId.value = null
  existingImageUrl.value = ''
  if (imageInput.value) imageInput.value.value = ''
}

function openCreateForm() {
  resetForm()
  addOpen.value = true
}

function openEditForm(atelier: Atelier) {
  resetForm()
  editingId.value = atelier.id
  existingImageUrl.value = atelier.image
  form.title = atelier.title
  form.ageRange = atelier.ageRange || atelier.ageLabel || ''
  form.description = atelier.description
  form.importantInfo = atelier.importantInfo || ''
  form.imagePreview = mediaUrl(atelier.image)
  form.date = atelier.dateValue
  form.location = atelier.location || ''
  form.startTime = atelier.startTime || ''
  form.endTime = atelier.endTime || ''
  form.recommendedAge = atelier.recommendedAge || ''
  form.capacity = atelier.capacity
  form.isFree = atelier.isFree ?? atelier.priceLabel === 'Gratuit'
  form.price = form.isFree ? '' : atelier.priceLabel === '—' ? '' : atelier.priceLabel
  addOpen.value = true
}

function closeForm() {
  if (submitting.value) return
  addOpen.value = false
  resetForm()
}

function onImageSelected(event: Event) {
  imageError.value = ''
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const okType = ['image/png', 'image/jpeg', 'image/webp'].includes(file.type)
  if (!okType) {
    imageError.value = 'Format non supporté. Utilisez PNG, JPG ou WEBP.'
    imageFile.value = null
    input.value = ''
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    imageError.value = 'Image trop lourde (max 2 Mo).'
    imageFile.value = null
    input.value = ''
    return
  }
  imageFile.value = file
  const reader = new FileReader()
  reader.onload = () => {
    form.imagePreview = String(reader.result ?? '')
  }
  reader.readAsDataURL(file)
}

watch(
  () => form.isFree,
  (free) => {
    if (free) form.price = ''
  },
)

async function loadOverview() {
  loadError.value = null
  loading.value = true
  try {
    const t = token.value
    if (!t) throw new Error('Session expirée. Reconnectez-vous.')
    overview.value = await $fetch<OverviewDto>(`${config.public.apiBase}/admin/ateliers`, {
      headers: { Authorization: `Bearer ${t}` },
    })
  } catch (e: unknown) {
    const err = e as { data?: { message?: string | string[] }; message?: string }
    const msg = err?.data?.message
    loadError.value = Array.isArray(msg) ? msg.join(', ') : msg || err?.message || 'Impossible de charger les ateliers.'
  } finally {
    loading.value = false
  }
}

const ateliers = computed(() => overview.value?.ateliers ?? [])
const reservations = computed(() => overview.value?.reservations ?? [])

const stats = computed(() => {
  const s = overview.value?.stats
  return {
    total: s?.total ?? 0,
    today: s?.today ?? 0,
    validated: s?.validated ?? 0,
    pending: s?.pending ?? 0,
    cancelled: s?.cancelled ?? 0,
    pct: (n: number) => {
      const total = s?.total ?? 0
      return total ? Math.round((n / total) * 100) : 0
    },
  }
})

const statCards = computed(() => [
  {
    key: 'total',
    title: 'Réservations totales',
    value: String(stats.value.total),
    hint: 'Toutes périodes',
    iconBg: 'bg-violet-100 text-violet-600',
    icon: `<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  },
  {
    key: 'today',
    title: "Aujourd'hui",
    value: String(stats.value.today),
    hint: 'Réservations',
    iconBg: 'bg-emerald-100 text-emerald-600',
    icon: `<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M12 14v4M10 16h4"/></svg>`,
  },
  {
    key: 'validated',
    title: 'Validées',
    value: String(stats.value.validated),
    hint: `${stats.value.pct(stats.value.validated)}% des réservations`,
    iconBg: 'bg-sky-100 text-sky-600',
    icon: `<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/></svg>`,
  },
  {
    key: 'pending',
    title: 'En attentes',
    value: String(stats.value.pending),
    hint: `${stats.value.pct(stats.value.pending)}% des réservations`,
    iconBg: 'bg-orange-100 text-orange-600',
    icon: `<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
  },
  {
    key: 'cancelled',
    title: 'Annulées',
    value: String(stats.value.cancelled),
    hint: `${stats.value.pct(stats.value.cancelled)}% des réservations`,
    iconBg: 'bg-amber-100 text-amber-600',
    icon: `<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>`,
  },
])

function matchesSearch(text: string) {
  const q = search.value.trim().toLowerCase()
  if (!q) return true
  return text.toLowerCase().includes(q)
}

function inDateRange(value: string) {
  if (dateFrom.value && value < dateFrom.value) return false
  if (dateTo.value && value > dateTo.value) return false
  return true
}

const filteredAteliers = computed(() => {
  let list = ateliers.value.filter(
    (a) => matchesSearch(`${a.title} ${a.description}`) && inDateRange(a.dateValue),
  )
  if (sort.value === 'name_asc') list = [...list].sort((a, b) => a.title.localeCompare(b.title, 'fr'))
  else if (sort.value === 'date_asc') list = [...list].sort((a, b) => a.dateValue.localeCompare(b.dateValue))
  else list = [...list].sort((a, b) => b.dateValue.localeCompare(a.dateValue))
  return list
})

const filteredReservations = computed(() => {
  let list = reservations.value.filter(
    (r) =>
      matchesSearch(`${r.code} ${r.atelierTitle} ${r.childName} ${r.parentName}`) &&
      inDateRange(r.sessionDate),
  )
  if (sort.value === 'name_asc') list = [...list].sort((a, b) => a.atelierTitle.localeCompare(b.atelierTitle, 'fr'))
  else if (sort.value === 'date_asc') list = [...list].sort((a, b) => a.sessionDate.localeCompare(b.sessionDate))
  else if (sort.value === 'status') list = [...list].sort((a, b) => a.status.localeCompare(b.status))
  else list = [...list].sort((a, b) => b.sessionDate.localeCompare(a.sessionDate))
  return list
})

function statusLabel(status: ReservationStatus) {
  if (status === 'VALIDEE') return 'Validée'
  if (status === 'EN_ATTENTE') return 'En attente'
  return 'Annulée'
}

function statusClass(status: ReservationStatus) {
  if (status === 'VALIDEE') return 'bg-emerald-50 text-emerald-700'
  if (status === 'EN_ATTENTE') return 'bg-orange-50 text-orange-700'
  return 'bg-slate-100 text-slate-600'
}

function apiErrorMessage(e: unknown, fallback: string) {
  const err = e as { data?: { message?: string | string[] }; message?: string }
  const msg = err?.data?.message
  if (Array.isArray(msg)) return msg.join(', ')
  return msg || err?.message || fallback
}

async function saveAtelier() {
  formError.value = null
  imageError.value = ''
  const hasImage = Boolean(imageFile.value || existingImageUrl.value || form.imagePreview)
  if (!hasImage) {
    imageError.value = "L'image de l'atelier est obligatoire."
    return
  }
  if (!form.title.trim() || !form.description.trim()) {
    formError.value = 'Complétez le titre et la description.'
    return
  }
  if (!form.date || !form.startTime || !form.endTime || !form.location.trim()) {
    formError.value = 'Complétez la date, les horaires et le lieu.'
    return
  }
  if (!form.ageRange || !form.recommendedAge) {
    formError.value = "Sélectionnez la tranche d'âge et l'âge recommandé."
    return
  }
  if (!form.isFree && !form.price.trim()) {
    formError.value = "Indiquez le prix de l'atelier."
    return
  }

  submitting.value = true
  try {
    let imageUrl = existingImageUrl.value
    if (imageFile.value) {
      const fd = new FormData()
      fd.append('file', imageFile.value)
      const up = await $fetch<{ url: string }>(`${config.public.apiBase}/admin/ateliers/upload`, {
        method: 'POST',
        headers: authHeaders(),
        body: fd,
      })
      imageUrl = up.url
    }
    if (!imageUrl) {
      imageError.value = "L'image de l'atelier est obligatoire."
      return
    }

    const body = {
      title: form.title.trim(),
      description: form.description.trim(),
      importantInfo: form.importantInfo.trim() || undefined,
      imageUrl,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      location: form.location.trim(),
      ageRange: form.ageRange,
      recommendedAge: form.recommendedAge,
      capacity: Number(form.capacity) || 1,
      isFree: form.isFree,
      price: form.isFree ? undefined : form.price.trim(),
      published: editingId.value ? undefined : true,
    }

    if (editingId.value) {
      await $fetch(`${config.public.apiBase}/admin/ateliers/${editingId.value}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body,
      })
    } else {
      await $fetch(`${config.public.apiBase}/admin/ateliers`, {
        method: 'POST',
        headers: authHeaders(),
        body: { ...body, published: true },
      })
    }

    submitting.value = false
    closeForm()
    tab.value = 'ateliers'
    await loadOverview()
  } catch (e: unknown) {
    formError.value = apiErrorMessage(e, "Impossible d'enregistrer l'atelier.")
  } finally {
    submitting.value = false
  }
}

async function togglePublish(atelier: Atelier) {
  actionId.value = atelier.id
  loadError.value = null
  try {
    await $fetch(`${config.public.apiBase}/admin/ateliers/${atelier.id}/publish`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: { published: !atelier.published },
    })
    await loadOverview()
  } catch (e: unknown) {
    loadError.value = apiErrorMessage(e, "Impossible de mettre à jour la publication.")
  } finally {
    actionId.value = null
  }
}

async function deleteAtelier(atelier: Atelier) {
  if (!confirm(`Supprimer l'atelier « ${atelier.title} » ? Cette action est irréversible.`)) return
  actionId.value = atelier.id
  loadError.value = null
  try {
    await $fetch(`${config.public.apiBase}/admin/ateliers/${atelier.id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    await loadOverview()
  } catch (e: unknown) {
    loadError.value = apiErrorMessage(e, "Impossible de supprimer l'atelier.")
  } finally {
    actionId.value = null
  }
}

onMounted(() => {
  void loadOverview()
})
</script>
