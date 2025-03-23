"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Edit, Eye } from "lucide-react"

const maintenances = [
  {
    id: "1",
    unit: "ABC-123",
    type: "Preventivo",
    status: "Pendiente",
    requestDate: "12/03/2024",
    observations: "Cambio de aceite y filtros",
  },
  {
    id: "2",
    unit: "XYZ-789",
    type: "Correctivo",
    status: "Realizado",
    requestDate: "10/03/2024",
    observations: "Reparación de frenos",
  },
  {
    id: "3",
    unit: "DEF-456",
    type: "Preventivo",
    status: "Pendiente",
    requestDate: "15/03/2024",
    observations: "Revisión de sistema eléctrico",
  },
  {
    id: "4",
    unit: "GHI-101",
    type: "Correctivo",
    status: "Realizado",
    requestDate: "08/03/2024",
    observations: "Cambio de neumáticos",
  },
  {
    id: "5",
    unit: "JKL-202",
    type: "Preventivo",
    status: "Pendiente",
    requestDate: "18/03/2024",
    observations: "Mantenimiento de aire acondicionado",
  },
]

export function MaintenancesTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredMaintenances = maintenances.filter((maintenance) => {
    const matchesSearch =
      maintenance.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.observations.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || maintenance.status === statusFilter

    const matchesType = typeFilter === "all" || maintenance.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Buscar por unidad u observaciones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="Realizado">Realizado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Preventivo">Preventivo</SelectItem>
              <SelectItem value="Correctivo">Correctivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Unidad</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha de Solicitud</TableHead>
              <TableHead>Observaciones</TableHead>
              <TableHead className="w-[120px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMaintenances.map((maintenance) => (
              <TableRow key={maintenance.id}>
                <TableCell className="font-medium">{maintenance.unit}</TableCell>
                <TableCell>
                  <Badge variant={maintenance.type === "Preventivo" ? "outline" : "secondary"}>
                    {maintenance.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={maintenance.status === "Pendiente" ? "outline" : "default"}>
                    {maintenance.status}
                  </Badge>
                </TableCell>
                <TableCell>{maintenance.requestDate}</TableCell>
                <TableCell className="max-w-xs truncate">{maintenance.observations}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" title="Ver detalles">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" title="Editar">
                      <Edit className="h-4 w-4" />
                    </Button>
                    {maintenance.status === "Pendiente" && (
                      <Button variant="outline" size="icon" title="Marcar como realizado">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
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

