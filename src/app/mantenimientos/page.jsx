"use client"

import { useState } from "react"
import { MaintenancesTable } from "@/components/maintenances/maintenances-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { maintenanceService } from "@/services/maintenanceService"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useMaintenances } from "@/hooks/useMaintenances"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  unidad_id: z.string().min(1, { message: "La unidad es requerida" }),
  tipo: z.enum(["preventivo", "correctivo"], { message: "El tipo es requerido" }),
  observaciones: z.string().min(1, { message: "Las observaciones son requeridas" }),
  kilometraje_actual: z.number().min(0, { message: "El kilometraje no puede ser negativo" }),
})

export default function MaintenancesPage() {
  const [isCreating, setIsCreating] = useState(false);
  const { data: maintenances, isLoading, isError, mutate } = useMaintenances()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      unidad_id: "",
      tipo: "preventivo",
      observaciones: "",
      kilometraje_actual: 0,
    },
  });

  const handleCreateMaintenance = async (values) => {
    try {
      const newMaintenance = await maintenanceService.createMaintenance(values);
      toast.success("Mantenimiento registrado correctamente");
      setIsCreating(false);
      form.reset();
      await mutate();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Mantenimientos</h1>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Registrar Mantenimiento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Mantenimiento</DialogTitle>
              <DialogDescription>
                Ingresa los datos del mantenimiento a realizar.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateMaintenance)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="unidad_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidad</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una unidad" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">ABC-123</SelectItem>
                          <SelectItem value="2">XYZ-789</SelectItem>
                          <SelectItem value="3">DEF-456</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="preventivo">Preventivo</SelectItem>
                          <SelectItem value="correctivo">Correctivo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="observaciones"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observaciones</FormLabel>
                      <FormControl>
                        <Input placeholder="Descripción del mantenimiento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="kilometraje_actual"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kilometraje Actual</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Kilometraje actual de la unidad" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Registrar Mantenimiento
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <MaintenancesTable />
    </div>
  )
}

