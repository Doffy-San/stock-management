using StockManagement.Domain.Enums;

namespace StockManagement.API.Requests;

public record UpdateNonFoodArticleRequest(
    string Name,
    decimal PriceExcludingTax,
    PackagingLevel PackagingLevel);