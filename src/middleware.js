import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token
  },
});

export const config = {
  matcher: [
    // Rutas específicas de tu aplicación
    "/dashboard/:path*",
    "/unidades/:path*",
    "/duenos/:path*",
    "/partes-unidades/:path*",
    "/mantenimientos/:path*",
    "/materiales/:path*",
    "/reportes/:path*",
    "/usuarios/:path*",
    "/api/:path*",
    
    // Excluir rutas públicas (mantén esto al final)
    "/((?!api/auth|login|register|_next/static|_next/image|favicon.ico).*)",
  ]
};