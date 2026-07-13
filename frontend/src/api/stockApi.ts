import { API_BASE_URL } from "./config";
import type { StockMovement, ReleaseReason  } from "../types/stock";
import {handleResponse} from "./httpClient";

const STOCK_URL = `${API_BASE_URL}/stock`;

export interface StockMovementPayload {
  quantity: number;
  comment: string | null;
}

export async function supplyStock(
  articleId: string,
  payload: StockMovementPayload
): Promise<void> {
  const response = await fetch(`${STOCK_URL}/supply/${articleId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  await handleResponse(response);
}

export async function recordInventory(
  articleId: string,
  payload: StockMovementPayload
): Promise<void> {
  const response = await fetch(`${STOCK_URL}/inventory/${articleId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  await handleResponse(response);
}

export async function getStockHistory(
  articleId: string
): Promise<StockMovement[]> {
  const response = await fetch(`${STOCK_URL}/history/${articleId}`);
  if (!response.ok) throw new Error("Failed to fetch stock history.");
  return response.json();
}

export interface ReleaseStockPayload {
  type: ReleaseReason;
  quantity: number;
  comment: string | null;
}

export async function releaseStock(
  articleId: string,
  payload: ReleaseStockPayload
): Promise<void> {
  const response = await fetch(`${STOCK_URL}/release/${articleId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  await handleResponse(response);
}