import { pgTable, serial, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const casesTable = pgTable("cases", {
  id: serial("id").primaryKey(),
  studentCode: text("student_code").notNull(),
  studentName: text("student_name"),
  grade: text("grade"),
  classroomId: integer("classroom_id"),
  surveyResponseId: integer("survey_response_id"),
  riskLevel: text("risk_level").notNull().default("yellow"),
  status: text("status").notNull().default("open"),
  assignedTo: integer("assigned_to"),
  flags: jsonb("flags").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCaseSchema = createInsertSchema(casesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCase = z.infer<typeof insertCaseSchema>;
export type Case = typeof casesTable.$inferSelect;

export const caseNotesTable = pgTable("case_notes", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").notNull(),
  content: text("content").notNull(),
  action: text("action").notNull().default("talked"),
  authorId: integer("author_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCaseNoteSchema = createInsertSchema(caseNotesTable).omit({ id: true, createdAt: true });
export type InsertCaseNote = z.infer<typeof insertCaseNoteSchema>;
export type CaseNote = typeof caseNotesTable.$inferSelect;
