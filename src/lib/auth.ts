import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const SESSION_COOKIE = "session_token";

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export function generateSessionToken(): string {
    return crypto.randomUUID();
}

export async function createSession(userId: string): Promise<string> {
    const token = generateSessionToken();
    // Store in cookie
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, `${userId}:${token}`, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
    });
    return token;
}

export async function getSession(): Promise<{ userId: string } | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE);

    if (!sessionCookie?.value) {
        return null;
    }

    const [userId] = sessionCookie.value.split(":");
    if (!userId) {
        return null;
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        return null;
    }

    return { userId };
}

export async function getCurrentUser() {
    const session = await getSession();
    if (!session) return null;

    return prisma.user.findUnique({
        where: { id: session.userId },
        select: {
            id: true,
            email: true,
            name: true,
        },
    });
}

export async function destroySession() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
}
