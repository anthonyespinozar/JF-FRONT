import { OwnerUnitsTable } from "@/components/owners/owner-units-table"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Datos de ejemplo para dueños
const owners = [
  {
    id: "1",
    name: "Transportes Rápidos S.A.",
    contactPerson: "Roberto Gómez",
    email: "roberto.gomez@transportesrapidos.com",
    phone: "+52 555 123 4567",
    address: "Av. Principal 123, Ciudad de México",
    unitsCount: 8,
    status: "Activo",
  },
  {
    id: "2",
    name: "Autobuses del Norte",
    contactPerson: "María Rodríguez",
    email: "maria.rodriguez@autobusesnorte.com",
    phone: "+52 555 987 6543",
    address: "Calle Norte 456, Monterrey",
    unitsCount: 12,
    status: "Activo",
  },
  // Otros dueños...
]

export default function OwnerUnitsPage({ params }) {
  const owner = owners.find((o) => o.id === params.id) || { name: "Dueño no encontrado", id: params.id }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/duenos">
            <ArrowLeft className="h-4 w-4 mr-1" /> Volver a Dueños
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Unidades de {owner.name}</h1>
          <p className="text-muted-foreground">Gestión de unidades pertenecientes a este dueño</p>
        </div>
        <Button asChild>
          <Link href={`/unidades/nuevo?dueno=${owner.id}`}>
            <Plus className="mr-2 h-4 w-4" /> Agregar Unidad
          </Link>
        </Button>
      </div>

      <OwnerUnitsTable ownerId={params.id} />
    </div>
  )
}

