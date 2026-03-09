// src/routes/auth.js
const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

const prisma = new PrismaClient();

// ── Schema validasi ─────────────────────────────────────
const registerSchema = z.object({
  username: z.string().min(3).max(20),
  email:    z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string(),
});

// ── Helper buat token ───────────────────────────────────
function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// ── POST /api/auth/register ─────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);

    const exists = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { username: data.username }] },
    });
    if (exists) return res.status(400).json({ error: 'Email atau username sudah digunakan' });

    const hashed = await bcrypt.hash(data.password, 10);
    const user   = await prisma.user.create({
      data: { ...data, password: hashed },
      select: { id: true, username: true, email: true, role: true },
    });

    res.status(201).json({ token: signToken(user), user });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Gagal mendaftar' });
  }
});

// ── POST /api/auth/login ────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Email atau password salah' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Email atau password salah' });

    const { password: _, ...safeUser } = user;
    res.json({ token: signToken(user), user: safeUser });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Gagal login' });
  }
});

// ── GET /api/auth/me ────────────────────────────────────
router.get('/me', require('../middleware/auth'), async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, username: true, email: true, role: true, avatar: true, whatsapp: true, createdAt: true },
  });
  res.json(user);
});

module.exports = router;
