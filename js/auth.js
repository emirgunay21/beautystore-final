"use strict";

const API_BASE = "http://localhost:3001";

function getToken() {
  return localStorage.getItem("token") || "";
}

export function setupLoginModal() {
  const navUser = document.getElementById("navUser");
  const mobileUserBtn = document.getElementById("mobileUserBtn");
  const navCart = document.getElementById("navCart");
  const mobileCartBtn = document.getElementById("mobileCartBtn");
  const modal = document.getElementById("loginModal");

  const emailEl = document.getElementById("loginEmail");
  const passEl = document.getElementById("loginPass");
  const btn = document.getElementById("loginBtn");
  const msg = document.getElementById("loginMsg");

  const burgerBtn = document.getElementById("burgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("menuOverlay");

  const showRegister = document.getElementById("showRegister");
  const registerBox = document.getElementById("registerBox");
  const registerName = document.getElementById("registerName");
  const registerEmail = document.getElementById("registerEmail");
  const registerPassword = document.getElementById("registerPassword");
  const registerBtn = document.getElementById("registerBtn");
  const registerMsg = document.getElementById("registerMsg");

  if (!navUser || !modal) return;

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }

  function renderUser() {
    const user = getUser();

    if (user?.email) {
      navUser.innerHTML = `
        <span style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;">
          <img src="images/User.png" style="width:24px;height:24px;" alt="User">
          <span style="font-size:14px;color:#111;">${user.email}</span>
        </span>
      `;
    } else {
      navUser.innerHTML = `
        <img src="images/User.png" style="width:24px;height:24px;cursor:pointer;" alt="User">
      `;
    }
  }

  function openModal() {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");

    if (msg) msg.textContent = "";
    if (emailEl) emailEl.value = "";
    if (passEl) passEl.value = "";

    if (registerBox) registerBox.style.display = "none";
    if (showRegister) showRegister.textContent = "Sign up";
    if (registerMsg) registerMsg.textContent = "";
    if (registerName) registerName.value = "";
    if (registerEmail) registerEmail.value = "";
    if (registerPassword) registerPassword.value = "";

    setTimeout(() => emailEl?.focus(), 0);
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  navUser.addEventListener("click", () => {
    const user = getUser();

    if (!user) {
      openModal();
    } else {
      if (confirm("Çıkış yapmak ister misin?")) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        renderUser();

        const cartCount = document.getElementById("cartCount");
        const cartCountMobile = document.getElementById("cartCountMobile");
        if (cartCount) {
          cartCount.textContent = "0";
          cartCount.style.display = "none";
        }
        if (cartCountMobile) {
          cartCountMobile.textContent = "0";
          cartCountMobile.style.display = "none";
        }
      }
    }
  });

  if (mobileUserBtn) {
    mobileUserBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (mobileMenu && mobileMenu.classList.contains("open")) {
        mobileMenu.classList.remove("open");
        overlay?.classList.remove("open");
        burgerBtn?.setAttribute("aria-expanded", "false");
        mobileMenu.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }

      navUser.click();
    });
  }

  if (navCart) {
    navCart.addEventListener("click", () => {
      window.location.href = "ShoppingCardMobile.html";
    });
  }

  if (mobileCartBtn) {
    mobileCartBtn.addEventListener("click", () => {
      window.location.href = "ShoppingCardMobile.html";
    });
  }

  modal.addEventListener("click", (e) => {
    if (e.target?.dataset?.close) closeModal();
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  btn?.addEventListener("click", async () => {
    const email = (emailEl?.value || "").trim();
    const password = (passEl?.value || "").trim();

    if (!email || !password) {
      if (msg) msg.textContent = "Email ve şifre boş olamaz.";
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (msg) msg.textContent = data.message || "Login başarısız";
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (msg) msg.textContent = "Giriş başarılı ✅";
      renderUser();
      setTimeout(closeModal, 250);
    } catch (err) {
      console.error("LOGIN FETCH ERROR:", err);
      if (msg) msg.textContent = "Sunucuya bağlanılamadı";
    }
  });

  showRegister?.addEventListener("click", () => {
    if (registerBox.style.display === "none" || !registerBox.style.display) {
      registerBox.style.display = "block";
      showRegister.textContent = "Hide";
    } else {
      registerBox.style.display = "none";
      showRegister.textContent = "Sign up";
    }
  });

  registerBtn?.addEventListener("click", async () => {
    const name = (registerName?.value || "").trim();
    const email = (registerEmail?.value || "").trim();
    const password = (registerPassword?.value || "").trim();

    if (!name || !email || !password) {
      if (registerMsg) registerMsg.textContent = "All fields required";
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (registerMsg) registerMsg.textContent = data.message || "Register failed";
        return;
      }

      if (registerMsg) registerMsg.textContent = "Account created! Now login.";

      if (registerName) registerName.value = "";
      if (registerEmail) registerEmail.value = "";
      if (registerPassword) registerPassword.value = "";
    } catch (err) {
      console.error("REGISTER FETCH ERROR:", err);
      if (registerMsg) registerMsg.textContent = "Server error";
    }
  });

  renderUser();
}