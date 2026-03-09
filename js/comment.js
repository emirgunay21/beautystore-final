"use strict";

import { apiFetch } from "./api.js";

export async function getProductComments(productId) {
  const data = await apiFetch(`/comments/${productId}`, {
    method: "GET",
  });
  return Array.isArray(data.comments) ? data.comments : [];
}

export async function addComment(productId, comment) {
  const payload = {
    productId: Number(productId),
    stars: Number(comment.rating || 5),
    text: comment.text || "",
  };

  const data = await apiFetch("/comments", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
}