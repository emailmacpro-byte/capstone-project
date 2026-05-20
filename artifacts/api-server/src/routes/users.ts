import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, classroomsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

router.get("/users", async (req, res) => {
  try {
    const { role } = req.query;
    let users = await db.select().from(usersTable);
    if (role) users = users.filter((u) => u.role === role);
    // Never return passwords
    const safe = users.map(({ password: _p, ...u }) => u);
    res.json(safe);
  } catch (err) {
    req.log.error({ err }, "Failed to get users");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/users/register", async (req, res) => {
  try {
    const schema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().min(1),
      password: z.string().min(4),
      role: z.enum(["teacher", "psychologist"]),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Мэдээлэл буруу байна" });
    }
    const { name, email, phone, password, role } = parsed.data;

    // Check if email already exists
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (existing.length > 0) {
      return res.status(400).json({ error: "Энэ имэйл хаяг бүртгэлтэй байна" });
    }

    const [user] = await db.insert(usersTable).values({ name, email, phone, password, role }).returning();
    const { password: _p, ...safe } = user;
    res.status(201).json(safe);
  } catch (err) {
    req.log.error({ err }, "Failed to register user");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(1),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Мэдээлэл буруу байна" });
    }
    const { email, password } = parsed.data;

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!user) {
      return res.status(401).json({ error: "Имэйл эсвэл нууц үг буруу байна" });
    }
    if (user.password !== password) {
      return res.status(401).json({ error: "Имэйл эсвэл нууц үг буруу байна" });
    }
    const { password: _p, ...safe } = user;
    res.json(safe);
  } catch (err) {
    req.log.error({ err }, "Failed to login user");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/users", async (req, res) => {
  try {
    const schema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      role: z.string().default("student"),
      phone: z.string().optional(),
      classroomId: z.number().optional(),
      grade: z.string().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
    const [user] = await db.insert(usersTable).values(parsed.data).returning();
    const { password: _p, ...safe } = user;
    res.status(201).json(safe);
  } catch (err) {
    req.log.error({ err }, "Failed to create user");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/users/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const updateSchema = z.object({
      name: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      password: z.string().optional(),
      role: z.string().optional(),
      isActive: z.boolean().optional(),
      classroomId: z.number().optional(),
    });
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
    const [updated] = await db.update(usersTable).set(parsed.data).where(eq(usersTable.id, id)).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    const { password: _p, ...safe } = updated;
    res.json(safe);
  } catch (err) {
    req.log.error({ err }, "Failed to update user");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/classrooms", async (req, res) => {
  try {
    const classrooms = await db.select().from(classroomsTable);
    res.json(classrooms);
  } catch (err) {
    req.log.error({ err }, "Failed to get classrooms");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
