import { useState } from "react"
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

// Mock data for medicines
const mockMedicines = [
  {
    id: 1,
    name: "Panadol",
    quantity: 20,
    batchId: "875432",
    expireDate: "02/02/2025",
    price: 1200,
    discountPrice: 1000
  },
  {
    id: 2,
    name: "Citizen",
    quantity: 200,
    batchId: "875547",
    expireDate: "02/02/2025",
    price: 995,
    discountPrice: 780
  }
]

export default function Discounts() {
  const [medicines, setMedicines] = useState(mockMedicines)
  const [selectedMedicine, setSelectedMedicine] = useState(null)
  const [discountType, setDiscountType] = useState("percentage")
  const [discountAmount, setDiscountAmount] = useState("")

  const handleApplyDiscount = () => {
    if (!selectedMedicine) {
      toast({
        title: "Error",
        description: "Please select a medicine first",
        variant: "destructive",
      })
      return
    }

    const amount = parseFloat(discountAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid discount amount",
        variant: "destructive",
      })
      return
    }

    const medicine = medicines.find(m => m.id === selectedMedicine)
    if (!medicine) return

    let newDiscountPrice
    if (discountType === "percentage") {
      if (amount > 100) {
        toast({
          title: "Error",
          description: "Percentage discount cannot exceed 100%",
          variant: "destructive",
        })
        return
      }
      newDiscountPrice = medicine.price * (1 - amount / 100)
    } else {
      if (amount >= medicine.price) {
        toast({
          title: "Error",
          description: "Fixed discount cannot exceed medicine price",
          variant: "destructive",
        })
        return
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