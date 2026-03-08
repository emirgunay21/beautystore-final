"use strict";

import { API_BASE, getJSON } from "../api.js";

function getParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    category: params.get("category") || "",
    search: params.get("search") || "",
  };
}

function qs(selector) {
  return document.querySelector(selector);
}

function renderProducts(list) {
  const grid = qs("#productPageGrid");
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = `<p style="padding:16px;">No products found.</p>`;
    return;
  }

  let html = "";

  for (let i = 0; i < list.length; i += 2) {
    const left = list[i];
    const right = list[i + 1];

    html += `
      <div class="ProductResultItems">
        <div class="productResultItemIphone">
          <img src="${left.thumbnail}" style="width:104px;height:104px;" alt="${left.title}">
          <h2 style="font-size:18px;color:black;overflow-wrap:break-word;margin-left:12px;">
            ${left.title}
          </h2>
          <p style="font-size:24px;color:black;margin:0;">
            $${left.price}
          </p>
          <button
            data-go-detail="1"
            data-product-id="${left.id}"
            style="width:139px;height:48px;background-color:#211C24;border:none;color:white;margin-top:16px;border-radius:8px;">
            Buy Now
          </button>
        </div>

        ${
          right
            ? `
          <div class="productResultItemIphone">
            <img src="${right.thumbnail}" style="width:104px;height:104px;" alt="${right.title}">
            <h2 style="font-size:18px;color:black;overflow-wrap:break-word;margin-left:12px;">
              ${right.title}
            </h2>
            <p style="font-size:24px;color:black;margin:0;">
              $${right.price}
            </p>
            <button
              data-go-detail="1"
              data-product-id="${right.id}"
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
}

export async function initProductPage() {
  const { category, search } = getParams();

  try {
    let data;

    if (search) {
      data = await getJSON(`${API_BASE}/products?limit=100&skip=0`);
      const all = data.products || data.items || [];

      const filtered = all.filter((p) =>
        String(p.title || "").toLowerCase().includes(search.toLowerCase())
      );

      renderProducts(filtered);
      return;
    }

    data = await getJSON(
      `${API_BASE}/products?category=${encodeURIComponent(category || "beauty")}`
    );

    const list = data.products || data.items || [];
    renderProducts(list);
  } catch (err) {
    console.error("ProductPage yüklenemedi:", err);
  }
}