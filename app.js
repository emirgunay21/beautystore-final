"use strict";
const API_BASE = "http://localhost:3001";

/* =========================
   1) Core Helpers
========================= */
const __CACHE = new Map();

async function getJSON(url) {
  if (__CACHE.has(url)) return __CACHE.get(url);

  const p = fetch(url).then(async (res) => {
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} -> ${url}`);
    return res.json();
  });

  __CACHE.set(url, p);
  return p;
}

function buildStarsHTML(rating, size = 24) {
  const r = Math.max(0, Math.min(5, Number(rating) || 0));
  const full = Math.floor(r);
  const half = (r - full) >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  let html = "";
  for (let i = 0; i < full; i++) {
    html += `<img src="images/Star 1.png" style="width:${size}px;height:${size}px;" alt="star">`;
  }
  if (half) {
    html += `<img src="images/Star 5.png" style="width:${size}px;height:${size}px;" alt="half">`;
  }
  for (let i = 0; i < empty; i++) {
    html += `<img src="images/Starempty.png" style="width:${size}px;height:${size}px;" alt="empty">`;
  }
  return html;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "-";
}

/* =========================
   2) Storage (localStorage)
========================= */
function readCart() {
  try {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

function writeCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartBadge() {
  const badgeDesktop = document.getElementById("cartCount");
  const badgeMobile = document.getElementById("cartCountMobile");

  const cart = readCart();
  const totalQty = cart.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);

  if (badgeDesktop) {
    badgeDesktop.textContent = totalQty;
    badgeDesktop.style.display = totalQty > 0 ? "inline-block" : "none";
  }

  if (badgeMobile) {
    badgeMobile.textContent = totalQty;
    badgeMobile.style.display = totalQty > 0 ? "inline-block" : "none";
  }
}

function readComments(productId) {
  try {
    const all = JSON.parse(localStorage.getItem("commentsByProduct")) || {};
    return Array.isArray(all[productId]) ? all[productId] : [];
  } catch {
    return [];
  }
}

function writeComments(productId, list) {
  const all = (() => {
    try {
      return JSON.parse(localStorage.getItem("commentsByProduct")) || {};
    } catch {
      return {};
    }
  })();

  all[productId] = list;
  localStorage.setItem("commentsByProduct", JSON.stringify(all));
}

const LS_KEY = "addresses";
const LS_SELECTED = "selectedAddressId";

function readAddresses() {
  try {
    const data = JSON.parse(localStorage.getItem(LS_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeAddresses(list) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

function seedAddressesIfEmpty() {
  const list = readAddresses();
  if (list.length) return;

  const seeded = [
    {
      id: "addr1",
      title: "2118 Thornridge",
      tag: "Home",
      line: "2118 Thornridge Cir. Syracuse, Connecticut 35624",
      phone: "(209) 555-0104",
    },
    {
      id: "addr2",
      title: "11 Oxford Street",
      tag: "Office",
      line: "11 Oxford Street, London W1D 2LT",
      phone: "(415) 555-0133",
    },
  ];

  writeAddresses(seeded);
  localStorage.setItem(LS_SELECTED, seeded[0].id);
}

/* =========================
   3) Navbar / Menu / Login
========================= */
function setupBurgerMenu() {
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("menuOverlay");
  const closeBtn = document.getElementById("menuCloseBtn");

  if (!burgerBtn || !mobileMenu || !overlay || !closeBtn) return;

  function openMenu() {
    mobileMenu.classList.add("open");
    overlay.classList.add("open");
    burgerBtn.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    mobileMenu.classList.remove("open");
    overlay.classList.remove("open");
    burgerBtn.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  burgerBtn.addEventListener("click", () => {
    mobileMenu.classList.contains("open") ? closeMenu() : openMenu();
  });

  overlay.addEventListener("click", closeMenu);
  closeBtn.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  mobileMenu.addEventListener("click", (e) => {
    if (e.target.tagName === "A") closeMenu();
  });
}

function setupLoginModal() {
  const navUser = document.getElementById("navUser");
  const mobileUserBtn = document.getElementById("mobileUserBtn");
  const navCart = document.getElementById("navCart");
  const mobileCartBtn = document.getElementById("mobileCartBtn");
  const modal = document.getElementById("loginModal");
  const emailEl = document.getElementById("loginEmail");
  const passEl = document.getElementById("loginPass");
  const btn = document.getElementById("loginBtn");
  const msg = document.getElementById("loginMsg");
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("menuOverlay");
  const closeBtn = document.getElementById("menuCloseBtn");

  if (!navUser || !modal) return;

  function openModal() {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    if (msg) msg.textContent = "";
    if (emailEl) emailEl.value = "";
    if (passEl) passEl.value = "";
    setTimeout(() => emailEl?.focus(), 0);
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }

  function renderUser() {
    const user = getUser();
    if (user?.email) {
      navUser.innerHTML = `
        <span style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;">
          <img src="images/User.png" style="width:24px;height:24px;" alt="User">
          <span style="font-size:14px;color:#111;">${user.email}</span>
        </span>
      `;
    } else {
      navUser.innerHTML = `<img src="images/User.png" style="width:24px;height:24px;cursor:pointer;" alt="User">`;
    }
  }

  navUser.addEventListener("click", () => {
    const user = getUser();
    if (!user) openModal();
    else {
      if (confirm("Çıkış yapmak ister misin?")) {
        localStorage.removeItem("user");
        renderUser();
      }
    }
  });

  if (mobileUserBtn) {
    mobileUserBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (mobileMenu && mobileMenu.classList.contains("open")) {
        mobileMenu.classList.remove("open");
       overlay?.classList.remove("open");
        burgerBtn?.setAttribute("aria-expanded", "false");
        mobileMenu.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }

      navUser.click();
    });
  }

  if (navCart) navCart.addEventListener("click", () => (window.location.href = "ShoppingCardMobile.html"));
  if (mobileCartBtn) mobileCartBtn.addEventListener("click", () => (window.location.href = "ShoppingCardMobile.html"));

  modal.addEventListener("click", (e) => {
    if (e.target?.dataset?.close) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  btn?.addEventListener("click", () => {
    const email = (emailEl?.value || "").trim();
    const pass = (passEl?.value || "").trim();

    if (!email || !pass) {
      if (msg) msg.textContent = "Email ve şifre boş olamaz.";
      return;
    }

    localStorage.setItem("user", JSON.stringify({ email }));
    if (msg) msg.textContent = "Giriş başarılı ✅";
    renderUser();
    setTimeout(closeModal, 250);
  });

  renderUser();
}

/* =========================
   4) Home / Catalog Rendering
========================= */



async function renderAll() {
  updateCartBadge();

  const productsGrid = document.getElementById("productsGrid");
  const discountGrid = document.getElementById("discountGrid");
  const bannerBottomGrid = document.getElementById("bannerBottomGrid");
  const categoriesGrid = document.getElementById("CategoriesGrid");
  const bigBannerWrapperGrid = document.getElementById("bigBannerWrapperGrid");
  const mainBanner = document.getElementById("mainBanner");
  const productPageGrid = document.getElementById("productPageGrid");

 if (productsGrid) {
  const data = await getJSON(`${API_BASE}/products?limit=8&skip=0`);

  const list = data.products || data.items || [];

  productsGrid.innerHTML = list
    .map(
      (p) => `
      <div class="productItems">
        <div class="productItemiphone14Pro">
          <img src="${p.thumbnail}" style="width:104px;height:104px;" alt="${p.title}">
          <h2 style="font-size:18px;color:black;overflow-wrap:break-word;margin-left:12px;">
            ${p.title}
          </h2>
          <p style="font-size:24px;color:black;margin:0px;">
            $${p.price}
          </p>
          <button data-go-detail="1" data-product-id="${p.id}"
            style="width:139px;height:48px;background-color:#211C24;border:none;color:white;margin-top:16px;border-radius:8px;">
            Buy Now
          </button>
        </div>
      </div>
    `
    )
    .join("");
}


  if (discountGrid) {
  const data2 = await getJSON(`${API_BASE}/products?limit=4&skip=8`);


  const list2 = data2.products || data2.items || [];

  discountGrid.innerHTML = list2
    .map(
      (p) => `
      <div class="DiscountitemTopiphoneGold">
        <img src="${p.thumbnail}" style="width:104px;height:104px;" alt="${p.title}">
        <h2 style="font-size:18px;color:black;overflow-wrap:break-word;margin-left:12px;">
          ${p.title}
        </h2>
        <p style="font-size:24px;color:black;margin:0px;">
          $${p.price}
        </p>
        <button data-go-detail="1" data-product-id="${p.id}" 
          style="width:139px;height:48px;background-color:#211C24;border:none;color:white;margin-top:16px;border-radius:8px;">
          Buy Now
        </button>
      </div>
    `
    )
    .join("");
}


  if (bannerBottomGrid) {
    const data = await getJSON(`${API_BASE}/products?category=beauty&limit=4&skip=0`);
const p = data.products || data.items || [];

    bannerBottomGrid.innerHTML = `
      <div class="bannerBottomAirPodsMax">
        <img src="${p[0]?.thumbnail || ""}" style="width:192px;height:200px;margin-top:40px">
        <h2 style="font-size:36px;margin:24px;color:black">${p[0]?.title || "Product"}</h2>
        <p style="font-size:19px;color:gray">${p[0]?.description || ""}</p>
      </div>

      <div class="bannerAppleVisionPro">
        <img src="${p[1]?.thumbnail || ""}" style="width:325px;height:192px;margin-top:40px">
        <h2 style="font-size:36px;margin:24px;color:white">${p[1]?.title || "Product"}</h2>
        <p style="font-size:19px;color:gray">${p[1]?.description || ""}</p>
      </div>

      <div class="bannerPlaystation5">
        <img src="${p[2]?.thumbnail || ""}" style="width:200px;height:200px">
        <h2 style="font-size:36px;margin:24px;color:black">${p[2]?.title || "Product"}</h2>
        <p style="font-size:19px;color:gray">${p[2]?.description || ""}</p>
      </div>

      <div class="MacbookAir">
        <img src="${p[3]?.thumbnail || ""}" style="width:330px;height:200px;margin-top:40px">
        <h2 style="font-size:36px;margin:24px;color:black">${p[3]?.title || "Product"}</h2>
        <p style="font-size:19px;color:gray">${p[3]?.description || ""}</p>
        <button class="shopNowBtn" data-category="beauty"
          style="width:343px;height:56px;border:2px solid black">
          Shop Now
        </button>
      </div>
    `;
  }

  if (categoriesGrid) {
    if (!categoriesGrid.dataset.bound) {
      categoriesGrid.addEventListener("click", (e) => {
        const card = e.target.closest(".category-card");
        if (!card) return;

        const slug = card.dataset.cat;
        if (!slug) return;

        window.location.href = `ProductPage.html?category=${encodeURIComponent(slug)}`;
      });
      categoriesGrid.dataset.bound = "1";
    }

    const all = [
  { slug: "beauty", name: "beauty" },
  { slug: "fragrances", name: "fragrances" },
  { slug: "skin-care", name: "skin-care" },
  { slug: "sunglasses", name: "sunglasses" },
  { slug: "womens-bags", name: "womens-bags" },
  { slug: "womens-jewellery", name: "womens-jewellery" },
];

    const wantedSlugs = ["beauty", "fragrances", "skin-care", "sunglasses", "womens-bags", "womens-jewellery"];

    async function getCategoryIcon(slug) {
      try {
        const d = await getJSON(`${API_BASE}/products?category=${encodeURIComponent(slug)}&limit=1&skip=0`);

        return (d.products || d.items || [])[0]?.thumbnail || "images/phoneicon.png";

      } catch {
        return "images/phoneicon.png";
      }
    }

    const list = wantedSlugs.map((slug) => all.find((c) => c.slug === slug) || { slug, name: slug });
    categoriesGrid.innerHTML = "";

    for (let i = 0; i < list.length; i += 2) {
      const left = list[i];
      const right = list[i + 1];

      const leftIcon = await getCategoryIcon(left.slug);
      const rightIcon = right ? await getCategoryIcon(right.slug) : "";

      categoriesGrid.innerHTML += `
        <div class="CategoryItem">
          <div class="CategoryItemTop category-card" data-cat="${left.slug}">
            <img src="${leftIcon}" style="width:48px;height:48px;" alt="${left.name}">
            <h1 style="font-size:16px;margin:0;color:black">${String(left.name).split("-").join(" ")}</h1>
          </div>

          ${
            right
              ? `
          <div class="CategoryItemTop category-card" data-cat="${right.slug}">
            <img src="${rightIcon}" style="width:48px;height:48px;" alt="${right.name}">
            <h1 style="font-size:16px;margin:0;color:black">${String(right.name).split("-").join(" ")}</h1>
          </div>
          `
              : ""
          }
        </div>
      `;
    }
  }

  if (bigBannerWrapperGrid) {
    const data = await getJSON(`${API_BASE}/products?category=beauty&limit=4&skip=0`);
const p = data.products || data.items || [];

    while (p.length < 4) p.push({ title: "Product", description: "", thumbnail: "" });

    bigBannerWrapperGrid.innerHTML = `
      <div class="bigBanner bigBanner-mobile-visible">
        <div class="Halfimage"><img src="${p[0].thumbnail}" style="width:360px; height:366px;" alt="${p[0].title}"></div>
        <div class="bigBannerText">
          <p style="font-size:49px;margin:0;color:black">${p[0].title}</p>
          <p style="font-size:14px;color:gray;margin-left:32px;margin-right:32px;">${p[0].description}</p>
          <button class="shopNowBtn" data-category="beauty"
            style="width:184px;height:56px;background:white;border:2px solid black;color:black;border-radius:8px;">
            Shop Now
          </button>
        </div>
      </div>

      <div class="bigBanner bigBanner-desktop-only">
        <div class="Halfimage"><img src="${p[0].thumbnail}" style="width:360px; height:327px;" alt="${p[0].title}"></div>
        <div class="bigBannerText">
          <p style="font-size:49px;margin:0;color:black">${p[0].title}</p>
          <p style="font-size:14px;color:gray;margin-left:32px;margin-right:32px;">${p[0].description}</p>
          <button class="shopNowBtn" data-category="beauty"
            style="width:184px;height:56px;background:white;border:2px solid black;color:black;border-radius:8px;">
            Shop Now
          </button>
        </div>
      </div>

      <div class="bigBanner bigBanner-desktop-only">
        <div class="Halfimage"><img src="${p[1].thumbnail}" style="width:360px; height:360px;" alt="${p[1].title}"></div>
        <div class="bigBannerText">
          <p style="font-size:49px;margin:0;color:black">${p[1].title}</p>
          <p style="font-size:14px;color:gray;margin-left:32px;margin-right:32px;">${p[1].description}</p>
          <button class="shopNowBtn" data-category="beauty"
            style="width:184px;height:56px;background:white;border:2px solid black;color:black;border-radius:8px;">
            Shop Now
          </button>
        </div>
      </div>

      <div class="bigBanner bigBanner-desktop-only">
        <div class="Halfimage"><img src="${p[2].thumbnail}" style="width:360px; height:360px;" alt="${p[2].title}"></div>
        <div class="bigBannerText">
          <p style="font-size:49px;margin:0;color:black">${p[2].title}</p>
          <p style="font-size:14px;color:gray;margin-left:32px;margin-right:32px;">${p[2].description}</p>
          <button class="shopNowBtn" data-category="beauty"
            style="width:184px;height:56px;background:white;border:2px solid black;color:black;border-radius:8px;">
            Shop Now
          </button>
        </div>
      </div>

      <div class="bigBanner bigBanner-desktop-only bigBanner-dark">
        <div class="Halfimage"><img src="${p[3].thumbnail}" style="width:340px; height:356px;" alt="${p[3].title}"></div>
        <div class="bigBannerText">
          <p style="font-size:49px;margin:0;color:white">${p[3].title}</p>
          <p style="font-size:14px;color:gray;margin-left:32px;margin-right:32px;">${p[3].description}</p>
          <button class="shopNowBtn" data-category="beauty"
            style="width:184px;height:56px;background:white;border:2px solid black;color:black;border-radius:8px;">
            Shop Now
          </button>
        </div>
      </div>
    `;
  }

  if (mainBanner) {
    const data = await getJSON(`${API_BASE}/products?category=beauty&limit=1&skip=0`);
const p = (data.products || data.items || [])[0];


    mainBanner.innerHTML = `
      <div class="bannerTop">
        <p style="font-size:25px;color:gray;margin:0;">Beauty Collection</p>
        <h1 style="font-size:72px;margin:0;color:#FFFFFF">Discover</h1>
        <h2 style="font-size:72px;margin:0;color:#FFFFFF">${p?.title || "Beauty Essentials"}</h2>
        <p style="font-size:19px;color:gray;margin:0;">${p?.description || ""}</p>
        <button class="shopNowBtn" data-category="beauty"
          style="width:184px;height:56px;background-color:#211C24;border:2px solid white;color:white;margin-top:48px;border-radius:8px;">
          Shop Now
        </button>
      </div>

      <div class="bannerTopimage">
        <picture>
          <source media="(min-width:1024px)" srcset="${p?.thumbnail || ""}">

          <img src="${p?.thumbnail || ""}" alt="${p?.title || "Beauty product"}">
        </picture>
      </div>
    `;
  }

  if (productPageGrid) {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const category = urlParams.get("category") || "Beauty";

     const data = await getJSON(`${API_BASE}/products?category=${encodeURIComponent(category)}&limit=12&skip=0`);
const products = data.products || data.items || [];


      buildBrandFilters(products);
      PRODUCTPAGE_ALL = products;
      PRODUCTPAGE_VIEW = products;

      buildBrandListDesktop(PRODUCTPAGE_ALL);
      setupBrandSearchDesktop();

      let html = "";
      for (let i = 0; i < products.length; i += 2) {
        const left = products[i];
        const right = products[i + 1];

        html += `
          <div class="ProductResultItems">
            <div class="productResultItemIphone">
              <img src="${left.thumbnail}" style="width:104px;height:104px;" alt="${left.title}">
              <h2 style="font-size:18px;color:black;overflow-wrap:break-word;margin-left:12px;">${left.title}</h2>
              <p style="font-size:24px;color:black;margin:0;">$${left.price}</p>
              <button data-go-detail="1" data-product-id="${left.id}"
                style="width:139px;height:48px;background-color:#211C24;border:none;color:white;margin-top:16px;border-radius:8px;">
                Buy Now
              </button>
            </div>

            ${
              right
                ? `
            <div class="productResultItemIphone">
              <img src="${right.thumbnail}" style="width:104px;height:104px;" alt="${right.title}">
              <h2 style="font-size:18px;color:black;overflow-wrap:break-word;margin-left:12px;">${right.title}</h2>
              <p style="font-size:24px;color:black;margin:0;">$${right.price}</p>
              <button data-go-detail="1" data-product-id="${right.id}"
                style="width:139px;height:48px;background-color:#211C24;border:none;color:white;margin-top:16px;border-radius:8px;">
                Buy Now
              </button>
            </div>
            `
                : ""
            }
          </div>
        `;
      }

      productPageGrid.innerHTML = html;
    } catch (err) {
      console.error("❌ ProductPage fetch error:", err);
    }
  }
}

/* =========================
   5) Product Page (Filters)
========================= */
const filtersBtn = document.getElementById("filtersBtn");
const ratingBtn = document.getElementById("ratingBtn");
const filtersDrop = document.getElementById("filtersDrop");
const ratingChevron = document.getElementById("ratingChevron");

function toggleDrop() {
  filtersDrop.classList.toggle("open");
}

filtersBtn?.addEventListener("click", toggleDrop);
ratingBtn?.addEventListener("click", () => {
  toggleDrop();
  ratingChevron?.classList.toggle("rotate");
});

function buildBrandFilters(products) {
  const box = document.getElementById("brandFilters");
  if (!box) return;

  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))].sort();

  box.innerHTML = brands.map((b) => `<label><input type="checkbox" value="${b}"> ${b}</label>`).join("");
}
let PRODUCTPAGE_ALL = [];
let PRODUCTPAGE_VIEW = [];

function buildBrandListDesktop(products) {
  const ul = document.getElementById("brandListDesktop");
  if (!ul) return;

  const counts = new Map();
  products.forEach((p) => {
    if (!p.brand) return;
    counts.set(p.brand, (counts.get(p.brand) || 0) + 1);
  });

  const brands = [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  ul.innerHTML = brands
    .map(
      ([brand, count]) => `
    <li>
      <label class="brandItem">
        <input type="checkbox" class="brandCheckDesktop" value="${brand}">
        <span class="brandCheck"></span>
        <span class="brandName">${brand}</span>
        <span class="brandCount">${count}</span>
      </label>
    </li>
  `
    )
    .join("");

  ul.querySelectorAll(".brandCheckDesktop").forEach((chk) => {
    chk.addEventListener("change", applyDesktopBrandFilter);
  });
}

function setupBrandSearchDesktop() {
  const input = document.getElementById("brandSearchDesktop");
  const ul = document.getElementById("brandListDesktop");
  if (!input || !ul) return;

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    ul.querySelectorAll("li").forEach((li) => {
      const name = li.querySelector(".brandName")?.textContent?.toLowerCase() || "";
      li.style.display = name.includes(q) ? "" : "none";
    });
  });
}

function applyDesktopBrandFilter() {
  const selected = [...document.querySelectorAll(".brandCheckDesktop:checked")].map((x) => x.value);

  let filtered = [...PRODUCTPAGE_ALL];
  if (selected.length) {
    filtered = filtered.filter((p) => selected.includes(p.brand));
  }

  PRODUCTPAGE_VIEW = filtered;

  renderProductPageGridDesktop(PRODUCTPAGE_VIEW);
}

/* =========================
   6) Global Click Handlers
========================= */
function setupClicks() {
  document.body.addEventListener("click", (e) => {
    const goDetailBtn = e.target.closest("button[data-go-detail='1']");
    if (goDetailBtn) {
      const id = Number(goDetailBtn.dataset.productId);
      if (!Number.isFinite(id)) return;
      window.location.href = `ProductDetailsMobile.html?id=${id}`;
      return;
    }

    const addCartBtn = e.target.closest("button[data-add-cart='1']");
    if (addCartBtn) {
      const id = Number(addCartBtn.dataset.productId);
      if (!Number.isFinite(id)) return;

      const cart = readCart();
      const existing = cart.find((i) => Number(i.id) === id);

      if (existing) existing.qty = (existing.qty || 0) + 1;
      else cart.push({ id, qty: 1 });

      writeCart(cart);
      updateCartBadge();
      return;
    }
  });
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".shopNowBtn");
  if (!btn) return;

  const category = btn.dataset.category || "beauty";
  window.location.href = `ProductPage.html?category=${encodeURIComponent(category)}`;
});

/* =========================
   7) Product Details
========================= */
function renderDetailsSection(p) {
  setText("pdDetailsText", p.description || "");

  setText("pdSpec1", p.brand || "-");
  setText("pdSpec2", p.category || "-");
  setText("pdSpec3", (p.rating ?? "-").toString());
  setText("pdSpec4", Number(p.stock || 0) > 0 ? `${p.stock} pcs` : "Out of stock");
  setText("pdSpec5", `$${p.price}`);

  const extra = document.getElementById("pdExtraList");
  if (extra) {
    const tags = Array.isArray(p.tags) ? p.tags : [];
    extra.innerHTML = tags.length
      ? tags.map((t) => `<p style="font-size: 15px;color: black;font-weight: bold;margin: 0px;">${String(t)}</p>`).join("")
      : `<p style="font-size: 15px;color: black;font-weight: bold;margin: 0px;">-</p>`;
  }

  setText("pdCpu1", p.warrantyInformation || "-");
  setText("pdCpu2", p.shippingInformation || "-");
}

function setupCommentsToggle() {
  const root = document.getElementById("commentsRoot");
  const btn = document.getElementById("commentsToggleBtn");
  if (!root || !btn) return;

  btn.addEventListener("click", () => {
    const opened = root.classList.toggle("expanded");
    btn.textContent = opened ? "View less" : "View more";
  });
}

async function renderRelatedProducts(p) {
  const grid = document.getElementById("relatedProductsGrid");
  if (!grid) return;

  try {
    const cat = encodeURIComponent(p.category || "");
    if (!cat) {
      grid.innerHTML = "";
      return;
    }

    const data = await getJSON(`${API_BASE}/products?category=${cat}&limit=12&skip=0`);
let list = (data.products || data.items || []).filter((x) => Number(x.id) !== Number(p.id));

    list = list.slice(0, 4);

    let html = "";
    for (let i = 0; i < list.length; i += 2) {
      const left = list[i];
      const right = list[i + 1];

      html += `
        <div class="ProductResultItems">
          <div class="productResultItemIphone">
            <img src="${left.thumbnail}" style="width:104px;height:104px;" alt="${left.title}">
            <h2 style="font-size:18px;color:black;overflow-wrap:break-word;margin-left:12px;">${left.title}</h2>
            <p style="font-size:24px;color:black;margin:0;">$${left.price}</p>
            <button data-go-detail="1" data-product-id="${left.id}"
              style="width:139px;height:48px;background-color:#211C24;border:none;color:white;margin-top:16px;border-radius:8px;">
              Buy Now
            </button>
          </div>

          ${
            right
              ? `
          <div class="productResultItemIphone">
            <img src="${right.thumbnail}" style="width:104px;height:104px;" alt="${right.title}">
            <h2 style="font-size:18px;color:black;overflow-wrap:break-word;margin-left:12px;">${right.title}</h2>
            <p style="font-size:24px;color:black;margin:0;">$${right.price}</p>
            <button data-go-detail="1" data-product-id="${right.id}"
              style="width:139px;height:48px;background-color:#211C24;border:none;color:white;margin-top:16px;border-radius:8px;">
              Buy Now
            </button>
          </div>
          `
              : ""
          }
        </div>
      `;
    }

    grid.innerHTML = html;
  } catch (e) {
    console.error("Related products error:", e);
    grid.innerHTML = "";
  }
}

async function renderProductDetails() {
  const root = document.getElementById("productDetailsRoot");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) {
    root.innerHTML = "<p style='padding:16px;'>Ürün bulunamadı (id yok).</p>";
    return;
  }

  try {
   const data = await getJSON(`${API_BASE}/products/${encodeURIComponent(id)}`);
const p = data.product;



    await renderRelatedProducts(p);

    const thumbs = [p.thumbnail].filter(Boolean);


    const catLower = String(p.category || "").toLowerCase();
    const isBeauty = ["beauty", "fragrances", "skin-care"].includes(catLower);

    const shadeOptions = [
      { key: "01", name: "Light" },
      { key: "02", name: "Medium" },
      { key: "03", name: "Dark" },
    ];
    const sizeOptions = ["30ml", "50ml", "100ml"];

    root.innerHTML = `
      <div class="productPageDetailsMobileMedia">
        <div class="productPageFiltersMobileTop">
          <img src="${p.thumbnail}" style="width:263.59px;height:329.24px;" alt="${p.title}">
          <div class="imageFilters">
            ${thumbs.map((src) => `<img src="${src}" style="width:74px;height:66px;" alt="thumb">`).join("")}
          </div>
        </div>

        <div class="productPageDetailsMobileContent">
          <div class="productPageDetailsMobileText">
            <h1 style="font-size:40px;font-weight:bold;margin:0;">${p.title}</h1>

            <div class="productPageDetailsMobileText2">
              <p style="font-size:32px;margin:0;">$${p.price}</p>
              ${
                p.discountPercentage
                  ? `
                <p style="font-size:24px;color:gray;text-decoration:line-through;margin-left:16px;margin-top:6px;">
                  $${Math.round(p.price / (1 - p.discountPercentage / 100))}
                </p>`
                  : ``
              }
            </div>
          </div>

          <div class="metaGrid">
            <div class="metaItem">
              <p class="metaLabel">Brand</p>
              <p class="metaValue">${p.brand || "-"}</p>
            </div>
            <div class="metaItem">
              <p class="metaLabel">Category</p>
              <p class="metaValue">${p.category || "-"}</p>
            </div>
            <div class="metaItem">
              <p class="metaLabel">Rating</p>
              <p class="metaValue">${p.rating ?? "-"}</p>
            </div>
            <div class="metaItem">
              <p class="metaLabel">Stock</p>
              <p class="metaValue">${Number(p.stock || 0) > 0 ? `${p.stock} pcs` : "Out of stock"}</p>
            </div>
          </div>

          ${
            isBeauty
              ? `
          <div class="variantBlock">
            <p class="metaLabel" style="margin-bottom:10px;">Shade</p>
            <div class="pillRow" id="shadeRow">
              ${shadeOptions
                .map(
                  (s) => `
                <button type="button" class="pillBtn" data-shade="${s.key}">
                  ${s.key} <span style="opacity:.7;margin-left:6px;">${s.name}</span>
                </button>
              `
                )
                .join("")}
            </div>
          </div>

          <div class="variantBlock">
            <p class="metaLabel" style="margin-bottom:10px;">Size</p>
            <div class="pillRow" id="sizeRow">
              ${sizeOptions.map((sz) => `<button type="button" class="pillBtn" data-size="${sz}">${sz}</button>`).join("")}
            </div>
          </div>
          `
              : ""
          }

          <p style="font-size:15px;color:#6C6C6C;margin-top:18px;">${p.description || ""}</p>

          <div class="productPageDetailsMobileButtons">
            <button style="width:341px;height:56px;background:white;border-radius:8px;border:1px solid black;color:black;font-size:16px;margin-top:26px;">
              Add to Wishlist
            </button>

            <button id="addToCartBtn"
              style="width:341px;height:56px;background:black;border-radius:8px;border:1px solid black;color:white;font-size:16px;margin-top:16px;">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;

    renderDetailsSection(p);

    const bc = document.getElementById("breadcrumbs");
    if (bc) {
      const catText = (p.category || "").toString().split("-").join(" ");
      const title = (p.title || "").toString();

      bc.innerHTML = `
        <p style="color:#A4A4A4;cursor:pointer;" data-bc="home">Home</p>
        <img src="images/Arrowright.png" alt="">
        <p style="color:#A4A4A4;cursor:pointer;" data-bc="catalog">Catalog</p>
        <img src="images/Arrowright.png" alt="">
        <p style="color:#A4A4A4;cursor:pointer;" data-bc="category">${catText}</p>
        <img src="images/Arrowright.png" alt="">
        <p>${title}</p>
      `;

      bc.querySelector("[data-bc='home']")?.addEventListener("click", () => {
        window.location.href = "Home.html";
      });

      bc.querySelector("[data-bc='catalog']")?.addEventListener("click", () => {
        window.location.href = "ProductPage.html?category=beauty";
      });

      bc.querySelector("[data-bc='category']")?.addEventListener("click", () => {
        window.location.href = `ProductPage.html?category=${encodeURIComponent(p.category)}`;
      });
    }

    const reviewsBox = document.querySelector(".productPageFiltersMobileRewiews");
    const ratingNumberEl = reviewsBox?.querySelector(".productPageFiltersMobileRewiewsRating1 h1");
    if (ratingNumberEl) ratingNumberEl.textContent = (p.rating ?? "-").toString();

    const ratingStarsEl = reviewsBox?.querySelector(".productPageFiltersMobileRewiewsRatingStars");
    if (ratingStarsEl) ratingStarsEl.innerHTML = buildStarsHTML(p.rating, 24);

    const commentsRoot = document.getElementById("commentsRoot");
    const input = document.getElementById("commentInput");
    const starsSel = document.getElementById("commentStars");
    const sendBtn = document.getElementById("commentSubmit");

    const beautyComments = [
      { name: "Grace Carey", stars: 4.5, text: "Texture is smooth and lightweight. Blends easily and looks natural all day. Great for daily makeup.", pics: [], avatar: "images/gracepic.png" },
      { name: "Ronald Richards", stars: 5, text: "Nice packaging and the scent is pleasant (not too strong). Good value for the price.", pics: [], avatar: "images/ronaldpic.png" },
      { name: "Darcy King", stars: 4, text: "Color payoff is good, but I’d recommend moisturizing first. Overall I’m happy with it.", pics: [], avatar: "images/darcypic.png" },
    ];

    const phoneComments = [
      { name: "Grace Carey", stars: 4.5, text: "Fast delivery and the device looks great. Performance is solid and battery lasts long.", pics: [], avatar: "images/gracepic.png" },
      { name: "Ronald Richards", stars: 5, text: "Storage is great and the build feels premium. Highly recommended.", pics: [], avatar: "images/ronaldpic.png" },
      { name: "Darcy King", stars: 4, text: "Camera quality is good, but low-light could be better. Still a nice purchase.", pics: [], avatar: "images/darcypic.png" },
    ];

    const seedList = isBeauty ? beautyComments : phoneComments;

    function pickFallbackAvatar(name) {
      const n = String(name || "").toLowerCase();
      if (n.includes("grace")) return "images/gracepic.png";
      if (n.includes("ronald")) return "images/ronaldpic.png";
      if (n.includes("darcy")) return "images/darcypic.png";
      return "images/User.png";
    }

    function renderComments(listToRender) {
      if (!commentsRoot) return;

      commentsRoot.innerHTML = listToRender
        .map((c, idx) => {
          const cls = idx === 0 ? "reviewAndCommentsGrace" : idx === 1 ? "reviewAndCommentsRonald" : "reviewAndCommentsDarcy";
          const avatarSrc = c.avatar || pickFallbackAvatar(c.name);

          return `
          <div class="${cls}">
            <img src="${avatarSrc}" style="width:48px;height:48px;margin-left:16px;margin-top:24px;" alt="User">

            <div class="reviewAndCommentsGraceText">
              <p style="font-size:17px;font-weight:bold;margin:0px;margin-left:16px;">${c.name}</p>

              <div class="reviewAndCommentsGraceTextStars">
                ${buildStarsHTML(c.stars, 16)}
              </div>

              <div class="reviewAndCommentsGraceComment">
                <p style="font-size:17px;color:#7E7E7E">${c.text}</p>
              </div>
            </div>
          </div>
        `;
        })
        .join("");
    }

    if (commentsRoot) {
      const stored = readComments(String(p.id));
      const merged = [...stored, ...seedList];
      renderComments(merged);
    }

    if (sendBtn && !sendBtn.dataset.bound) {
      sendBtn.dataset.bound = "1";

      sendBtn.addEventListener("click", () => {
        const text = (input?.value || "").trim();
        const stars = Number(starsSel?.value || 5);

        if (!text) {
          alert("Yorum boş olamaz.");
          return;
        }

        const user = (() => {
          try {
            return JSON.parse(localStorage.getItem("user"));
          } catch {
            return null;
          }
        })();

        if (!user?.email) {
          alert("Yorum yapmak için giriş yapmalısın.");
          document.getElementById("navUser")?.click();
          return;
        }

        const storedNow = readComments(String(p.id));
        storedNow.unshift({
          name: user.email,
          stars,
          text,
          pics: [],
          avatar: "images/User.png",
        });

        writeComments(String(p.id), storedNow);

        if (input) input.value = "";

        const mergedNow = [...storedNow, ...seedList];
        renderComments(mergedNow);
      });
    }

    setupCommentsToggle();

    let selectedShade = null;
    let selectedSize = null;

    function bindPills(rowId, attr, onSelect) {
      const row = document.getElementById(rowId);
      if (!row) return;
      row.querySelectorAll(".pillBtn").forEach((btn) => {
        btn.addEventListener("click", () => {
          row.querySelectorAll(".pillBtn").forEach((x) => x.classList.remove("active"));
          btn.classList.add("active");
          onSelect(btn.dataset[attr]);
        });
      });
    }

    if (isBeauty) {
      bindPills("shadeRow", "shade", (v) => (selectedShade = v));
      bindPills("sizeRow", "size", (v) => (selectedSize = v));

      const firstShade = document.querySelector("#shadeRow .pillBtn");
      if (firstShade) firstShade.click();
      const firstSize = document.querySelector("#sizeRow .pillBtn");
      if (firstSize) firstSize.click();
    }

    const addBtn = document.getElementById("addToCartBtn");
    addBtn?.addEventListener("click", () => {
      if (Number(p.stock || 0) <= 0) {
        alert("Stok yok.");
        return;
      }

      const cart = readCart();
      const key = `${p.id}|${selectedShade || ""}|${selectedSize || ""}`;
      const existing = cart.find((i) => i.key === key);

      if (existing) existing.qty = (existing.qty || 0) + 1;
      else
        cart.push({
          key,
          id: p.id,
          qty: 1,
          shade: selectedShade,
          size: selectedSize,
        });

      writeCart(cart);
      updateCartBadge();
    });
  } catch (err) {
    console.error(err);
    root.innerHTML = "<p style='padding:16px;'>Ürün yüklenemedi.</p>";
  }
}

/* =========================
   8) Cart
========================= */
async function renderCartPage() {
  const listEl = document.getElementById("cartList");
  if (!listEl) return;

  const cart = readCart();
  if (!cart.length) {
    listEl.innerHTML = `<p style="padding:12px;color:#6C6C6C;">Sepet boş</p>`;
    listEl.classList.remove("is-scroll");
    updateSummary(0);
    return;
  }

  const ids = [...new Set(cart.map((i) => Number(i.id)).filter(Boolean))];
  const products = await Promise.all(
  ids.map((id) => getJSON(`${API_BASE}/products/${id}`).then(r => r.product).catch(() => null))
);

  const byId = new Map(products.filter(Boolean).map((p) => [Number(p.id), p]));

  let subtotal = 0;

  listEl.innerHTML = cart
    .map((item) => {
      const p = byId.get(Number(item.id));
      const title = p?.title || "Product";
      const thumb = p?.thumbnail || "images/placeholder.png";
      const price = Number(p?.price || 0);
      const qty = Number(item.qty || 0);

      const lineTotal = price * qty;
      subtotal += lineTotal;

      const variantText = [item.shade ? `Shade: ${item.shade}` : "", item.size ? `Size: ${item.size}` : ""].filter(Boolean).join(" • ");

      const rowKey = item.key || String(item.id);

      return `
      <div class="shopingCardProduct" data-row-key="${rowKey}">
        <img src="${thumb}" alt="${title}" style="width: 90px;height:90px;object-fit:cover;">
        <div class="shopingCardProductDetails">
          <div class="shopingCardProductDetailsTitle">
            <p style="font-size: 16px;font-weight: 500;margin: 0;">${title}</p>
            ${variantText ? `<p style="font-size: 12px;color:#6C6C6C;margin:4px 0 0 0;">${variantText}</p>` : ""}
          </div>

          <div class="shopingCardProductDetailsQuantity">
            <button class="quantityButton" type="button" data-dec="1">-</button>
            <p class="quantityNumber">${qty}</p>
            <button class="quantityButton" type="button" data-inc="1">+</button>

            <p style="font-size: 20px;margin: 0;">$${lineTotal.toFixed(0)}</p>
            <button class="cancel-btn" type="button" aria-label="Remove product" data-remove="1">&times;</button>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  updateSummary(subtotal);

  const itemsCount = listEl.children.length;
  listEl.classList.toggle("is-scroll", itemsCount >= 3);

  listEl.addEventListener(
    "click",
    (e) => {
      const row = e.target.closest(".shopingCardProduct");
      if (!row) return;

      const key = row.dataset.rowKey;
      if (!key) return;

      let cartNow = readCart();

      const idx = cartNow.findIndex((x) => (x.key || String(x.id)) === key);
      if (idx === -1) return;

      if (e.target.closest("[data-inc='1']")) {
        cartNow[idx].qty = (Number(cartNow[idx].qty) || 0) + 1;
      }

      if (e.target.closest("[data-dec='1']")) {
        cartNow[idx].qty = (Number(cartNow[idx].qty) || 0) - 1;
        if (cartNow[idx].qty <= 0) cartNow.splice(idx, 1);
      }

      if (e.target.closest("[data-remove='1']")) {
        cartNow.splice(idx, 1);
      }

      writeCart(cartNow);
      updateCartBadge();
      renderCartPage();
    },
    { once: true }
  );
}

function updateSummary(subtotal) {
  const tax = subtotal > 0 ? subtotal * 0.02 : 0;
  const ship = subtotal > 0 ? 29 : 0;
  const total = subtotal + tax + ship;

  const s1 = document.getElementById("sumSubtotal");
  const s2 = document.getElementById("sumTax");
  const s3 = document.getElementById("sumShip");
  const s4 = document.getElementById("sumTotal");

  if (s1) s1.textContent = `$${subtotal.toFixed(0)}`;
  if (s2) s2.textContent = `$${tax.toFixed(0)}`;
  if (s3) s3.textContent = `$${ship.toFixed(0)}`;
  if (s4) s4.textContent = `$${total.toFixed(0)}`;
}

function setupCheckoutBtn() {
  const btn = document.getElementById("checkoutBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    window.location.href = "step1.html";
  });
}

/* =========================
   9) Checkout
========================= */
function renderAddresses() {
  const listEl = document.getElementById("addressList");
  if (!listEl) return;

  const addresses = readAddresses();
  const selectedId = localStorage.getItem(LS_SELECTED) || (addresses[0] && addresses[0].id);

  if (!addresses.length) {
    listEl.innerHTML = `<p style="margin:12px 0;color:#6C6C6C;">No saved address.</p>`;
    return;
  }

  listEl.innerHTML = addresses
    .map(
      (a) => `
    <div class="step1SelectAdressBlockHome" data-id="${a.id}">
      <div class="step1SelectAdressBlockHomeTop">
        <div class="step1SelectAdressBlockHomeRadio">
        <input type="radio" name="address" value="${a.id}" ${a.id === selectedId ? "checked" : ""}>
          <p style="margin:0px;font-size:16px;font-weight:bold;">${a.title}</p>
          <img src="images/Tag.png" style="width:51px;height:22px;margin-left:8px;" alt="${a.tag}">
        </div>

        <div class="step1SelectAdressBlockHomeText">
          <p style="margin:0px;font-size:16px;font-weight:bold;">${a.line}</p>
          <p style="margin:0px;font-size:14px;">${a.phone}</p>
        </div>
      </div>

      <div class="step1SelectAdressBlockHomeicons">
        <img class="addrEdit" src="images/To edit.png" style="width:24px;height:24px;margin-right:16px;cursor:pointer;" alt="edit">
        <img class="addrDelete" src="images/Close.png" style="width:24px;height:24px;cursor:pointer;" alt="delete">
      </div>
    </div>
  `
    )
    .join("");
}

function initStep1AddressPage() {
  const listEl = document.getElementById("addressList");
  if (!listEl) return;

  seedAddressesIfEmpty();
  renderAddresses();
}

function bindStep1Nav() {
  const back = document.getElementById("step1Back");
  const next = document.getElementById("step1Next");
  if (!back || !next) return;

  back.addEventListener("click", () => {
    window.location.href = "ShoppingCardMobile.html";
  });

  next.addEventListener("click", () => {
    const selectedId = localStorage.getItem("selectedAddressId");
    if (!selectedId) {
      alert("Lütfen bir adres seç.");
      return;
    }
    window.location.href = "Step2.html";
  });
}

function bindAddressActionsOnce() {
  const host = document.getElementById("addressList");
  if (!host || host.dataset.bound === "1") return;
  host.dataset.bound = "1";

  host.addEventListener("click", (e) => {
    const card = e.target.closest(".step1SelectAdressBlockHome");
    if (!card) return;

    const id = card.dataset.id;
    if (!id) return;
   localStorage.setItem(LS_SELECTED, id);
  renderAddresses();
    if (e.target.classList.contains("addrDelete")) {
      let list = readAddresses().filter((a) => a.id !== id);
      writeAddresses(list);

      const selected = localStorage.getItem(LS_SELECTED);
      if (selected === id) {
        localStorage.setItem(LS_SELECTED, list[0]?.id || "");
      }

      renderAddresses();
      return;
    }

    if (e.target.classList.contains("addrEdit")) {
      let user = null;
      try {
        user = JSON.parse(localStorage.getItem("user"));
      } catch {}
      if (!user?.email) {
        alert("Düzenlemek için giriş yapmalısın.");
        document.getElementById("navUser")?.click();
        return;
      }

      const list = readAddresses();
      const addr = list.find((a) => a.id === id);
      if (!addr) return;

      openAddressEditModal(addr);
      return;
    }
  });
}

/* ---------- Address Edit Modal ---------- */
function ensureAddressEditModal() {
  if (document.getElementById("addressEditModal")) return;

  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <div class="modal" id="addressEditModal" aria-hidden="true">
      <div class="modal-backdrop" data-close="1"></div>

      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="addrEditTitle">
        <div class="modal-head">
          <h3 id="addrEditTitle" style="margin:0;">Edit Address</h3>
          <button class="modal-x" type="button" data-close="1" aria-label="Close">×</button>
        </div>

        <div class="modal-body">
          <input type="hidden" id="addrEditId">

          <label class="modal-label">Title</label>
          <input id="addrEditTitleInput" class="modal-input" type="text" placeholder="2118 Thornridge">

          <label class="modal-label">Tag</label>
          <input id="addrEditTagInput" class="modal-input" type="text" placeholder="Home / Office">

          <label class="modal-label">Address Line</label>
          <input id="addrEditLineInput" class="modal-input" type="text" placeholder="Street, City...">

          <label class="modal-label">Phone</label>
          <input id="addrEditPhoneInput" class="modal-input" type="text" placeholder="(555) 555-5555">

          <button id="addrEditSaveBtn" class="modal-btn" type="button">Save</button>
          <p id="addrEditMsg" style="margin:12px 0 0 0;font-size:12px;opacity:.8;"></p>
        </div>
      </div>
    </div>
  `
  );

  const modal = document.getElementById("addressEditModal");
  const saveBtn = document.getElementById("addrEditSaveBtn");

  function close() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  modal.addEventListener("click", (e) => {
    if (e.target?.dataset?.close) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) close();
  });

  saveBtn.addEventListener("click", () => {
    const id = document.getElementById("addrEditId").value;

    const title = document.getElementById("addrEditTitleInput").value.trim();
    const tag = document.getElementById("addrEditTagInput").value.trim();
    const line = document.getElementById("addrEditLineInput").value.trim();
    const phone = document.getElementById("addrEditPhoneInput").value.trim();

    if (!title || !line) {
      const msg = document.getElementById("addrEditMsg");
      if (msg) msg.textContent = "Title ve Address boş olamaz.";
      return;
    }

    const list = readAddresses();
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) return;

    list[idx] = {
      ...list[idx],
      title,
      tag: tag || list[idx].tag || "Home",
      line,
      phone: phone || list[idx].phone || "",
    };

    writeAddresses(list);
    renderAddresses();
    close();
  });
}

function openAddressEditModal(addr) {
  ensureAddressEditModal();

  const modal = document.getElementById("addressEditModal");
  const msg = document.getElementById("addrEditMsg");
  if (msg) msg.textContent = "";

  document.getElementById("addrEditId").value = addr.id;
  document.getElementById("addrEditTitleInput").value = addr.title || "";
  document.getElementById("addrEditTagInput").value = addr.tag || "";
  document.getElementById("addrEditLineInput").value = addr.line || "";
  document.getElementById("addrEditPhoneInput").value = addr.phone || "";

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function initStep2ShippingPage() {
  const back = document.getElementById("step2Back");
  const next = document.getElementById("step2Next");
  if (!back || !next) return;

  const saved = localStorage.getItem("selectedShippingId");
  if (saved) {
    const input = document.querySelector(`input[name="shipment"][value="${saved}"]`);
    if (input) input.checked = true;
  }

  document.querySelectorAll(`input[name="shipment"]`).forEach((r) => {
    r.addEventListener("change", () => {
      localStorage.setItem("selectedShippingId", r.value);
    });
  });

  back.addEventListener("click", () => {
    window.location.href = "step1.html";
  });

  next.addEventListener("click", () => {
    const picked = document.querySelector(`input[name="shipment"]:checked`);
    if (!picked) {
      alert("Lütfen bir shipment method seç.");
      return;
    }
    localStorage.setItem("selectedShippingId", picked.value);
    window.location.href = "Step3.html";
  });
}

function initStep3PaymentPage() {
  const back = document.getElementById("step3Back");
  const pay = document.getElementById("step3Pay");
  if (!back || !pay) return;

  back.addEventListener("click", () => {
    window.location.href = "Step2.html";
  });

  pay.addEventListener("click", () => {
    alert("Ödeme başarılı ✅");
  });
}
function money(n) {
  const x = Number(n) || 0;
  return `$${x.toFixed(0)}`;
}

function setPaymentTotals(subtotal) {
  const tax = Math.round(subtotal * 0.02);     
  const ship = subtotal > 0 ? 29 : 0;          
  const total = subtotal + tax + ship;

  const subEl = document.getElementById("paymentSubtotal");
  const taxEl = document.getElementById("paymentTax");
  const shipEl = document.getElementById("paymentShip");
  const totalEl = document.getElementById("paymentTotal");

  if (subEl) subEl.textContent = money(subtotal);
  if (taxEl) taxEl.textContent = money(tax);
  if (shipEl) shipEl.textContent = money(ship);
  if (totalEl) totalEl.textContent = money(total);
}

async function renderPaymentSummary() {
  const wrap = document.getElementById("paymentSummaryItems");
  if (!wrap) return; 

  const cart = readCart();
  if (!cart.length) {
    wrap.innerHTML = `<p style="padding:12px;color:#6C6C6C;">Sepet boş</p>`;
    setPaymentTotals(0);
    return;
  }

  const ids = [...new Set(cart.map(i => Number(i.id)).filter(Boolean))];
  const products = await Promise.all(
    ids.map(id => getJSON(`${API_BASE}/products/${id}`).then(r => r.product).catch(() => null))

  );
  const byId = new Map(products.filter(Boolean).map(p => [Number(p.id), p]));

  let subtotal = 0;

  wrap.innerHTML = cart.map(item => {
    const p = byId.get(Number(item.id));
    if (!p) return "";

    const qty = Number(item.qty) || 1;
    const price = Number(p.price) || 0;
    const line = price * qty;
    subtotal += line;

    const thumb = p.thumbnail || "";


    return `
      <div class="Step3SummaryItem" style="display:flex;align-items:center;gap:12px;padding:10px;border:1px solid #E7E7E7;border-radius:10px;margin-bottom:10px;">
        <img src="${thumb}" alt="${p.title}" style="width:44px;height:44px;object-fit:cover;border-radius:8px;">
        <div style="flex:1;">
          <div style="font-size:12px;font-weight:600;">${p.title}</div>
          <div style="font-size:12px;color:#6C6C6C;">x${qty}</div>
        </div>
        <div style="font-size:12px;font-weight:700;">${money(line)}</div>
      </div>
    `;
  }).join("");

  setPaymentTotals(subtotal);

  // (opsiyonel) Step1 seçilen adres / Step2 seçilen kargo yazıları
  const addresses = JSON.parse(localStorage.getItem("addresses") || "[]");
const selectedAddressId = localStorage.getItem("selectedAddressId");
const chosen = addresses.find(a => String(a.id) === String(selectedAddressId));

const addrEl = document.getElementById("paymentAddressText");
if (addrEl) addrEl.textContent = chosen ? chosen.line : "-";

  const selectedShippingId = localStorage.getItem("selectedShippingId");
  const shipEl = document.getElementById("paymentShippingText");
  if (shipEl && selectedShippingId) shipEl.textContent = selectedShippingId; 
}
function renderPaymentAddressAndShipping() {
  const addressEl = document.getElementById("paymentAddressText");
  const shipEl = document.getElementById("paymentShippingText");
  if (!addressEl || !shipEl) return;

  
  const addresses = JSON.parse(localStorage.getItem("addresses") || "[]");
  const selectedAddressId = localStorage.getItem("selectedAddressId");

  const addr = addresses.find(a => String(a.id) === String(selectedAddressId));

  addressEl.textContent = addr
    ? addr.line
    : "-";

  // Shipping
  const selectedShippingId =
    localStorage.getItem("selectedShippingId") ||
    localStorage.getItem("selectedShipping");

  shipEl.textContent = selectedShippingId || "-";
}
/* =========================
   10) Boot
========================= */
// ✅ Sayfa algılama helper'ı
function has(id) {
  return !!document.getElementById(id);
}

function initGlobal() {
  setupBurgerMenu();
  setupLoginModal();
  setupClicks();
  updateCartBadge();
}

async function initHomePage() {
  await renderAll();
}

async function initProductPage() {
  await renderAll();
}

async function initProductDetailsPage() {
  await renderProductDetails();
}

async function initCartPage() {
  await renderCartPage();
  setupCheckoutBtn();
}

function initStep1Page() {
  seedAddressesIfEmpty();
  renderAddresses();
  bindAddressActionsOnce();
  bindStep1Nav();
}

function initStep2Page() {
  initStep2ShippingPage();
}

function initStep3Page() {
  initStep3PaymentPage();
  renderPaymentSummary();
  renderPaymentAddressAndShipping();
}

document.addEventListener("DOMContentLoaded", async () => {
  initGlobal();

  try {
    if (has("mainBanner") || has("productsGrid") || has("discountGrid")) {
      await initHomePage();
    }

    if (has("productPageGrid") || has("brandFilters")) {
      await initProductPage();
    }

    if (has("productDetailsRoot")) {
      await initProductDetailsPage();
    }

    if (has("cartList")) {
      await initCartPage();
    }

    if (has("addressList")) {
      initStep1Page();
    }

    if (has("step2Back")) {
      initStep2Page();
    }

    if (has("step3Back")) {
      initStep3Page();
    }
  } catch (e) {
    console.error("Init error:", e);
  }
});