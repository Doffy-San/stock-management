using StockManagement.Domain.Enums;

namespace StockManagement.API.Requests;

public record UpdateFoodArticleRequest(
    string Name,
    decimal PriceExcludingTax,
    DateTime ExpiryDate,
    SaleType SaleType);