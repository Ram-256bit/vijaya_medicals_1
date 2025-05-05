"use client"

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ExpiredMedicines() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expiredMedicines, setExpiredMedicines] = useState([])
  const [filteredMedicines, setFilteredMedicines] = useState([])

  useEffect(() => {
    const fetchExpiredMedicines = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/inventory/expired")
        const data = await response.json()
        setExpiredMedicines(data)
        setFilteredMedicines(data)
      } catch (error) {
        console.error("Failed to fetch expired medicines:", error)
      }
    }

    fetchExpiredMedicines()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const filtered = expiredMedicines.filter(medicine =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.batchId.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredMedicines(filtered)
  }

  return (
    <div className="container mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Expired Medicines</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search by name or batch number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Drug Name</TableHead>
                <TableHead>Batch Id</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedicines.map((medicine) => (
                <TableRow key={medicine._id}>
                  <TableCell>{medicine.name}</TableCell>
                  {/* <TableCell>{medicine.batchId}</TableCell> */}
                  <TableCell>{medicine.expireDate}</TableCell>
                  <TableCell>{medicine.quantity}</TableCell>
                  <TableCell>{medicine.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredMedicines.length === 0 && (
            <p className="text-sm text-gray-500 mt-4">No expired medicines found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
