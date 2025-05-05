"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Printer, Calendar, User, Phone } from "lucide-react"

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders")
        if (!res.ok) throw new Error("Failed to fetch orders")
        const data = await res.json()
        setOrders(data)
      } catch (err) {
        console.error("Error fetching orders:", err)
      }
    }

    fetchOrders()
  }, [])

  const formatDate = (dateString, format) => {
    const date = new Date(dateString)
    if (format === "yyyy-MM-dd") {
      return date.toISOString().split("T")[0]
    }
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toString().includes(searchTerm)

    const matchesDate = dateFilter ? formatDate(order.date, "yyyy-MM-dd") === dateFilter : true

    return matchesSearch && matchesDate
  })

  const handleViewDetails = (order) => {
    setSelectedOrder(order)
    setIsDetailsOpen(true)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <Card className="bg-gray-800 border border-gray-700 shadow-md">
        <CardHeader className="border-b border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-2xl font-bold text-white">Orders History</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by customer or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Order ID</TableHead>
                  <TableHead className="text-gray-300">Customer</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300 text-right">Items</TableHead>
                  <TableHead className="text-gray-300 text-right">Total</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow className="border-gray-700">
                    <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order._id} className="border-gray-700">
                      <TableCell className="font-medium text-white">#{order._id}</TableCell>
                      <TableCell className="text-gray-300">{order.customer.name}</TableCell>
                      <TableCell className="text-gray-300">{formatDate(order.date)}</TableCell>
                      <TableCell className="text-right text-gray-300">{order.items.length}</TableCell>
                      <TableCell className="text-right font-medium text-white">₹{order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600 text-white">{order.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-400 hover:text-blue-300 hover:bg-gray-700"
                          onClick={() => handleViewDetails(order)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="bg-gray-800 text-white border border-gray-700 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Order Details - #{selectedOrder?._id}</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-gray-300">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Date: {formatDate(selectedOrder.date)}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <User className="h-4 w-4 mr-2" />
                    <span>Customer: {selectedOrder.customer.name}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>Phone: {selectedOrder.customer.phone}</span>
                  </div>
                </div>
                <div className="space-y-2 md:text-right">
                  <div className="text-gray-300">
                    <span>Subtotal: ₹{selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="text-gray-300">
                    <span>Tax: ₹{selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="text-xl font-bold text-white">
                    <span>Total: ₹{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h3 className="font-medium text-white mb-2">Order Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Item</TableHead>
                      <TableHead className="text-gray-300 text-right">Price</TableHead>
                      <TableHead className="text-gray-300 text-right">Quantity</TableHead>
                      <TableHead className="text-gray-300 text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item) => (
                      <TableRow key={item._id} className="border-gray-700">
                        <TableCell className="text-white">{item.name}</TableCell>
                        <TableCell className="text-right text-gray-300">₹{item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right text-gray-300">{item.quantity}</TableCell>
                        <TableCell className="text-right text-white">₹{item.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  onClick={handlePrint}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print Receipt
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

