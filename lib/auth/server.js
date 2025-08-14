import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '7d';

function generateToken(payload) {
  if (typeof window !== 'undefined') throw new Error('Only server-side');
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

function verifyToken(token) {
  if (typeof window !== 'undefined') throw new Error('Only server-side');
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

async function safeDbCall(fn) {
  try {
    return await fn();
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getUserById(id) {
  return safeDbCall(() =>
    prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, image: true, createdAt: true, updatedAt: true }
    })
  );
}

export async function createUser(data) {
  try {
    return await prisma.user.create({
      data,
      select: { id: true, name: true, email: true, image: true, createdAt: true, updatedAt: true }
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function createSession(userId, token) {
  return safeDbCall(() =>
    prisma.session.create({
      data: { userId, sessionToken: token, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    })
  );
}

export async function deleteSession(token) {
  return safeDbCall(() =>
    prisma.session.deleteMany({ where: { sessionToken: token } })
      .then(() => true)
      .catch(() => false)
  );
}

export async function verifyAuth(request) {
  try {
    const token = request.cookies.get('auth-token')?.value ||
                  request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) return { authenticated: false, user: null };

    const decoded = verifyToken(token);
    if (!decoded) return { authenticated: false, user: null };

    const user = await getUserById(decoded.userId);
    if (!user) return { authenticated: false, user: null };

    return { authenticated: true, user };
  } catch (e) {
    console.error(e);
    return { authenticated: false, user: null };
  }
}

export async function loginUser(user) {
  const token = generateToken({ userId: user.id });
  await createSession(user.id, token);
  return { token, user };
}

export async function registerUser(userData) {
  const newUser = await createUser(userData);
  const token = generateToken({ userId: newUser.id });
  await createSession(newUser.id, token);
  return { token, user: newUser };
}

export async function logoutUser(request) {
  const token = request.cookies.get('auth-token')?.value;
  if (token) await deleteSession(token);
  return true;
}
