import { pgTable, serial, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const surveysTable = pgTable("surveys", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  gradeGroup: text("grade_group").notNull(),
  surveyType: text("survey_type").notNull(),
  status: text("status").notNull().default("draft"),
  questions: jsonb("questions").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSurveySchema = createInsertSchema(surveysTable).omit({ id: true, createdAt: true });
export type InsertSurvey = z.infer<typeof insertSurveySchema>;
export type Survey = typeof surveysTable.$inferSelect;
