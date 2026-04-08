export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith('/parent')) return;
  if (to.path === '/parent/login') return;

  const legacy = useCookie<string | null>('parent_jwt');
  const sess = useCookie<string | null>('parent_sess');
  const long = useCookie<string | null>('parent_long');
  if (!legacy.value && !sess.value && !long.value) {
    return navigateTo('/parent/login');
  }
});
