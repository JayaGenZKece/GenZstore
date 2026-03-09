// src/routes/admin.js
const express = require('express');
const router  = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const { adminOnly } = require('../middleware/auth');

const prisma = new PrismaClient();

// Semua route admin butuh login + role ADMIN
router.use(auth, adminOnly);

// ── GET /api/admin/stats ────────────────────────────────
router.get('/stats', async (req, res) => {
  const [totalAccounts, totalSold, totalUsers, totalOrders, revenue] = await Promise.all([
    prisma.account.count({ where: { status: 'AVAILABLE' } }),
    prisma.account.count({ where: { status: 'SOLD' } }),
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true } }),
  ]);

  res.json({
    totalAccounts,
    totalSold,
    totalUsers,
    totalOrders,
    revenue: revenue._sum.amount || 0,
  });
});

// ── GET /api/admin/orders ───────────────────────────────
router.get('/orders', async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const where = status ? { status } : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip:    (parseInt(page) - 1) * parseInt(limit),
      take:    parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        account: { select: { code: true, priceSell: true } },
        buyer:   { select: { username: true, email: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);

  res.json({ orders, total });
});

// ── PATCH /api/admin/orders/:id ─────────────────────────
router.patch('/orders/:id', async (req, res) => {
  const { status } = req.body;
  const order = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!order) return res.status(404).json({ error: 'Order tidak ditemukan' });

  const updated = await prisma.order.update({
    where: { id: req.params.id },
    data:  { status },
  });

  // Kalau COMPLETED → tandai akun SOLD
  if (status === 'COMPLETED') {
    await prisma.account.update({ where: { id: order.accountId }, data: { status: 'SOLD' } });
  }
  // Kalau CANCELLED → kembalikan akun ke AVAILABLE
  if (status === 'CANCELLED') {
    await prisma.account.update({ where: { id: order.accountId }, data: { status: 'AVAILABLE' } });
  }

  res.json(updated);
});

// ── PATCH /api/admin/accounts/:id/flash-sale ────────────
router.patch('/accounts/:id/flash-sale', async (req, res) => {
  const { isFlashSale } = req.body;
  const account = await prisma.account.update({
    where: { id: req.params.id },
    data:  { isFlashSale: Boolean(isFlashSale) },
  });
  res.json(account);
});

// ── DELETE /api/admin/users/:id ─────────────────────────
router.delete('/users/:id', async (req, res) => {
  await prisma.user.delete({ where: { id: req.params.id } });
  res.json({ message: 'User dihapus' });
});

// ── Banner CRUD ─────────────────────────────────────────
router.get('/banners', async (req, res) => {
  res.json(await prisma.banner.findMany({ orderBy: { order: 'asc' } }));
});

router.post('/banners', async (req, res) => {
  const banner = await prisma.banner.create({ data: req.body });
  res.status(201).json(banner);
});

router.delete('/banners/:id', async (req, res) => {
  await prisma.banner.delete({ where: { id: req.params.id } });
  res.json({ message: 'Banner dihapus' });
});

module.exports = router;
