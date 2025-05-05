"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import { Sidebar } from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"
import ExpiredMedicines from "./pages/ExpiredMedicines"
import Discounts from "./pages/Discounts"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import { isAuthenticated } from "./utils/auth"
import { Toaster } from "@/components/ui/toaster"
import OutOfStock from "./pages/OutOfStock"
import Settings from "./pages/Settings"
import Inventory from "./pages/Inventory"
import PointOfSale from "./pages/PointOfSale"
import Orders from "./pages/Orders"

function App() {
  const [auth, setAuth] = useState(isAuthenticated())
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      setAuth(isAuthenticated())
    }

    window.addEventListener("storage", checkAuth)
    return () => window.removeEventListener("storage", checkAuth)
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* {auth && <Navbar setSidebarOpen={setSidebarOpen} setAuth={setAuth} />} */}
        <div className="flex flex-1">
          {auth && <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} setAuth={setAuth} />}
          <div className={`flex-1 ${auth ? "lg:ml-64" : ""} transition-all duration-200 ease-in-out`}>
            <Routes>
              <Route path="/login" element={auth ? <Navigate to="/" replace /> : <Login setAuth={setAuth} />} />
              <Route path="/signup" element={auth ? <Navigate to="/" replace /> : <Signup setAuth={setAuth} />} />
              <Route
                path="/"
                element={
                  auth ? (
                    <Dashboard sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setAuth={setAuth} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/expired-medicines"
                element={auth ? <ExpiredMedicines /> : <Navigate to="/login" replace />}
              />
              <Route path="/discounts" element={auth ? <Discounts /> : <Navigate to="/login" replace />} />
              {/* <Route path="/out-of-stock" element={auth ? <OutOfStock /> : <Navigate to="/login" replace />} /> */}
              <Route path="/settings" element={auth ? <Settings /> : <Navigate to="/login" replace />} />
              <Route path="/inventory" element={auth ? <Inventory /> : <Navigate to="/login" replace />} />
              {/* <Route path="/notifications" element={auth ? <Notifications /> : <Navigate to="/login" replace />} /> */}
              <Route path="/pos" element={auth ? <PointOfSale /> : <Navigate to="/login" replace />} />
              <Route path="/orders" element={auth ? <Orders /> : <Navigate to="/login" replace />} />
            </Routes>
          </div>
        </div>
      </div>
      <Toaster />
    </Router>
  )
}

export default App

