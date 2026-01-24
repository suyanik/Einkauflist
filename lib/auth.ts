import { cookies } from 'next/headers';

export type SessionUser = {
  userId: string;
  timestamp: number;
};

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie) return null;

  try {
    const decoded = Buffer.from(sessionCookie.value, 'base64').toString('utf-8');
    const session = JSON.parse(decoded) as SessionUser;

    // Token 7 günden eski mi kontrol et
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 gün
    if (Date.now() - session.timestamp > maxAge) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}
