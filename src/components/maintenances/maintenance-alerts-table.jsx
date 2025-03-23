"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, AlertTriangle, CheckCircle, Calendar, Wrench } from "lucide-react"
import { vehicleParts, remainingLifePercentage, getPartStatus, needsMaintenance } from "@/lib/maintenance-alerts"

export function MaintenanceAlertsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [unitFilter, setUnitFilter] = useState("all")

  // Obtener unidades únicas para el filtro
  const uniqueUnits = Array.from(new Set(vehicleParts.map((part) => part.unitPlate)))

  const filteredParts = vehicleParts.filter((part) => {
    const matchesSearch =
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.unitPlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.description.toLowerCase().includes(searchTerm.toLowerCase())

    const status = getPartStatus(part)
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "critical" && status === "critical") ||
      (statusFilter === "warning" && status === "warning") ||
      (statusFilter === "normal" && status === "normal")

    const matchesUnit = unitFilter === "all" || part.unitPlate === unitFilter

    return matchesSearch && matchesStatus && matchesUnit
  })

  // Ordenar por estado (crítico primero, luego advertencia, luego normal)
  const sortedParts = [...filteredParts].sort((a, b) => {
    const statusA = getPartStatus(a)
    const statusB = getPartStatus(b)

    if (statusA === "critical" && statusB !== "critical") return -1
    if (statusA !== "critical" && statusB === "critical") return 1
    if (statusA === "warning" && statusB === "normal") return -1
    if (statusA === "normal" && statusB === "warning") return 1

    return 0
  })

  const getStatusBadge = (part) => {
    const status = getPartStatus(part)
    const percentage = remainingLifePercentage(part)

    if (status === "critical") {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          <span>Crítico ({percentage.toFixed(0)}%)</span>
        </Badge>
      )
    } else if (status === "warning") {
      return (
        <Badge variant="outline" className="flex items-center gap-1 border-yellow-500 text-yellow-500">
          <AlertTriangle className="h-3 w-3" />
          <span>Advertencia ({percentage.toFixed(0)}%)</span>
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="flex items-center gap-1 border-green-500 text-green-500">
          <CheckCircle className="h-3 w-3" />
          <span>Normal ({percentage.toFixed(0)}%)</span>
        </Badge>
      )
    }
  }

  const getProgressColor = (part) => {
    const status = getPartStatus(part)
    if (status === "critical") return "bg-red-500"
    if (status === "warning") return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Buscar por nombre, unidad o descripción..."
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
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="critical">Crítico</SelectItem>
              <SelectItem value="warning">Advertencia</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
            </SelectContent>
          </Select>
          <Select value={unitFilter} onValueChange={setUnitFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Unidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las unidades</SelectItem>
              {uniqueUnits.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Parte</TableHead>
              <TableHead>Unidad</TableHead>
              <TableHead>Intervalo</TableHead>
              <TableHead>Último Mantenimiento</TableHead>
              <TableHead>Km Actual</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Vida Útil</TableHead>
              <TableHead className="w-[120px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedParts.map((part) => (
              <TableRow key={part.id} className={needsMaintenance(part) ? "bg-red-50 dark:bg-red-950/20" : ""}>
                <TableCell className="font-medium">{part.name}</TableCell>
                <TableCell>{part.unitPlate}</TableCell>
                <TableCell>{part.maintenanceInterval.toLocaleString()} km</TableCell>
                <TableCell>{part.lastMaintenanceKm.toLocaleString()} km</TableCell>
                <TableCell>{part.unitCurrentKm.toLocaleString()} km</TableCell>
                <TableCell>{getStatusBadge(part)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={remainingLifePercentage(part)}
                      className="h-2"
                      indicatorClassName={getProgressColor(part)}
                    />
                    <span className="text-xs w-8">{remainingLifePercentage(part).toFixed(0)}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" title="Programar mantenimiento">
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" title="Registrar mantenimiento">
                      <Wrench className="h-4 w-4" />
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

