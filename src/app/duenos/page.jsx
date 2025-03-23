import { OwnersTable } from "@/components/owners/owners-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function OwnersPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dueños de Unidades</h1>
          <p className="text-muted-foreground">Gestión de propietarios de las unidades de transporte</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Agregar Dueño
        </Button>
      </div>
      <OwnersTable />
    </div>
  )
}

