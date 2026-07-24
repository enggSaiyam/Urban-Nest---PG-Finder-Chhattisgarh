import { Router } from "express";
import { db, pgsTable } from "@workspace/db";
import { CHHATTISGARH_CITIES } from "../data/cities";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/cities", async (_req, res) => {
  try {
    // Count PGs per city
    const pgCounts = await db
      .select({ city: pgsTable.city, count: sql<number>`count(*)::int` })
      .from(pgsTable)
      .groupBy(pgsTable.city);

    const countMap = new Map(pgCounts.map((r) => [r.city, r.count]));

    const cities = CHHATTISGARH_CITIES.map((c) => ({
      ...c,
      pgCount: countMap.get(c.name) || 0,
    }));

    return res.json(cities);
  } catch {
    return res.json(CHHATTISGARH_CITIES.map((c) => ({ ...c, pgCount: 0 })));
  }
});

export default router;
