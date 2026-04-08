import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  compatibilityDate: '2026-04-07',
  devtools: { enabled: true },
  /** Un seul port pour le dev : évite de croire que le site est sur 3000 alors que Nuxt a basculé sur 3002+. */
  devServer: {
    port: 3000,
    host: 'localhost',
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'fr', language: 'fr-FR', name: 'Français', file: 'fr.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    lazy: true,
    /** Relatif au dossier `i18n/` (convention du module v9). */
    langDir: 'locales',
    defaultLocale: 'fr',
    strategy: 'no_prefix',
    bundle: {
      optimizeTranslationDirective: false,
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      cookieSecure: false,
      fallbackLocale: 'fr',
    },
  },
  css: ['~/assets/css/tailwind.css'],
  /** Désactivé explicitement : évite l’import virtuel `#app-manifest` côté runtime. */
  experimental: {
    appManifest: false,
  },
  runtimeConfig: {
    public: {
      // API Nest (voir backend `PORT`, défaut 3001 — Nuxt utilise souvent 3000)
      apiBase: 'http://localhost:3001/api',
    },
  },
  vite: {
    server: {
      /** Si 3000 est pris, échoue clairement au lieu de changer de port (source de confusion / « boucle »). */
      strictPort: true,
      port: 3000,
      /**
       * Moins de watchers = moins de risque EMFILE sur macOS (sinon Nuxt redémarre en boucle).
       * node_modules est déjà ignoré en pratique ; on explicite les gros dossiers du repo.
       */
      watch: {
        ignored: ['**/node_modules/**', '**/.git/**', '**/.output/**', '**/dist/**'],
      },
    },
    resolve: {
      alias: {
        // Vite analyse quand même `import("#app-manifest")` dans nuxt/dist ; le stub évite l’erreur en dev.
        '#app-manifest': join(__dirname, 'stubs/app-manifest.mjs'),
      },
    },
  },
  app: {
    head: {
      title: 'Gestion scolaire',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }]
    }
  }
})

