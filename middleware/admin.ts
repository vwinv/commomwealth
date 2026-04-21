import { checkAdminAccessToken } from '~/utils/admin-token'

export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith('/admin')) return
  if (to.path === '/admin/login') return

  const auth = useAuth()
  const raw = auth.token.value
  const check = checkAdminAccessToken(raw)

  if (!check.ok) {
    auth.logout()
    return navigateTo('/admin/login')
  }
})
