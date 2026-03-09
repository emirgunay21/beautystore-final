"use strict";

import { getAddresses, createAddress, apiFetch } from "../api.js";

let addresses = [];
let selectedId = localStorage.getItem("selectedAddressId") || null;

function renderAddresses() {
  const listEl = document.getElementById("addressList");
  if (!listEl) return;

  if (!addresses.length) {
    listEl.innerHTML = `<p style="margin:12px 0;color:#6C6C6C;">No saved address.</p>`;
    return;
  }

  listEl.innerHTML = addresses
    .map((a) => {
      const id = String(a.id);

      return `
        <div class="step1SelectAdressBlockHome" data-id="${id}">
          <div class="step1SelectAdressBlockHomeTop">
            <div class="step1SelectAdressBlockHomeRadio">
              <input type="radio" name="address" value="${id}" ${id === selectedId ? "checked" : ""}>
              <p style="margin:0;font-size:16px;font-weight:bold;">${a.title}</p>
              <img src="images/Tag.png" style="width:51px;height:22px;margin-left:8px;" alt="${a.tag || ""}">
            </div>

            <div class="step1SelectAdressBlockHomeText">
              <p style="margin:0;font-size:16px;font-weight:bold;">${a.line}</p>
              <p style="margin:0;font-size:14px;">${a.phone}</p>
            </div>
          </div>

          <div class="step1SelectAdressBlockHomeicons">
            <img class="addrDelete" src="images/Close.png" style="width:24px;height:24px;cursor:pointer;" alt="delete">
          </div>
        </div>
      `;
    })
    .join("");
}

async function loadAddresses() {
  try {
    const data = await getAddresses();
    addresses = data.addresses || [];

    if (addresses.length) {
      const stillExists = addresses.find((a) => String(a.id) === String(selectedId));
      if (!stillExists) {
        selectedId = String(addresses[0].id);
        localStorage.setItem("selectedAddressId", selectedId);
      }
    } else {
      selectedId = null;
      localStorage.removeItem("selectedAddressId");
    }

    renderAddresses();
  } catch (err) {
    console.error("Address load error:", err);
  }
}

function bindAddressActions() {
  const host = document.getElementById("addressList");
  if (!host || host.dataset.bound === "1") return;
  host.dataset.bound = "1";

  host.addEventListener("click", async (e) => {
    const card = e.target.closest(".step1SelectAdressBlockHome");
    if (!card) return;

    const id = card.dataset.id;
    if (!id) return;

    if (e.target.classList.contains("addrDelete")) {
      try {
        await apiFetch(`/addresses/${id}`, { method: "DELETE" });
        await loadAddresses();
      } catch (err) {
        console.error("Delete address error:", err);
        alert("Address delete error");
      }
      return;
    }

    selectedId = id;
    localStorage.setItem("selectedAddressId", selectedId);
    renderAddresses();
  });
}

function bindAddAddressButton() {
  const btn = document.getElementById("addAddressBtn");
  const modal = document.getElementById("addressModal");
  const closeBtn = document.getElementById("closeAddressModal");
  const backdrop = document.getElementById("addressBackdrop");
  const saveBtn = document.getElementById("saveAddressBtn");

  if (!btn) return;

  btn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  closeBtn?.addEventListener("click", () => {
    modal.style.display = "none";
  });

  backdrop?.addEventListener("click", () => {
    modal.style.display = "none";
  });

  saveBtn?.addEventListener("click", async () => {
    const title = document.getElementById("addrTitle").value.trim();
    const tag = document.getElementById("addrTag").value.trim();
    const line = document.getElementById("addrLine").value.trim();
    const phone = document.getElementById("addrPhone").value.trim();

    if (!title || !line || !phone) {
      alert("Please fill required fields");
      return;
    }

    try {
      await createAddress({ title, tag, line, phone });
      modal.style.display = "none";
      await loadAddresses();
    } catch (err) {
      console.error("Create address error:", err);
      alert("Address save error");
    }
  });
}

function bindStep1Nav() {
  const back = document.getElementById("step1Back");
  const next = document.getElementById("step1Next");

  if (back) {
    back.addEventListener("click", () => {
      window.location.href = "ShoppingCardMobile.html";
    });
  }

  if (next) {
    next.addEventListener("click", () => {
      if (!selectedId) {
        alert("Please select address");
        return;
      }

      localStorage.setItem("selectedAddressId", selectedId);
      window.location.href = "Step2.html";
    });
  }
}

export async function initStep1Page() {
  await loadAddresses();
  bindAddressActions();
  bindAddAddressButton();
  bindStep1Nav();
}