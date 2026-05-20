import { Router } from "express";
import { db } from "@workspace/db";
import { surveyResponsesTable, surveysTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

function calculateRiskLevel(score: number): string {
  if (score <= 25) return "green";
  if (score <= 50) return "yellow";
  if (score <= 75) return "orange";
  return "red";
}

function calculateRiskScore(answers: Array<{ questionId: string; value: string }>, questions: Array<{ id: string; options: Array<{ value: string; riskScore?: number | null }> }>): { score: number; flags: string[] } {
  let totalScore = 0;
  const flags: string[] = [];

  for (const answer of answers) {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) continue;
    const option = question.options.find((o) => o.value === answer.value);
    if (option?.riskScore) {
      totalScore += option.riskScore;
      if (option.riskScore >= 20) {
        flags.push(question.id);
      }
    }
  }

  const normalizedScore = Math.min(100, totalScore);
  return { score: normalizedScore, flags };
}

router.get("/survey-responses", async (req, res) => {
  try {
    const { studentId, riskLevel, classroomId } = req.query;
    let responses = await db.select().from(surveyResponsesTable);
    if (riskLevel) responses = responses.filter((r) => r.riskLevel === riskLevel);
    if (classroomId) responses = responses.filter((r) => r.classroomId === parseInt(classroomId as string));
    res.json(responses);
  } catch (err) {
    req.log.error({ err }, "Failed to get survey responses");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/survey-responses", async (req, res) => {
  try {
    const bodySchema = z.object({
      surveyId: z.number(),
      studentCode: z.string(),
      studentName: z.string().optional(),
      classroomId: z.number().optional(),
      grade: z.string().optional(),
      answers: z.array(z.object({ questionId: z.string(), value: z.string() })),
    });
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

    const { surveyId, answers, ...rest } = parsed.data;
    const [survey] = await db.select().from(surveysTable).where(eq(surveysTable.id, surveyId));
    
    let riskScore = 0;
    let riskLevel = "green";
    let flags: string[] = [];

    if (survey && survey.questions) {
      const questions = survey.questions as Array<{ id: string; options: Array<{ value: string; riskScore?: number | null }> }>;
      const result = calculateRiskScore(answers, questions);
      riskScore = result.score;
      riskLevel = calculateRiskLevel(riskScore);
      flags = result.flags;
    } else {
      const avgScore = answers.reduce((acc, a) => {
        const numVal = parseInt(a.value);
        return acc + (isNaN(numVal) ? 0 : numVal);
      }, 0);
      riskScore = Math.min(100, avgScore);
      riskLevel = calculateRiskLevel(riskScore);
    }

    const [response] = await db.insert(surveyResponsesTable).values({
      surveyId,
      answers,
      riskScore,
      riskLevel,
      flags,
      ...rest,
    }).returning();

    res.status(201).json(response);
  } catch (err) {
    req.log.error({ err }, "Failed to submit survey response");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/survey-responses/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const [response] = await db.select().from(surveyResponsesTable).where(eq(surveyResponsesTable.id, id));
    if (!response) return res.status(404).json({ error: "Not found" });
    res.json(response);
  } catch (err) {
    req.log.error({ err }, "Failed to get survey response");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
