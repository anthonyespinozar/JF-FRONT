import { useState, useEffect } from 'react';
import userService from '@/services/userService';
import { toast } from 'sonner';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getUsers();
      setUsers(data);
      setIsError(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setIsError(true);
      toast.error('Error al cargar los usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const mutate = () => {
    fetchUsers();
  };

  return {
    data: users,
    isLoading,
    isError,
    mutate
  };
}
