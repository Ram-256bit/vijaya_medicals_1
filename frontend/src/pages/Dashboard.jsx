"use client"

import { useEffect, useState } from "react"
import {
  Bell, Search, Menu, Check, User, Settings, LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { logout } from "@/utils/auth"
import axios from "axios"

const initialNotifications = [
  {
    id: 1,
    type: "expired",
    title: "Medicines Expiring Soon",
    description: "Some medicines will expire within the next 30 days.",
    time: "1 day ago",
    read: false,
    link: "/expired-medicines",
  },
  {
    id: 2,
    type: "discount",
    title: "New Discount Available",
    description: "Check the latest discounted items.",
    time: "2 days ago",
    read: true,
    link: "/discounts",
  },
  {
    id: 3,
    type: "preOrder",
    title: "Low Stock Alert",
    description: "Some medicines are running low. Reorder now.",
    time: "3 hours ago",
    read: false,
    link: "/out-of-stock",
  },
]

export default function Dashboard({ sidebarOpen, setSidebarOpen, setAuth }) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [dashboardData, setDashboardData] = useState({
    totalDiscounts: 0,
    totalExpired: 0,
    totalRefunded: 0,
    expiringMedicines: [],
  })

  const navigate = useNavigate()
  const userName = "John Doe"
  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    axios.get("http://localhost:5000/api/dashboard")
      .then((res) => {
        console.log("Dashboard API response:", res.data) // ← ADD THIS
        setDashboardData(res.data)
      })
      .catch((err) => console.error("Dashboard fetch error:", err))
  }, [])

  const handleNotificationClick = (notification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    )
    navigate(notification.link)
    setIsDropdownOpen(false)
  }

  const markAllAsRead = (e) => {
    e.stopPropagation()
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleLogout = () => {
    logout()
    setAuth(false)
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "expired":
        return <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
      case "discount":
        return <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
      case "preOrder":
        return <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
      default:
        return <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
    }
  }

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-300 hover:text-white hover:bg-gray-700"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Vijaya Medicals</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="search"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
            />
          </div>

          {/* Notification Dropdown */}
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-gray-300 hover:text-white hover:bg-gray-700">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    {unreadCount}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-gray-900 text-white border-gray-800">
              <div className="flex items-center justify-between p-2 border-b border-gray-800">
                <h3 className="font-medium text-gray-200">Notifications</h3>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs flex items-center gap-1 text-gray-300 hover:text-white hover:bg-gray-800"
                    onClick={markAllAsRead}
                  >
                    <Check className="h-3 w-3" />
                    Mark all as read
                  </Button>
                )}
              </div>
              <DropdownMenuSeparator className="bg-gray-800" />
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">No notifications</div>
                ) : (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={cn(
                        "flex flex-col items-start p-3 cursor-pointer hover:bg-gray-800",
                        !notification.read && "bg-gray-800",
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-center w-full">
                        {getNotificationIcon(notification.type)}
                        <span className="font-medium text-white">{notification.title}</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1 ml-4">{notification.description}</p>
                      <span className="text-xs text-gray-500 mt-1 ml-4">{notification.time}</span>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem
                className="justify-center text-center text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={() => {
                  navigate("/notifications")
                  setIsDropdownOpen(false)
                }}
              >
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Dropdown */}
          <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src="https://tse1.mm.bing.net/th?id=OIP.gMjkn2JkqfWi6CcI1JESnAHaIp&pid=Api&P=0&w=300&h=300" />
                <AvatarFallback>Al-M</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-gray-900 text-white border-gray-800">
              <div className="p-3 border-b border-gray-800">
                <div className="font-medium text-white">Welcome!</div>
                <div className="text-sm text-gray-400">{userName}</div>
              </div>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem className="p-3 cursor-pointer hover:bg-gray-800 flex items-center gap-2" onClick={() => navigate("/settings")}>
                <User className="h-4 w-4 text-gray-400" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 cursor-pointer hover:bg-gray-800 flex items-center gap-2" onClick={() => navigate("/settings")}>
                <Settings className="h-4 w-4 text-gray-400" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem
                className="p-3 cursor-pointer hover:bg-gray-800 flex items-center gap-2 text-red-400 hover:text-red-300"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gray-800 border border-gray-700 shadow-md">
          <CardHeader className="pb-2 border-b border-gray-700">
            <CardTitle className="text-sm font-medium text-yellow-400">Discounts</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-4xl font-bold text-white">{dashboardData.totalDiscounts}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border border-gray-700 shadow-md">
          <CardHeader className="pb-2 border-b border-gray-700">
            <CardTitle className="text-sm font-medium text-blue-400">Expired!</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-4xl font-bold text-white">{dashboardData.totalExpired}</div>
          </CardContent>
        </Card>

        {/* <Card className="bg-gray-800 border border-gray-700 shadow-md"> */}
        {/*   <CardHeader className="pb-2 border-b border-gray-700"> */}
        {/*     <CardTitle className="text-sm font-medium text-red-400">Refunded</CardTitle> */}
        {/*   </CardHeader> */}
        {/*   <CardContent className="pt-4"> */}
        {/*     <div className="text-4xl font-bold text-white">{dashboardData.totalRefunded}</div> */}
        {/*   </CardContent> */}
        {/* </Card> */}
      </div>

      {/* Expiring Soon Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border border-gray-700 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-700">
            <CardTitle className="text-white">Expire Date Notification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {dashboardData?.expiringMedicines?.length > 0 ? (
              dashboardData.expiringMedicines.map((medicine) => (
                <div key={medicine._id} className="bg-gray-700 text-white p-4 rounded-lg border border-gray-600">
                  <p>Name: {medicine.name}</p>
                  {/* <p>Date: {medicine.expireDate}</p> */}
                </div>
              ))
            ) : (
              <p className="text-gray-400">No expiring medicines found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
