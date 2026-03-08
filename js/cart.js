"use strict";

function getUserId() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.id || user?.email || "guest";
  } catch {
    return "guest";
  }
}

function getCartKey() {
  return "cart_" + getUserId();
}

export function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(getCartKey())) || [];
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(getCartKey(), JSON.stringify(cart));
}

export function addToCart(product) {
  const cart = getCart();

  const existing = cart.find(
    (item) => String(item.id) === String(product.id)
  );

  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: Number(product.price) || 0,
      thumbnail: product.thumbnail || product.image || "",
      qty: 1,
    });
  }

  saveCart(cart);
}

export async function updateCartBadge() {
  const badgeDesktop = document.getElementById("cartCount");
  const badgeMobile = document.getElementById("cartCountMobile");

  if (!badgeDesktop && !badgeMobile) return;

  const cart = getCart();
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