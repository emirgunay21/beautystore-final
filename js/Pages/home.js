/* =========================
   js/Pages/home.js
========================= */
"use strict";

import { API_BASE, getJSON } from "../api.js";

export async function initHomePage() {
  const productsGrid = document.getElementById("productsGrid");
  const discountGrid = document.getElementById("discountGrid");
  const bannerBottomGrid = document.getElementById("bannerBottomGrid");
  const categoriesGrid = document.getElementById("CategoriesGrid");
  const bigBannerWrapperGrid = document.getElementById("bigBannerWrapperGrid");
  const mainBanner = document.getElementById("mainBanner");

  // PRODUCTS (New Arrivals)
  if (productsGrid) {
    const data = await getJSON(`${API_BASE}/products?limit=8&skip=0`);
    const list = data.products || data.items || [];
    console.log("HOME products list:", list);
    console.log("HOME products length:", list.length);

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

  // DISCOUNT GRID (Featured/Discount)
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

  // BANNER BOTTOM GRID
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

  // CATEGORIES GRID
  if (categoriesGrid) {
    const all = [
      { slug: "beauty", name: "beauty" },
      { slug: "fragrances", name: "fragrances" },
      { slug: "skin-care", name: "skin-care" },
      { slug: "sunglasses", name: "sunglasses" },
      { slug: "womens-bags", name: "womens-bags" },
      { slug: "womens-jewellery", name: "womens-jewellery" },
    ];

    const wantedSlugs = all.map((x) => x.slug);

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

  // BIG BANNERS
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

  // MAIN TOP BANNER
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
}