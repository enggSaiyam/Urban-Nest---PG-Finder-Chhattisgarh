import { Router } from "express";
import { db, complaintsTable, usersTable, pgsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { CreateComplaintBody, UpdateComplaintStatusBody, UpdateComplaintStatusParams } from "@workspace/api-zod";

const router = Router();

function formatComplaint(c: any, complainant?: any, pg?: any) {
  return {
    id: c.id,
    complainantId: c.complainantId,
    complainantName: complainant?.name || null,
    pgId: c.pgId,
    pgName: pg?.name || null,
    subject: c.subject,
    description: c.description,
    category: c.category,
    status: c.status,
    response: c.response,
    createdAt: c.createdAt?.toISOString?.() || c.createdAt,
    updatedAt: c.updatedAt?.toISOString?.() || c.updatedAt,
  };
}

router.get("/complaints", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const complaints = await db
    .select()
    .from(complaintsTable)
    .where(eq(complaintsTable.complainantId, user.id))
    .orderBy(desc(complaintsTable.createdAt));

  const results = await Promise.all(
    complaints.map(async (c) => {
      let pg = null;
      if (c.pgId) {
        [pg] = await db.select().from(pgsTable).where(eq(pgsTable.id, c.pgId)).limit(1);
      }
      return formatComplaint(c, user, pg);
    })
  );

  return res.json(results);
});

router.post("/complaints", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const parse = CreateComplaintBody.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid input: " + parse.error.message });
  }
  const data = parse.data;

  const [complaint] = await db.insert(complaintsTable).values({
    complainantId: user.id,
    pgId: data.pgId || null,
    subject: data.subject,
    description: data.description,
    category: data.category as any,
    status: "pending",
  }).returning();

  let pg = null;
  if (complaint.pgId) {
    [pg] = await db.select().from(pgsTable).where(eq(pgsTable.id, complaint.pgId)).limit(1);
  }

  return res.status(201).json(formatComplaint(complaint, user, pg));
});

router.put("/complaints/:id", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const parse = UpdateComplaintStatusParams.safeParse({ id: Number(req.params.id) });
  if (!parse.success) return res.status(400).json({ error: "Invalid id" });

  const [complaint] = await db.select().from(complaintsTable).where(eq(complaintsTable.id, parse.data.id)).limit(1);
  if (!complaint) return res.status(404).json({ error: "Complaint not found" });
  if (complaint.complainantId !== user.id && user.role !== "owner") {
    return res.status(403).json({ error: "Forbidden" });
  }

  const bodyParse = UpdateComplaintStatusBody.safeParse(req.body);
  if (!bodyParse.success) return res.status(400).json({ error: "Invalid input" });
  const { status, response } = bodyParse.data;

  const [updated] = await db.update(complaintsTable).set({
    status: status as any,
    ...(response && { response }),
    updatedAt: new Date(),
  }).where(eq(complaintsTable.id, parse.data.id)).returning();

  const [complainant] = await db.select().from(usersTable).where(eq(usersTable.id, updated.complainantId)).limit(1);
  let pg = null;
  if (updated.pgId) {
    [pg] = await db.select().from(pgsTable).where(eq(pgsTable.id, updated.pgId)).limit(1);
  }

  return res.json(formatComplaint(updated, complainant, pg));
});

export default router;
