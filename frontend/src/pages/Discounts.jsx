import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export default function Discounts() {
  const [medicines, setMedicines] = useState([])
  const [selectedMedicine, setSelectedMedicine] = useState(null)
  const [discountType, setDiscountType] = useState("percentage")
  const [discountAmount, setDiscountAmount] = useState("")

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/inventory")
        if (!res.ok) throw new Error("Failed to fetch medicines")
        const data = await res.json()

        const withDiscount = data.map(med => ({
          id: med._id,
          name: med.name,
          price: med.price,
          quantity: med.quantity,
          expireDate: med.expireDate,
          batchId: med._id.slice(-6), // Simulate batch ID
          discountPrice: med.price // No discount by default
        }))

        setMedicines(withDiscount)
      } catch (err) {
        console.error("Error fetching medicines:", err)
      }
    }

    fetchMedicines()
  }, [])

  const handleApplyDiscount = () => {
    if (!selectedMedicine) {
      return toast({
        title: "Error",
        description: "Please select a medicine first",
        variant: "destructive",
      })
    }

    const amount = parseFloat(discountAmount)
    if (isNaN(amount) || amount <= 0) {
      return toast({
        title: "Error",
        description: "Please enter a valid discount amount",
        variant: "destructive",
      })
    }

    const medicine = medicines.find(m => m.id === selectedMedicine)
    if (!medicine) return

    let newDiscountPrice
    if (discountType === "percentage") {
      if (amount > 100) {
        return toast({
          title: "Error",
          description: "Percentage discount cannot exceed 100%",
          variant: "destructive",
        })
      }
      newDiscountPrice = medicine.price * (1 - amount / 100)
    } else {
      if (amount >= medicine.price) {
        return toast({
          title: "Error",
          description: "Fixed discount cannot exceed medicine price",
          variant: "destructive",
        })
      }
      newDiscountPrice = medicine.price - amount
    }

    setMedicines(medicines.map(m =>
      m.id === selectedMedicine
        ? { ...m, discountPrice: Math.round(newDiscountPrice) }
        : m
    ))

    toast({
      title: "Success",
      description: "Discount applied successfully",
    })
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-6">
        {/* Discount Management Section */}
        <Card>
          <CardHeader>
            <CardTitle>Apply Discount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Select onValueChange={(value) => setSelectedMedicine(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Medicine" />
                </SelectTrigger>
                <SelectContent>
                  {medicines.map((medicine) => (
                    <SelectItem key={medicine.id} value={medicine.id.toString()}>
                      {medicine.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select defaultValue="percentage" onValueChange={setDiscountType}>
                <SelectTrigger>
                  <SelectValue placeholder="Discount Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder={discountType === "percentage" ? "Enter percentage" : "Enter amount"}
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
              />

              <Button onClick={handleApplyDiscount}>Apply Discount</Button>
            </div>
          </CardContent>
        </Card>

        {/* Discounted Medicines Table */}
        <Card>
          <CardHeader>
            <CardTitle>Discounted Medicines</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Drug Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Batch Id</TableHead>
                  <TableHead>Expire Date</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Discount Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicines.map((medicine) => (
                  <TableRow key={medicine.id}>
                    <TableCell>{medicine.name}</TableCell>
                    <TableCell>{medicine.quantity}</TableCell>
                    <TableCell>{medicine.batchId}</TableCell>
                    <TableCell>{medicine.expireDate}</TableCell>
                    <TableCell>{medicine.price}</TableCell>
                    <TableCell className="text-green-500 font-medium">
                      {medicine.discountPrice}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
