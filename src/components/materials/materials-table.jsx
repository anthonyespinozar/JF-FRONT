"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus } from "lucide-react"

const materials = [
  {
    id: "1",
    name: "Aceite de motor 15W-40",
    stock: 25,
    price: 45.99,
    category: "Lubricantes",
  },
  {
    id: "2",
    name: "Filtro de aceite",
    stock: 42,
    price: 12.5,
    category: "Filtros",
  },
  {
    id: "3",
    name: "Pastillas de freno",
    stock: 16,
    price: 85.0,
    category: "Frenos",
  },
  {
    id: "4",
    name: "Neumáticos 295/80 R22.5",
    stock: 8,
    price: 350.0,
    category: "Neumáticos",
  },
  {
    id: "5",
    name: "Líquido refrigerante",
    stock: 30,
    price: 18.75,
    category: "Líquidos",
  },
]

export function MaterialsTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMaterials = materials.filter(
    (material) =>
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Input
          placeholder="Buscar por nombre o categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead className="w-[120px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMaterials.map((material) => (
              <TableRow key={material.id}>
                <TableCell className="font-medium">{material.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{material.category}</Badge>
                </TableCell>
                <TableCell>
                  <span className={material.stock < 10 ? "text-destructive" : ""}>{material.stock}</span>
                </TableCell>
                <TableCell>${material.price.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" title="Editar">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" title="Actualizar stock">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

