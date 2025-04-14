"use client"

import { useState } from "react"
import { UsersTable } from "@/components/users/users-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { userService } from "@/services/userService"
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
import { useUsers } from "@/hooks/useUsers"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UsersPage() {
  const [isCreating, setIsCreating] = useState(false);
  const { mutate, users } = useUsers();

  const handleCreateUser = async (userData) => {
    try {
      const newUser = await userService.createUser(userData);
      toast.success("Usuario creado correctamente");
      setIsCreating(false);
      // Actualizar la lista de usuarios inmediatamente
      mutate([...users, newUser], false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Agregar Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Ingresa los datos del nuevo usuario.
              </DialogDescription>
            </DialogHeader>
            <CreateUserForm 
              onSubmit={handleCreateUser}
              onCancel={() => setIsCreating(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <UsersTable onUserDeleted={() => mutate()} />
    </div>
  )
}

function CreateUserForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    password: "",
    rol: "CHOFER",
    activo: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="nombre">Nombre</label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="correo">Correo</label>
          <Input
            id="correo"
            type="email"
            value={formData.correo}
            onChange={(e) => setFormData(prev => ({ ...prev, correo: e.target.value }))}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="password">Contraseña</label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="rol">Rol</label>
          <Select
            value={formData.rol}
            onValueChange={(value) => setFormData(prev => ({ ...prev, rol: value }))}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Seleccione un rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Administrador</SelectItem>
              <SelectItem value="CHOFER">Chofer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Crear Usuario
        </Button>
      </div>
    </form>
  );
}

