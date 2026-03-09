// src/routes/users.js
const express = require('express');
const router  = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

// GET /api/users/me/wishlist
router.get('/me/wishlist', auth, async (req, res) => {
  const wishlist = await prisma.wishlist.findMany({
    where: { userId: req.user.id },
    include: { account: true },
  });
  res.json(wishlist);
});

// GET /api/users/me/accounts  (akun yang diposting)
router.get('/me/accounts', auth, async (req, res) => {
  const accounts = await prisma.account.findMany({
    where:   { sellerId: req.user.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json(accounts);
});

// PATCH /api/users/me  (update profil)
router.patch('/me', auth, async (req, res) => {
  const { whatsapp, avatar } = req.body;
  const user = await prisma.user.update({
    where:  { id: req.user.id },
    data:   { whatsapp, avatar },
    select: { id: true, username: true, email: true, whatsapp: true, avatar: true },
  });
  res.json(user);
});

module.exports = router;
