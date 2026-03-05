"use strict";

export const API_BASE = "http://localhost:3001";

// token al
export function getToken() {
  return localStorage.getItem("token") || "";
}

// API fetch helper
export async function apiFetch(path, options = {}) {

  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `${res.status} ${res.statusText}`);
  }

  return data;
}


// GET helper (cache ile)
const __CACHE = new Map();

export async function getJSON(url) {

  if (__CACHE.has(url)) {
    return __CACHE.get(url);
  }

  const p = fetch(url).then(async (res) => {
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText} -> ${url}`);
    }
    return res.json();
  });

  __CACHE.set(url, p);

  return p;
}
export function getAddresses() {
  return apiFetch("/addresses");
}

export function createAddress(data) {
  return apiFetch("/addresses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export function getAddresses() {
  return apiFetch("/addresses");
}

export function createAddress(data) {
  return apiFetch("/addresses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}