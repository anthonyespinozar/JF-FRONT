"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash, Settings, Building2 } from "lucide-react"
import Link from "next/link"
import { formatNumber } from '@/utils/formatting'

// Datos de ejemplo para dueños
const owners = [
  { id: "1", name: "Transportes Rápidos S.A." },
  { id: "2", name: "Autobuses del Norte" },
  { id: "3", name: "Transportes Urbanos S.A." },
  { id: "4", name: "Líneas Express" },
  { id: "5", name: "Autotransportes del Sur" },
]

// Datos de ejemplo para unidades con dueños
const units = [
  {
    id: "1",
    plate: "ABC-123",
    model: "Mercedes Benz O500",
    year: 2020,
    type: "Urbano",
    mileage: 45000,
    driver: "Carlos Rodríguez",
    ownerId: "1",
  },
  {
    id: "2",
    plate: "XYZ-789",
    model: "Volvo 9700",
    year: 2019,
    type: "Interurbano",
    mileage: 78000,
    driver: "Ana Martínez",
    ownerId: "2",
  },
  {
    id: "3",
    plate: "DEF-456",
    model: "Scania K410",
    year: 2021,
    type: "Urbano",
    mileage: 32000,
    driver: "Luis Gómez",
    ownerId: "3",
  },
  {
    id: "4",
    plate: "GHI-101",
    model: "Mercedes Benz O500",
    year: 2018,
    type: "Urbano",
    mileage: 95000,
    driver: "María López",
    ownerId: "4",
  },
  {
    id: "5",
    plate: "JKL-202",
    model: "Volvo 9700",
    year: 2022,
    type: "Interurbano",
    mileage: 15000,
    driver: "Pedro Sánchez",
    ownerId: "5",
  },
]

export function UnitsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [ownerFilter, setOwnerFilter] = useState("all")

  const filteredUnits = units.filter((unit) => {
    const matchesSearch =
      unit.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.driver.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesOwner = ownerFilter === "all" || unit.ownerId === ownerFilter

    return matchesSearch && matchesOwner
  })

  // Función para obtener el nombre del dueño
  const getOwnerName = (ownerId) => {
    const owner = owners.find((o) => o.id === ownerId)
    return owner ? owner.name : "Desconocido"
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Buscar por placa, modelo o chofer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={ownerFilter} onValueChange={setOwnerFilter}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Filtrar por dueño" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los dueños</SelectItem>
            {owners.map((owner) => (
              <SelectItem key={owner.id} value={owner.id}>
                {owner.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Placa</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Año</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Kilometraje</TableHead>
              <TableHead>Chofer Asignado</TableHead>
              <TableHead>Dueño</TableHead>
              <TableHead className="w-[80px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUnits.map((unit) => (
              <TableRow key={unit.id}>
                <TableCell className="font-medium">{unit.plate}</TableCell>
                <TableCell>{unit.model}</TableCell>
                <TableCell>{unit.year}</TableCell>
                <TableCell>{unit.type}</TableCell>
                <TableCell>{formatNumber(unit.mileage)}</TableCell>
                <TableCell>{unit.driver}</TableCell>
                <TableCell>
                  <Link href={`/duenos/${unit.ownerId}`} className="flex items-center hover:underline">
                    <Building2 className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    {getOwnerName(unit.ownerId)}
                  </Link>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/unidades/${unit.id}/partes`} className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Gestionar Partes</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Eliminar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

