const AUTH_TOKEN_KEY = "auth_token"
const API_URL = "http://localhost:5000/api"

export const login = async (email, password) => {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (res.ok) {
      localStorage.setItem(AUTH_TOKEN_KEY, data.token)
      return true
    } else {
      console.error(data.error)
      return false
    }
  } catch (err) {
    console.error("Login error:", err)
    return false
  }
}

export const signup = async (name, email, password) => {
  try {
    const res = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    })
    const data = await res.json()
    if (res.ok) {
      return true
    } else {
      console.error(data.error)
      return false
    }
  } catch (err) {
    console.error("Signup error:", err)
    return false
  }
}

export const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export const isAuthenticated = () => {
  return !!localStorage.getItem(AUTH_TOKEN_KEY)
}
