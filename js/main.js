"use strict";

import { setupBurgerMenu } from "./navbar.js";
import { setupLoginModal } from "./auth.js";
import { updateCartBadge } from "./cart.js";

import { initHomePage } from "./Pages/home.js";
import { initProductPage } from "./Pages/productPage.js";
import { initProductDetailsPage } from "./Pages/productDetails.js";
import { initCartPage } from "./Pages/cartPage.js";
import { initStep1Page } from "./Pages/step1.js";
import { initStep2Page } from "./Pages/step2.js";
import { initStep3Page } from "./Pages/step3.js";

function has(id) {
  return !!document.getElementById(id);
}

function setupGlobalClicks() {
  document.body.addEventListener("click", (e) => {
    const goDetailBtn = e.target.closest("button[data-go-detail='1']");
    if (goDetailBtn) {
      const id = Number(goDetailBtn.dataset.productId);
      if (Number.isFinite(id)) {
        window.location.href = `ProductDetailsMobile.html?id=${id}`;
      }
      return;
    }

    const shopNow = e.target.closest(".shopNowBtn");
    if (shopNow) {
      const category = shopNow.dataset.category || "beauty";
      window.location.href = `ProductPage.html?category=${encodeURIComponent(category)}`;
      return;
    }

    const catCard = e.target.closest(".category-card");
    if (catCard) {
      const slug = catCard.dataset.cat;
      if (slug) {
        window.location.href = `ProductPage.html?category=${encodeURIComponent(slug)}`;
      }
      return;
    }
  });
}
function setupSearch() {
  const navSearchInput = document.getElementById("navSearchInput");
  const mobileSearchInput = document.getElementById("mobileSearchInput");

  function goSearch(value) {
    const q = String(value || "").trim();
    if (!q) return;

    window.location.href = `ProductPage.html?search=${encodeURIComponent(q)}`;
  }

  if (navSearchInput) {
    navSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        goSearch(navSearchInput.value);
      }
    });
  }

  if (mobileSearchInput) {
    mobileSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        goSearch(mobileSearchInput.value);
      }
    });
  }
}
document.addEventListener("DOMContentLoaded", async () => {
  setupBurgerMenu();
setupLoginModal();
setupGlobalClicks();
setupSearch();
await updateCartBadge();

  if (has("mainBanner") || has("productsGrid") || has("discountGrid")) {
    await initHomePage();
  }

 if (has("productPageGrid") || has("brandFilters")) {
  await initProductPage();
}

  if (has("productDetailsRoot") || has("productTitle") || has("productImage")) {
    await initProductDetailsPage();
  }

  if (has("cartList")) {
  await initCartPage();
}

  if (has("addressList")) {
  await initStep1Page();
}

if (has("step2Back")) {
  await initStep2Page();
}

if (has("step3Back")) {
  await initStep3Page();
}
});