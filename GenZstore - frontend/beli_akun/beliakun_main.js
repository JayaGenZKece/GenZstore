// ==========================================
// 4. LOGIKA HAMBURGER MENU (MODE HP)
// ==========================================
const hamburgerBtn = document.getElementById("hamburger-btn");
const mobileMenu = document.getElementById("mobile-menu");
const hamburgerIcon = document.getElementById("hamburger-icon");

if (hamburgerBtn && mobileMenu) {
  hamburgerBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
    if (mobileMenu.classList.contains("hidden")) {
      hamburgerIcon.classList.remove("fa-xmark");
      hamburgerIcon.classList.add("fa-bars");
    } else {
      hamburgerIcon.classList.remove("fa-bars");
      hamburgerIcon.classList.add("fa-xmark");
    }
  });
}

// ==========================================
// 6. LOGIKA SLIDER BERITA & MODAL POP-UP
// ==========================================

// --- A. Logika Slider Berita (Modern & Mulus) ---
function moveNews(direction) {
  const track = document.getElementById("news-track");

  // Kalau ID-nya ga ketemu, batalkan
  if (!track) return;

  // Jarak geser = Lebar 1 kartu (350px) + Jarak gap (24px)
  const scrollAmount = 374;

  if (direction === "next") {
    // Geser ke kanan dengan efek smooth
    track.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  } else {
    // Geser ke kiri dengan efek smooth
    track.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  }
}

// --- B. Logika Data & Pop-up (Modal) Berita Lengkap ---

// Database isi berita lengkap lu (Tinggal lu edit teksnya di sini)
const newsDatabase = {
  berita1: {
    title: "5 Metode Pembayaran Top Up ML Paling Murah (Dana, QRIS, Pulsa?)",
    date: "11-03-2026",
    img: "assets/img/berita-1.jpg",
    content: `
            <p><strong>GenZstore</strong> - Mencari metode pembayaran termurah untuk top up diamond Mobile Legends adalah hal yang wajib dilakukan oleh para gamers cerdas.</p>
            <p>Saat ini, QRIS dan E-Wallet seperti DANA menjadi pilihan paling populer karena sering memberikan promo *cashback* yang lumayan besar. Berbeda dengan pembayaran via pulsa yang biasanya terkena biaya admin atau pajak yang cukup tinggi.</p>
            <h3 class="font-bold text-lg mt-4 mb-2">Rekomendasi Metode Pembayaran:</h3>
            <ul class="list-disc pl-5 mb-4">
                <li><strong>QRIS (All Bank/E-Wallet):</strong> Bebas biaya admin, proses instan. Sangat disarankan!</li>
                <li><strong>DANA/OVO/GoPay:</strong> Cepat, praktis, dan sering ada promo dari aplikasinya.</li>
                <li><strong>Transfer Bank (Virtual Account):</strong> Aman untuk transaksi besar, biaya admin kecil.</li>
            </ul>
            <p>Pastikan kamu selalu mengecek halaman utama GenZstore untuk melihat promo potongan harga terbaru ya!</p>
        `,
  },
  berita2: {
    title: "Jam Terbaik Top Up Mobile Legends Biar Dapat Harga Lebih Murah",
    date: "09-03-2026",
    img: "assets/img/berita-2.jpg",
    content: `
            <p><strong>GenZstore</strong> - Tahukah kamu bahwa ada jam-jam tertentu yang bisa bikin top up diamond ML kamu jauh lebih murah?</p>
            <p>Banyak website top up, termasuk GenZstore, sering mengadakan *Flash Sale* dadakan pada jam-jam spesifik. Biasanya, *Flash Sale* terjadi di waktu-waktu berikut:</p>
            <ul class="list-disc pl-5 mb-4">
                <li><strong>Jam Malam (00:00 - 02:00 WIB):</strong> Waktu pergantian hari biasanya menjadi momen reset promo dan *Flash Sale* tengah malam.</li>
                <li><strong>Jam Istirahat (12:00 - 14:00 WIB):</strong> Sering ada promo makan siang untuk menemani waktu *break* kamu.</li>
                <li><strong>Saat Event Besar MLBB:</strong> Seperti event KOF, Aspirants, atau Promo Diamond Kuning. Di momen ini harga diamond sering anjlok!</li>
            </ul>
            <p>Sering-sering *refresh* halaman GenZstore ya biar nggak ketinggalan *Flash Sale* kilat dari kami!</p>
        `,
  },
  berita3: {
    title: "Jangan Asal Top Up! Ini 5 Ciri Website ML Yang Berbahaya",
    date: "08-03-2026",
    img: "assets/img/berita-3.jpg",
    content: `
            <p><strong>GenZstore</strong> - Maraknya kasus penipuan (*scam*) akun Mobile Legends membuat kita harus ekstra hati-hati saat memilih tempat top up atau joki.</p>
            <p>Agar akun kamu aman dari *hack*, perhatikan 5 ciri website berbahaya ini:</p>
            <ol class="list-decimal pl-5 mb-4">
                <li><strong>Harga Terlalu Murah Tidak Masuk Akal:</strong> Jika harganya 80% lebih murah dari harga normal, itu 99% penipuan phising.</li>
                <li><strong>Meminta Password/Email:</strong> Top up legal HANYA membutuhkan ID Server dan User ID. JANGAN PERNAH berikan password akun kamu!</li>
                <li><strong>Desain Website Berantakan:</strong> Website penipu biasanya dibuat asal-asalan dan menggunakan domain gratisan.</li>
                <li><strong>Tidak Ada Kontak Customer Service:</strong> Website resmi seperti GenZstore pasti memiliki tombol WhatsApp CS yang aktif dan responsif.</li>
                <li><strong>Memaksa Klik Link Aneh:</strong> Hindari mengklik *link* promosi yang dikirim dari orang tidak dikenal di dalam *game*.</li>
            </ol>
            <p>Transaksi aman, cepat, dan terpercaya? Tentu saja cuma di <strong>GenZstore ID</strong>!</p>
        `,
  },
  berita4: {
    title: "Bocoran Skin Baru Free Fire Spesial Ramadhan 2026",
    date: "05-03-2026",
    img: "assets/img/berita-4.jpg",
    content: `
            <p><strong>GenZstore</strong> - Menjelang bulan Ramadhan, Garena Free Fire selalu menyiapkan event besar-besaran dengan hadiah skin eksklusif yang keren parah!</p>
            <p>Bocoran terbaru menyebutkan bahwa tahun ini akan ada bundle bertema Timur Tengah modern dengan efek partikel cahaya bulan yang epik. Selain itu, kabarnya juga akan ada *Mystery Shop* spesial dengan diskon hingga 90%!</p>
            <p>Siapkan tabungan diamond kamu dari sekarang. Beli diamond FF murah dan aman langsung meluncur ke menu Top Up GenZstore ya!</p>
        `,
  },
};

function openNewsModal(newsId) {
  const modal = document.getElementById("news-modal");
  const modalContent = document.getElementById("news-modal-content");
  const data = newsDatabase[newsId];

  if (data && modal) {
    // Masukkan data ke dalam HTML Modal
    document.getElementById("modal-title").textContent = data.title;
    document.getElementById("modal-date").textContent = data.date;
    document.getElementById("modal-img").src = data.img;
    document.getElementById("modal-body").innerHTML = data.content; // Pakai innerHTML karena isinya ada tag <p>, <ul>, dll

    // Tampilkan Modal dengan animasi
    modal.classList.remove("hidden");
    modal.classList.add("flex");

    // Delay sedikit agar efek fade in jalan
    setTimeout(() => {
      modal.classList.remove("opacity-0");
      modal.classList.add("opacity-100");
      modalContent.classList.remove("scale-95");
      modalContent.classList.add("scale-100");
    }, 50);

    // Kunci background agar tidak bisa di-scroll saat baca berita
    document.body.style.overflow = "hidden";
  }
}

function closeNewsModal() {
  const modal = document.getElementById("news-modal");
  const modalContent = document.getElementById("news-modal-content");

  if (modal) {
    // Animasi fade out
    modal.classList.remove("opacity-100");
    modal.classList.add("opacity-0");
    modalContent.classList.remove("scale-100");
    modalContent.classList.add("scale-95");

    // Sembunyikan setelah animasi selesai
    setTimeout(() => {
      modal.classList.remove("flex");
      modal.classList.add("hidden");
      // Buka kunci scroll background
      document.body.style.overflow = "";
    }, 300); // Harus sama dengan durasi transisi di Tailwind (duration-300)
  }
}

// Tutup modal kalau user klik area hitam di luar kotak putih
document.getElementById("news-modal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeNewsModal();
  }
});

// ==========================================
// 7. LOGIKA AKORDION FAQ (Buka Tutup)
// ==========================================

function toggleFaq(id) {
  const answer = document.getElementById(`faq-answer-${id}`);
  const arrow = document.getElementById(`faq-arrow-${id}`);
  const plusIcon = document.getElementById(`faq-plus-${id}`);

  // Cek apakah jawaban sedang disembunyikan
  if (answer.classList.contains("hidden")) {
    // Buka jawabannya
    answer.classList.remove("hidden");
    // Putar panah ke atas (180 derajat)
    arrow.classList.add("rotate-180");
    // Ganti icon plus jadi minus
    plusIcon.classList.remove("fa-plus");
    plusIcon.classList.add("fa-minus");
  } else {
    // Tutup kembali jawabannya
    answer.classList.add("hidden");
    // Kembalikan posisi panah
    arrow.classList.remove("rotate-180");
    // Ganti icon minus jadi plus lagi
    plusIcon.classList.remove("fa-minus");
    plusIcon.classList.add("fa-plus");
  }
}
