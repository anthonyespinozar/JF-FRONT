"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, User, Settings, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/ui/user-avatar"
import { useSession, signIn, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserMenu() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, status } = useSession()

  const handleLogin = () => {
    router.push('/login')
  }

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      await signOut({ 
        redirect: true,
        callbackUrl: '/login'
      })
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      window.location.href = '/login'
    } finally {
      setIsLoading(false)
    }
  }

  // Si no hay sesión, mostrar botón de login
  if (status === "unauthenticated") {
    return (
      <Button 
        variant="ghost" 
        onClick={handleLogin}
        className="flex items-center gap-2"
      >
        <User className="h-4 w-4" />
        <span>Iniciar sesión</span>
      </Button>
    )
  }

  // Si está cargando, mostrar skeleton
  if (status === "loading") {
    return (
      <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
    )
  }

  // Si hay sesión, mostrar menú de usuario
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <UserAvatar 
            user={{
              name: session.user.name,
              email: session.user.email
            }}
            variant="menu"
            className="h-8 w-8 border-2 border-primary/20"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground mt-1">
              {session.user.role === 'ADMIN' ? 'Administrador' : 'Chofer'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/perfil")}>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          {session.user.role === "ADMIN" && (
            <DropdownMenuItem onClick={() => router.push("/configuracion")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => router.push("/ayuda")}>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Ayuda</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout} 
          disabled={isLoading} 
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoading ? "Cerrando sesión..." : "Cerrar sesión"}</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

