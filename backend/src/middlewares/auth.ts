import { type Request, type Response, type NextFunction } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { createHmac } from "crypto";

const SECRET = process.env.SESSION_SECRET || "urban-nest-secret-key-2024";

export function createToken(userId: number): string {
  const payload = `${userId}:${Date.now()}`;
  const hmac = createHmac("sha256", SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${hmac}`).toString("base64");
}

export function verifyToken(token: string): number | null {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const parts = decoded.split(":");
    if (parts.length < 3) return null;
    const userId = parts[0];
    const timestamp = parts[1];
    const hmac = parts[2];
    const payload = `${userId}:${timestamp}`;
    const expected = createHmac("sha256", SECRET).update(payload).digest("hex");
    if (hmac !== expected) return null;
    return parseInt(userId, 10);
  } catch {
    return null;
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.slice(7);
  const userId = verifyToken(token);
  if (!userId) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }
  (req as any).user = user;
  next();
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const userId = verifyToken(token);
    if (userId) {
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
      if (user) (req as any).user = user;
    }
  }
  next();
}
