"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Search, ShoppingCart, Plus, Minus, Trash2, Printer, Save } from "lucide-react"
import { useNavigate } from "react-router-dom"

// Fetch medicines from the server
export default function PointOfSale() {
  const [searchTerm, setSearchTerm] = useState("")
  const [medicines, setMedicines] = useState([])
  const [cart, setCart] = useState([])
  const [tax, setTax] = useState(0)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const { toast } = useToast()
  const navigate = useNavigate()

  // Fetch medicines data from the backend when component mounts
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/inventory")
        if (!response.ok) {
          throw new Error(`Failed to fetch medicines, status: ${response.status}`)
        }
        const data = await response.json()
        setMedicines(data)
      } catch (err) {
        console.error("Error fetching medicines:", err)
        toast({
          title: "Error",
          description: "Failed to load medicines data.",
          variant: "destructive",
        })
      }
    }

    fetchMedicines()
  }, []) // Empty dependency array ensures this runs only once when the component mounts

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addToCart = (medicine) => {
    const existingItem = cart.find((item) => item.id === medicine._id)

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item._id === medicine._id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item,
        ),
      )
    } else {
      setCart([
        ...cart,
        {
          ...medicine,
          quantity: 1,
          total: medicine.price,
        },
      ])
    }

    toast({
      title: "Added to bill",
      description: `${medicine.name} added to the bill.`,
    })
  }

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return

    setCart(
      cart.map((item) => (item._id === id ? { ...item, quantity: newQuantity, total: newQuantity * item.price } : item)),
    )
  }

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id))

    toast({
      title: "Removed from bill",
      description: "Item removed from the bill.",
    })
  }

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.total, 0)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    return subtotal + (subtotal * tax) / 100
  }

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast({
        title: "Empty cart",
        description: "Please add items to the bill before checkout.",
        variant: "destructive",
      });
      return;
    }

    const order = {
      customer: {
        name: customerName || "Walk-in Customer",
        phone: customerPhone || "N/A",
      },
      items: cart.map(item => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.total,
      })),
      subtotal: calculateSubtotal(),
      tax: (calculateSubtotal() * tax) / 100,
      total: calculateTotal(),
      date: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error("Failed to save order");
      }

      const savedOrder = await response.json();
      console.log("Order saved:", savedOrder);

      toast({
        title: "Order completed",
        description: `Order has been processed successfully.`,
      });

      // Clear the cart and customer info
      setCart([]);
      setCustomerName("");
      setCustomerPhone("");
      setTax(0);
      navigate("/orders");
    } catch (err) {
      console.error("Checkout failed:", err);
      toast({
        title: "Checkout failed",
        description: "Could not save the order. Please try again.",
        variant: "destructive",
      });
    }
  };
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - Medicine search and list */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-800 border border-gray-700 shadow-md">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-xl font-bold text-white">Search Medicines</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredMedicines.map((medicine) => (
                  <Card key={medicine.id} className="bg-gray-700 border border-gray-600 overflow-hidden">
                    <div className="p-2 flex justify-center bg-gray-600">
                      {/*   <img */}
                      {/*     src={medicine.image || "/placeholder.svg"} */}
                      {/*     alt={medicine.name} */}
                      {/*     className="h-24 w-24 object-cover" */}
                      {/*   /> */}
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-medium text-white text-center mb-1">{medicine.name}</h3>
                      <p className="text-center text-gray-300 mb-2">₹{medicine.price.toFixed(2)}</p>
                      <Button
                        onClick={() => addToCart(medicine)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        Add to Bill
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Bill */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-800 border border-gray-700 shadow-md">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-xl font-bold text-white flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Bill
              </CardTitle>
              <div className="grid grid-cols-1 gap-2 mt-2">
                <Input
                  placeholder="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
                <Input
                  placeholder="Customer Phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No items added to the bill yet</div>
              ) : (
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">Name</TableHead>
                        <TableHead className="text-gray-300 text-right">Qty</TableHead>
                        <TableHead className="text-gray-300 text-right">Price</TableHead>
                        <TableHead className="text-gray-300 text-right">Total</TableHead>
                        <TableHead className="text-gray-300 w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.map((item) => (
                        <TableRow key={item.id} className="border-gray-700">
                          <TableCell className="text-white">{item.name}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 bg-gray-700 border-gray-600 text-gray-300"
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-white">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 bg-gray-700 border-gray-600 text-gray-300"
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-gray-300">₹{item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right text-white">₹{item.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-gray-700"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal:</span>
                      <span>₹{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Tax (%):</span>
                      <Input
                        type="number"
                        value={tax}
                        onChange={(e) => setTax(Number.parseFloat(e.target.value) || 0)}
                        className="w-20 h-8 bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-700">
                      <span className="text-white">Total:</span>
                      <span className="text-white">₹{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-6">
                    <Button
                      variant="outline"
                      className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      onClick={handlePrint}
                    >
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleCheckout}>
                      <Save className="mr-2 h-4 w-4" />
                      Checkout
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

