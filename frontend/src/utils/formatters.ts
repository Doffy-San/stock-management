import type { UnitOfMeasure } from "../types/article";
import { unitSymbols } from "./labels";

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Non renseignée";
  }
  return date.toLocaleDateString("fr-FR");
}

export function formatPrice(value: number): string {
  return `${value.toFixed(2)} €`;
}

export function formatQuantity(quantity: number, unit: UnitOfMeasure): string {
  return `${quantity} ${unitSymbols[unit]}`;
}

export function isExpired(dateString: string): boolean {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  return date < new Date();
}

export function isExpiringSoon(dateString: string): boolean {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  const in7Days = new Date();
  in7Days.setDate(in7Days.getDate() + 7);
  return date >= new Date() && date <= in7Days;
}