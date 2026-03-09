// src/routes/orders.js
const express = require('express');
const router  = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

// ── POST /api/orders  (buat order baru) ─────────────────
router.post('/', auth, async (req, res) => {
  try {
    const { accountId, notes } = req.body;

    const account = await prisma.account.findUnique({ where: { id: accountId } });
    if (!account) return res.status(404).json({ error: 'Akun tidak ditemukan' });
    if (account.status !== 'AVAILABLE') return res.status(400).json({ error: 'Akun sudah tidak tersedia' });

    // Lock akun sementara
    await prisma.account.update({ where: { id: accountId }, data: { status: 'PENDING' } });

    const order = await prisma.order.create({
      data: {
        accountId,
        buyerId: req.user.id,
        amount:  account.priceSell,
        notes,
      },
      include: { account: true },
    });

    // TODO: Integrasikan payment gateway (Midtrans/Xendit) di sini
    // const paymentUrl = await createPayment(order);

    res.status(201).json({ order, paymentUrl: null /* ganti dengan URL asli */ });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal membuat order' });
  }
});

// ── GET /api/orders  (riwayat order user) ───────────────
router.get('/', auth, async (req, res) => {
  const orders = await prisma.order.findMany({
    where:   { buyerId: req.user.id },
    orderBy: { createdAt: 'desc' },
    include: { account: { select: { code: true, images: true, priceSell: true } } },
  });
  res.json(orders);
});

// ── GET /api/orders/:id ─────────────────────────────────
router.get('/:id', auth, async (req, res) => {
  const order = await prisma.order.findUnique({
    where:   { id: req.params.id },
    include: {
      account: { include: { seller: { select: { username: true, whatsapp: true } } } },
      buyer:   { select: { username: true, email: true } },
    },
  });
  if (!order) return res.status(404).json({ error: 'Order tidak ditemukan' });
  if (order.buyerId !== req.user.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Akses ditolak' });
  }
  res.json(order);
});

// ── PATCH /api/orders/:id/cancel ────────────────────────
router.patch('/:id/cancel', auth, async (req, res) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!order || order.buyerId !== req.user.id) return res.status(403).json({ error: 'Akses ditolak' });
  if (!['PENDING'].includes(order.status)) return res.status(400).json({ error: 'Order tidak bisa dibatalkan' });

  await Promise.all([
    prisma.order.update({ where: { id: order.id }, data: { status: 'CANCELLED' } }),
    prisma.account.update({ where: { id: order.accountId }, data: { status: 'AVAILABLE' } }),
  ]);
  res.json({ message: 'Order dibatalkan' });
});

module.exports = router;
