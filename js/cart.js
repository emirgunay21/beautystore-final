"use strict";

import { apiFetch, getJSON } from "./api.js";

function isLoggedIn() {
  return !!localStorage.getItem("token");
}

export async function getCart() {
  if (!isLoggedIn()) return [];

  const data = await apiFetch("/cart");
  const cartRows = Array.isArray(data.cart) ? data.cart : [];

  const products = await getJSON("https://dummyjson.com/products?limit=200");

  const productList = Array.isArray(products.products) ? products.products : [];

  return cartRows.map((item) => {
    const product = productList.find(
      (p) => Number(p.id) === Number(item.productId)
    );

    return {
      id: item.productId,
      title: product?.title || "Product",
      price: Number(product?.price || 0),
      thumbnail: product?.thumbnail || "images/placeholder.png",
      qty: Number(item.quantity || 1),
    };
  });
}

export async function addToCart(product) {
  if (!isLoggedIn()) {
    alert("Please login first");
    return false;
  }

  await apiFetch("/cart", {
    method: "POST",
    body: JSON.stringify({
      productId: product.id,
      qty: 1,
    }),
  });

  return true;
}

export async function saveCart(cart) {
  if (!isLoggedIn()) return;

  const current = await apiFetch("/cart");
  const currentCart = Array.isArray(current.cart) ? current.cart : [];

  const newIds = cart.map((item) => Number(item.id));

  for (const item of currentCart) {
    if (!newIds.includes(Number(item.productId))) {
      await apiFetch(`/cart/${item.productId}`, {
        method: "DELETE",
      });
    }
  }

  for (const item of cart) {
    await apiFetch(`/cart/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({
        qty: Number(item.qty || 1),
      }),
    });
  }
}

export async function updateCartBadge() {
  const badgeDesktop = document.getElementById("cartCount");
  const badgeMobile = document.getElementById("cartCountMobile");

  if (!badgeDesktop && !badgeMobile) return;

  const cart = await getCart();
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