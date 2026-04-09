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
// 1. LOGIKA TAB SWITCHER
// ==========================================
function switchTab(tab) {
  const btnBanner = document.getElementById("btn-banner");
  const btnFlash = document.getElementById("btn-flash");
  const bannerSection = document.getElementById("banner-section");
  const contentFlash = document.getElementById("content-flash");

  const activeClass =
    "bg-gradient-to-r from-blue-700 to-blue-500 text-white border-2 border-cyanaccent shadow-[0_0_10px_rgba(0,168,255,0.5)]".split(
      " ",
    );
  const inactiveClass =
    "bg-navblue text-gray-300 border-2 border-gray-600".split(" ");

  if (tab === "banner") {
    bannerSection.classList.remove("hidden");
    bannerSection.classList.add("flex");

    contentFlash.classList.add("hidden");
    contentFlash.classList.remove("block");

    btnBanner.classList.remove(...inactiveClass);
    btnBanner.classList.add(...activeClass);
    btnFlash.classList.remove(...activeClass);
    btnFlash.classList.add(...inactiveClass);
  } else {
    bannerSection.classList.add("hidden");
    bannerSection.classList.remove("flex");

    contentFlash.classList.remove("hidden");
    contentFlash.classList.add("block");

    btnFlash.classList.remove(...inactiveClass);
    btnFlash.classList.add(...activeClass);
    btnBanner.classList.remove(...activeClass);
    btnBanner.classList.add(...inactiveClass);
  }
}

// ==========================================
// 2. LOGIKA AUTO SLIDER BANNER
// ==========================================
let currentSlide = 0;
let slideInterval;

function updateSliderPosition() {
  const track = document.getElementById("banner-track");
  if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextBanner() {
  const track = document.getElementById("banner-track");
  if (track) {
    currentSlide = (currentSlide + 1) % track.children.length;
    updateSliderPosition();
    resetTimer();
  }
}

function prevBanner() {
  const track = document.getElementById("banner-track");
  if (track) {
    const total = track.children.length;
    currentSlide = (currentSlide - 1 + total) % total;
    updateSliderPosition();
    resetTimer();
  }
}

function startAutoSlide() {
  slideInterval = setInterval(() => {
    const track = document.getElementById("banner-track");
    if (track) {
      currentSlide = (currentSlide + 1) % track.children.length;
      updateSliderPosition();
    }
  }, 3000);
}

function resetTimer() {
  clearInterval(slideInterval);
  startAutoSlide();
}

// Jalankan otomatis saat web dimuat
startAutoSlide();

// ==========================================
// 3. LOGIKA SLIDESHOW CARD POPULER
// ==========================================

// Data untuk Card 1 (TOP UP)
const card1Data = [
  {
    img: "assets/img/lgtpml.jpg", // Ganti dengan path gambar lu
    title: "TOP UP ALL GAME",
    subtitle: "Mobile Legend",
    logo: "assets/img/logoml0.png",
  },
  {
    img: "assets/img/logoff.jpg", // Ganti dengan path gambar kedua
    title: "TOP UP ALL GAME",
    subtitle: "FREE FIRE",
    logo: "assets/img/lgtpff.png", // Siapkan logo Free Fire
  },
  {
    img: "assets/img/logo roblok.jpg", // Ganti dengan path gambar ketiga
    title: "TOP UP ALL GAME",
    subtitle: "Roblox",
    logo: "assets/img/lgtprx1.png", // Siapkan logo Valorant
  },
];

// Masukkan nama file foto hero/showcase Joki lu di sini
const card2Images = [
  "assets/img/logoml1.jpg", // Foto Joki 1
  "assets/img/logoml2.jpg", // Foto Joki 2
  "assets/img/logoml3.jpg", // Foto Joki 3
];

// Data untuk Card 3 (BELI AKUN)
const card3Data = [
  {
    img: "assets/img/logoml1.jpg",
    title: "BELI AKUN",
    subtitle: "MOBILE LEGENDS",
    logo: "assets/img/logoml0.png",
  },
  {
    img: "assets/img/logoff.jpg",
    title: "BELI AKUN",
    subtitle: "FREE FIRE",
    logo: "assets/img/lgtpff.png",
  },
  {
    img: "assets/img/logoefb.jpg",
    title: "BELI AKUN",
    subtitle: "E-FOOTBALL",
    logo: "assets/img/logoefbbuy.png",
  },
];

// Data untuk Card 4 (CUSTOMER SERVICE)
const card4Data = [
  {
    img: "assets/img/populer-4.jpg",
    title: "CUSTOMER SERVICE",
    subtitle: "GENZSTORE",
    logo: "assets/img/logo-cs.png", // Bisa pakai logo icon CS PNG
  },
];

let card1Index = 0;
let card2ImgIndex = 0;
let card3Index = 0;
let card4Index = 0;

// Fungsi untuk mengganti konten card dengan efek fade sederhana
function updateCard(cardId, data, index) {
  const imgEl = document.getElementById(`${cardId}-img`);
  const titleEl = document.getElementById(`${cardId}-title`);
  const subtitleEl = document.getElementById(`${cardId}-subtitle`);
  const logoEl = document.getElementById(`${cardId}-logo`);

  if (!imgEl || !titleEl || !subtitleEl || !logoEl) return;

  // Tambahkan efek fade out cepat
  imgEl.style.opacity = 0;
  titleEl.style.opacity = 0;
  subtitleEl.style.opacity = 0;
  logoEl.style.opacity = 0;

  setTimeout(() => {
    // Ganti konten setelah fade out
    imgEl.src = data[index].img;
    titleEl.textContent = data[index].title;
    subtitleEl.textContent = data[index].subtitle;
    logoEl.src = data[index].logo;

    // Fade in kembali
    imgEl.style.opacity = 1;
    titleEl.style.opacity = 1;
    subtitleEl.style.opacity = 1;
    logoEl.style.opacity = 0.3; // Kembalikan opacity logo watermark ke 30%
  }, 300); // Waktu transisi 300ms, harus cocok dengan duration-300 di HTML
}

// Jalankan interval untuk Card 1 (Tiap 3 detik)
setInterval(() => {
  card1Index = (card1Index + 1) % card1Data.length;
  updateCard("card1", card1Data, card1Index);
}, 3000);

// Jalankan interval tiap 4 detik
setInterval(() => {
  card2ImgIndex = (card2ImgIndex + 1) % card2Images.length;

  // Kita targetin FOTO UTAMA di sebelah kiri (card2-img)
  const imgEl = document.getElementById("card2-img");

  if (imgEl) {
    setTimeout(() => {
      // Ganti src fotonya dengan gambar dari array di atas
      imgEl.src = card2Images[card2ImgIndex];

      // Munculkan kembali (fade in)
      imgEl.style.opacity = 1;
    }, 300); // Waktu transisi 300ms
  }
}, 3000);

// Jalankan interval untuk Card 3 (Tiap 3.5 detik)
setInterval(() => {
  card3Index = (card3Index + 1) % card3Data.length;
  updateCard("card3", card3Data, card3Index);
}, 3500);

// ==========================================
// 4. LOGIKA TAB PILIHAN STOCK & 3D MULTI-SLIDER
// ==========================================

let stockIndices = {
  ml: 1,
  ff: 1,
  efootball: 1,
};
let currentActiveStockTab = "ml";

// Fungsi untuk menata posisi 3D di tab mana pun
function applyCarouselStyles(tabName) {
  const container = document.getElementById(`tab-content-${tabName}`);
  if (!container) return;

  const cards = container.querySelectorAll(".stock-card");
  if (cards.length === 0) return;

  let currentIndex = stockIndices[tabName];

  cards.forEach((card, index) => {
    // Reset class z-index, opacity, pointer-events
    card.classList.remove(
      "z-30",
      "z-20",
      "z-10",
      "opacity-100",
      "opacity-60",
      "opacity-0",
      "pointer-events-none",
    );

    // Posisi dasar: left & top 50% agar titik referensi ada di tengah carousel
    card.style.left = "50%";
    card.style.top = "50%";

    let diff = index - currentIndex;

    // Bikin rotasinya nyambung (melingkar)
    if (diff < -2) diff += cards.length;
    if (diff > 2) diff -= cards.length;

    // Atur posisi 3D — translateX(-50%) selalu ada agar CENTER kartu = CENTER container
    if (diff === 0) {
      // Kartu aktif: tepat di tengah
      card.classList.add("z-30", "opacity-100");
      card.style.transform = "translateX(-50%) translateY(-50%) scale(1)";
      card.style.filter = "brightness(1)";
    } else if (diff === 1) {
      // Kartu kanan: geser +75% dari lebar kartu
      card.classList.add("z-20", "opacity-60");
      card.style.transform =
        "translateX(calc(-50% + 75%)) translateY(-50%) scale(0.85)";
      card.style.filter = "brightness(0.4)";
    } else if (diff === -1) {
      // Kartu kiri: geser -75% dari lebar kartu
      card.classList.add("z-20", "opacity-60");
      card.style.transform =
        "translateX(calc(-50% - 75%)) translateY(-50%) scale(0.85)";
      card.style.filter = "brightness(0.4)";
    } else {
      // Kartu jauh: sembunyikan ke luar area
      const dir = diff > 0 ? 1 : -1;
      card.classList.add("z-10", "opacity-0", "pointer-events-none");
      card.style.transform = `translateX(calc(-50% + ${dir * 200}%)) translateY(-50%) scale(0.7)`;
      card.style.filter = "brightness(0.1)";
    }
  });
}

// Fungsi pindah tab klik tombol
function switchStockTab(tabName) {
  const allBtns = document.querySelectorAll(".stock-tab-btn");
  const allContents = document.querySelectorAll(".stock-content");

  const activeBtnClasses =
    "bg-white text-navblue font-black shadow-[0_0_15px_rgba(255,255,255,0.3)] border-transparent".split(
      " ",
    );
  const inactiveBtnClasses =
    "bg-navblue border-2 border-gray-600 text-gray-300 font-bold".split(" ");

  allBtns.forEach((btn) => {
    btn.classList.remove(...activeBtnClasses);
    btn.classList.add(...inactiveBtnClasses);
  });

  allContents.forEach((content) => {
    content.classList.remove("block", "opacity-100");
    content.classList.add("hidden", "opacity-0");
  });

  const activeBtn = document.getElementById(`tab-btn-${tabName}`);
  const activeContent = document.getElementById(`tab-content-${tabName}`);

  if (activeBtn && activeContent) {
    activeBtn.classList.remove(...inactiveBtnClasses);
    activeBtn.classList.add(...activeBtnClasses);

    activeContent.classList.remove("hidden");
    setTimeout(() => {
      activeContent.classList.remove("opacity-0");
      activeContent.classList.add("opacity-100", "block");
    }, 50);

    currentActiveStockTab = tabName;
  }
}

// Fungsi geser panah Kanan/Kiri
function moveStock(direction) {
  const container = document.getElementById(
    `tab-content-${currentActiveStockTab}`,
  );
  if (!container) return;
  const cards = container.querySelectorAll(".stock-card");
  if (cards.length === 0) return;

  if (direction === "next") {
    stockIndices[currentActiveStockTab] =
      (stockIndices[currentActiveStockTab] + 1) % cards.length;
  } else {
    stockIndices[currentActiveStockTab] =
      (stockIndices[currentActiveStockTab] - 1 + cards.length) % cards.length;
  }
  applyCarouselStyles(currentActiveStockTab);
}

// Auto play (Cuma muter di tab yang lagi dibuka)
setInterval(() => {
  moveStock("next");
}, 4000);

// Inisialisasi awal saat web dimuat
document.addEventListener("DOMContentLoaded", () => {
  applyCarouselStyles("ml");
  applyCarouselStyles("ff");
  applyCarouselStyles("efootball");
});

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

// ── FUNGSI SEARCH ─────────────────────────────────────────
// Redirect ke halaman katalog dengan keyword sebagai query param
function cariAkun(keyword) {
  const q = keyword.trim();
  if (!q) return;
  window.location.href = "beli_akun/katalogML.html?q=" + encodeURIComponent(q);
}

// ── FUNGSI JUAL AKUN ───────────────────────────────────────
// Buka WhatsApp admin dengan teks siap kirim
function jualAkun() {
  const teks =
    "Halo Admin GENZSTORE! 👋\n\n" +
    "Saya ingin menjual akun game saya.\n\n" +
    "📋 *Info Akun yang Ingin Dijual:*\n" +
    "- Game       : (isi game)\n" +
    "- Rank/Level : (isi rank)\n" +
    "- Hero/Skin  : (isi jumlah)\n" +
    "- Harga Harapan: Rp ___\n\n" +
    "Mohon info lebih lanjut proses penjualannya ya Min! 🙏";

  const noWA = "6285790427533";
  window.open(
    "https://wa.me/" + noWA + "?text=" + encodeURIComponent(teks),
    "_blank",
  );
}
