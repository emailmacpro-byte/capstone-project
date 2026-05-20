import { Router } from "express";
import { db } from "@workspace/db";
import { casesTable, caseNotesTable, insertCaseSchema } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

async function getCaseWithNotes(id: number) {
  const [caseItem] = await db.select().from(casesTable).where(eq(casesTable.id, id));
  if (!caseItem) return null;
  const notes = await db.select().from(caseNotesTable).where(eq(caseNotesTable.caseId, id));
  return { ...caseItem, notes, flags: (caseItem.flags as string[]) || [] };
}

router.get("/cases", async (req, res) => {
  try {
    const { assignedTo, status, riskLevel } = req.query;
    let cases = await db.select().from(casesTable);
    if (assignedTo) cases = cases.filter((c) => c.assignedTo === parseInt(assignedTo as string));
    if (status) cases = cases.filter((c) => c.status === status);
    if (riskLevel) cases = cases.filter((c) => c.riskLevel === riskLevel);

    const casesWithNotes = await Promise.all(
      cases.map(async (c) => {
        const notes = await db.select().from(caseNotesTable).where(eq(caseNotesTable.caseId, c.id));
        return { ...c, notes, flags: (c.flags as string[]) || [] };
      })
    );
    res.json(casesWithNotes);
  } catch (err) {
    req.log.error({ err }, "Failed to get cases");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/cases", async (req, res) => {
  try {
    const parsed = insertCaseSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
    const [caseItem] = await db.insert(casesTable).values(parsed.data).returning();
    res.status(201).json({ ...caseItem, notes: [], flags: (caseItem.flags as string[]) || [] });
  } catch (err) {
    req.log.error({ err }, "Failed to create case");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/cases/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const caseWithNotes = await getCaseWithNotes(id);
    if (!caseWithNotes) return res.status(404).json({ error: "Not found" });
    res.json(caseWithNotes);
  } catch (err) {
    req.log.error({ err }, "Failed to get case");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/cases/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const updateSchema = z.object({
      status: z.string().optional(),
      assignedTo: z.number().optional(),
      riskLevel: z.string().optional(),
    });
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
    const [updated] = await db.update(casesTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(casesTable.id, id))
      .returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    const notes = await db.select().from(caseNotesTable).where(eq(caseNotesTable.caseId, id));
    res.json({ ...updated, notes, flags: (updated.flags as string[]) || [] });
  } catch (err) {
    req.log.error({ err }, "Failed to update case");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/cases/:id/notes", async (req, res) => {
  try {
    const caseId = parseInt(req.params.id);
    if (isNaN(caseId)) return res.status(400).json({ error: "Invalid id" });
    const noteSchema = z.object({
      content: z.string(),
      action: z.string(),
      authorId: z.number().optional(),
    });
    const parsed = noteSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
    const [note] = await db.insert(caseNotesTable).values({ caseId, ...parsed.data }).returning();
    await db.update(casesTable).set({ updatedAt: new Date() }).where(eq(casesTable.id, caseId));
    res.status(201).json(note);
  } catch (err) {
    req.log.error({ err }, "Failed to add case note");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
