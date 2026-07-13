using StockManagement.Domain.Enums;

namespace StockManagement.API.Requests;

public record CreateNonFoodArticleRequest(
    string Reference,
    string Name,
    decimal PriceExcludingTax,
    PackagingLevel PackagingLevel,
    UnitOfMeasure Unit);