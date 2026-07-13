export type ArticleType = "Food" | "NonFood";

export type SaleType = "OnSite" | "Takeaway" | "Both";

export type PackagingLevel = "New" | "Refurbished" | "Unsellable";

export type UnitOfMeasure = "Piece" | "Kilogram" | "Liter";

export interface Article {
  id: string;
  reference: string;
  name: string;
  priceExcludingTax: number;
  priceIncludingTax: number;
  vatRate: number;
  articleType: ArticleType;
  unit: UnitOfMeasure;
  currentStock: number;
}

export interface FoodArticle extends Article {
  expiryDate: string;
  saleType: SaleType;
}

export interface NonFoodArticle extends Article {
  packagingLevel: PackagingLevel;
}