"use strict";

function getUserId() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.id || user?.email || "guest";
  } catch {
    return "guest";
  }
}

function getSelectedAddressKey() {
  return "selectedAddressId_" + getUserId();
}

function getAddressesKey() {
  return "addresses_" + getUserId();
}

function readAddresses() {
  try {
    const data = JSON.parse(localStorage.getItem(getAddressesKey()));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeAddresses(list) {
  localStorage.setItem(getAddressesKey(), JSON.stringify(list));
}

function seedAddressesIfEmpty() {
  
}

function renderAddresses() {
  const listEl = document.getElementById("addressList");
  if (!listEl) return;

  const addresses = readAddresses();
  const selectedId =
    localStorage.getItem(getSelectedAddressKey()) ||
    (addresses[0] && String(addresses[0].id));

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
              <p style="margin:0;font-size:16px;font-weight:bold;">${a.title || ""}</p>
              <img src="images/Tag.png" style="width:51px;height:22px;margin-left:8px;" alt="${a.tag || ""}">
            </div>

            <div class="step1SelectAdressBlockHomeText">
              <p style="margin:0;font-size:16px;font-weight:bold;">${a.line || ""}</p>
              <p style="margin:0;font-size:14px;">${a.phone || ""}</p>
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

function bindAddressActionsOnce() {
  const host = document.getElementById("addressList");
  if (!host || host.dataset.bound === "1") return;
  host.dataset.bound = "1";

  host.addEventListener("click", (e) => {
    const card = e.target.closest(".step1SelectAdressBlockHome");
    if (!card) return;

    const id = card.dataset.id;
    if (!id) return;

    if (e.target.classList.contains("addrDelete")) {
      const list = readAddresses().filter((a) => String(a.id) !== String(id));
      writeAddresses(list);

      const selectedId = localStorage.getItem(getSelectedAddressKey());
      if (selectedId === id) {
        if (list[0]) localStorage.setItem(getSelectedAddressKey(), list[0].id);
        else localStorage.removeItem(getSelectedAddressKey());
      }

      renderAddresses();
      return;
    }

    localStorage.setItem(getSelectedAddressKey(), id);
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

  if (getUserId() === "guest") {
    alert("Please login first");
    return;
  }

  modal.style.display = "flex";
});

  closeBtn?.addEventListener("click", () => {
    modal.style.display = "none";
  });

  backdrop?.addEventListener("click", () => {
    modal.style.display = "none";
  });

  saveBtn?.addEventListener("click", () => {

    const title = document.getElementById("addrTitle").value;
    const tag = document.getElementById("addrTag").value;
    const line = document.getElementById("addrLine").value;
    const phone = document.getElementById("addrPhone").value;

    if (!title || !line) {
      alert("Please fill required fields");
      return;
    }

    const list = readAddresses();

    const newAddress = {
      id: "addr" + Date.now(),
      title,
      tag,
      line,
      phone
    };

    list.push(newAddress);
    writeAddresses(list);

    localStorage.setItem(getSelectedAddressKey(), newAddress.id);

    renderAddresses();

    modal.style.display = "none";
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
      const selectedId = localStorage.getItem(getSelectedAddressKey());
      if (!selectedId) {
        alert("Lütfen bir adres seç.");
        return;
      }
      window.location.href = "Step2.html";
    });
  }
}

export async function initStep1Page() {
  seedAddressesIfEmpty();
  renderAddresses();
  bindAddressActionsOnce();
  bindAddAddressButton();
  bindStep1Nav();
}