// =============================================
//  MLShop — Jual Beli Akun Mobile Legends
//  script.js
// =============================================

// ==============================
// SUPABASE CONFIG
// ==============================
const SUPA_URL = "https://jwqzdjhvisjnoqjmffgq.supabase.co";
const SUPA_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3cXpkamh2aXNqbm9xam1mZmdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMjk1NDAsImV4cCI6MjA4ODgwNTU0MH0.-UxhV-uQ4P_Ih5nFXXtqXFzlwx7RODMbfsokEY7jAug";

const supa = {
  async query(path, options = {}) {
    const res = await fetch(`${SUPA_URL}/rest/v1/${path}`, {
      headers: {
        apikey: SUPA_KEY,
        Authorization: `Bearer ${SUPA_KEY}`,
        "Content-Type": "application/json",
        Prefer: options.prefer || "return=representation",
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Supabase error");
    }
    return res.status === 204 ? null : res.json();
  },

  async getUser(email) {
    const data = await this.query(
      `users?email=eq.${encodeURIComponent(email)}&limit=1`,
    );
    return data?.[0] || null;
  },

  async createUser(name, email, password, wa) {
    // Hash password sederhana (base64 + salt) — cukup untuk proteksi dasar
    const hashed = btoa(unescape(encodeURIComponent(password + "_gz2026")));
    return this.query("users", {
      method: "POST",
      body: JSON.stringify({ name, email, password: hashed, wa }),
      prefer: "return=representation",
    });
  },

  async verifyUser(email, password) {
    const user = await this.getUser(email);
    if (!user) return null;
    const hashed = btoa(unescape(encodeURIComponent(password + "_gz2026")));
    return user.password === hashed ? user : null;
  },

  async saveOrder(userId, orderId, type, detail, total) {
    return this.query("orders", {
      method: "POST",
      body: JSON.stringify({
        user_id: userId,
        order_id: orderId,
        type,
        detail,
        total,
        payment_method: "QRIS",
        status: "pending",
      }),
      prefer: "return=representation",
    });
  },

  async updateOrderStatus(orderId, status) {
    return this.query(`orders?order_id=eq.${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      headers: { Prefer: "return=minimal" },
    });
  },

  async updatePostStatus(supaId, status) {
    return this.query(`posts?id=eq.${supaId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      headers: { Prefer: "return=minimal" },
    });
  },

  async getOrders(userId) {
    return this.query(`orders?user_id=eq.${userId}&order=created_at.desc`);
  },
};

// ╔══════════════════════════════════════════════════════════╗
// ║          🖼️  KONFIGURASI GAMBAR BANNER SLIDER           ║
// ║  Ganti URL di bawah dengan link gambar banner kamu.     ║
// ║  Bisa pakai path lokal: "images/banner1.jpg"            ║
// ║  Atau URL online: "https://i.imgur.com/xxxxx.jpg"       ║
// ╚══════════════════════════════════════════════════════════╝
const BANNERS = [
  {
    image: "img/banner1.png", // 🔁 Ganti dengan URL gambar banner slide 1
    //    Contoh: "images/banner1.jpg"
    title: "Jual Beli Akun",
    titleHighlight: "Mobile Legends",
    subtitle: "Terpercaya & Termurah se-Indonesia 🇮🇩",
    btnText: "Lihat Akun →",
    btnAction:
      "document.getElementById('sec-produk').scrollIntoView({behavior:'smooth'})",
    bgColor: "radial-gradient(ellipse at 70% 50%, #0f2a50 0%, #060c18 70%)",
    deco: "⚔️",
  },
  {
    image: "img/banner1.png", // 🔁 Ganti dengan URL gambar banner slide 2
    title: "Flash Sale",
    titleHighlight: "Harga Spesial!",
    subtitle: "Dapatkan akun premium dengan harga terjangkau ✨",
    btnText: "Lihat Flash Sale →",
    btnAction:
      "document.getElementById('sec-flash').scrollIntoView({behavior:'smooth'})",
    bgColor: "radial-gradient(ellipse at 70% 50%, #2a0f1a 0%, #0c0608 70%)",
    deco: "🔥",
  },
  {
    image: "img/banner1.png", // 🔁 Ganti dengan URL gambar banner slide 3
    title: "Garansi Aman",
    titleHighlight: "100% Terpercaya",
    subtitle: "Transaksi aman dengan sistem escrow terjamin 🔒",
    btnText: "Daftar Sekarang →",
    btnAction: "showPage('login')",
    bgColor: "radial-gradient(ellipse at 70% 50%, #0f2a18 0%, #060c08 70%)",
    deco: "🛡️",
  },
];

// ╔══════════════════════════════════════════════════════════╗
// ║         🎮  KONFIGURASI DATA & GAMBAR PRODUK            ║
// ║  Tambahkan field "image" pada setiap akun.              ║
// ║  Jika image dikosongkan (""), akan tampil emoji.        ║
// ║  Contoh image lokal : "images/akun1.jpg"               ║
// ║  Contoh image online: "https://i.imgur.com/xxxxx.jpg"  ║
// ╚══════════════════════════════════════════════════════════╝
const ACCOUNTS = [
  {
    id: 1,
    code: "Code-1121",
    title: "Akun ML Full Hero",
    price: 220000,
    orig: 275000,
    views: 0,
    likes: 0,
    sold: false,
    rank: "Mythic",
    hero: 120,
    skin: 65,
    server: "Indonesia",
    emoji: "⚔️",
    image: "", // 🔁 Ganti dengan URL gambar akun ini
    desc: "Akun epic dengan rank Mythic, full hero & skin rare.",
  },
  {
    id: 2,
    code: "Code-1120",
    title: "Akun ML Rank Legend",
    price: 399999,
    orig: 499999,
    views: 0,
    likes: 0,
    sold: false,
    rank: "Legend",
    hero: 98,
    skin: 45,
    server: "Indonesia",
    emoji: "🗡️",
    image: "", // 🔁 Ganti dengan URL gambar akun ini
    desc: "Rank legend dengan banyak skin season lama.",
  },
  {
    id: 3,
    code: "Code-1119",
    title: "Akun ML Starter Pack",
    price: 175000,
    orig: 218000,
    views: 0,
    likes: 0,
    sold: false,
    rank: "Grandmaster",
    hero: 60,
    skin: 20,
    server: "Indonesia",
    emoji: "🏹",
    image: "", // 🔁 Ganti dengan URL gambar akun ini
    desc: "Cocok untuk pemula yang ingin mulai dengan akun bagus.",
  },
  {
    id: 4,
    code: "Code-1118",
    title: "Akun ML Epic Full Skin",
    price: 335000,
    orig: 418000,
    views: 0,
    likes: 0,
    sold: false,
    rank: "Epic",
    hero: 85,
    skin: 55,
    server: "Indonesia",
    emoji: "🔥",
    image: "", // 🔁 Ganti dengan URL gambar akun ini
    desc: "Banyak skin epic dan hero lengkap untuk ranked.",
  },
];

const DENOMS = [
  // 🔥 Special Items
  {
    label: "Weekly Diamond Pass",
    diamond: 0,
    price: 32415,
    cat: "special",
  },
  {
    label: "Weekly Diamond Pass 2x",
    diamond: 0,
    price: 63067,
    cat: "special",
  },
  {
    label: "Weekly Diamond Pass 3x",
    diamond: 0,
    price: 98594,
    cat: "special",
  },
  {
    label: "Weekly Diamond Pass 4x",
    diamond: 0,
    price: 131445,
    cat: "special",
  },
  {
    label: "Weekly Diamond Pass 5x",
    diamond: 0,
    price: 159559,
    cat: "special",
  },
  // 💎 Regular Diamond
  { diamond: 5, price: 1634, cat: "regular" },
  { diamond: 3, price: 1994, cat: "regular" },
  { diamond: 14, price: 4409, cat: "regular" },
  { diamond: 18, price: 6782, cat: "regular" },
  { diamond: 28, price: 10718, cat: "regular" },
  { diamond: 36, price: 13670, cat: "regular" },
  { diamond: 42, price: 15138, cat: "regular" },
  { diamond: 56, price: 16876, cat: "regular" },
  { diamond: 59, price: 17836, cat: "regular" },
  { diamond: 70, price: 21484, cat: "regular" },
  { diamond: 86, price: 25543, cat: "regular" },
  { diamond: 74, price: 26175, cat: "regular" },
  { diamond: 92, price: 28160, cat: "regular" },
  { diamond: 112, price: 34681, cat: "regular" },
  { diamond: 140, price: 41913, cat: "regular" },
  { diamond: 172, price: 52667, cat: "regular" },
  { diamond: 185, price: 54906, cat: "regular" },
  { diamond: 257, price: 76062, cat: "regular" },
  { diamond: 284, price: 83530, cat: "regular" },
  { diamond: 344, price: 102704, cat: "regular" },
  { diamond: 355, price: 113673, cat: "regular" },
  { diamond: 384, price: 116976, cat: "regular" },
  { diamond: 370, price: 118383, cat: "regular" },
  { diamond: 429, price: 127586, cat: "regular" },
  { diamond: 448, price: 131230, cat: "regular" },
  { diamond: 514, price: 166090, cat: "regular" },
  { diamond: 600, price: 172800, cat: "regular" },
  { diamond: 568, price: 174651, cat: "regular" },
  { diamond: 706, price: 204288, cat: "regular" },
  { diamond: 716, price: 207445, cat: "regular" },
  { diamond: 792, price: 232079, cat: "regular" },
  { diamond: 878, price: 251860, cat: "regular" },
  { diamond: 963, price: 274858, cat: "regular" },
  { diamond: 1050, price: 326875, cat: "regular" },
  { diamond: 1220, price: 404194, cat: "regular" },
  { diamond: 1412, price: 443490, cat: "regular" },
  { diamond: 1446, price: 449379, cat: "regular" },
  { diamond: 2195, price: 707563, cat: "regular" },
  { diamond: 2901, price: 865775, cat: "regular" },
  { diamond: 3073, price: 920548, cat: "regular" },
  { diamond: 3688, price: 1113727, cat: "regular" },
  { diamond: 4396, price: 1204076, cat: "regular" },
  { diamond: 5532, price: 1633188, cat: "regular" },
  { diamond: 6234, price: 1791209, cat: "regular" },
  { diamond: 7727, price: 2150493, cat: "regular" },
  { diamond: 9288, price: 2889000, cat: "regular" },
];

// ==============================
// STATE APLIKASI
// ==============================
let state = {
  user: null,
  cart: [],
  liked: new Set(),
  filter: "semua",
  displayCount: 12,
  modalAccount: null,
  modalQty: 1,
  checkoutItems: [],
  checkoutStep: 1,
  checkoutPM: "",
  myPostings: [],
  myPurchases: [],
  notifications: [],
  topupDenom: null,
};

// ==============================
// UTILS
// ==============================
function rp(n) {
  return "Rp " + n.toLocaleString("id-ID");
}
function disc(o, c) {
  return Math.round((1 - c / o) * 100);
}
function genUID() {
  return (
    "ORD-" +
    Date.now().toString(36).toUpperCase() +
    "-" +
    Math.random().toString(36).substr(2, 4).toUpperCase()
  );
}

function showToast(msg, type = "info") {
  const t = document.createElement("div");
  t.className =
    "toast " +
    (type === "error" ? "error" : type === "success" ? "success" : "");
  t.textContent = msg;
  document.getElementById("toast-container").appendChild(t);
  setTimeout(() => {
    t.style.animation = "slideIn .3s ease reverse";
    setTimeout(() => t.remove(), 300);
  }, 3200);
}

// ==============================
// PAGE ROUTING
// ==============================
function showPage(pg) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById("page-" + pg).classList.add("active");
  document
    .querySelectorAll(".nav-links a")
    .forEach((a) => a.classList.remove("active"));
  const nm = document.getElementById("nav-" + pg);
  if (nm) nm.classList.add("active");
  else document.getElementById("nav-home")?.classList.remove("active");
  window.scrollTo(0, 0);
  closeDropdown();

  if (pg === "cart") renderCart();
  if (pg === "profile") {
    renderProfile();
    renderMyPostings();
  }
  if (pg === "notif") renderNotifs();
  if (pg === "home")
    document.getElementById("nav-home").classList.add("active");

  // Tampilkan/sembunyikan section keunggulan & footer
  const isHome = pg === "home";
  const kEl = document.getElementById("sec-keunggulan");
  const fEl = document.getElementById("main-footer");
  if (kEl) kEl.style.display = isHome ? "block" : "none";
  if (fEl) fEl.style.display = isHome ? "block" : "none";

  const floatBtn = document.getElementById("float-btn");
  if (floatBtn)
    floatBtn.style.display = isHome && state.user ? "block" : "none";
}

function requireAuth(cb) {
  if (!state.user) {
    showPage("login");
    showToast("Silahkan login terlebih dahulu", "error");
  } else {
    cb();
  }
}

// ==============================
// BANNER SLIDER — render dari BANNERS config
// ==============================
function renderBanners() {
  try {
    const sliderEl = document.getElementById("banner-slider-inner");
    const dotsEl = document.getElementById("banner-dots");
    if (!sliderEl || !dotsEl) return;

    // Bungkus semua slide dalam track
    sliderEl.innerHTML =
      `<div class="banner-slider-track" id="banner-track">` +
      BANNERS.map(
        (b, i) => `
        <div class="slide ${i === 0 ? "active" : ""}"
             style="${b.image ? "" : "background:" + b.bgColor}">
          ${
            b.image
              ? `<img src="${b.image}" alt="Banner ${i + 1}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;z-index:0">`
              : `<div class="slide-deco">${b.deco}</div>
               <div style="position:relative;z-index:1">
                 <h1>${b.title}<br><em>${b.titleHighlight}</em></h1>
                 <p>${b.subtitle}</p>
                 <button class="btn btn-gold" onclick="${b.btnAction}">${b.btnText}</button>
               </div>`
          }
        </div>`,
      ).join("") +
      `</div>`;

    dotsEl.innerHTML = BANNERS.map(
      (_, i) =>
        `<button class="dot ${i === 0 ? "active" : ""}" onclick="goSlide(${i})"></button>`,
    ).join("");
  } catch (e) {
    console.error("renderBanners error:", e);
  }
}

let slideIdx = 0;
function goSlide(n) {
  const track = document.getElementById("banner-track");
  const dots = document.querySelectorAll(".dot");
  const slides = document.querySelectorAll(".slide");
  if (!track) return;

  slides[slideIdx].classList.remove("active");
  dots[slideIdx].classList.remove("active");
  slideIdx = n;
  slides[n].classList.add("active");
  dots[n].classList.add("active");

  // Geser track ke posisi slide yang dipilih
  track.style.transform = `translateX(-${n * 100}%)`;
}
setInterval(() => goSlide((slideIdx + 1) % BANNERS.length), 4500);

// ==============================
// COUNTDOWN FLASH SALE
// ==============================
let cdTotal = 6 * 3600 + 59 * 60;
setInterval(() => {
  if (cdTotal <= 0) cdTotal = 8 * 3600;
  cdTotal--;
  const h = Math.floor(cdTotal / 3600);
  const m = Math.floor((cdTotal % 3600) / 60);
  const s = cdTotal % 60;
  document.getElementById("cd-h").textContent = String(h).padStart(2, "0");
  document.getElementById("cd-m").textContent = String(m).padStart(2, "0");
  document.getElementById("cd-s").textContent = String(s).padStart(2, "0");
}, 1000);

// ==============================
// RENDER FLASH SALE
// ==============================
function renderFlash() {
  const el = document.getElementById("flash-scroll");
  const items = ACCOUNTS.filter((a) => !a.sold).slice(0, 8);
  el.innerHTML = items
    .map(
      (a) => `
    <div class="flash-card" onclick="openModal('${String(a.id)}')">
      <div class="flash-img">
        ${
          a.image
            ? `<img src="${a.image}" alt="${a.code}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0">`
            : a.emoji
        }
      </div>
      <div class="flash-body">
        <div class="flash-code">${a.code}</div>
        <div class="flash-price">${rp(a.price)}</div>
        <div class="flash-orig">${rp(a.orig)}</div>
      </div>
    </div>`,
    )
    .join("");
}

// ==============================
// RENDER POPULAR
// ==============================
function renderPopular() {
  const el = document.getElementById("pop-grid");
  const items = [...ACCOUNTS].sort((a, b) => b.views - a.views).slice(0, 6);
  el.innerHTML = items
    .map(
      (a, i) => `
    <div class="pop-card" onclick="openModal('${String(a.id)}')">
      <div class="pop-rank ${i === 0 ? "r1" : i === 1 ? "r2" : i === 2 ? "r3" : ""}">#${i + 1}</div>
      <div class="pop-thumb">
        ${
          a.image
            ? `<img src="${a.image}" alt="${a.code}" style="width:100%;height:100%;object-fit:cover">`
            : a.emoji
        }
      </div>
      <div class="pop-info">
        <div class="pop-code">${a.code}</div>
        <div class="pop-price">${rp(a.price)} <span class="pop-orig">${rp(a.orig)}</span></div>
        <div class="pop-meta">👁️ ${a.views}x · ❤️ ${a.likes}x</div>
      </div>
    </div>`,
    )
    .join("");
}

// ==============================
// RENDER PRODUCT GRID
// ==============================
function getFiltered() {
  let data = [...ACCOUNTS, ...state.myPostings];
  const q = document.getElementById("search-inp")?.value.toLowerCase() || "";
  const sort = document.getElementById("sort-sel")?.value || "terbaru";
  const price = document.getElementById("price-sel")?.value || "all";

  if (state.filter === "tersedia") data = data.filter((a) => !a.sold);
  else if (state.filter === "terjual") data = data.filter((a) => a.sold);

  if (q)
    data = data.filter(
      (a) =>
        a.code.toLowerCase().includes(q) || a.title.toLowerCase().includes(q),
    );

  if (price === "low") data = data.filter((a) => a.price <= 200000);
  else if (price === "mid")
    data = data.filter((a) => a.price > 200000 && a.price <= 500000);
  else if (price === "high") data = data.filter((a) => a.price > 500000);

  if (sort === "termurah") data.sort((a, b) => a.price - b.price);
  else if (sort === "termahal") data.sort((a, b) => b.price - a.price);

  return data;
}

function renderGrid() {
  const data = getFiltered();
  const shown = data.slice(0, state.displayCount);
  const el = document.getElementById("prod-grid");
  const nr = document.getElementById("no-results");
  const lm = document.getElementById("load-more-btn");

  if (shown.length === 0) {
    el.innerHTML = "";
    nr.style.display = "block";
  } else {
    nr.style.display = "none";
  }

  el.innerHTML = shown.map((a) => cardHTML(a)).join("");
  lm.style.display = data.length > state.displayCount ? "block" : "none";
}

function cardHTML(a) {
  const d = disc(a.orig, a.price);
  const isLiked = state.liked.has(a.id);
  const idStr = String(a.id); // handle both numeric and string IDs
  return `
  <div class="prod-card${a.sold ? " sold" : ""}" onclick="openModal('${idStr}')">
    <div class="prod-img">
      ${a.image ? `<img src="${a.image}" alt="${a.code}">` : ""}
      ${a.sold ? '<div class="sold-ovl"></div><div class="sold-lbl">SOLD</div>' : ""}
      <div class="disc-ribbon">-${d}%</div>
      <button class="liked-btn${isLiked ? " liked" : ""}"
        onclick="event.stopPropagation();toggleLike('${idStr}',this)">
        ${isLiked ? "❤️" : "🤍"}
      </button>
      ${!a.image ? `<span style="font-size:3.5rem;z-index:0">${a.emoji}</span>` : ""}
    </div>
    <div class="prod-body">
      <div class="prod-code">${a.code}</div>
      <div class="price-row">
        <span class="price-now">${rp(a.price)}</span>
        <span class="price-was">${rp(a.orig)}</span>
      </div>
      <div class="prod-meta">
        <span>👁️ ${a.views}x</span>
        <span>❤️ ${a.likes}x</span>
        <span>🗡️ ${a.hero || "?"} hero</span>
      </div>
      <button class="prod-btn" ${a.sold ? "disabled" : ""}
        onclick="event.stopPropagation();${a.sold ? "" : `openModal('${idStr}')`}">
        ${a.sold ? "✕ Terjual" : "Lihat Detail →"}
      </button>
    </div>
  </div>`;
}

function setFilter(f, el) {
  state.filter = f;
  state.displayCount = 12;
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));
  el.classList.add("active");
  renderGrid();
}

function loadMore() {
  state.displayCount += 8;
  renderGrid();
}

// ==============================
// LIKE / UNLIKE
// ==============================
function toggleLike(id, btn) {
  if (!state.user) {
    showToast("Login untuk menyukai akun", "error");
    return;
  }
  const acc =
    ACCOUNTS.find((a) => a.id === id) ||
    state.myPostings.find((a) => a.id === id);
  if (!acc) return;

  if (state.liked.has(id)) {
    state.liked.delete(id);
    acc.likes = Math.max(0, acc.likes - 1);
    if (btn) {
      btn.textContent = "🤍";
      btn.classList.remove("liked");
    }
    showToast("Dihapus dari favorit", "info");
  } else {
    state.liked.add(id);
    acc.likes++;
    if (btn) {
      btn.textContent = "❤️";
      btn.classList.add("liked");
    }
    showToast("Ditambahkan ke favorit ❤️", "success");
  }
  updateNavUI();
  renderGrid();
}

// ==============================
// MODAL DETAIL PRODUK
// ==============================
function openModal(id) {
  // Support both numeric ID and string ID (supa_xxx)
  const idParsed = isNaN(id) ? id : Number(id);
  const a =
    ACCOUNTS.find((x) => x.id === idParsed || x.id === id) ||
    state.myPostings.find((x) => x.id === idParsed || x.id === id);
  if (!a) return;
  state.modalAccount = a;
  state.modalQty = 1;
  a.views++;

  document.getElementById("m-img").innerHTML = a.image
    ? `<img src="${a.image}" alt="${a.code}" style="width:100%;height:auto;max-height:500px;object-fit:contain;display:block;position:relative">`
    : `<span style="font-size:5rem;color:rgba(255,255,255,.2)">${a.emoji}</span>`;
  document.getElementById("m-code").textContent = a.code;
  document.getElementById("m-title").textContent = a.title;
  document.getElementById("m-price").innerHTML =
    `${rp(a.price)} <small>${rp(a.orig)}</small>`;
  document.getElementById("m-qty").textContent = 1;

  const isLiked = state.liked.has(a.id);
  document.getElementById("m-like-btn").className =
    "modal-act btn-heart" + (isLiked ? " liked" : "");
  document.getElementById("m-like-btn").textContent = isLiked ? "❤️" : "🤍";

  document.getElementById("m-chips").innerHTML = `
    <div class="chip ${a.sold ? "r" : "g"}">${a.sold ? "❌ Terjual" : "✅ Tersedia"}</div>
    <div class="chip">🏆 ${a.rank || "N/A"}</div>
    <div class="chip">🗡️ ${a.hero || "?"} Hero</div>
    <div class="chip">👗 ${a.skin || "?"} Skin</div>
    <div class="chip">🌐 ${a.server || "ID"}</div>
    <div class="chip">👁️ ${a.views}x dilihat</div>
    <div class="chip">❤️ ${a.likes}x disukai</div>
    <div class="chip">-${disc(a.orig, a.price)}% diskon</div>`;

  const buyBtn = document.getElementById("m-buy-btn");
  const cartBtn = document.getElementById("m-cart-btn");
  const qtyRow = document.getElementById("m-qty-row");

  if (a.sold) {
    buyBtn.textContent = "❌ Sudah Terjual";
    buyBtn.disabled = true;
    buyBtn.style.opacity = ".5";
    cartBtn.style.display = "none";
    qtyRow.style.display = "none";
  } else {
    buyBtn.textContent = "🛒 Beli Sekarang";
    buyBtn.disabled = false;
    buyBtn.style.opacity = "1";
    cartBtn.style.display = "";
    qtyRow.style.display = "flex";
  }

  document.getElementById("modal-overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("open");
  document.body.style.overflow = "";
  renderGrid();
  renderPopular();
  renderFlash();
}

function changeQty(d) {
  state.modalQty = Math.max(1, state.modalQty + d);
  document.getElementById("m-qty").textContent = state.modalQty;
}

function toggleLikeModal() {
  if (!state.user) {
    showToast("Login untuk menyukai akun", "error");
    return;
  }
  const a = state.modalAccount;
  if (!a) return;
  toggleLike(a.id, null);
  const isLiked = state.liked.has(a.id);
  const btn = document.getElementById("m-like-btn");
  btn.textContent = isLiked ? "❤️" : "🤍";
  btn.className = "modal-act btn-heart" + (isLiked ? " liked" : "");
  // refresh chips
  document.getElementById("m-chips").innerHTML = `
    <div class="chip ${a.sold ? "r" : "g"}">${a.sold ? "❌ Terjual" : "✅ Tersedia"}</div>
    <div class="chip">🏆 ${a.rank || "N/A"}</div>
    <div class="chip">🗡️ ${a.hero || "?"} Hero</div>
    <div class="chip">👗 ${a.skin || "?"} Skin</div>
    <div class="chip">🌐 ${a.server || "ID"}</div>
    <div class="chip">👁️ ${a.views}x dilihat</div>
    <div class="chip">❤️ ${a.likes}x disukai</div>
    <div class="chip">-${disc(a.orig, a.price)}% diskon</div>`;
}

function buyNow() {
  if (!state.user) {
    closeModal();
    showPage("login");
    showToast("Login dahulu untuk membeli", "error");
    return;
  }
  const a = state.modalAccount;
  if (!a) return;
  state.checkoutItems = [{ ...a, qty: state.modalQty }];
  closeModal();
  openCheckout();
}

function addToCartFromModal() {
  if (!state.user) {
    closeModal();
    showPage("login");
    showToast("Login dahulu untuk menambah keranjang", "error");
    return;
  }
  const a = state.modalAccount;
  if (!a) return;
  addToCart(a);
  showToast(`${a.code} ditambahkan ke keranjang! 🛒`, "success");
}

// ==============================
// KERANJANG
// ==============================
function addToCart(acc) {
  const existing = state.cart.find((i) => i.id === acc.id);
  if (existing) existing.qty = (existing.qty || 1) + 1;
  else state.cart.push({ ...acc, qty: 1 });
  updateCartUI();
}

function removeFromCart(id) {
  state.cart = state.cart.filter((i) => i.id !== id);
  updateCartUI();
  renderCart();
  showToast("Item dihapus dari keranjang", "info");
}

function updateCartUI() {
  const cnt = state.cart.length;
  const badge = document.getElementById("cart-count");
  if (cnt > 0) {
    badge.style.display = "flex";
    badge.textContent = cnt;
  } else badge.style.display = "none";
}

function renderCart() {
  const el = document.getElementById("cart-body");
  if (!state.cart.length) {
    el.innerHTML = `
      <div class="cart-empty">
        <div class="ei">🛒</div>
        <p style="font-weight:700;font-size:1rem;margin-bottom:8px">Keranjang Kosong</p>
        <p>Belum ada item di keranjang kamu.</p>
        <button class="btn btn-gold" style="margin-top:16px" onclick="showPage('home')">
          Mulai Belanja →
        </button>
      </div>`;
    return;
  }
  const total = state.cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  el.innerHTML =
    state.cart
      .map(
        (i) => `
    <div class="cart-item">
      <div class="cart-item-img">${i.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-code">${i.code}</div>
        <div class="cart-item-name">${i.title}</div>
        <div class="cart-item-price">
          ${rp(i.price * (i.qty || 1))}
          ${
            i.qty > 1
              ? `<small style="font-size:.75rem;color:var(--muted)">(${i.qty}x ${rp(i.price)})</small>`
              : ""
          }
        </div>
      </div>
      <button class="cart-item-rm" onclick="removeFromCart(${i.id})">🗑️ Hapus</button>
    </div>`,
      )
      .join("") +
    `
    <div class="cart-total">
      <div>
        <div class="cart-total-lbl">Total Pembayaran</div>
        <div style="font-size:.75rem;color:var(--muted)">${state.cart.length} item</div>
      </div>
      <div style="display:flex;align-items:center;gap:14px">
        <div class="cart-total-val">${rp(total)}</div>
        <button class="cart-checkout-btn" onclick="checkoutCart()">Checkout →</button>
      </div>
    </div>`;
}

function checkoutCart() {
  if (!state.cart.length) return;
  state.checkoutItems = [...state.cart];
  openCheckout();
}

// ==============================
// CHECKOUT
// ==============================
function openCheckout() {
  state.checkoutStep = 1;
  state.checkoutPM = "";
  document.getElementById("cs1").className = "cstep active";
  document.getElementById("cs2").className = "cstep";
  document.getElementById("cs3").className = "cstep";
  document.getElementById("co-step1").style.display = "block";
  document.getElementById("co-step2").style.display = "none";
  document.getElementById("co-step3").style.display = "none";
  document.getElementById("co-pm-note").style.display = "none";
  document.querySelectorAll(".pm").forEach((p) => p.classList.remove("sel"));

  const total = state.checkoutItems.reduce(
    (s, i) => s + i.price * (i.qty || 1),
    0,
  );
  const fee = Math.round(total * 0.02);
  document.getElementById("co-summary").innerHTML =
    state.checkoutItems
      .map(
        (i) =>
          `<div class="order-row"><span>${i.code} (${i.qty || 1}x)</span><span>${rp(i.price * (i.qty || 1))}</span></div>`,
      )
      .join("") +
    `<div class="order-row"><span>Biaya Layanan (2%)</span><span>${rp(fee)}</span></div>` +
    `<div class="order-row total"><span>TOTAL</span><span>${rp(total + fee)}</span></div>`;

  document.getElementById("checkout-overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCheckout() {
  document.getElementById("checkout-overlay").classList.remove("open");
  document.body.style.overflow = "";
}

function coNext(step) {
  if (step === 2) {
    document.getElementById("co-step1").style.display = "none";
    document.getElementById("co-step2").style.display = "block";
    document.getElementById("cs1").className = "cstep done";
    document.getElementById("cs2").className = "cstep active";
  } else if (step === 3) {
    if (!state.checkoutPM) {
      showToast("Pilih metode pembayaran dahulu", "error");
      return;
    }
    processPayment();
  }
}

function selectPM(el, pm) {
  document.querySelectorAll(".pm").forEach((p) => p.classList.remove("sel"));
  el.classList.add("sel");
  state.checkoutPM = pm;
  const note = document.getElementById("co-pm-note");
  note.style.display = "block";
  note.textContent = `Pembayaran via ${pm} akan dikonfirmasi dalam 1-5 menit. Pastikan saldo kamu mencukupi.`;
}

// ==============================
// NOMOR WA ADMIN — ganti jika perlu
// ==============================
const ADMIN_WA = "6285790427533";

function openWA(pesan) {
  const url = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(pesan)}`;
  window.open(url, "_blank");
}

async function processPayment() {
  document.getElementById("co-step2").style.display = "none";
  document.getElementById("co-step3").style.display = "block";
  document.getElementById("cs2").className = "cstep done";
  document.getElementById("cs3").className = "cstep active done";

  const orderId = genUID();
  const total = state.checkoutItems.reduce(
    (s, i) => s + i.price * (i.qty || 1),
    0,
  );
  const grandTotal = total + Math.round(total * 0.02);

  document.getElementById("co-order-id").innerHTML =
    `Order ID: <b style="color:var(--gold)">${orderId}</b><br>` +
    `Metode: QRIS<br>` +
    `Total: ${rp(grandTotal)}`;

  state.checkoutItems.forEach((item) => {
    // Update di array ACCOUNTS (semua ID format)
    const acc = ACCOUNTS.find(
      (a) =>
        a.id === item.id ||
        a.id === String(item.id) ||
        String(a.id) === String(item.id),
    );
    if (acc) acc.sold = true;
    state.myPurchases.unshift({
      ...item,
      orderId,
      paidAt: new Date().toLocaleDateString("id-ID"),
      pm: "QRIS",
      status: "waiting_payment",
    });
  });

  // Simpan ke Supabase + update status otomatis
  if (state.user?.id && state.user.id !== "demo") {
    try {
      await supa.saveOrder(
        state.user.id,
        orderId,
        "akun",
        { items: state.checkoutItems, nama: state.user.name },
        grandTotal,
      );

      await supa.updateOrderStatus(orderId, "waiting_payment");

      // Update status akun jadi 'sold' di tabel posts
      for (const item of state.checkoutItems) {
        const acc = ACCOUNTS.find((a) => String(a.id) === String(item.id));
        if (acc?.supaId) {
          await supa.updatePostStatus(acc.supaId, "sold");
        }
      }
    } catch (e) {
      console.error("Gagal update status:", e);
    }
  }

  state.cart = [];
  updateCartUI();

  // Re-render supaya kartu langsung tampil SOLD di halaman
  renderGrid();
  renderFlash();
  renderPopular();

  const itemLines = state.checkoutItems
    .map(
      (i) =>
        `• ${i.code} — ${i.title} x${i.qty || 1} = ${rp(i.price * (i.qty || 1))}`,
    )
    .join("\n");
  const pesan =
    `🛒 *ORDER BELI AKUN ML*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `Order ID  : ${orderId}\n` +
    `Nama      : ${state.user?.name || "-"}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `*Detail Akun:*\n${itemLines}\n` +
    `Biaya Layanan (2%) : ${rp(Math.round(total * 0.02))}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `💰 *TOTAL: ${rp(grandTotal)}*\n` +
    `Metode Bayar: QRIS\n\n` +
    `Mohon konfirmasi pembayaran. Terima kasih! 🙏`;

  setTimeout(() => openWA(pesan), 1000);
  addNotif(
    "✅ Pesanan Dibuat!",
    `Order ${orderId} menunggu konfirmasi pembayaran via WhatsApp.`,
  );
  showToast("Mengarahkan ke WhatsApp... 📱", "success");
}

// ==============================
// AUTENTIKASI
// ==============================
function switchAuth(type, el) {
  document
    .querySelectorAll(".auth-tab")
    .forEach((t) => t.classList.remove("active"));
  el.classList.add("active");
  document.getElementById("auth-login").style.display =
    type === "login" ? "block" : "none";
  document.getElementById("auth-register").style.display =
    type === "register" ? "block" : "none";
}

async function doLogin() {
  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-pass").value;
  if (!email || !pass) {
    showToast("Email & password wajib diisi", "error");
    return;
  }
  if (!email.includes("@")) {
    showToast("Format email tidak valid", "error");
    return;
  }
  if (pass.length < 6) {
    showToast("Password minimal 6 karakter", "error");
    return;
  }

  showToast("Sedang login...", "info");
  try {
    const user = await supa.verifyUser(email, pass);
    if (!user) {
      showToast("Email atau password salah ❌", "error");
      return;
    }
    loginUser(user);
  } catch (e) {
    showToast("Gagal login, coba lagi", "error");
    console.error(e);
  }
}

async function doRegister() {
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const wa = document.getElementById("reg-wa").value.trim();
  const pass = document.getElementById("reg-pass").value;
  if (!name || !email || !wa || !pass) {
    showToast("Semua field wajib diisi", "error");
    return;
  }
  if (!email.includes("@")) {
    showToast("Format email tidak valid", "error");
    return;
  }
  if (wa.length < 10) {
    showToast("Nomor WhatsApp tidak valid", "error");
    return;
  }
  if (pass.length < 6) {
    showToast("Password minimal 6 karakter", "error");
    return;
  }

  showToast("Membuat akun...", "info");
  try {
    const exists = await supa.getUser(email);
    if (exists) {
      showToast("Email sudah terdaftar ❌", "error");
      return;
    }
    const result = await supa.createUser(name, email, pass, wa);
    const user = Array.isArray(result) ? result[0] : result;
    loginUser(user);
    showToast("Akun berhasil dibuat! 🎉", "success");
    addNotif(
      "🎉 Selamat Datang!",
      `Halo ${name}! Akun kamu di GenZstore sudah aktif.`,
    );
  } catch (e) {
    showToast("Gagal daftar: " + (e.message || "coba lagi"), "error");
    console.error(e);
  }
}

function demoLogin() {
  loginUser({
    id: "demo",
    name: "Demo User",
    email: "demo@genzstore.id",
    wa: "081234567890",
  });
  showToast("Login sebagai Demo User ✅", "success");
  addNotif(
    "🎮 Selamat Datang Demo!",
    "Ini adalah akun demo. Coba semua fitur GenZstore!",
  );
}

function loginUser(user) {
  state.user = user;
  // Simpan session di sessionStorage supaya tidak hilang saat refresh
  try {
    sessionStorage.setItem("gz_user", JSON.stringify(user));
  } catch (e) {}
  updateNavUI();
  showPage("home");
  showToast(`Selamat datang, ${user.name}! 👋`, "success");
}

function logout() {
  state.user = null;
  state.cart = [];
  state.liked.clear();
  state.myPostings = [];
  state.myPurchases = [];
  state.notifications = [];
  try {
    sessionStorage.removeItem("gz_user");
  } catch (e) {}
  updateNavUI();
  closeDropdown();
  showPage("home");
  showToast("Berhasil keluar. Sampai jumpa!", "info");
}

function updateNavUI() {
  const u = state.user;
  document.getElementById("auth-btns").style.display = u ? "none" : "flex";
  document.getElementById("user-menu").style.display = u ? "block" : "none";
  document.getElementById("float-btn").style.display =
    u && document.querySelector("#page-home.active") ? "block" : "none";
  if (u)
    document.getElementById("avatar-btn").textContent = u.name
      .charAt(0)
      .toUpperCase();
  updateCartUI();
  updateNotifBadge();
}

// ==============================
// DROPDOWN USER MENU
// ==============================
function toggleDropdown() {
  document.getElementById("user-dropdown").classList.toggle("open");
}
function closeDropdown() {
  document.getElementById("user-dropdown").classList.remove("open");
}
document.addEventListener("click", (e) => {
  if (!e.target.closest(".dropdown")) closeDropdown();
});

// ==============================
// POST AKUN
// ==============================
let uploadedFiles = [];

function handleFiles(files) {
  const preview = document.getElementById("upload-preview");
  Array.from(files)
    .slice(0, 5)
    .forEach((f) => {
      if (!f.type.startsWith("image/")) return;
      const r = new FileReader();
      r.onload = (e) => {
        uploadedFiles.push(e.target.result);
        const img = document.createElement("img");
        img.src = e.target.result;
        img.className = "preview-img";
        preview.appendChild(img);
      };
      r.readAsDataURL(f);
    });
}

function updatePricePreview() {
  const price = parseInt(document.getElementById("post-price").value) || 0;
  const wrap = document.getElementById("price-preview-wrap");
  if (price > 0) {
    wrap.style.display = "block";
    document.getElementById("pp-val").textContent = rp(price);
    document.getElementById("pp-net").textContent = rp(
      Math.round(price * 0.95),
    );
  } else {
    wrap.style.display = "none";
  }
}

async function submitPost() {
  if (!state.user) {
    showPage("login");
    showToast("Login dahulu untuk post akun", "error");
    return;
  }
  const title = document.getElementById("post-title").value.trim();
  const price = parseInt(document.getElementById("post-price").value) || 0;
  const orig = parseInt(document.getElementById("post-orig").value) || price;
  const rank = document.getElementById("post-rank").value;
  const server = document.getElementById("post-server").value;
  const hero = parseInt(document.getElementById("post-hero").value) || 0;
  const skin = parseInt(document.getElementById("post-skin").value) || 0;
  const desc = document.getElementById("post-desc").value.trim();
  const wa =
    document.getElementById("post-wa")?.value.trim() || state.user.wa || "";
  const imageUrl =
    document.getElementById("post-image-url")?.value.trim() || "";

  if (!title) {
    showToast("Nama/judul akun wajib diisi", "error");
    return;
  }
  if (price < 10000) {
    showToast("Harga minimal Rp 10.000", "error");
    return;
  }
  if (!rank) {
    showToast("Rank wajib dipilih", "error");
    return;
  }
  if (!server) {
    showToast("Server wajib dipilih", "error");
    return;
  }

  showToast("Menyimpan akun...", "info");

  // Simpan ke Supabase
  if (state.user?.id && state.user.id !== "demo") {
    try {
      await supa.query("posts", {
        method: "POST",
        body: JSON.stringify({
          user_id: state.user.id,
          user_name: state.user.name,
          user_wa: state.user.wa || wa,
          title,
          price,
          orig_price: orig || Math.round(price * 1.25),
          rank,
          server,
          hero_count: hero,
          skin_count: skin,
          description: desc,
          contact_wa: wa,
          image_url: imageUrl,
          status: "approved",
        }),
        prefer: "return=representation",
      });
    } catch (e) {
      console.error("Gagal simpan post:", e);
      showToast("Gagal simpan ke database: " + (e.message || ""), "error");
      return;
    }
  }

  const emojis = ["⚔️", "🗡️", "🏹", "🔥", "⚡", "🌟", "💎", "👑", "🛡️", "🏆"];
  const newAcc = {
    id: Date.now(),
    code: `Code-${1200 + state.myPostings.length}`,
    title,
    price,
    orig: orig || Math.round(price * 1.25),
    views: 0,
    likes: 0,
    sold: false,
    rank,
    hero,
    skin,
    server,
    desc,
    emoji: emojis[Math.floor(Math.random() * emojis.length)],
    image: imageUrl,
    postedBy: state.user.name,
    postedAt: new Date().toLocaleDateString("id-ID"),
  };

  state.myPostings.unshift(newAcc);
  ACCOUNTS.unshift(newAcc); // langsung muncul di marketplace

  // Reset form
  [
    "post-title",
    "post-price",
    "post-orig",
    "post-hero",
    "post-skin",
    "post-desc",
    "post-wa",
    "post-image-url",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  document.getElementById("upload-preview").innerHTML = "";
  const fi = document.getElementById("file-input");
  if (fi) fi.value = "";
  document.getElementById("post-rank").value = "";
  document.getElementById("post-server").value = "";
  document.getElementById("price-preview-wrap").style.display = "none";
  uploadedFiles = [];

  addNotif(
    "📦 Akun Berhasil Dipost!",
    `Akun "${title}" sudah langsung tampil di marketplace. Semoga cepat laku! 🎉`,
  );
  showToast("Akun berhasil dipost & langsung tampil! 🎉", "success");
  showPage("home");
  renderGrid();
  renderFlash();
  renderPopular();
}

// ==============================
// LOAD APPROVED POSTS FROM SUPABASE
// ==============================
async function handleFileUpload(file) {
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    showToast("Foto maksimal 5MB", "error");
    return;
  }

  const preview = document.getElementById("upload-preview");
  preview.innerHTML = `<p style="color:var(--muted);font-size:.8rem">⏳ Mengupload foto...</p>`;

  try {
    const ext = file.name.split(".").pop();
    const fileName = `akun_${Date.now()}.${ext}`;
    const res = await fetch(
      `${SUPA_URL}/storage/v1/object/akun-photos/${fileName}`,
      {
        method: "POST",
        headers: {
          apikey: SUPA_KEY,
          Authorization: `Bearer ${SUPA_KEY}`,
          "Content-Type": file.type,
          "x-upsert": "true",
        },
        body: file,
      },
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Upload error:", res.status, errText);
      throw new Error(`Upload gagal: ${res.status} — ${errText}`);
    }

    const publicUrl = `${SUPA_URL}/storage/v1/object/public/akun-photos/${fileName}`;
    document.getElementById("post-image-url").value = publicUrl;
    preview.innerHTML = `
      <img src="${publicUrl}" alt="Preview"
        style="max-width:100%;max-height:200px;border-radius:10px;object-fit:contain;border:2px solid var(--gold)">
      <p style="color:var(--green);font-size:.78rem;margin-top:6px">✅ Foto berhasil diupload!</p>`;
    showToast("Foto berhasil diupload! 📸", "success");
  } catch (e) {
    preview.innerHTML = `<p style="color:var(--red);font-size:.8rem">❌ Gagal upload foto, coba lagi</p><p style="color:var(--muted);font-size:.7rem;margin-top:4px">${e.message}</p>`;
    showToast("Gagal upload foto", "error");
    console.error(e);
  }
}

async function loadApprovedPosts() {
  try {
    const posts = await supa.query(
      "posts?status=eq.approved&order=created_at.desc",
    );
    if (!posts || !posts.length) return;

    const emojis = ["⚔️", "🗡️", "🏹", "🔥", "⚡", "🌟", "💎", "👑", "🛡️", "🏆"];
    posts.forEach((p) => {
      // Cegah duplikat
      const exists = ACCOUNTS.find((a) => a.supaId === p.id);
      if (exists) return;

      ACCOUNTS.unshift({
        id: "supa_" + p.id,
        supaId: p.id,
        code: `Code-${p.id.slice(0, 4).toUpperCase()}`,
        title: p.title,
        price: p.price,
        orig: p.orig_price || Math.round(p.price * 1.25),
        views: 0,
        likes: 0,
        sold: false,
        rank: p.rank || "Mythic",
        hero: p.hero_count || 0,
        skin: p.skin_count || 0,
        server: p.server || "Indonesia",
        desc: p.description || "",
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        postedBy: p.user_name || "-",
        postedAt: new Date(p.created_at).toLocaleDateString("id-ID"),
        image: p.image_url || "",
      });
    });

    renderGrid();
    renderFlash();
    renderPopular();
  } catch (e) {
    console.error("Gagal load posts:", e);
  }
}
let activeDenomFilter = "semua";

function filterDenom(f, el) {
  activeDenomFilter = f;
  document
    .querySelectorAll(".tu-ftab")
    .forEach((t) => t.classList.remove("active"));
  el.classList.add("active");
  document.querySelectorAll(".denom").forEach((card) => {
    const cat = card.dataset.cat;
    if (f === "semua") card.classList.remove("hidden");
    else if (f === "special")
      card.classList.toggle("hidden", cat !== "special");
    else if (f === "regular")
      card.classList.toggle("hidden", cat !== "regular");
  });
}

function renderTopUp() {
  const el = document.getElementById("denom-grid");
  el.innerHTML = DENOMS.map((d, i) => {
    const isSpecial = d.cat === "special";
    const label = d.label || `${d.diamond} Diamond`;
    return `
    <div class="denom${isSpecial ? " special-item" : ""}" 
         data-cat="${d.cat}" onclick="selectDenom(${i},this)">
      ${isSpecial ? `<div class="d-badge">🔥 SPECIAL</div>` : ""}
      <div class="d-diamond">${isSpecial ? "🎫 Pass" : "💎 Diamond"}</div>
      <div class="d-val">${isSpecial ? d.label.replace("Weekly Diamond Pass", "WDP") : d.diamond}</div>
      <div class="d-price">${rp(d.price)}</div>
    </div>`;
  }).join("");
}

let selDenom = null;
function selectDenom(i, el) {
  document.querySelectorAll(".denom").forEach((d) => d.classList.remove("sel"));
  el.classList.add("sel");
  selDenom = DENOMS[i];
  const uid = document.getElementById("tu-uid").value.trim();
  const server = document.getElementById("tu-server").value.trim();
  updateTopUpSummary(uid, server, selDenom);
  // tampilkan box payment & wa
  document.getElementById("tu-payment-box").style.display = "block";
  document.getElementById("tu-wa-box").style.display = "block";
}

function validateUID() {
  if (selDenom) {
    const uid = document.getElementById("tu-uid").value.trim();
    const server = document.getElementById("tu-server").value.trim();
    updateTopUpSummary(uid, server, selDenom);
  }
}

function updateTopUpSummary(uid, server, denom) {
  const wrap = document.getElementById("tu-summary");
  if (uid.length >= 4 && denom) {
    const label = denom.label || `${denom.diamond} Diamond`;
    document.getElementById("tu-sum-uid").textContent = uid;
    document.getElementById("tu-sum-server").textContent = server || "-";
    document.getElementById("tu-sum-denom").textContent = label;
    document.getElementById("tu-sum-total").textContent = rp(denom.price);
    wrap.style.display = "block";
  } else {
    wrap.style.display = "none";
  }
}

async function doTopUp() {
  if (!selDenom) {
    showToast("Pilih nominal diamond dahulu", "error");
    return;
  }
  const uid = document.getElementById("tu-uid").value.trim();
  const server = document.getElementById("tu-server").value.trim();
  const waBuyer = document.getElementById("tu-wa-buyer")?.value.trim() || "-";
  if (uid.length < 4) {
    showToast("Masukkan ID Player yang valid", "error");
    return;
  }

  const orderId = genUID();
  const label = selDenom.label || `${selDenom.diamond} Diamond`;

  // Simpan ke Supabase + update status otomatis
  if (state.user?.id && state.user.id !== "demo") {
    try {
      await supa.saveOrder(
        state.user.id,
        orderId,
        "topup",
        { uid, server, nominal: label, wa_buyer: waBuyer },
        selDenom.price,
      );
      await supa.updateOrderStatus(orderId, "waiting_payment");
    } catch (e) {
      console.error("Gagal simpan order topup:", e);
    }
  }

  const pesan =
    `💎 *ORDER TOP UP DIAMOND ML*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `Order ID    : ${orderId}\n` +
    `Game        : Mobile Legends\n` +
    `ID Player   : ${uid}\n` +
    `Server      : ${server || "-"}\n` +
    `Nominal     : ${label}\n` +
    `Metode Bayar: QRIS\n` +
    `No. WA      : ${waBuyer}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `💰 *TOTAL: ${rp(selDenom.price)}*\n\n` +
    `Mohon kirimkan bukti transfer QRIS. Terima kasih! 🙏`;

  openWA(pesan);
  showToast("Mengarahkan ke WhatsApp... 📱", "success");

  // Tambahkan ke riwayat pembelian
  state.myPurchases.unshift({
    emoji: "💎",
    orderId,
    paidAt: new Date().toLocaleDateString("id-ID"),
    code: "Top Up",
    title: label,
    price: selDenom.price,
    pm: "QRIS",
    status: "waiting_payment",
  });

  // Reset form
  selDenom = null;
  document.querySelectorAll(".denom").forEach((d) => d.classList.remove("sel"));
  document.getElementById("tu-uid").value = "";
  document.getElementById("tu-server").value = "";
  if (document.getElementById("tu-wa-buyer"))
    document.getElementById("tu-wa-buyer").value = "";
  document.getElementById("tu-summary").style.display = "none";
  document.getElementById("tu-payment-box").style.display = "none";
  document.getElementById("tu-wa-box").style.display = "none";
}

// ==============================
// PROFIL
// ==============================
// ==============================
// ORDER STATUS HELPERS
// ==============================
function getOrderStatusBadge(status) {
  const map = {
    pending: { bg: "#64748b", icon: "⏳", label: "Menunggu" },
    waiting_payment: { bg: "#f59e0b", icon: "💳", label: "Bayar Dulu" },
    completed: { bg: "#22c55e", icon: "✓", label: "Selesai" },
    cancelled: { bg: "#e94560", icon: "✕", label: "Dibatalkan" },
  };
  const s = map[status] || map["pending"];
  return `<span style="background:${s.bg};color:#fff;font-size:.65rem;padding:2px 8px;border-radius:4px;font-weight:700">${s.icon} ${s.label}</span>`;
}

async function cancelOrder(orderId) {
  if (!confirm("Yakin ingin membatalkan pesanan ini?")) return;
  try {
    await supa.updateOrderStatus(orderId, "cancelled");
    const p = state.myPurchases.find((o) => o.orderId === orderId);
    if (p) p.status = "cancelled";
    renderPurchases();
    showToast("Pesanan dibatalkan", "error");
  } catch (e) {
    showToast("Gagal membatalkan pesanan", "error");
  }
}

function renderProfile() {
  if (!state.user) return;
  const u = state.user;
  document.getElementById("profile-av").textContent = u.name
    .charAt(0)
    .toUpperCase();
  document.getElementById("profile-name").textContent = u.name;
  document.getElementById("profile-email").textContent = u.email;
  document.getElementById("ps-post").textContent = state.myPostings.length;
  document.getElementById("ps-sold").textContent = state.myPostings.filter(
    (a) => a.sold,
  ).length;
  document.getElementById("ps-buy").textContent = state.myPurchases.length;
  document.getElementById("ps-fav").textContent = state.liked.size;
  document.getElementById("set-name").value = u.name;
  document.getElementById("set-wa").value = u.wa || "";
}

function renderMyPostings() {
  const g = document.getElementById("my-postings-grid");
  const e = document.getElementById("my-postings-empty");
  if (!state.myPostings.length) {
    g.innerHTML = "";
    e.style.display = "block";
    return;
  }
  e.style.display = "none";
  g.innerHTML = state.myPostings.map((a) => cardHTML(a)).join("");
}

function renderPurchases() {
  const el = document.getElementById("my-purchases");
  const em = document.getElementById("my-purchases-empty");
  if (!state.myPurchases.length) {
    el.innerHTML = "";
    em.style.display = "block";
    return;
  }
  em.style.display = "none";
  el.innerHTML = state.myPurchases
    .map(
      (p) => `
    <div class="cart-item">
      <div class="cart-item-img">${p.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-code">${p.orderId} · ${p.paidAt}</div>
        <div class="cart-item-name">${p.code} — ${p.title}</div>
        <div class="cart-item-price" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          ${rp(p.price)}
          ${getOrderStatusBadge(p.status || "waiting_payment")}
          ${p.status === "waiting_payment" ? `<button onclick="cancelOrder('${p.orderId}')" style="background:rgba(233,69,96,.15);border:1px solid var(--red);color:var(--red);font-size:.65rem;padding:2px 8px;border-radius:4px;cursor:pointer;font-family:'Nunito',sans-serif;font-weight:700">Batalkan</button>` : ""}
        </div>
      </div>
    </div>`,
    )
    .join("");
}

function renderFavorites() {
  const g = document.getElementById("my-fav-grid");
  const e = document.getElementById("my-fav-empty");
  const favs = [...ACCOUNTS, ...state.myPostings].filter((a) =>
    state.liked.has(a.id),
  );
  if (!favs.length) {
    g.innerHTML = "";
    e.style.display = "block";
    return;
  }
  e.style.display = "none";
  g.innerHTML = favs.map((a) => cardHTML(a)).join("");
}

function switchPTab(sec, el) {
  document
    .querySelectorAll(".ptab")
    .forEach((t) => t.classList.remove("active"));
  el.classList.add("active");
  document
    .querySelectorAll(".profile-section")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById("psec-" + sec).classList.add("active");
  if (sec === "postings") renderMyPostings();
  if (sec === "purchases") renderPurchases();
  if (sec === "favorites") renderFavorites();
}

function saveSettings() {
  const name = document.getElementById("set-name").value.trim();
  const wa = document.getElementById("set-wa").value.trim();
  if (!name) {
    showToast("Nama tidak boleh kosong", "error");
    return;
  }
  state.user.name = name;
  state.user.wa = wa;
  document.getElementById("avatar-btn").textContent = name
    .charAt(0)
    .toUpperCase();
  document.getElementById("profile-av").textContent = name
    .charAt(0)
    .toUpperCase();
  document.getElementById("profile-name").textContent = name;
  document.getElementById("set-pass").value = "";
  showToast("Profil berhasil disimpan ✅", "success");
}

function showEditProfile() {
  switchPTab("settings", document.querySelectorAll(".ptab")[3]);
}

// ==============================
// NOTIFIKASI
// ==============================
function addNotif(title, body) {
  state.notifications.unshift({
    id: Date.now(),
    title,
    body,
    unread: true,
    time: new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });
  updateNotifBadge();
}

function updateNotifBadge() {
  const cnt = state.notifications.filter((n) => n.unread).length;
  const badge = document.getElementById("notif-badge");
  if (cnt > 0) {
    badge.style.display = "inline-flex";
    badge.textContent = cnt;
  } else badge.style.display = "none";
}

function renderNotifs() {
  const el = document.getElementById("notif-list");
  if (!state.notifications.length) {
    el.innerHTML = `<div class="no-results"><div class="nr-icon">🔔</div><p>Belum ada notifikasi</p></div>`;
    return;
  }
  state.notifications.forEach((n) => (n.unread = false));
  updateNotifBadge();
  el.innerHTML = state.notifications
    .map(
      (n) => `
    <div class="notif-item${n.unread ? " unread" : ""}">
      <div class="notif-icon">🔔</div>
      <div class="notif-content">
        <div class="notif-title">${n.title}</div>
        <div class="notif-body">${n.body}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </div>`,
    )
    .join("");
}

function markAllRead() {
  state.notifications.forEach((n) => (n.unread = false));
  updateNotifBadge();
  renderNotifs();
  showToast("Semua notifikasi ditandai dibaca", "info");
}

function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = answer.classList.contains("open");
  // Tutup semua dulu
  document
    .querySelectorAll(".faq-a")
    .forEach((a) => a.classList.remove("open"));
  document
    .querySelectorAll(".faq-q")
    .forEach((q) => q.classList.remove("open"));
  // Buka yang diklik (kecuali kalau sudah open)
  if (!isOpen) {
    answer.classList.add("open");
    btn.classList.add("open");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Restore session kalau user sudah login sebelumnya
  try {
    const saved = sessionStorage.getItem("gz_user");
    if (saved) {
      state.user = JSON.parse(saved);
      updateNavUI();
    }
  } catch (e) {}

  renderBanners();
  renderFlash();
  renderPopular();
  renderGrid();
  renderTopUp();

  // Load akun approved dari Supabase
  loadApprovedPosts();

  // Tampilkan halaman home secara default agar section keunggulan & footer muncul
  showPage("home");
});

// ==============================
// INFO MODAL
// ==============================
const INFO_CONTENT = {
  tentang: `
    <h2>🏪 Tentang GenZstore</h2>
    <p class="info-sub">Platform jual beli akun & top up Mobile Legends terpercaya</p>
    <p>GenZstore adalah platform digital yang didirikan pada tahun 2024, berfokus pada jual beli akun Mobile Legends dan layanan top up diamond dengan harga terjangkau dan proses yang cepat.</p>
    <h3>🎯 Visi Kami</h3>
    <p>Menjadi marketplace akun game terpercaya #1 di Indonesia dengan layanan terbaik dan harga yang bersaing.</p>
    <h3>💡 Misi Kami</h3>
    <ul>
      <li>Menyediakan akun Mobile Legends berkualitas dengan harga terjangkau</li>
      <li>Memberikan pelayanan yang cepat, ramah, dan profesional</li>
      <li>Menjamin keamanan setiap transaksi yang dilakukan</li>
      <li>Membantu penjual mendapatkan pembeli yang tepat dengan mudah</li>
    </ul>
    <h3>📞 Hubungi Kami</h3>
    <div class="info-highlight"><p>📱 WhatsApp: +62 857-9042-7533<br>📧 Email: cs@genzstore.id<br>🕐 Jam Aktif: Senin–Minggu, 08.00–22.00 WIB</p></div>`,

  syarat: `
    <h2>📋 Syarat & Ketentuan</h2>
    <p class="info-sub">Harap baca dengan seksama sebelum menggunakan layanan kami</p>
    <h3>1. Ketentuan Umum</h3>
    <p>Dengan menggunakan layanan GenZstore, kamu menyetujui semua syarat dan ketentuan yang berlaku. GenZstore berhak mengubah ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya.</p>
    <h3>2. Ketentuan Akun Pengguna</h3>
    <ul>
      <li>Pengguna harus berusia minimal 13 tahun</li>
      <li>Satu orang hanya diperbolehkan memiliki satu akun</li>
      <li>Pengguna bertanggung jawab atas keamanan akun masing-masing</li>
      <li>Dilarang menggunakan akun untuk tujuan penipuan atau merugikan pihak lain</li>
    </ul>
    <h3>3. Ketentuan Jual Beli</h3>
    <ul>
      <li>Penjual wajib memberikan informasi akun yang akurat dan jujur</li>
      <li>Pembeli wajib melakukan pembayaran sesuai harga yang tertera</li>
      <li>Transaksi yang sudah selesai tidak dapat dibatalkan tanpa alasan yang valid</li>
      <li>GenZstore tidak bertanggung jawab atas kerugian akibat kelalaian pengguna</li>
    </ul>
    <h3>4. Larangan</h3>
    <ul>
      <li>Dilarang menjual akun yang diperoleh secara ilegal atau hasil hack</li>
      <li>Dilarang melakukan penipuan dalam bentuk apapun</li>
      <li>Dilarang menggunakan bot atau script untuk mengakses platform</li>
    </ul>
    <div class="info-highlight"><p>⚠️ Pelanggaran terhadap syarat & ketentuan ini dapat mengakibatkan pemblokiran akun permanen.</p></div>`,

  privasi: `
    <h2>🔒 Kebijakan Privasi</h2>
    <p class="info-sub">Kami menghargai dan melindungi privasi data kamu</p>
    <h3>Data yang Kami Kumpulkan</h3>
    <ul>
      <li><strong>Data Registrasi:</strong> Nama, email, nomor WhatsApp</li>
      <li><strong>Data Transaksi:</strong> Riwayat pembelian dan penjualan</li>
      <li><strong>Data Teknis:</strong> Browser, waktu akses (untuk keamanan)</li>
    </ul>
    <h3>Bagaimana Kami Menggunakan Data</h3>
    <ul>
      <li>Memproses transaksi dan pengiriman akun</li>
      <li>Mengirimkan notifikasi terkait pesanan</li>
      <li>Meningkatkan layanan dan pengalaman pengguna</li>
      <li>Mencegah penipuan dan menjaga keamanan platform</li>
    </ul>
    <h3>Perlindungan Data</h3>
    <p>Semua data disimpan dengan enkripsi dan hanya dapat diakses oleh tim yang berwenang. Kami tidak menjual atau membagikan data pribadi kamu kepada pihak ketiga tanpa izin.</p>
    <h3>Hak Pengguna</h3>
    <ul>
      <li>Hak mengakses data pribadi yang tersimpan</li>
      <li>Hak meminta penghapusan akun dan data</li>
      <li>Hak mengajukan keberatan atas penggunaan data</li>
    </ul>
    <div class="info-highlight"><p>📧 Untuk pertanyaan terkait privasi, hubungi: cs@genzstore.id</p></div>`,

  cara: `
    <h2>🛒 Cara Pembelian</h2>
    <p class="info-sub">Ikuti langkah berikut untuk membeli akun atau top up diamond</p>
    <h3>🎮 Beli Akun Mobile Legends</h3>
    <div class="info-step"><div class="info-step-num">1</div><div class="info-step-text"><strong>Daftar / Login</strong><span>Buat akun GenZstore atau login jika sudah punya akun</span></div></div>
    <div class="info-step"><div class="info-step-num">2</div><div class="info-step-text"><strong>Pilih Akun</strong><span>Browse marketplace, filter sesuai rank atau hero yang kamu inginkan</span></div></div>
    <div class="info-step"><div class="info-step-num">3</div><div class="info-step-text"><strong>Klik Beli Sekarang</strong><span>Buka detail akun, klik tombol "Beli Sekarang"</span></div></div>
    <div class="info-step"><div class="info-step-num">4</div><div class="info-step-text"><strong>Pilih Pembayaran</strong><span>Pilih metode bayar (QRIS/e-wallet/transfer bank)</span></div></div>
    <div class="info-step"><div class="info-step-num">5</div><div class="info-step-text"><strong>Konfirmasi via WhatsApp</strong><span>Pesan otomatis terkirim ke admin, lakukan pembayaran & kirim bukti</span></div></div>
    <div class="info-step"><div class="info-step-num">6</div><div class="info-step-text"><strong>Terima Akun</strong><span>Admin akan mengirimkan detail akun setelah pembayaran dikonfirmasi</span></div></div>
    <h3>💎 Top Up Diamond</h3>
    <div class="info-step"><div class="info-step-num">1</div><div class="info-step-text"><strong>Masuk ke Halaman Top Up</strong><span>Klik menu "Top Up" di navbar atas</span></div></div>
    <div class="info-step"><div class="info-step-num">2</div><div class="info-step-text"><strong>Pilih Nominal Diamond</strong><span>Pilih jumlah diamond yang ingin dibeli</span></div></div>
    <div class="info-step"><div class="info-step-num">3</div><div class="info-step-text"><strong>Masukkan ID & Server</strong><span>Isi ID Player dan Server ML kamu dengan benar</span></div></div>
    <div class="info-step"><div class="info-step-num">4</div><div class="info-step-text"><strong>Bayar & Konfirmasi</strong><span>Lakukan pembayaran via QRIS dan kirim bukti ke admin WA</span></div></div>
    <div class="info-highlight"><p>⏱️ Diamond masuk dalam <strong>1-30 menit</strong> setelah pembayaran dikonfirmasi (jam aktif 08.00-22.00 WIB)</p></div>`,

  reseller: `
    <h2>🤝 Program Reseller</h2>
    <p class="info-sub">Bergabung dan raih penghasilan tambahan bersama GenZstore!</p>
    <h3>Apa itu Program Reseller?</h3>
    <p>Program Reseller GenZstore memungkinkan kamu untuk menjual ulang akun dan layanan top up dengan harga spesial, dan mendapatkan komisi dari setiap transaksi yang berhasil.</p>
    <h3>💰 Keuntungan Reseller</h3>
    <ul>
      <li>Harga khusus reseller lebih murah dari harga publik</li>
      <li>Komisi hingga 5-10% per transaksi</li>
      <li>Support admin 24 jam via WhatsApp</li>
      <li>Materi promosi (banner, caption) disediakan gratis</li>
      <li>Tidak ada target penjualan minimum</li>
    </ul>
    <h3>📋 Syarat Menjadi Reseller</h3>
    <ul>
      <li>Memiliki akun GenZstore yang aktif</li>
      <li>Membayar biaya pendaftaran reseller (hubungi admin)</li>
      <li>Menyetujui ketentuan program reseller</li>
      <li>Bersedia menjaga nama baik GenZstore</li>
    </ul>
    <h3>🚀 Cara Daftar</h3>
    <div class="info-step"><div class="info-step-num">1</div><div class="info-step-text"><strong>Hubungi Admin WA</strong><span>Chat admin di +62 857-9042-7533</span></div></div>
    <div class="info-step"><div class="info-step-num">2</div><div class="info-step-text"><strong>Kirim Data Diri</strong><span>Nama, email, dan alasan ingin jadi reseller</span></div></div>
    <div class="info-step"><div class="info-step-num">3</div><div class="info-step-text"><strong>Aktivasi Akun Reseller</strong><span>Setelah diverifikasi, kamu langsung bisa mulai berjualan</span></div></div>
    <div class="info-highlight"><p>💬 Daftar sekarang: <a href="https://wa.me/6285790427533" target="_blank" style="color:var(--gold)">Hubungi Admin WhatsApp</a></p></div>`,
};

function openInfoModal(type) {
  const overlay = document.getElementById("info-modal-overlay");
  const body = document.getElementById("info-modal-body");
  body.innerHTML = INFO_CONTENT[type] || "<p>Konten tidak tersedia.</p>";
  overlay.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeInfoModal() {
  document.getElementById("info-modal-overlay").style.display = "none";
  document.body.style.overflow = "";
}
