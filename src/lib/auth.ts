import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length === 0) {
    throw new Error('JWT_SECRET is not set');
  }
  return secret;
};

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name: string;
  [key: string]: unknown;
}

export const verifyAuth = async (token: string): Promise<AuthUser | null> => {
  try {
    const verified = await jwtVerify(token, new TextEncoder().encode(getJwtSecretKey()));
    return verified.payload as unknown as AuthUser;
  } catch {
    return null;
  }
};

export const signToken = async (payload: { id: string; email: string; role: string; name: string }) => {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(getJwtSecretKey()));
  return token;
};

export type AuthResult =
  | { user: AuthUser; response?: never }
  | { user?: never; response: NextResponse };

export async function requireAuth(
  req?: Request,
  allowedRoles?: string[]
): Promise<AuthResult> {
  let token: string | undefined;

  // 1. Try reading cookie from next/headers cookies()
  try {
    const cookieStore = await cookies();
    token = cookieStore.get('token')?.value;
  } catch {
    // Context where next/headers is unavailable (e.g. tests)
  }

  // 2. Fallback to Request headers (cookie or Authorization Bearer)
  if (!token && req) {
    const cookieHeader = req.headers.get('cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
      if (match) {
        token = decodeURIComponent(match[1]);
      }
    }
    if (!token) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
      }
    }
  }

  if (!token) {
    return {
      response: NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 })
    };
  }

  const payload = await verifyAuth(token);
  if (!payload) {
    return {
      response: NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 })
    };
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(payload.role)) {
      return {
        response: NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 })
      };
    }
  }

  return { user: payload };
}
