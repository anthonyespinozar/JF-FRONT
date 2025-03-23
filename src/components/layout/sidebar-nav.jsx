"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { BarChart3, Bus, Wrench, Package, FileBarChart, Users, LogOut, Settings, Building2, ChevronLeft } from "lucide-react"
import { useState } from "react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/ui/user-avatar"
import { useSession, signOut } from "next-auth/react"

const navItems = [
  { title: "Dashboard", href: "/", icon: BarChart3 },
  { title: "Unidades", href: "/unidades", icon: Bus },
  { title: "Dueños", href: "/duenos", icon: Building2 },
  { title: "Partes de Unidades", href: "/partes-unidades", icon: Settings },
  { title: "Mantenimientos", href: "/mantenimientos", icon: Wrench },
  { title: "Materiales", href: "/materiales", icon: Package },
  { title: "Reportes", href: "/reportes", icon: FileBarChart },
  { title: "Usuarios", href: "/usuarios", icon: Users },
]

export function SidebarNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { data: session, status } = useSession()

  // Si está cargando o no hay sesión, no mostrar el sidebar
  if (status === "loading" || !session) {
    return null
  }

  const handleLogout = async () => {
    await signOut({ 
      redirect: true,
      callbackUrl: '/login'
    })
  }

  return (
    <div className="relative">
      <Sidebar className={`h-screen bg-sidebar transition-all duration-300 ${isCollapsed ? 'w-[64px]' : 'w-[280px]'}`}>
        <SidebarHeader className="bg-sidebar border-none">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} py-3`}>
            <Bus className="h-5 w-5 text-sidebar-primary shrink-0" />
            {!isCollapsed && <div className="ml-3 font-semibold text-lg text-sidebar-foreground">FleetMaster</div>}
          </div>
        </SidebarHeader>
        <SidebarContent className="py-1">
          <SidebarGroup className="border-none">
            {!isCollapsed && (
              <SidebarGroupLabel className="px-4 py-2 text-xs uppercase tracking-wider text-sidebar-foreground/70">
                Navegación
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent className="border-none">
              <SidebarMenu className="space-y-0.5">
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Link 
                      href={item.href} 
                      className={`flex items-center w-full px-4 py-2 rounded-lg transition-all duration-200 hover:bg-sidebar-accent/50 ${
                        pathname === item.href ? 'bg-sidebar-accent text-sidebar-primary' : 'text-sidebar-foreground'
                      } ${isCollapsed ? 'justify-center' : 'gap-3'}`} 
                      title={isCollapsed ? item.title : undefined}
                    >
                      <item.icon className={`h-4 w-4 ${pathname === item.href ? 'text-sidebar-primary' : ''}`} />
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <div className="relative">
          <SidebarFooter className="bg-sidebar-accent/10 border-none">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3`}>
              <UserAvatar 
                user={session.user}
                variant="sidebar"
                className="h-8 w-8 border border-sidebar-border/50 shrink-0"
              />
              {!isCollapsed && (
                <>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-none text-sidebar-foreground">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-sidebar-foreground/70 mt-1">
                      {session.user.role || 'Usuario'}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-sidebar-accent/50" 
                    title="Cerrar sesión"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 text-sidebar-foreground" />
                  </Button>
                </>
              )}
            </div>
          </SidebarFooter>
          <Button
            variant="ghost"
            size="icon"
            className={`absolute -right-4 top-1/2 -translate-y-1/2 z-50 h-8 w-8 rounded-full bg-sidebar-accent hover:bg-sidebar-accent/80 transition-all duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expandir" : "Colapsar"}
          >
            <ChevronLeft className="h-4 w-4 text-sidebar-foreground" />
          </Button>
        </div>
      </Sidebar>
    </div>
  )
}
