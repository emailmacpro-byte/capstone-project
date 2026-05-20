import { Router } from "express";
import { db } from "@workspace/db";
import { surveysTable, insertSurveySchema } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

router.get("/surveys", async (req, res) => {
  try {
    const { status, gradeGroup } = req.query;
    let surveys = await db.select().from(surveysTable);
    if (status) surveys = surveys.filter((s) => s.status === status);
    if (gradeGroup) surveys = surveys.filter((s) => s.gradeGroup === gradeGroup);
    res.json(surveys);
  } catch (err) {
    req.log.error({ err }, "Failed to get surveys");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/surveys", async (req, res) => {
  try {
    const parsed = insertSurveySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
    const [survey] = await db.insert(surveysTable).values(parsed.data).returning();
    res.status(201).json(survey);
  } catch (err) {
    req.log.error({ err }, "Failed to create survey");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/surveys/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const [survey] = await db.select().from(surveysTable).where(eq(surveysTable.id, id));
    if (!survey) return res.status(404).json({ error: "Not found" });
    res.json(survey);
  } catch (err) {
    req.log.error({ err }, "Failed to get survey");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/surveys/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const updateSchema = z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      status: z.string().optional(),
      questions: z.array(z.any()).optional(),
    });
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
    const [updated] = await db.update(surveysTable).set(parsed.data).where(eq(surveysTable.id, id)).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update survey");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
