"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { OwnerForm } from "@/components/owners/owner-form"

export default function NewOwnerPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (data) => {
    setIsLoading(true)

    // Simulación de guardado
    setTimeout(() => {
      console.log("Datos del nuevo dueño:", data)
      setIsLoading(false)
      router.push("/duenos")
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Registrar Nuevo Dueño</h1>
        <p className="text-muted-foreground">Complete el formulario para registrar un nuevo dueño de unidades</p>
      </div>

      <OwnerForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
}

