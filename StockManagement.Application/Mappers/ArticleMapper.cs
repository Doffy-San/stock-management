using StockManagement.Application.DTOs;
using StockManagement.Domain.Entities;

namespace StockManagement.Application.Mappers;

public static class ArticleMapper
{
    public static ArticleDto ToDto(Article article)
    {
        if (article is FoodArticle foodArticle)
            return MapFoodArticle(foodArticle);

        if (article is NonFoodArticle nonFoodArticle)
            return MapNonFoodArticle(nonFoodArticle);

        throw new InvalidOperationException($"Unknown article type: {article.GetType().Name}");
    }

    private static FoodArticleDto MapFoodArticle(FoodArticle article) => new()
    {
        Id = article.Id,
        Reference = article.Reference.Value,
        Name = article.Name,
        PriceExcludingTax = article.Price.ExcludingTax,
        PriceIncludingTax = article.Price.IncludingTax,
        VatRate = article.Price.VatRate,
        ArticleType = "Food",
        CurrentStock = article.GetCurrentStock(),
        ExpiryDate = article.ExpiryDate,
        SaleType = article.SaleType.ToString(),
        Unit = article.Unit.ToString(),
    };

    private static NonFoodArticleDto MapNonFoodArticle(NonFoodArticle article) => new()
    {
        Id = article.Id,
        Reference = article.Reference.Value,
        Name = article.Name,
        PriceExcludingTax = article.Price.ExcludingTax,
        PriceIncludingTax = article.Price.IncludingTax,
        VatRate = article.Price.VatRate,
        ArticleType = "NonFood",
        CurrentStock = article.GetCurrentStock(),
        PackagingLevel = article.PackagingLevel.ToString(),
        Unit = article.Unit.ToString(),
    };
}