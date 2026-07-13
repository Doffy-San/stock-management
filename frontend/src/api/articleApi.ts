import { API_BASE_URL } from "./config";
import type { SaleType, PackagingLevel, UnitOfMeasure, Article } from "../types/article";
import { handleResponse } from "./httpClient";

const ARTICLES_URL = `${API_BASE_URL}/articles`;

export interface CreateFoodArticlePayload {
  reference: string;
  name: string;
  priceExcludingTax: number;
  unit: UnitOfMeasure;
  expiryDate: string;
  saleType: SaleType;
}

export interface CreateNonFoodArticlePayload {
  reference: string;
  name: string;
  priceExcludingTax: number;
  unit: UnitOfMeasure;
  packagingLevel: PackagingLevel;
}

export async function getArticles(): Promise<Article[]> {
  const response = await fetch(ARTICLES_URL);
  if (!response.ok) throw new Error("Failed to fetch articles.");
  return response.json();
}

export async function createFoodArticle(
  payload: CreateFoodArticlePayload
): Promise<void> {
  const response = await fetch(`${ARTICLES_URL}/food`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  await handleResponse(response);
}

export async function createNonFoodArticle(
  payload: CreateNonFoodArticlePayload
): Promise<void> {
  const response = await fetch(`${ARTICLES_URL}/non-food`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  await handleResponse(response);
}

export interface UpdateFoodArticlePayload {
  name: string;
  priceExcludingTax: number;
  expiryDate: string;
  saleType: SaleType;
}

export interface UpdateNonFoodArticlePayload {
  name: string;
  priceExcludingTax: number;
  packagingLevel: PackagingLevel;
}

export async function updateFoodArticle(
  id: string,
  payload: UpdateFoodArticlePayload
): Promise<void> {
  const response = await fetch(`${ARTICLES_URL}/food/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  await handleResponse(response);
}

export async function updateNonFoodArticle(
  id: string,
  payload: UpdateNonFoodArticlePayload
): Promise<void> {
  const response = await fetch(`${ARTICLES_URL}/non-food/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  await handleResponse(response);
}

export async function deleteArticle(id: string): Promise<void> {
  const response = await fetch(`${ARTICLES_URL}/${id}`, {
    method: "DELETE",
  });
  await handleResponse(response);
}