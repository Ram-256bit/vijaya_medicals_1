"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { login } from "@/utils/auth"

export default function Login({ setAuth }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    if (true) {
      setAuth(true)
      navigate("/")
    } else {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#1a1a1a] relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent transform rotate-12"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/50 via-transparent to-transparent"></div>

      {/* Logo */}
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 text-orange-500">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-white text-2xl font-bold">Vijaya Medicals</span>
      </div>

      {/* Main content */}
      <div className="container mx-auto min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-[1000px] grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side */}
          <div className="text-white space-y-4">
            <h1 className="text-5xl font-bold">Login</h1>
            <p className="text-gray-400 text-lg">Sign in to continue</p>
          </div>

          {/* Right side - Login form */}
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-white mb-8">Sign in</h2>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-300 uppercase tracking-wider">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/10 border-transparent text-white placeholder:text-gray-400"
                    placeholder="hello@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300 uppercase tracking-wider">Password</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white/10 border-transparent text-white placeholder:text-gray-400"
                    placeholder="Enter your password"
                  />
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-colors"
                >
                  Login
                </Button>
              </form>
              <p className="text-center text-gray-400">
                Don't have an account?{" "}
                <Link to="/signup" className="text-orange-500 hover:text-orange-400">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

