"use strict";

export async function initStep2Page() {
  const back = document.getElementById("step2Back");
  const next = document.getElementById("step2Next");

  if (!back || !next) return;

  const saved = localStorage.getItem("selectedShippingId");
  if (saved) {
    const input = document.querySelector(`input[name="shipment"][value="${saved}"]`);
    if (input) input.checked = true;
  }

  document.querySelectorAll(`input[name="shipment"]`).forEach((r) => {
    r.addEventListener("change", () => {
      localStorage.setItem("selectedShippingId", r.value);
    });
  });

  back.addEventListener("click", () => {
    window.location.href = "step1.html";
  });

  next.addEventListener("click", () => {
    const picked = document.querySelector(`input[name="shipment"]:checked`);
    if (!picked) {
      alert("Lütfen bir shipment method seç.");
      return;
    }
    localStorage.setItem("selectedShippingId", picked.value);
    window.location.href = "Step3.html";
  });
}