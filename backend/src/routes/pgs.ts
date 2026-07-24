import { Router } from "express";
import { db, pgsTable, usersTable } from "@workspace/db";
import { eq, and, gte, lte, asc, desc, ilike, or, sql } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { CreatePgBody, UpdatePgBody, ListPgsQueryParams, GetPgParams, UpdatePgParams, DeletePgParams } from "@workspace/api-zod";

const router = Router();

function formatPg(pg: any, owner?: any) {
  return {
    id: pg.id,
    name: pg.name,
    city: pg.city,
    address: pg.address,
    description: pg.description,
    rent: pg.rent,
    pgType: pg.pgType,
    gender: pg.gender,
    totalRooms: pg.totalRooms,
    availableRooms: pg.availableRooms,
    amenities: pg.amenities || [],
    images: pg.images || [],
    ownerId: pg.ownerId,
    ownerName: owner?.name || null,
    ownerPhone: owner?.phone || null,
    isAvailable: pg.isAvailable,
    createdAt: pg.createdAt?.toISOString?.() || pg.createdAt,
  };
}

router.get("/pgs", async (req, res) => {
  const parse = ListPgsQueryParams.safeParse(req.query);
  const params = parse.success ? parse.data : {};

  const conditions: any[] = [];
  if (params.city) {
    conditions.push(ilike(pgsTable.city, `%${params.city}%`));
  }
  if (params.search) {
    conditions.push(
      or(
        ilike(pgsTable.name, `%${params.search}%`),
        ilike(pgsTable.address, `%${params.search}%`),
        ilike(pgsTable.city, `%${params.search}%`)
      )
    );
  }
  if (params.pgType && params.pgType !== "all") {
    conditions.push(eq(pgsTable.pgType, params.pgType as any));
  }
  if (params.gender && params.gender !== "any") {
    conditions.push(eq(pgsTable.gender, params.gender as any));
  }
  if (params.minRent) {
    conditions.push(gte(pgsTable.rent, Number(params.minRent)));
  }
  if (params.maxRent) {
    conditions.push(lte(pgsTable.rent, Number(params.maxRent)));
  }

  let orderBy: any = desc(pgsTable.createdAt);
  if (params.sortBy === "rent_asc") orderBy = asc(pgsTable.rent);
  else if (params.sortBy === "rent_desc") orderBy = desc(pgsTable.rent);
  else if (params.sortBy === "rooms_asc") orderBy = asc(pgsTable.availableRooms);
  else if (params.sortBy === "rooms_desc") orderBy = desc(pgsTable.availableRooms);
  else if (params.sortBy === "availability") orderBy = desc(pgsTable.availableRooms);

  const pgs = await db
    .select()
    .from(pgsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(orderBy)
    .limit(100);

  // Fetch owners in batch
  const ownerIds = [...new Set(pgs.map((p) => p.ownerId))];
  const owners = ownerIds.length > 0
    ? await db.select().from(usersTable).where(sql`${usersTable.id} = ANY(${ownerIds}::int[])`)
    : [];
  const ownerMap = new Map(owners.map((o) => [o.id, o]));

  return res.json(pgs.map((p) => formatPg(p, ownerMap.get(p.ownerId))));
});

router.post("/pgs", requireAuth, async (req, res) => {
  const user = (req as any).user;
  if (user.role !== "owner") {
    return res.status(403).json({ error: "Only PG owners can create listings" });
  }
  const parse = CreatePgBody.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid input" });
  }
  const data = parse.data;
  const [pg] = await db.insert(pgsTable).values({
    ...data,
    pgType: data.pgType as any,
    gender: data.gender as any,
    amenities: data.amenities || [],
    images: data.images || [],
    ownerId: user.id,
    isAvailable: true,
  }).returning();

  return res.status(201).json(formatPg(pg, user));
});

router.get("/pgs/owner/mine", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const pgs = await db.select().from(pgsTable).where(eq(pgsTable.ownerId, user.id)).orderBy(desc(pgsTable.createdAt));
  return res.json(pgs.map((p) => formatPg(p, user)));
});

router.get("/pgs/:id", async (req, res) => {
  const parse = GetPgParams.safeParse({ id: Number(req.params.id) });
  if (!parse.success) return res.status(400).json({ error: "Invalid id" });

  const [pg] = await db.select().from(pgsTable).where(eq(pgsTable.id, parse.data.id)).limit(1);
  if (!pg) return res.status(404).json({ error: "PG not found" });

  const [owner] = await db.select().from(usersTable).where(eq(usersTable.id, pg.ownerId)).limit(1);
  return res.json(formatPg(pg, owner));
});

router.put("/pgs/:id", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const parse = UpdatePgParams.safeParse({ id: Number(req.params.id) });
  if (!parse.success) return res.status(400).json({ error: "Invalid id" });

  const [pg] = await db.select().from(pgsTable).where(eq(pgsTable.id, parse.data.id)).limit(1);
  if (!pg) return res.status(404).json({ error: "PG not found" });
  if (pg.ownerId !== user.id) return res.status(403).json({ error: "Forbidden" });

  const bodyParse = UpdatePgBody.safeParse(req.body);
  if (!bodyParse.success) return res.status(400).json({ error: "Invalid input" });
  const updateData = bodyParse.data;

  const [updated] = await db.update(pgsTable).set({
    ...(updateData.name && { name: updateData.name }),
    ...(updateData.city && { city: updateData.city }),
    ...(updateData.address && { address: updateData.address }),
    ...(updateData.description !== undefined && { description: updateData.description }),
    ...(updateData.rent !== undefined && { rent: updateData.rent }),
    ...(updateData.pgType && { pgType: updateData.pgType as any }),
    ...(updateData.gender && { gender: updateData.gender as any }),
    ...(updateData.totalRooms !== undefined && { totalRooms: updateData.totalRooms }),
    ...(updateData.availableRooms !== undefined && { availableRooms: updateData.availableRooms }),
    ...(updateData.amenities && { amenities: updateData.amenities }),
    ...(updateData.images && { images: updateData.images }),
    ...(updateData.isAvailable !== undefined && { isAvailable: updateData.isAvailable }),
  }).where(eq(pgsTable.id, parse.data.id)).returning();

  return res.json(formatPg(updated, user));
});

router.delete("/pgs/:id", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const parse = DeletePgParams.safeParse({ id: Number(req.params.id) });
  if (!parse.success) return res.status(400).json({ error: "Invalid id" });

  const [pg] = await db.select().from(pgsTable).where(eq(pgsTable.id, parse.data.id)).limit(1);
  if (!pg) return res.status(404).json({ error: "PG not found" });
  if (pg.ownerId !== user.id) return res.status(403).json({ error: "Forbidden" });

  await db.delete(pgsTable).where(eq(pgsTable.id, parse.data.id));
  return res.json({ message: "PG deleted successfully" });
});

export default router;
