import { useState, useEffect } from "react"
import { materialService } from "@/services/materialService"
import { toast } from "sonner"

export function useMaterials() {
  const [materials, setMaterials] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const fetchMaterials = async () => {
    try {
      setIsLoading(true)
      const data = await materialService.getMaterials()
      setMaterials(data)
      setIsError(false)
    } catch (error) {
      console.error("Error fetching materials:", error)
      toast.error(error.message)
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMaterials()
  }, [])

  const mutate = async () => {
    await fetchMaterials()
  }

  return {
    materials,
    isLoading,
    isError,
    mutate
  }
} 