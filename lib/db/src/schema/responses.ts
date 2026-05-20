import { pgTable, serial, text, integer, real, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const surveyResponsesTable = pgTable("survey_responses", {
  id: serial("id").primaryKey(),
  surveyId: integer("survey_id").notNull(),
  studentCode: text("student_code").notNull(),
  studentName: text("student_name"),
  classroomId: integer("classroom_id"),
  grade: text("grade"),
  answers: jsonb("answers").notNull().default([]),
  riskScore: real("risk_score").notNull().default(0),
  riskLevel: text("risk_level").notNull().default("green"),
  flags: jsonb("flags").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSurveyResponseSchema = createInsertSchema(surveyResponsesTable).omit({ id: true, createdAt: true });
export type InsertSurveyResponse = z.infer<typeof insertSurveyResponseSchema>;
export type SurveyResponse = typeof surveyResponsesTable.$inferSelect;
