const AUTH_TOKEN_KEY = "auth_token"

export const login = (email, password) => {
  // In a real app, you would validate credentials with a backend
  if (email === "a@a.com" && password === "a") {
    const token = "fake_jwt_token"
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    return true
  }
  return false
}

export const logout = () => {
  // Implement logout logic here, e.g., clearing local storage, cookies, etc.
  localStorage.removeItem(AUTH_TOKEN_KEY)
  console.log("Logging out")
}

export const isAuthenticated = () => {
  return !!localStorage.getItem(AUTH_TOKEN_KEY)
}

// Add this new function
export const signup = (name, email, password) => {
  // In a real app, you would send this data to your backend
  console.log("Signing up:", { name, email, password })
  // For now, let's just simulate a successful signup
  return true
}