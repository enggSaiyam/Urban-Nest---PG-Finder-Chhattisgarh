import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { createHash } from "crypto";
import { createToken, requireAuth } from "../middlewares/auth";
import { RegisterUserBody, LoginUserBody } from "@workspace/api-zod";

function hashPassword(password: string): string {
  return createHash("sha256").update(password + "urban-nest-salt").digest("hex");
}

const router = Router();

router.post("/auth/register", async (req, res) => {
  const parse = RegisterUserBody.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid input" });
  }
  const { name, email, password, phone, role } = parse.data;

  const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (existing) {
    return res.status(400).json({ error: "Email already registered" });
  }

  const passwordHash = hashPassword(password);
  const [user] = await db.insert(usersTable).values({ name, email, passwordHash, phone, role }).returning();

  const token = createToken(user.id);
  return res.status(201).json({
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, createdAt: user.createdAt },
    token,
  });
});

router.post("/auth/login", async (req, res) => {
  const parse = LoginUserBody.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid input" });
  }
  const { email, password } = parse.data;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const passwordHash = hashPassword(password);
  if (user.passwordHash !== passwordHash) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = createToken(user.id);
  return res.json({
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, createdAt: user.createdAt },
    token,
  });
});

router.post("/auth/logout", (_req, res) => {
  return res.json({ message: "Logged out successfully" });
});

router.get("/auth/me", requireAuth, (req, res) => {
  const user = (req as any).user;
  return res.json({ id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, createdAt: user.createdAt });
});

export default router;
