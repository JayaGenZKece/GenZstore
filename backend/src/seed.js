// src/seed.js  – jalankan: npm run db:seed
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Admin
  const adminPass = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where:  { email: 'admin@mlshop.id' },
    update: {},
    create: { email: 'admin@mlshop.id', username: 'admin', password: adminPass, role: 'ADMIN' },
  });

  // Seller
  const sellerPass = await bcrypt.hash('seller123', 10);
  const seller = await prisma.user.upsert({
    where:  { email: 'seller@mlshop.id' },
    update: {},
    create: { email: 'seller@mlshop.id', username: 'seller_dion', password: sellerPass, role: 'SELLER', whatsapp: '628123456789' },
  });

  // Sample akun ML
  const sampleAccounts = [
    { code: 'Code-1121', priceSell: 220000, priceOriginal: 275000, rankTier: 'Mythic', skinCount: 45, heroCount: 80, isFlashSale: true },
    { code: 'Code-1120', priceSell: 399999, priceOriginal: 499999, rankTier: 'Legend', skinCount: 62, heroCount: 95, isFlashSale: true },
    { code: 'Code-1119', priceSell: 175000, priceOriginal: 218000, rankTier: 'Epic',   skinCount: 28, heroCount: 60 },
    { code: 'Code-1118', priceSell: 335000, priceOriginal: 418000, rankTier: 'Mythic', skinCount: 50, heroCount: 88, isFlashSale: true },
    { code: 'Code-1117', priceSell: 499999, priceOriginal: 624999, rankTier: 'Mythic', skinCount: 75, heroCount: 100 },
    { code: 'Code-1116', priceSell: 230000, priceOriginal: 287000, rankTier: 'Epic',   skinCount: 35, heroCount: 70 },
    { code: 'Code-1106', priceSell: 570000, priceOriginal: 712000, rankTier: 'Mythic', skinCount: 88, heroCount: 110 },
    { code: 'Code-1078', priceSell: 670000, priceOriginal: 837000, rankTier: 'Mythical Glory', skinCount: 100, heroCount: 120, views: 147 },
    { code: 'Code-1115', priceSell: 270000, priceOriginal: 337000, rankTier: 'Legend', skinCount: 40, heroCount: 75, status: 'SOLD' },
    { code: 'Code-1114', priceSell: 165000, priceOriginal: 206000, rankTier: 'Epic',   skinCount: 22, heroCount: 55, status: 'SOLD' },
  ];

  for (const acc of sampleAccounts) {
    await prisma.account.upsert({
      where:  { code: acc.code },
      update: {},
      create: {
        ...acc,
        title:       'Akun Mobile Legends',
        description: `Akun ML ${acc.rankTier} dengan ${acc.skinCount} skin dan ${acc.heroCount} hero. Siap pakai!`,
        images:      [],
        sellerId:    seller.id,
      },
    });
  }

  // Banner
  await prisma.banner.createMany({
    skipDuplicates: true,
    data: [
      { imageUrl: 'https://placehold.co/1200x400/0f3460/f5a623?text=FLASH+SALE+ML+ACCOUNT', title: 'Flash Sale', order: 0 },
      { imageUrl: 'https://placehold.co/1200x400/601428/ffffff?text=AKUN+PREMIUM+MURAH',     title: 'Promo',      order: 1 },
      { imageUrl: 'https://placehold.co/1200x400/145a14/ffffff?text=GARANSI+100%25+AMAN',    title: 'Garansi',    order: 2 },
    ],
  });

  console.log('✅ Seeding selesai!');
  console.log('👤 Admin:  admin@mlshop.id  / admin123');
  console.log('👤 Seller: seller@mlshop.id / seller123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
