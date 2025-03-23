"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { OwnerForm } from "@/components/owners/owner-form"

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

export default function EditOwnerPage({ params }) {
  const router = useRouter()
  const [owner, setOwner] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    // Simulación de carga de datos
    setTimeout(() => {
      const foundOwner = owners.find((o) => o.id === params.id)
      if (foundOwner) {
        setOwner(foundOwner)
      } else {
        // Redirigir si no se encuentra el dueño
        router.push("/duenos")
      }
      setIsLoadingData(false)
    }, 500)
  }, [params.id, router])

  const handleSubmit = (data) => {
    setIsLoading(true)

    // Simulación de actualización
    setTimeout(() => {
      console.log("Datos actualizados:", data)
      setIsLoading(false)
      router.push("/duenos")
    }, 1000)
  }

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Editar Dueño</h1>
        <p className="text-muted-foreground">Actualice la información del dueño de unidades</p>
      </div>

      <OwnerForm owner={owner} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
}

