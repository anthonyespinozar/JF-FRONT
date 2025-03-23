import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Header } from "@/components/layout/header"
import AuthProvider from "@/components/providers/AuthProvider"

const inter = Inter({ subsets: ["latin"] })

/** @type {import('next').Metadata} */
export const metadata = {
  title: "FleetMaster - Gestión de Mantenimiento de Flotas",
  description: "Sistema profesional de gestión de mantenimiento de flotas de buses",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/icon.png",
        type: "image/png",
        sizes: "32x32",
      },
    ],
    apple: {
      url: "/apple-icon.png",
      sizes: "180x180",
    },
  },
}

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export default function RootLayout({ children }) {
  return (
    <html lang="es-PE" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SidebarProvider>
              <div className="fixed inset-0 flex">
                <SidebarNav />
                <div className="flex-1 flex flex-col min-h-screen overflow-auto">
                  <Header className="sticky top-0 z-10 border-b bg-background" />
                  <main className="flex-grow p-6">
                    {children}
                  </main>
                  <footer className="border-t py-4 text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} FleetMaster. Todos los derechos reservados.</p>
                  </footer>
                </div>
              </div>
            </SidebarProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

