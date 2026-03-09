// src/routes/accounts.js
const express = require('express');
const router  = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

// ── GET /api/accounts  (list + filter + search) ─────────
router.get('/', async (req, res) => {
  try {
    const {
      status,        // AVAILABLE | SOLD | PENDING
      minPrice,
      maxPrice,
      sort = 'terbaru', // terbaru | termurah | termahal | terpopuler
      search,
      flashSale,
      page  = 1,
      limit = 12,
    } = req.query;

    const where = {};
    if (status)   where.status = status;
    if (flashSale === 'true') where.isFlashSale = true;
    if (search)   where.code = { contains: search, mode: 'insensitive' };
    if (minPrice || maxPrice) {
      where.priceSell = {};
      if (minPrice) where.priceSell.gte = parseInt(minPrice);
      if (maxPrice) where.priceSell.lte = parseInt(maxPrice);
    }

    const orderBy =
      sort === 'termurah'   ? { priceSell: 'asc' }  :
      sort === 'termahal'   ? { priceSell: 'desc' } :
      sort === 'terpopuler' ? { views: 'desc' }      :
                              { createdAt: 'desc' };

    const [accounts, total] = await Promise.all([
      prisma.account.findMany({
        where,
        orderBy,
        skip:  (parseInt(page) - 1) * parseInt(limit),
        take:  parseInt(limit),
        include: {
          seller:   { select: { username: true, avatar: true } },
          _count:   { select: { wishlist: true } },
        },
      }),
      prisma.account.count({ where }),
    ]);

    res.json({ accounts, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil data akun' });
  }
});

// ── GET /api/accounts/popular ───────────────────────────
router.get('/popular', async (req, res) => {
  const accounts = await prisma.account.findMany({
    where:   { status: 'AVAILABLE' },
    orderBy: { views: 'desc' },
    take:    6,
    include: { _count: { select: { wishlist: true } } },
  });
  res.json(accounts);
});

// ── GET /api/accounts/:id ───────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const account = await prisma.account.findUnique({
      where:   { id: req.params.id },
      include: {
        seller:  { select: { username: true, avatar: true, whatsapp: true } },
        reviews: { include: { user: { select: { username: true, avatar: true } } } },
        _count:  { select: { wishlist: true } },
      },
    });
    if (!account) return res.status(404).json({ error: 'Akun tidak ditemukan' });

    // increment views
    await prisma.account.update({ where: { id: account.id }, data: { views: { increment: 1 } } });

    res.json(account);
  } catch {
    res.status(500).json({ error: 'Gagal mengambil detail akun' });
  }
});

// ── POST /api/accounts  (seller post akun) ─────────────
router.post('/', auth, async (req, res) => {
  try {
    const {
      code, title, description, priceOriginal, priceSell,
      images, heroCount, skinCount, emblemLevel, winRate, rankTier,
    } = req.body;

    if (!code || !priceSell) {
      return res.status(400).json({ error: 'Code dan harga wajib diisi' });
    }

    const account = await prisma.account.create({
      data: {
        code, title, description,
        priceOriginal: parseInt(priceOriginal),
        priceSell:     parseInt(priceSell),
        images:        images || [],
        heroCount:     heroCount ? parseInt(heroCount) : null,
        skinCount:     skinCount ? parseInt(skinCount) : null,
        emblemLevel:   emblemLevel ? parseInt(emblemLevel) : null,
        winRate:       winRate ? parseFloat(winRate) : null,
        rankTier,
        sellerId: req.user.id,
      },
    });
    res.status(201).json(account);
  } catch (err) {
    res.status(500).json({ error: 'Gagal memposting akun' });
  }
});

// ── DELETE /api/accounts/:id ────────────────────────────
router.delete('/:id', auth, async (req, res) => {
  const account = await prisma.account.findUnique({ where: { id: req.params.id } });
  if (!account) return res.status(404).json({ error: 'Tidak ditemukan' });

  if (account.sellerId !== req.user.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Tidak berhak menghapus akun ini' });
  }

  await prisma.account.delete({ where: { id: req.params.id } });
  res.json({ message: 'Akun berhasil dihapus' });
});

// ── POST /api/accounts/:id/wishlist ─────────────────────
router.post('/:id/wishlist', auth, async (req, res) => {
  try {
    const existing = await prisma.wishlist.findUnique({
      where: { userId_accountId: { userId: req.user.id, accountId: req.params.id } },
    });
    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } });
      return res.json({ wishlisted: false });
    }
    await prisma.wishlist.create({ data: { userId: req.user.id, accountId: req.params.id } });
    res.json({ wishlisted: true });
  } catch {
    res.status(500).json({ error: 'Gagal update wishlist' });
  }
});

module.exports = router;
