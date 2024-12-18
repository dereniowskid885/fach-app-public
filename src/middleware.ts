import { NextRequest, NextResponse } from 'next/server';
import { LOGIN_PATH, protectedRoutes } from './constants/routes';
import { isTokenExpired } from './lib/token';

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);

  const token = request.cookies.get('token');
  const isTokenInvalid = !token || isTokenExpired(token?.value);

  if (isProtectedRoute && isTokenInvalid) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.nextUrl));
  }

  return NextResponse.next();
}
