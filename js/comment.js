"use strict";

export function getComments() {
  return JSON.parse(localStorage.getItem("commentsByProduct")) || {};
}

export function saveComments(data) {
  localStorage.setItem("commentsByProduct", JSON.stringify(data));
}

export function addComment(productId, comment) {
  const allComments = getComments();

  if (!allComments[productId]) {
    allComments[productId] = [];
  }

  allComments[productId].push(comment);

  saveComments(allComments);
}

export function getProductComments(productId) {
  const allComments = getComments();
  return allComments[productId] || [];
}