import { checkAdminAccessToken } from '~/utils/admin-token'

export type AdminLoginResult =
  | { ok: true }
  | { ok: false; message: string }

/**
 * Auth réservée à l’espace admin : cookies `admin_long` / `admin_sess`.
 * `isAuthenticated` = jeton présent, non expiré, rôle ADMIN ou STAFF (pas un JWT parent).
 */
export function useAuth() {
  const long = useCookie<string | null>('admin_long', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    path: '/',
    default: () => null,
  })
  const sess = useCookie<string | null>('admin_sess', {
    sameSite: 'lax',
    path: '/',
    default: () => null,
  })

  const token = computed(() => long.value ?? sess.value)
  const isAuthenticated = computed(() => checkAdminAccessToken(token.value).ok)

  async function login(email: string, password: string, remember: boolean): Promise<AdminLoginResult> {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed || !password) {
      return { ok: false, message: 'Email et mot de passe requis.' }
    }

    const config = useRuntimeConfig()
    try {
      const res = await $fetch<{ accessToken: string }>(`${config.public.apiBase}/auth/admin/login`, {
        method: 'POST',
        body: { email: trimmed, password },
      })
      long.value = null
      sess.value = null
      if (remember) {
        long.value = res.accessToken
      } else {
        sess.value = res.accessToken
      }
      return { ok: true }
    } catch (e: unknown) {
      const err = e as { data?: { message?: string | string[] }; statusMessage?: string }
      const raw = err?.data?.message
      const msg =
        typeof raw === 'string'
          ? raw
          : Array.isArray(raw)
            ? raw[0]
            : err?.statusMessage ?? 'Identifiants incorrects.'
      return { ok: false, message: msg }
    }
  }

  function logout() {
    long.value = null
    sess.value = null
  }

  return {
    token,
    isAuthenticated,
    login,
    logout,
  }
}
