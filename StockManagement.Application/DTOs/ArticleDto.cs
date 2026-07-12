using System.Text.Json.Serialization;

namespace StockManagement.Application.DTOs;

[JsonPolymorphic(TypeDiscriminatorPropertyName = "articleType")]
[JsonDerivedType(typeof(FoodArticleDto), "Food")]
[JsonDerivedType(typeof(NonFoodArticleDto), "NonFood")]
public class ArticleDto
{
    public Guid Id { get; init; }
    public string Reference { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public decimal PriceExcludingTax { get; init; }
    public decimal PriceIncludingTax { get; init; }
    public decimal VatRate { get; init; }
    public string ArticleType { get; init; } = string.Empty;
    public int CurrentStock { get; init; }
}