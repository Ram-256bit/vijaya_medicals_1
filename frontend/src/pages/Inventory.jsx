"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Edit, Trash2 } from "lucide-react"

// Simulated API call to fetch inventory data
const fetchInventory = async () => {
  const res = await fetch("http://localhost:5000/api/inventory");
  return await res.json();
};


export default function Inventory() {
  const [inventory, setInventory] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newItem, setNewItem] = useState({ name: "", batchId: "", quantity: "", price: "", expiryDate: "" })
  const [editingItem, setEditingItem] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchInventory().then(setInventory)
  }, [])

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.batchId || !newItem.quantity || !newItem.price || !newItem.expiryDate) {
      toast({ title: "Error", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
  
    const response = await fetch("http://localhost:5000/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newItem,
        quantity: Number(newItem.quantity),
        price: Number(newItem.price)
      })
    });
  
    if (response.ok) {
      const added = await response.json();
      setInventory([...inventory, added]);
      setNewItem({ name: "", batchId: "", quantity: "", price: "", expiryDate: "" });
      setIsAddDialogOpen(false);
      toast({ title: "Success", description: "New item added." });
    } else {
      toast({ title: "Error", description: "Failed to add item.", variant: "destructive" });
    }
  };
  

  const handleEditItem = async () => {
    if (!editingItem.name || !editingItem.batchId || !editingItem.quantity || !editingItem.price || !editingItem.expiryDate) {
      toast({ title: "Error", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
  
    const response = await fetch(`http://localhost:5000/api/inventory/${editingItem._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editingItem,
        quantity: Number(editingItem.quantity),
        price: Number(editingItem.price)
      })
    });
  
    if (response.ok) {
      const updatedItem = await response.json();
      setInventory(inventory.map(item => item._id === updatedItem._id ? updatedItem : item));
      setIsEditDialogOpen(false);
      setEditingItem(null);
      toast({ title: "Success", description: "Item updated." });
    } else {
      toast({ title: "Error", description: "Failed to update item.", variant: "destructive" });
    }
  };
  

  const handleDeleteItem = async (id) => {
    const res = await fetch(`http://localhost:5000/api/inventory/${id}`, { method: "DELETE" });
  
    if (res.ok) {
      setInventory(inventory.filter((item) => item._id !== id));
      toast({ title: "Success", description: "Item deleted." });
    } else {
      toast({ title: "Error", description: "Failed to delete item.", variant: "destructive" });
    }
  };
  

  return (
    <div className="p-6">
      <Card className="bg-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Inventory Management</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Add New Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold mb-4 text-white">Add New Inventory Item</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right text-gray-300">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="col-span-3 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="batchId" className="text-right text-gray-300">
                    Batch ID
                  </Label>
                  <Input
                    id="batchId"
                    value={newItem.batchId}
                    onChange={(e) => setNewItem({ ...newItem, batchId: e.target.value })}
                    className="col-span-3 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right text-gray-300">
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    className="col-span-3 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right text-gray-300">
                    Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className="col-span-3 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="expiryDate" className="text-right text-gray-300">
                    Expiry Date
                  </Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={newItem.expiryDate}
                    onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                    className="col-span-3 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleAddItem}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Input
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Batch ID</TableHead>
                  <TableHead className="font-semibold">Quantity</TableHead>
                  <TableHead className="font-semibold">Price</TableHead>
                  <TableHead className="font-semibold">Expiry Date</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.batchId}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>{item.expiryDate}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingItem(item)
                            setIsEditDialogOpen(true)
                          }}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded text-xs"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-xs"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold mb-4 text-white">Edit Inventory Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right text-gray-300">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="col-span-3 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-batchId" className="text-right text-gray-300">
                  Batch ID
                </Label>
                <Input
                  id="edit-batchId"
                  value={editingItem.batchId}
                  onChange={(e) => setEditingItem({ ...editingItem, batchId: e.target.value })}
                  className="col-span-3 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-quantity" className="text-right text-gray-300">
                  Quantity
                </Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  value={editingItem.quantity}
                  onChange={(e) => setEditingItem({ ...editingItem, quantity: e.target.value })}
                  className="col-span-3 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-price" className="text-right text-gray-300">
                  Price
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                  className="col-span-3 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-expiryDate" className="text-right text-gray-300">
                  Expiry Date
                </Label>
                <Input
                  id="edit-expiryDate"
                  type="date"
                  value={editingItem.expiryDate}
                  onChange={(e) => setEditingItem({ ...editingItem, expiryDate: e.target.value })}
                  className="col-span-3 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={handleEditItem}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            >
              Update Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

