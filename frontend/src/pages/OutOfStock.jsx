"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ShoppingCart } from "lucide-react"

export default function OutOfStock() {
  // Sample data - replace with your actual data
  const [medicines, setMedicines] = useState([
    {
      id: 1,
      drugName: "Amoxicillin",
      batchId: "AMX001",
      quantity: 0,
      supplier: "PharmaCorp",
      preOrdered: false,
    },
    {
      id: 2,
      drugName: "Lisinopril",
      batchId: "LSP002",
      quantity: 0,
      supplier: "MedSupply Inc.",
      preOrdered: false,
    },
    {
      id: 3,
      drugName: "Metformin",
      batchId: "MTF003",
      quantity: 0,
      supplier: "HealthDrugs Ltd.",
      preOrdered: false,
    },
    {
      id: 4,
      drugName: "Ibuprofen",
      batchId: "IBU004",
      quantity: 0,
      supplier: "PainRelief Co.",
      preOrdered: false,
    },
    {
      id: 5,
      drugName: "Omeprazole",
      batchId: "OMP005",
      quantity: 0,
      supplier: "GastroHealth Inc.",
      preOrdered: false,
    },
  ])

  const [isPreOrderDialogOpen, setIsPreOrderDialogOpen] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState(null)
  const [preOrderQuantity, setPreOrderQuantity] = useState("")
  const { toast } = useToast()

  const handlePreOrderClick = (medicine) => {
    setSelectedMedicine(medicine)
    setPreOrderQuantity("")
    setIsPreOrderDialogOpen(true)
  }

  const handlePreOrderSubmit = () => {
    if (!preOrderQuantity || Number.parseInt(preOrderQuantity) <= 0) {
      toast({
        title: "Invalid quantity",
        description: "Please enter a valid quantity greater than zero.",
        variant: "destructive",
      })
      return
    }

    // Update the medicine's preOrdered status
    setMedicines(medicines.map((med) => (med.id === selectedMedicine.id ? { ...med, preOrdered: true } : med)))

    // Close the dialog
    setIsPreOrderDialogOpen(false)

    // Show success toast
    toast({
      title: "Pre-order placed successfully",
      description: `You have pre-ordered ${preOrderQuantity} units of ${selectedMedicine.drugName}.`,
    })
  }

  return (
    <div className="p-6">
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Out of Stock Medicines</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="font-semibold">Drug Name</TableHead>
                <TableHead className="font-semibold">Batch ID</TableHead>
                <TableHead className="font-semibold">Quantity</TableHead>
                <TableHead className="font-semibold">Supplier</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicines.map((medicine) => (
                <TableRow key={medicine.id} className="border-b">
                  <TableCell>{medicine.drugName}</TableCell>
                  <TableCell>{medicine.batchId}</TableCell>
                  <TableCell className="text-red-500 font-medium">{medicine.quantity}</TableCell>
                  <TableCell>{medicine.supplier}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handlePreOrderClick(medicine)}
                      variant="outline"
                      size="sm"
                      className={medicine.preOrdered ? "bg-green-100 text-green-800" : ""}
                      disabled={medicine.preOrdered}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      {medicine.preOrdered ? "Pre-ordered" : "Pre-order"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pre-order Dialog */}
      <Dialog open={isPreOrderDialogOpen} onOpenChange={setIsPreOrderDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Pre-order {selectedMedicine?.drugName}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="medicine-name" className="text-right">
                Medicine
              </Label>
              <Input id="medicine-name" value={selectedMedicine?.drugName || ""} className="col-span-3" disabled />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="batch-id" className="text-right">
                Batch ID
              </Label>
              <Input id="batch-id" value={selectedMedicine?.batchId || ""} className="col-span-3" disabled />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                value={preOrderQuantity}
                onChange={(e) => setPreOrderQuantity(e.target.value)}
                className="col-span-3"
                placeholder="Enter required quantity"
                min="1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreOrderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePreOrderSubmit}>Place Pre-order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

