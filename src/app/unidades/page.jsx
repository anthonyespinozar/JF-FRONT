import { UnitsTable } from "@/components/units/units-table"
import { Button } from "@/components/ui/button"
import { Plus, Settings } from "lucide-react"
import Link from "next/link"

export default function UnitsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Unidades</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/unidades/partes">
              <Settings className="mr-2 h-4 w-4" /> Gestionar Partes
            </Link>
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Agregar Unidad
          </Button>
        </div>
      </div>
      <UnitsTable />
    </div>
  )
}

