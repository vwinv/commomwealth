export function useAuth() {
  const token = useState<string | null>('auth_token', () => null)

  return {
    token,
    isAuthenticated: computed(() => Boolean(token.value)),
    login(username: string, password: string) {
      // Front-only scaffold: replace with real API call later.
      if (!username || !password) return false
      token.value = `${username}:${Date.now()}`
      return true
    },
    logout() {
      token.value = null
    }
  }
}

