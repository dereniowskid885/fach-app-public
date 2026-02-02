import { NextRequest, NextResponse } from 'next/server';
import { LOGIN_PATH } from './constants/routes';
import { isTokenExpired } from './lib/token';
import axios from 'axios';
import { API } from './constants/api';
import { routing } from './i18n/routing';
import createMiddleware from 'next-intl/middleware';
import { isProtectedPath } from './helpers/isProtectedPath';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const localePrefix = path.split('/')[1];
  const isProtectedRoute = isProtectedPath(path, localePrefix);
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
      const axiosResponseData = axiosResponse.data;

      const expirationTime = 900; // 15 minutes - 15 * 60
      const response = NextResponse.next();
      response.cookies.set('accessToken', axiosResponseData.data.accessToken, {
        httpOnly: true,
        secure: process.env.NEXT_PUBLIC_NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: expirationTime,
        expires: expirationTime
      });

      return response;
    } catch {
      const loginURL = new URL(LOGIN_PATH, request.nextUrl);
      const response = NextResponse.redirect(loginURL);

      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');

      return response;
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',
    '/(pl|en)/:path*',
    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    '/((?!_next|_vercel|.*\\..*).*)'
  ]
};
