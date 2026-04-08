const SESS_MAX = 60 * 60 * 24 * 2;
const LONG_MAX = 60 * 60 * 24 * 30;

export function useParentAuth() {
  const config = useRuntimeConfig();

  const legacy = useCookie<string | null>('parent_jwt');
  const tokenSession = useCookie<string | null>('parent_sess', {
    maxAge: SESS_MAX,
    path: '/',
    sameSite: 'lax',
  });
  const tokenLong = useCookie<string | null>('parent_long', {
    maxAge: LONG_MAX,
    path: '/',
    sameSite: 'lax',
  });

  const activeToken = computed(
    () => tokenLong.value || tokenSession.value || legacy.value || null,
  );

  const isLoggedIn = computed(() => Boolean(activeToken.value?.length));

  async function login(email: string, password: string, rememberMe = false) {
    const res = await $fetch<{
      accessToken: string;
      user: { id: string; email: string; fullName: string | null; phone: string | null };
    }>(`${config.public.apiBase}/auth/parent/login`, {
      method: 'POST',
      body: { email, password },
    });

    legacy.value = null;
    if (rememberMe) {
      tokenLong.value = res.accessToken;
      tokenSession.value = null;
    } else {
      tokenSession.value = res.accessToken;
      tokenLong.value = null;
    }
    return res;
  }

  function logout() {
    legacy.value = null;
    tokenSession.value = null;
    tokenLong.value = null;
  }

  function authHeaders(): HeadersInit {
    const t = activeToken.value;
    if (!t) return {};
    return { Authorization: `Bearer ${t}` };
  }

  function authFetch<T>(
    path: string,
    opts: { method?: 'GET' | 'POST' | 'PATCH'; body?: Record<string, unknown> } = {},
  ) {
    const t = activeToken.value;
    return $fetch<T>(`${config.public.apiBase}${path}`, {
      method: opts.method ?? 'GET',
      headers: t ? { Authorization: `Bearer ${t}` } : {},
      body: opts.body,
    });
  }

  return { token: activeToken, isLoggedIn, login, logout, authHeaders, authFetch };
}
