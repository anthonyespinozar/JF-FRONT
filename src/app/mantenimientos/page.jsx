import { MaintenancesTable } from "@/components/maintenances/maintenances-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function MaintenancesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Mantenimientos</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Registrar Mantenimiento
        </Button>
      </div>
      <MaintenancesTable />
    </div>
  )
}

