import { Router } from "express";
import { z } from "zod";
import { randomUUID } from "crypto";

const router = Router();

router.post("/notifications/send", async (req, res) => {
  try {
    const bodySchema = z.object({
      to: z.string(),
      subject: z.string(),
      type: z.string(),
      studentCode: z.string().optional(),
      studentEmail: z.string().optional(),
      studentPhone: z.string().optional(),
      riskLevel: z.string().optional(),
      grade: z.string().optional(),
      flags: z.array(z.string()).optional(),
    });
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

    const { to, subject, type, studentCode, studentEmail, studentPhone, riskLevel, grade, flags } = parsed.data;

    req.log.info({
      mockEmail: true,
      to,
      subject,
      type,
      studentCode,
      studentEmail,
      studentPhone,
      riskLevel,
      grade,
      flags,
    }, "Mock email notification sent");

    res.json({
      success: true,
      messageId: `mock-${randomUUID()}`,
      sentAt: new Date().toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to send notification");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
