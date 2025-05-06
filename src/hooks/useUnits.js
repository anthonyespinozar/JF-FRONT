import { useState, useEffect } from 'react';
import { unitService } from '@/services/unitService';
import { toast } from 'sonner';

export function useUnits() {
  const [units, setUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchUnits = async () => {
    try {
      setIsLoading(true);
      const data = await unitService.getAllUnits();
      if (Array.isArray(data)) {
        setUnits(data);
        setIsError(false);
      } else {
        setUnits([]);
        setIsError(true);
        toast.error('Error: La respuesta no es un array válido');
      }
    } catch (error) {
      console.error('Error fetching units:', error);
      setUnits([]);
      setIsError(true);
      toast.error('Error al cargar las unidades');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const mutate = async () => {
    try {
      setIsLoading(true);
      await fetchUnits();
    } catch (error) {
      console.error('Error in mutate:', error);
      toast.error('Error al actualizar la lista de unidades');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data: units,
    isLoading,
    isError,
    mutate
  };
} 