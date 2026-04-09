// ==========================================
// LOGIKA HAMBURGER MENU (MODE HP)
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
// KATALOG STATE
// ==========================================
let currentGame = "ml";
let currentCategory = "semua";
let currentPage = 1;
const itemsPerPage = 8;
let allAkun = [];
let filteredAkun = [];

function parseHarga(str) {
  if (!str) return 0;
  return parseInt(String(str).replace(/\./g, "").replace(/,/g, "")) || 0;
}

// ==========================================
// TAB GAME SWITCHER
// ==========================================
function switchGame(game) {
  currentGame = game;
  currentPage = 1;
  currentCategory = "semua";

  ["cuci", "ml", "ff", "ef"].forEach((g) => {
    const btn = document.getElementById("tab-" + g);
    if (!btn) return;
    btn.classList.remove("active");
    btn.classList.add("border-gray-500", "text-gray-300");
    btn.classList.remove("text-navblue");
  });
  const active = document.getElementById("tab-" + game);
  if (active) {
    active.classList.add("active");
    active.classList.remove("border-gray-500", "text-gray-300");
  }
  resetKategoriUI();
  applyFilters();
}

// ==========================================
// KATEGORI HARGA
// ==========================================
const kategoriRange = {
  semua: [0, Infinity],
  gagah: [0, 499000],
  mewah: [500000, 999000],
  megah: [1000000, 1990000],
  sultan: [2000000, 100000000],
};

function filterKategori(cat) {
  currentCategory = cat;
  currentPage = 1;
  ["semua", "gagah", "mewah", "megah", "sultan"].forEach((c) => {
    const b = document.getElementById("cat-" + c);
    if (b) {
      b.style.outline = "";
      b.style.outlineOffset = "";
    }
  });
  const ab = document.getElementById("cat-" + cat);
  if (ab) {
    ab.style.outline = "3px solid white";
    ab.style.outlineOffset = "2px";
  }
  applyFilters();
}

function resetKategoriUI() {
  ["semua", "gagah", "mewah", "megah", "sultan"].forEach((c) => {
    const b = document.getElementById("cat-" + c);
    if (b) {
      b.style.outline = "";
      b.style.outlineOffset = "";
    }
  });
  const s = document.getElementById("cat-semua");
  if (s) {
    s.style.outline = "3px solid white";
    s.style.outlineOffset = "2px";
  }
}

// ==========================================
// MASTER FILTER
// ==========================================
function applyFilters() {
  const keyword = (document.getElementById("search-input")?.value || "")
    .toLowerCase()
    .trim();
  const hargaMin =
    parseHarga(document.getElementById("filter-harga-min")?.value) || 0;
  const hargaMaxV =
    parseHarga(document.getElementById("filter-harga-max")?.value) || 0;
  const hargaMax = hargaMaxV > 0 ? hargaMaxV : Infinity;
  const heroMin =
    parseInt(document.getElementById("filter-hero-min")?.value) || 0;
  const skinMin =
    parseInt(document.getElementById("filter-skin-min")?.value) || 0;
  const [catMin, catMax] = kategoriRange[currentCategory] || [0, Infinity];

  let hasil = allAkun.filter((a) => {
    if (currentGame === "ml") return a.id.startsWith("ml-");
    if (currentGame === "ff") return a.id.startsWith("idx-ff-");
    if (currentGame === "ef") return a.id.startsWith("idx-ef-");
    if (currentGame === "cuci") {
      const disc = parseInt(String(a.diskon).replace("%", "")) || 0;
      return disc >= 50;
    }
    return true;
  });

  hasil = hasil.filter((a) => {
    const h = parseHarga(a.hargaDiskon);
    return h >= catMin && h <= catMax;
  });

  if (hargaMin > 0 || hargaMax < Infinity) {
    hasil = hasil.filter((a) => {
      const h = parseHarga(a.hargaDiskon);
      return h >= hargaMin && h <= hargaMax;
    });
  }

  if (heroMin > 0) {
    hasil = hasil.filter((a) => {
      return (parseInt(String(a.hero).replace(/\D/g, "")) || 0) >= heroMin;
    });
  }

  if (skinMin > 0) {
    hasil = hasil.filter((a) => {
      return (parseInt(String(a.skin).replace(/\D/g, "")) || 0) >= skinMin;
    });
  }

  if (keyword) {
    hasil = hasil.filter((a) => a.nama.toLowerCase().includes(keyword));
  }

  filteredAkun = hasil;
  currentPage = 1;
  renderKatalog();
  renderPagination();
  updateResultInfo();
}

function resetFilters() {
  currentCategory = "semua";
  currentPage = 1;
  [
    "search-input",
    "filter-harga-min",
    "filter-harga-max",
    "filter-hero-min",
    "filter-skin-min",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  resetKategoriUI();
  applyFilters();
}

// ==========================================
// RENDER KARTU
// ==========================================
function renderKatalog() {
  const container = document.getElementById("katalog-container");
  const emptyState = document.getElementById("empty-state");
  if (!container) return;

  container.innerHTML = "";

  if (filteredAkun.length === 0) {
    if (emptyState) emptyState.classList.remove("hidden");
    document.getElementById("pagination-wrapper")?.classList.add("hidden");
    return;
  }
  if (emptyState) emptyState.classList.add("hidden");
  document.getElementById("pagination-wrapper")?.classList.remove("hidden");

  const start = (currentPage - 1) * itemsPerPage;
  const tampil = filteredAkun.slice(start, start + itemsPerPage);

  tampil.forEach((akun) => {
    const hargaCoret = akun.hargaAsli
      ? `<h3 class="text-xs md:text-sm text-gray-400 line-through font-semibold">Rp ${akun.hargaAsli}</h3>`
      : "";
    container.innerHTML += `
      <a href="detail_akun.html?id=${akun.id}"
        class="rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative block border border-gray-100">
        <div class="absolute top-0 left-0 bg-[#FF0000] px-3 py-1.5 rounded-br-2xl z-10 shadow-sm">
          <span class="text-white font-black text-sm drop-shadow-sm">${akun.diskon}</span>
        </div>
        <div class="w-full bg-gray-100 aspect-[4/5] overflow-hidden">
          <img src="assets3/img/${akun.gambar}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='assets3/img/stok1.jpg'">
        </div>
        <div class="p-4 md:p-5 space-y-1.5 bg-white">
          <h1 class="uppercase text-sm md:text-[15px] text-[#121926] font-black line-clamp-1 tracking-tight">${akun.nama}</h1>
          ${hargaCoret}
          <h2 class="text-lg lg:text-xl text-[#0E467D] font-black tracking-tight">Rp ${akun.hargaDiskon}</h2>
        </div>
      </a>`;
  });
}

// ==========================================
// PAGINATION
// ==========================================
function renderPagination() {
  const wrapper = document.getElementById("page-buttons");
  if (!wrapper) return;
  const maxPage = Math.max(1, Math.ceil(filteredAkun.length / itemsPerPage));
  wrapper.innerHTML = "";
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(maxPage, start + 4);
  if (end - start < 4) start = Math.max(1, end - 4);
  for (let i = start; i <= end; i++) {
    const btn = document.createElement("button");
    btn.className = `page-btn w-10 h-10 rounded-lg text-sm font-bold transition cursor-pointer ${
      i === currentPage
        ? "bg-cyanaccent text-navblue font-black shadow-md"
        : "bg-[#0f203b] border border-gray-600 text-white hover:bg-cyanaccent hover:text-navblue"
    }`;
    btn.textContent = i;
    btn.onclick = () => changePage(i);
    wrapper.appendChild(btn);
  }
  const pi = document.getElementById("page-input");
  if (pi) pi.value = currentPage;
}

function changePage(action) {
  const maxPage = Math.max(1, Math.ceil(filteredAkun.length / itemsPerPage));
  const old = currentPage;
  if (action === "prev" && currentPage > 1) currentPage--;
  else if (action === "next" && currentPage < maxPage) currentPage++;
  else if (typeof action === "number")
    currentPage = Math.min(Math.max(1, action), maxPage);
  if (old !== currentPage) {
    renderKatalog();
    renderPagination();
    window.scrollTo({ top: 350, behavior: "smooth" });
  }
}

function goToPage(val) {
  const maxPage = Math.max(1, Math.ceil(filteredAkun.length / itemsPerPage));
  const num = parseInt(val);
  if (num >= 1 && num <= maxPage) changePage(num);
  else {
    const pi = document.getElementById("page-input");
    if (pi) pi.value = currentPage;
  }
}

function updateResultInfo() {
  const el = document.getElementById("result-info");
  if (!el) return;
  el.textContent =
    filteredAkun.length === 0
      ? "Tidak ada akun yang cocok"
      : `Menampilkan ${filteredAkun.length} akun`;
}

// ==========================================
// PROSES BELI & NEGO
// ==========================================
function tampilkanToast() {
  const t = document.getElementById("toast-error");
  if (!t) return;
  t.classList.remove("opacity-0", "pointer-events-none", "translate-y-[-20px]");
  t.classList.add("opacity-100", "translate-y-0");
  setTimeout(() => tutupToast(), 3500);
}
function tutupToast() {
  const t = document.getElementById("toast-error");
  if (!t) return;
  t.classList.add("opacity-0", "pointer-events-none", "translate-y-[-20px]");
  t.classList.remove("opacity-100", "translate-y-0");
}
function prosesBeli() {
  const email = document.getElementById("order-email")?.value || "";
  const hp = document.getElementById("order-hp")?.value || "";
  const tele = document.getElementById("order-tele")?.value || "-";
  const lain = document.getElementById("order-lain")?.value || "-";
  if (!email || !hp) {
    tampilkanToast();
    return;
  }
  const namaAkun = document.getElementById("detail-nama")?.innerText || "-";
  const harga =
    document.getElementById("detail-harga-diskon")?.innerText || "-";
  const kodeAkun = document.getElementById("detail-kode")?.innerText || "-";
  const textWA = `Halo Admin GENZSTORE, saya mau order akun ini:\n\n🎮 *DETAIL AKUN*\n- Nama: ${namaAkun}\n- ${kodeAkun}\n- Harga: *${harga}*\n\n📝 *DATA PEMBELI*\n- Email: ${email}\n- No HP: ${hp}\n- Telegram: ${tele}\n- Kontak Lain: ${lain}\n\nMohon instruksi pembayarannya ya Min!`;
  const btn = document.querySelector(
    'button[onclick="prosesBeli()"] span:first-child',
  );
  if (btn) btn.innerText = "MEMBUKA WHATSAPP...";
  setTimeout(() => {
    window.open(
      `https://wa.me/6285790427533?text=${encodeURIComponent(textWA)}`,
      "_blank",
    );
    window.location.href = "katalogML.html";
  }, 800);
}
function prosesNego() {
  const namaAkun = document.getElementById("detail-nama")?.innerText || "-";
  const harga =
    document.getElementById("detail-harga-diskon")?.innerText || "-";
  const kodeAkun = document.getElementById("detail-kode")?.innerText || "-";
  const textWA = `Halo Admin GENZSTORE, saya tertarik sama akun ini:\n\n🎮 *DETAIL AKUN*\n- Nama: ${namaAkun}\n- ${kodeAkun}\n- Harga: *${harga}*\n\nBoleh nego sikit kah Min? 😁`;
  window.open(`https://wa.me/6285790427533?text=${encodeURIComponent(textWA)}`);
}

// ==========================================
// MODAL BERITA
// ==========================================
const newsDatabase = {
  berita1: {
    title: "5 Metode Pembayaran Top Up ML Paling Murah",
    date: "11-03-2026",
    img: "assets3/img/berita1.jpg",
    content: `<p><strong>GenZstore</strong> - QRIS dan E-Wallet seperti DANA menjadi pilihan paling populer karena sering memberikan promo cashback.</p><ul class="list-disc pl-5 mb-4"><li><strong>QRIS:</strong> Bebas biaya admin, proses instan.</li><li><strong>DANA/OVO/GoPay:</strong> Cepat dan sering ada promo.</li><li><strong>Transfer Bank:</strong> Aman untuk transaksi besar.</li></ul>`,
  },
  berita2: {
    title: "Jam Terbaik Top Up Mobile Legends Biar Lebih Murah",
    date: "09-03-2026",
    img: "assets3/img/berita2.jpg",
    content: `<p><strong>GenZstore</strong> - Ada jam-jam tertentu yang bikin top up diamond ML lebih murah.</p><ul class="list-disc pl-5"><li>00:00–02:00 WIB: Flash Sale tengah malam.</li><li>12:00–14:00 WIB: Promo jam istirahat.</li><li>Saat Event Besar: Harga diamond anjlok!</li></ul>`,
  },
  berita3: {
    title: "5 Ciri Website ML Yang Berbahaya",
    date: "08-03-2026",
    img: "assets3/img/berita3.jpg",
    content: `<p><strong>GenZstore</strong> - Waspadai website penipuan top up ML!</p><ol class="list-decimal pl-5"><li>Harga terlalu murah.</li><li>Minta password/email.</li><li>Desain berantakan.</li><li>Tidak ada CS aktif.</li><li>Paksa klik link aneh.</li></ol>`,
  },
  berita4: {
    title: "Bocoran Skin Baru Free Fire Spesial Ramadhan 2026",
    date: "05-03-2026",
    img: "assets3/img/berita4.jpg",
    content: `<p><strong>GenZstore</strong> - Free Fire siapkan event besar dengan bundle eksklusif dan Mystery Shop diskon hingga 90%!</p>`,
  },
};

function openNewsModal(newsId) {
  const modal = document.getElementById("news-modal");
  const content = document.getElementById("news-modal-content");
  const data = newsDatabase[newsId];
  if (!data || !modal) return;
  document.getElementById("modal-title").textContent = data.title;
  document.getElementById("modal-date").textContent = data.date;
  document.getElementById("modal-img").src = data.img;
  document.getElementById("modal-body").innerHTML = data.content;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  setTimeout(() => {
    modal.classList.remove("opacity-0");
    modal.classList.add("opacity-100");
    content.classList.remove("scale-95");
    content.classList.add("scale-100");
  }, 50);
  document.body.style.overflow = "hidden";
}
function closeNewsModal() {
  const modal = document.getElementById("news-modal");
  const content = document.getElementById("news-modal-content");
  if (!modal) return;
  modal.classList.remove("opacity-100");
  modal.classList.add("opacity-0");
  content.classList.remove("scale-100");
  content.classList.add("scale-95");
  setTimeout(() => {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }, 300);
}
const nm = document.getElementById("news-modal");
if (nm)
  nm.addEventListener("click", (e) => {
    if (e.target === nm) closeNewsModal();
  });

function moveNews(direction) {
  const track = document.getElementById("news-track");
  if (track)
    track.scrollBy({
      left: direction === "next" ? 374 : -374,
      behavior: "smooth",
    });
}

// ==========================================
// FAQ
// ==========================================
function toggleFaq(id) {
  const answer = document.getElementById(`faq-answer-${id}`);
  const arrow = document.getElementById(`faq-arrow-${id}`);
  const plus = document.getElementById(`faq-plus-${id}`);
  if (!answer) return;
  if (answer.classList.contains("hidden")) {
    answer.classList.remove("hidden");
    arrow?.classList.add("rotate-180");
    plus?.classList.remove("fa-plus");
    plus?.classList.add("fa-minus");
  } else {
    answer.classList.add("hidden");
    arrow?.classList.remove("rotate-180");
    plus?.classList.remove("fa-minus");
    plus?.classList.add("fa-plus");
  }
}

// ==========================================
// TOGGLE BOX (detail_akun.html)
// ==========================================
function toggleBox(id) {
  const content = document.getElementById("content-" + id);
  const icon = document.getElementById("icon-" + id);
  if (!content) return;
  if (id === "cara-beli") {
    const isHidden =
      content.style.display === "none" || content.style.display === "";
    content.style.display = isHidden ? "flex" : "none";
    if (icon) {
      icon.classList.toggle("rotate-180", isHidden);
    }
  } else if (id === "deskripsi") {
    const textEl = document.getElementById("text-deskripsi");
    const isHidden = content.classList.contains("hidden");
    content.classList.toggle("hidden");
    if (icon) {
      icon.classList.toggle("fa-chevron-up", isHidden);
      icon.classList.toggle("fa-chevron-down", !isHidden);
    }
    if (textEl)
      textEl.textContent = isHidden
        ? "Sembunyikan Deskripsi"
        : "Tampilkan Deskripsi";
  }
}

// ==========================================
// INIT
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("katalog-container")) return;
  if (typeof databaseAkun === "undefined") {
    console.warn("data_akun.js belum dimuat!");
    return;
  }
  allAkun = databaseAkun;
  switchGame("ml");
});
