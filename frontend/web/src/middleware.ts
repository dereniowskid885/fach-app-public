import { NextRequest, NextResponse } from 'next/server';
import { LOGIN_PATH, protectedRoutes } from './constants/routes';
import { isTokenExpired } from './lib/token';
import axios from 'axios';
import { AuthAPI } from './constants/api';

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const token = request.cookies.get('accessToken');
  const isTokenInvalid = !token || isTokenExpired(token?.value);
  const requestHeaders = new Headers(request.headers);
  const userAgent = request.headers.get('user-agent') || 'Unknown Device';

  if (isProtectedRoute && isTokenInvalid) {
    try {
      const refreshResponse = await axios.post(
        AuthAPI.REFRESH_TOKEN,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Cookie: request.cookies.toString(),
            customuaheader: userAgent
          },
          withCredentials: true
        }
      );

      if (refreshResponse.status === 200) {
        const response = NextResponse.next({
          request: {
            headers: requestHeaders
          }
        });

        return response;
      }
    } catch (error) {
      console.log(error);
      const redirectUrl = new URL(LOGIN_PATH, request.nextUrl);
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.delete('accessToken');
      return response;
    }
  }
  return NextResponse.next();
}
