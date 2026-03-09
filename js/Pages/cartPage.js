"use strict";

import { getCart, saveCart, updateCartBadge } from "../cart.js";

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

async function renderCartPage() {
  const listEl = document.getElementById("cartList");
  if (!listEl) return;

  const cart = await getCart();

  if (!cart.length) {
    listEl.innerHTML = `<p style="padding:12px;color:#6C6C6C;">Sepet boş</p>`;
    updateSummary(0);
    return;
  }

  let subtotal = 0;

  listEl.innerHTML = cart
    .map((item) => {
      const title = item.title || "Product";
      const thumb = item.thumbnail || "images/placeholder.png";
      const price = Number(item.price || 0);
      const qty = Number(item.qty || 1);

      const lineTotal = price * qty;
      subtotal += lineTotal;

      return `
        <div class="shopingCardProduct" data-product-id="${item.id}">
          <img src="${thumb}" alt="${title}" style="width:90px;height:90px;object-fit:cover;">
          <div class="shopingCardProductDetails">
            <div class="shopingCardProductDetailsTitle">
              <p style="font-size:16px;font-weight:500;margin:0;">${title}</p>
            </div>

            <div class="shopingCardProductDetailsQuantity">
              <button class="quantityButton" type="button" data-dec="1">-</button>
              <p class="quantityNumber">${qty}</p>
              <button class="quantityButton" type="button" data-inc="1">+</button>

              <p style="font-size:20px;margin:0;">$${lineTotal.toFixed(0)}</p>
              <button class="cancel-btn" type="button" aria-label="Remove product" data-remove="1">&times;</button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  updateSummary(subtotal);

  if (!listEl.dataset.bound) {
    listEl.dataset.bound = "1";

    listEl.addEventListener("click", async (e) => {
      const row = e.target.closest(".shopingCardProduct");
      if (!row) return;

      const productId = Number(row.dataset.productId);
      const cart = await getCart();
      const item = cart.find((x) => Number(x.id) === productId);
      if (!item) return;

      if (e.target.closest("[data-inc='1']")) {
        item.qty = (item.qty || 1) + 1;
      } else if (e.target.closest("[data-dec='1']")) {
        item.qty = (item.qty || 1) - 1;
        if (item.qty <= 0) {
          const next = cart.filter((x) => Number(x.id) !== productId);
          await saveCart(next);
          await renderCartPage();
          await updateCartBadge();
          return;
        }
      } else if (e.target.closest("[data-remove='1']")) {
        const next = cart.filter((x) => Number(x.id) !== productId);
        await saveCart(next);
        await renderCartPage();
        await updateCartBadge();
        return;
      } else {
        return;
      }

      await saveCart(cart);
      await renderCartPage();
      await updateCartBadge();
    });
  }
}

function setupCheckoutBtn() {
  const btn = document.getElementById("checkoutBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    window.location.href = "step1.html";
  });
}

export async function initCartPage() {
  await renderCartPage();
  setupCheckoutBtn();
  await updateCartBadge();
}