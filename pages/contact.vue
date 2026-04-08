<template>
  <div class="w-full bg-white">
    <section class="w-full bg-white py-14">
      <RevealSection extra-class="mx-auto w-full max-w-[980px] px-6">
        <div class="text-center">
          <h1 class="text-[28px] font-extrabold tracking-tight text-brandBlue">Contactez&nbsp; Commonwealth School</h1>
          <p class="mx-auto mt-4 max-w-[760px] text-sm leading-6 text-slate-500">
            Yorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
            Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
          </p>
        </div>

        <div class="mt-10 rounded-3xl bg-brandBlue p-10 shadow-[0_22px_60px_rgba(2,6,23,0.16)]">
          <div class="grid grid-cols-1 gap-10 lg:grid-cols-[360px_1fr]">
            <div class="text-white">
              <div class="text-xl font-extrabold">Contactez–Nous</div>
              <p class="mt-2 text-xs leading-5 text-white/80">
                Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
              </p>

              <form class="mt-7 space-y-4" @submit.prevent="onSubmit">
                <div>
                  <label class="mb-2 block text-[11px] font-semibold text-white/90">Noms &amp; Prénoms</label>
                  <input
                    v-model.trim="form.fullName"
                    class="h-10 w-full rounded-lg border border-white/25 bg-white/10 px-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/50"
                    placeholder=""
                    type="text"
                  />
                </div>

                <div>
                  <label class="mb-2 block text-[11px] font-semibold text-white/90">E-mail</label>
                  <input
                    v-model.trim="form.email"
                    class="h-10 w-full rounded-lg border border-white/25 bg-white/10 px-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/50"
                    placeholder=""
                    type="email"
                  />
                </div>

                <div>
                  <label class="mb-2 block text-[11px] font-semibold text-white/90">Numéro de Téléphone</label>
                  <input
                    v-model.trim="form.phone"
                    class="h-10 w-full rounded-lg border border-white/25 bg-white/10 px-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/50"
                    placeholder=""
                    type="tel"
                  />
                </div>

                <div>
                  <label class="mb-2 block text-[11px] font-semibold text-white/90">Numéro de Téléphone</label>
                  <textarea
                    v-model.trim="form.message"
                    class="min-h-[96px] w-full resize-none rounded-lg border border-white/25 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/50"
                    placeholder="Votre message ici"
                  />
                </div>

                <button
                  class="mt-2 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-brandOrange px-6 text-[12px] font-semibold text-white hover:brightness-95"
                  type="submit"
                >
                  <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
                    <path
                      d="M22 2 11 13"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M22 2 15 22l-4-9-9-4 20-7Z"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Envoyer le message
                </button>
              </form>
            </div>

            <div class="relative min-h-[420px] overflow-hidden rounded-2xl bg-white/10">
              <img class="absolute inset-0 h-full w-full object-cover" src="/assets/images/contact.png" alt="Contact" loading="lazy" />
            </div>
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
  title: 'Contact',
});

const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  message: '',
});

const onSubmit = () => {
  // Placeholder: later we will POST to backend
  // eslint-disable-next-line no-console
  console.log('contact_submit', JSON.parse(JSON.stringify(form)));
};
</script>

