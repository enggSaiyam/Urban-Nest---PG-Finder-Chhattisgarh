import { Router } from "express";
import { db, pgsTable, complaintsTable, usersTable } from "@workspace/db";
import { eq, and, desc, sql } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

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

router.get("/dashboard/tenant", requireAuth, async (req, res) => {
  const user = (req as any).user;

  const [complaintCountRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(complaintsTable)
    .where(and(eq(complaintsTable.complainantId, user.id), eq(complaintsTable.status, "pending")));

  const recentPgs = await db
    .select()
    .from(pgsTable)
    .where(eq(pgsTable.isAvailable, true))
    .orderBy(desc(pgsTable.createdAt))
    .limit(6);

  const ownerIds = [...new Set(recentPgs.map((p) => p.ownerId))];
  const owners = ownerIds.length > 0
    ? await db.select().from(usersTable).where(sql`${usersTable.id} = ANY(${ownerIds}::int[])`)
    : [];
  const ownerMap = new Map(owners.map((o) => [o.id, o]));

  return res.json({
    totalPgsViewed: recentPgs.length,
    savedPgs: 0,
    activeComplaints: complaintCountRow?.count || 0,
    recentPgs: recentPgs.map((p) => formatPg(p, ownerMap.get(p.ownerId))),
  });
});

router.get("/dashboard/owner", requireAuth, async (req, res) => {
  const user = (req as any).user;

  const myPgs = await db
    .select()
    .from(pgsTable)
    .where(eq(pgsTable.ownerId, user.id))
    .orderBy(desc(pgsTable.createdAt));

  const totalRooms = myPgs.reduce((sum, p) => sum + p.totalRooms, 0);
  const availableRooms = myPgs.reduce((sum, p) => sum + p.availableRooms, 0);

  const pgIds = myPgs.map((p) => p.id);
  let activeComplaints = 0;
  if (pgIds.length > 0) {
    const [countRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(complaintsTable)
      .where(and(
        sql`${complaintsTable.pgId} = ANY(${pgIds}::int[])`,
        eq(complaintsTable.status, "pending")
      ));
    activeComplaints = countRow?.count || 0;
  }

  return res.json({
    totalListings: myPgs.length,
    totalRooms,
    availableRooms,
    activeComplaints,
    myPgs: myPgs.map((p) => formatPg(p, user)),
  });
});

export default router;
