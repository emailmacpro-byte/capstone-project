import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  password: text("password"),
  role: text("role").notNull().default("student"),
  classroomId: integer("classroom_id"),
  grade: text("grade"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;

export const classroomsTable = pgTable("classrooms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  grade: text("grade").notNull(),
  teacherId: integer("teacher_id"),
  studentCount: integer("student_count").notNull().default(0),
});

export const insertClassroomSchema = createInsertSchema(classroomsTable).omit({ id: true });
export type InsertClassroom = z.infer<typeof insertClassroomSchema>;
export type Classroom = typeof classroomsTable.$inferSelect;
