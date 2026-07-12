using StockManagement.Domain.Enums;

namespace StockManagement.API.Requests;

public record CreateFoodArticleRequest(
    string Reference,
    string Name,
    decimal PriceExcludingTax,
    DateTime ExpiryDate,
    SaleType SaleType);