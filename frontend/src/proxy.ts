import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/'];

export function proxy(request: NextRequest) {
    const token = request.cookies.get('token');
    const { pathname } = request.nextUrl;

    const isAuthRoute = pathname === '/login' || pathname === '/register';
    const isProtectedRoute = protectedRoutes.includes(pathname) || pathname.startsWith('/rooms');

    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
