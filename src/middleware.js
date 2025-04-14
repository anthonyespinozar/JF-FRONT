import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname === '/login';
    const role = token?.role;

    // Si está en login y ya está autenticado, redirigir según rol
    if (isAuthPage && isAuth) {
      if (role === 'CHOFER') {
        return NextResponse.redirect(new URL('/chofer/dashboard', req.url));
      }
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Protección de rutas administrativas
    if (req.nextUrl.pathname.startsWith('/admin') && role !== 'ADMIN') {
      if (role === 'CHOFER') {
        return NextResponse.redirect(new URL('/chofer/dashboard', req.url));
      }
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Protección de rutas de chofer
    if (req.nextUrl.pathname.startsWith('/chofer') && role !== 'CHOFER') {
      if (role === 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url));
      }
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/chofer/:path*',
    '/perfil',
    '/configuracion',
    '/ayuda'
  ]
};