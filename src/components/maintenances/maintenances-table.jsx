"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, MoreHorizontal, Wrench } from "lucide-react"
import { useMaintenances } from "@/hooks/useMaintenances"
import { maintenanceService } from "@/services/maintenanceService"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  estado: z.enum(["pendiente", "en_proceso", "completado"], { message: "El estado es requerido" }),
})

export function MaintenancesTable() {
  const { data: maintenances, isLoading, isError, mutate } = useMaintenances()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMaintenance, setSelectedMaintenance] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      estado: "pendiente",
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-center">Cargando mantenimientos...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-center text-red-500">
          Error al cargar los mantenimientos. Por favor, intente nuevamente.
        </div>
      </div>
    )
  }

  const filteredMaintenances = maintenances?.filter((maintenance) => {
    if (!maintenance) return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (maintenance.unidad_id?.toString() || '').includes(searchLower) ||
      (maintenance.tipo?.toLowerCase() || '').includes(searchLower) ||
      (maintenance.observaciones?.toLowerCase() || '').includes(searchLower)
    );
  }) || [];

  const handleUpdateStatus = async (values) => {
    try {
      await maintenanceService.updateMaintenanceStatus(selectedMaintenance.id, values.estado)
      toast.success("Estado actualizado correctamente")
      setIsUpdating(false)
      setSelectedMaintenance(null)
      await mutate()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleEditClick = (maintenance) => {
    setSelectedMaintenance(maintenance)
    form.reset({
      estado: maintenance.estado || "pendiente",
    })
    setIsUpdating(true)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pendiente":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pendiente</Badge>
      case "en_proceso":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">En Proceso</Badge>
      case "completado":
        return <Badge variant="outline" className="border-green-500 text-green-500">Completado</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Input
          placeholder="Buscar por unidad, tipo o observaciones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Unidad</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Observaciones</TableHead>
              <TableHead>Kilometraje</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="w-[80px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMaintenances.map((maintenance) => (
              <TableRow key={maintenance.id}>
                <TableCell className="font-medium">{maintenance.unidad_id}</TableCell>
                <TableCell>
                  <Badge variant={maintenance.tipo === "preventivo" ? "outline" : "secondary"}>
                    {maintenance.tipo}
                  </Badge>
                </TableCell>
                <TableCell>{maintenance.observaciones}</TableCell>
                <TableCell>{maintenance.kilometraje_actual.toLocaleString()} km</TableCell>
                <TableCell>{getStatusBadge(maintenance.estado)}</TableCell>
                <TableCell>{new Date(maintenance.fecha_solicitud).toLocaleDateString()}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleEditClick(maintenance)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Actualizar Estado
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isUpdating} onOpenChange={setIsUpdating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar Estado</DialogTitle>
            <DialogDescription>
              Selecciona el nuevo estado del mantenimiento.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateStatus)} className="space-y-4">
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                        <SelectItem value="en_proceso">En Proceso</SelectItem>
                        <SelectItem value="completado">Completado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsUpdating(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Guardar Cambios
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

