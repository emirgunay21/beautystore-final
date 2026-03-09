"use strict";

import { getAddresses, apiFetch } from "../api.js";
import { getCart } from "../cart.js";

function getUserId() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.id || user?.email || "guest";
  } catch {
    return "guest";
  }
}

function getSelectedAddressKey() {
  return "selectedAddressId";
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

  const cart = await getCart();

  if (!cart.length) {
    wrap.innerHTML = `<p style="padding:12px;color:#6C6C6C;">Sepet boş</p>`;
    setPaymentTotals(0);
    return;
  }

  let subtotal = 0;

  wrap.innerHTML = cart
    .map((item) => {
      const qty = Number(item.qty) || 1;
      const price = Number(item.price) || 0;
      const line = price * qty;
      subtotal += line;

      const thumb = item.thumbnail || "";
      const title = item.title || "Product";

      return `
        <div class="Step3SummaryItem" style="display:flex;align-items:center;gap:12px;padding:10px;border:1px solid #E7E7E7;border-radius:10px;margin-bottom:10px;">
          <img src="${thumb}" alt="${title}" style="width:44px;height:44px;object-fit:cover;border-radius:8px;">
          <div style="flex:1;">
            <div style="font-size:12px;font-weight:600;">${title}</div>
            <div style="font-size:12px;color:#6C6C6C;">x${qty}</div>
          </div>
          <div style="font-size:12px;font-weight:700;">${money(line)}</div>
        </div>
      `;
    })
    .join("");

  setPaymentTotals(subtotal);
}

async function renderPaymentAddressAndShipping() {
  const addressEl = document.getElementById("paymentAddressText");
  const shipEl = document.getElementById("paymentShippingText");

  try {
    const data = await getAddresses();
    const list = data.addresses || [];
    const selectedAddressId = localStorage.getItem(getSelectedAddressKey());

    const chosen =
      list.find((a) => String(a.id) === String(selectedAddressId)) || list[0];

    if (addressEl) {
      addressEl.textContent = chosen
        ? `${chosen.title} | ${chosen.line} | ${chosen.phone || "-"}`
        : "-";
    }
  } catch (err) {
    console.error("Step3 address load error:", err);
    if (addressEl) addressEl.textContent = "-";
  }

  const selectedShippingId = localStorage.getItem("selectedShippingId");
  if (shipEl) {
    shipEl.textContent = selectedShippingId || "-";
  }
}

function initStep3PaymentPage() {
  const back = document.getElementById("step3Back");
  const pay = document.getElementById("step3Pay");

  if (back) {
    back.addEventListener("click", () => {
      window.location.href = "Step2.html";
    });
  }

  if (pay) {
    pay.addEventListener("click", async () => {
      alert("Ödeme başarılı ✅");

      try {
        const cart = await getCart();

        for (const item of cart) {
          await apiFetch(`/cart/${item.id}`, {
            method: "DELETE",
          });
        }
      } catch (err) {
        console.error("Cart clear error:", err);
      }

      window.location.href = "Home.html";
    });
  }
}

export async function initStep3Page() {
  initStep3PaymentPage();
  await renderPaymentSummary();
  await renderPaymentAddressAndShipping();
}