// src/routes/upload.js
// Upload gambar ke Cloudinary (gratis 25GB/bulan)
const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const auth    = require('../middleware/auth');

// Simpan di memory dulu, lalu kirim ke Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 }, // maks 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Hanya file gambar yang diperbolehkan'));
    }
    cb(null, true);
  },
});

// POST /api/upload/image
router.post('/image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Tidak ada file' });

    // ── Upload ke Cloudinary ──────────────────────────
    // Install: npm install cloudinary
    // const cloudinary = require('cloudinary').v2;
    // cloudinary.config({ cloud_name, api_key, api_secret });
    //
    // const result = await new Promise((resolve, reject) => {
    //   const stream = cloudinary.uploader.upload_stream(
    //     { folder: 'mlshop/accounts' },
    //     (err, result) => err ? reject(err) : resolve(result)
    //   );
    //   stream.end(req.file.buffer);
    // });
    // return res.json({ url: result.secure_url });

    // ── Placeholder (ganti dengan Cloudinary di atas) ──
    res.json({
      url: `https://placehold.co/400x300/1a2a3a/ffffff?text=${encodeURIComponent(req.file.originalname)}`,
      message: 'Aktifkan Cloudinary di src/routes/upload.js',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
