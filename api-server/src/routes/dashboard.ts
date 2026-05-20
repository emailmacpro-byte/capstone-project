import { Router } from "express";
import { db } from "@workspace/db";
import { surveyResponsesTable, casesTable, caseNotesTable, usersTable, surveysTable, classroomsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

function getRiskSummary(items: Array<{ riskLevel: string }>) {
  return items.reduce(
    (acc, item) => {
      const level = item.riskLevel as "green" | "yellow" | "orange" | "red";
      if (level in acc) acc[level]++;
      acc.total++;
      return acc;
    },
    { green: 0, yellow: 0, orange: 0, red: 0, total: 0 }
  );
}

router.get("/dashboard/teacher", async (req, res) => {
  try {
    const { classroomId } = req.query;
    const classrooms = await db.select().from(classroomsTable);
    const allResponses = await db.select().from(surveyResponsesTable).orderBy(desc(surveyResponsesTable.createdAt)).limit(20);
    const openCases = await db.select().from(casesTable).where(eq(casesTable.status, "open"));

    const filteredResponses = classroomId
      ? allResponses.filter((r) => r.classroomId === parseInt(classroomId as string))
      : allResponses;

    const riskSummary = getRiskSummary(filteredResponses);
    const weeklyAlerts = filteredResponses.filter((r) => r.riskLevel === "orange" || r.riskLevel === "red").length;

    const casesWithNotes = await Promise.all(
      openCases.slice(0, 10).map(async (c) => {
        const notes = await db.select().from(caseNotesTable).where(eq(caseNotesTable.caseId, c.id));
        return { ...c, notes, flags: (c.flags as string[]) || [] };
      })
    );

    res.json({
      classrooms,
      riskSummary,
      recentResponses: filteredResponses.slice(0, 10),
      followUpList: casesWithNotes,
      weeklyAlerts,
      bullyingIndex: Math.round((riskSummary.orange + riskSummary.red) / Math.max(riskSummary.total, 1) * 100) / 100,
      lonelinessIndex: Math.round(riskSummary.yellow / Math.max(riskSummary.total, 1) * 100) / 100,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get teacher dashboard");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/dashboard/psychologist", async (req, res) => {
  try {
    const allCases = await db.select().from(casesTable).orderBy(desc(casesTable.createdAt));
    const activeCases = allCases.filter((c) => c.status === "open" || c.status === "in_progress");
    const closedThisMonth = allCases.filter((c) => {
      const d = new Date(c.updatedAt);
      const now = new Date();
      return c.status === "closed" && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    const activeCasesWithNotes = await Promise.all(
      activeCases.slice(0, 15).map(async (c) => {
        const notes = await db.select().from(caseNotesTable).where(eq(caseNotesTable.caseId, c.id)).orderBy(desc(caseNotesTable.createdAt));
        return { ...c, notes, flags: (c.flags as string[]) || [] };
      })
    );

    const recentActivity = await db.select().from(caseNotesTable).orderBy(desc(caseNotesTable.createdAt)).limit(10);
    const allResponses = await db.select().from(surveyResponsesTable);
    const riskSummary = getRiskSummary(allResponses);

    res.json({
      activeCases: activeCasesWithNotes,
      riskSummary,
      recentActivity,
      pendingReferrals: activeCases.filter((c) => c.status === "open" && (c.riskLevel === "orange" || c.riskLevel === "red")).length,
      totalCases: allCases.length,
      closedThisMonth,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get psychologist dashboard");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/dashboard/admin", async (req, res) => {
  try {
    const users = await db.select().from(usersTable);
    const surveys = await db.select().from(surveysTable);
    const responses = await db.select().from(surveyResponsesTable);
    const classrooms = await db.select().from(classroomsTable);

    const now = new Date();
    const completedThisMonth = responses.filter((r) => {
      const d = new Date(r.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    const avgRiskScore = responses.length > 0
      ? Math.round(responses.reduce((acc, r) => acc + r.riskScore, 0) / responses.length * 10) / 10
      : 0;

    const riskSummary = getRiskSummary(responses);
    const highRisk = responses.filter((r) => r.riskLevel === "orange" || r.riskLevel === "red").length;
    const participationRate = classrooms.length > 0
      ? Math.min(1, responses.length / (classrooms.length * 10))
      : 0;

    res.json({
      userStats: {
        total: users.length,
        students: users.filter((u) => u.role === "student").length,
        teachers: users.filter((u) => u.role === "teacher").length,
        psychologists: users.filter((u) => u.role === "psychologist" || u.role === "social_worker").length,
        admins: users.filter((u) => u.role === "admin").length,
      },
      surveyStats: {
        total: surveys.length,
        active: surveys.filter((s) => s.status === "active").length,
        completedThisMonth,
        avgRiskScore,
      },
      riskSummary,
      schoolStats: {
        totalClassrooms: classrooms.length,
        avgBullyingIndex: Math.round(highRisk / Math.max(responses.length, 1) * 100) / 100,
        avgLonelinessIndex: Math.round(riskSummary.yellow / Math.max(responses.length, 1) * 100) / 100,
        participationRate: Math.round(participationRate * 100) / 100,
      },
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get admin dashboard");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
