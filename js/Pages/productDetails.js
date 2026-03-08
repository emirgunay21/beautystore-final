"use strict";

import { API_BASE, getJSON } from "../api.js";
import { addToCart, updateCartBadge } from "../cart.js";

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "-";
}

function buildStarsHTML(rating, size = 24) {
  const r = Math.max(0, Math.min(5, Number(rating) || 0));
  const full = Math.floor(r);
  const half = r - full >= 0.5 ? 1 : 0;
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

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

function getComments() {
  return JSON.parse(localStorage.getItem("commentsByProduct")) || {};
}

function saveComments(data) {
  localStorage.setItem("commentsByProduct", JSON.stringify(data));
}

function addComment(productId, comment) {
  const allComments = getComments();

  if (!allComments[productId]) {
    allComments[productId] = [];
  }

  allComments[productId].push(comment);
  saveComments(allComments);
}

function getProductComments(productId) {
  const allComments = getComments();
  return allComments[productId] || [];
}

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
      ? tags.map((t) => `<p style="font-size:15px;color:black;font-weight:bold;margin:0;">${String(t)}</p>`).join("")
      : `<p style="font-size:15px;color:black;font-weight:bold;margin:0;">-</p>`;
  }

  setText("pdCpu1", p.warrantyInformation || "-");
  setText("pdCpu2", p.shippingInformation || "-");
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

export async function initProductDetailsPage() {
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
    const p = data.product || data;

    await renderRelatedProducts(p);

    const thumbs = [p.thumbnail].filter(Boolean);

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

          <p style="font-size:15px;color:#6C6C6C;margin-top:18px;">${p.description || ""}</p>

          <div class="productPageDetailsMobileButtons">
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

    const commentsRoot = document.getElementById("commentsRoot");
    const input = document.getElementById("commentInput");
    const starsSel = document.getElementById("commentStars");
    const sendBtn = document.getElementById("commentSubmit");
    const toggleBtn = document.getElementById("commentsToggleBtn");

    const seedComments = [
      {
        name: "Grace Carey",
        stars: 4,
        text: "Great product, I liked the overall quality.",
        avatar: "images/gracepic.png",
      },
      {
        name: "Ronald Richards",
        stars: 5,
        text: "Price-performance is good. Would recommend.",
        avatar: "images/ronaldpic.png",
      },
      {
        name: "Darcy King",
        stars: 4,
        text: "Looks nice and works as expected.",
        avatar: "images/darcypic.png",
      },
    ];

    function renderCommentsList() {
      if (!commentsRoot) return;

      let saved = getProductComments(String(p.id));

      if (!saved.length) {
        const seeded = seedComments.map((c) => ({
          user: c.name,
          text: c.text,
          rating: c.stars,
          avatar: c.avatar,
        }));
        const all = getComments();
        all[String(p.id)] = seeded;
        saveComments(all);
        saved = seeded;
      }

      commentsRoot.innerHTML = saved
        .map((c, idx) => {
          const name = c.user || "User";
          const text = c.text || "";
          const rating = Number(c.rating || 5);
          const avatar =
            c.avatar ||
            (idx % 3 === 0
              ? "images/gracepic.png"
              : idx % 3 === 1
              ? "images/ronaldpic.png"
              : "images/darcypic.png");

          return `
            <div class="reviewAndCommentsGrace">
              <img src="${avatar}" style="width:48px;height:48px;margin-left:16px;margin-top:24px;" alt="User">
              <div class="reviewAndCommentsGraceText">
                <p style="font-size:17px;font-weight:bold;margin:0;margin-left:16px;">${name}</p>
                <div class="reviewAndCommentsGraceTextStars">
                  ${buildStarsHTML(rating, 16)}
                </div>
                <div class="reviewAndCommentsGraceComment">
                  <p style="font-size:17px;color:#7E7E7E">${text}</p>
                </div>
              </div>
            </div>
          `;
        })
        .join("");
    }

    renderCommentsList();

    sendBtn?.addEventListener("click", () => {
      const user = getCurrentUser();

      if (!user) {
        alert("Please login to leave a comment");
        return;
      }

      const text = (input?.value || "").trim();
      const rating = Number(starsSel?.value || 5);

      if (!text) {
        alert("Yorum boş olamaz.");
        return;
      }

      addComment(String(p.id), {
        user: user.name || user.email || "User",
        text,
        rating,
        avatar: "images/User.png",
      });

      if (input) input.value = "";
      if (starsSel) starsSel.value = "5";

      renderCommentsList();
    });

    if (toggleBtn && commentsRoot) {
      toggleBtn.addEventListener("click", () => {
        commentsRoot.classList.toggle("expanded");
        toggleBtn.textContent = commentsRoot.classList.contains("expanded")
          ? "View less"
          : "View more";
      });
    }

    const addBtn = document.getElementById("addToCartBtn");
    addBtn?.addEventListener("click", async () => {
      addToCart(p);
      await updateCartBadge();
      alert("Sepete eklendi ✅");
    });
  } catch (err) {
    console.error(err);
    root.innerHTML = "<p style='padding:16px;'>Ürün yüklenemedi.</p>";
  }
}