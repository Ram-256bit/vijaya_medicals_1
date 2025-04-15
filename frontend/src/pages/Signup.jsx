"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signup } from "@/utils/auth"

export default function Signup({ setAuth }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSignup = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (signup(formData.name, formData.email, formData.password)) {
      setAuth(true)
      navigate("/")
    } else {
      setError("Signup failed. Please try again.")
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
            <h1 className="text-5xl font-bold leading-tight">
              Create
              <br />
              New Account
            </h1>
            <p className="text-gray-400 text-lg">
              Already Registered?{" "}
              <Link to="/login" className="text-orange-500 hover:text-orange-400">
                Login
              </Link>
            </p>
          </div>

          {/* Right side - Signup form */}
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-white mb-8">Sign Up</h2>
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-300 uppercase tracking-wider">Name</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/10 border-transparent text-white placeholder:text-gray-400"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300 uppercase tracking-wider">Email</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/10 border-transparent text-white placeholder:text-gray-400"
                    placeholder="hello@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300 uppercase tracking-wider">Password</label>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/10 border-transparent text-white placeholder:text-gray-400"
                    placeholder="Create a password"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300 uppercase tracking-wider">Confirm Password</label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/10 border-transparent text-white placeholder:text-gray-400"
                    placeholder="Confirm your password"
                  />
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </Button>
              </form>
              <div className="text-center">
                <Button
                  variant="link"
                  className="text-orange-500 hover:text-orange-400"
                  onClick={() => navigate("/login")}
                >
                  Already have an account? Login
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

