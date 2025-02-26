import { NextRequest, NextResponse } from 'next/server';
import { LOGIN_PATH, protectedRoutes } from './constants/routes';
import { isTokenExpired } from './lib/token';
import axios from 'axios';
import { API } from './constants/api';

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);

  const refreshToken = request.cookies.get('refreshToken');
  const isRefreshTokenInvalid = !refreshToken || isTokenExpired(refreshToken.value);

  if (isProtectedRoute && isRefreshTokenInvalid) {
    const loginURL = new URL(LOGIN_PATH, request.nextUrl);
    const response = NextResponse.redirect(loginURL);

    return response;
  }

  const accessToken = request.cookies.get('accessToken');
  const isAccessTokenInvalid = !accessToken || isTokenExpired(accessToken.value);

  if (isProtectedRoute && isAccessTokenInvalid) {
    const userAgent = request.headers.get('user-agent') || 'Unknown Device';

    try {
      const axiosResponse = await axios.post(
        API.REFRESH_TOKEN,
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

      const expirationTime = 900; // 15 minutes - 15 * 60
      const response = NextResponse.next();
      response.cookies.set('accessToken', axiosResponse.data.accessToken, {
        httpOnly: true,
        secure: process.env.NEXT_PUBLIC_NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: expirationTime,
        expires: expirationTime
      });

      return response;
    } catch (error) {
      const loginURL = new URL(LOGIN_PATH, request.nextUrl);
      const response = NextResponse.redirect(loginURL);

      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');

      return response;
    }
  }

  return NextResponse.next();
}
