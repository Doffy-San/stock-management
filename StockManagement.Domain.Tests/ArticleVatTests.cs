using StockManagement.Domain.Entities;
using StockManagement.Domain.Enums;
using StockManagement.Domain.ValueObjects;
using Xunit;

namespace StockManagement.Domain.Tests;

public class ArticleVatTests
{
    private const string ValidReference = "3017620422003";

    [Fact]
    public void FoodArticle_Takeaway_HasReducedVatRate()
    {
        // Arrange & Act : à emporter => TVA 5,5 %
        FoodArticle article = FoodArticle.Create(
            new EAN13(ValidReference),
            "Sandwich",
            10.00m,
            UnitOfMeasure.Piece,
            DateTime.UtcNow.AddDays(2),
            SaleType.Takeaway);

        // Assert
        Assert.Equal(5.5m, article.Price.VatRate);
        Assert.Equal(10.55m, article.Price.IncludingTax);
    }

    [Fact]
    public void FoodArticle_OnSite_HasStandardFoodVatRate()
    {
        // Arrange & Act : sur place => TVA 10 %
        FoodArticle article = FoodArticle.Create(
            new EAN13(ValidReference),
            "Plat chaud",
            10.00m,
            UnitOfMeasure.Piece,
            DateTime.UtcNow.AddDays(2),
            SaleType.OnSite);

        // Assert
        Assert.Equal(10m, article.Price.VatRate);
        Assert.Equal(11.00m, article.Price.IncludingTax);
    }

    [Fact]
    public void FoodArticle_Both_HasStandardFoodVatRate()
    {
        // Arrange & Act : les deux => TVA 10 % (hypothèse retenue)
        FoodArticle article = FoodArticle.Create(
            new EAN13(ValidReference),
            "Salade",
            10.00m,
            UnitOfMeasure.Piece,
            DateTime.UtcNow.AddDays(2),
            SaleType.Both);

        // Assert
        Assert.Equal(10m, article.Price.VatRate);
    }

    [Fact]
    public void NonFoodArticle_HasStandardVatRate()
    {
        // Arrange & Act : non-alimentaire => TVA 20 %
        NonFoodArticle article = NonFoodArticle.Create(
            new EAN13(ValidReference),
            "Casque audio",
            100.00m,
            UnitOfMeasure.Piece,
            PackagingLevel.New);

        // Assert
        Assert.Equal(20m, article.Price.VatRate);
        Assert.Equal(120.00m, article.Price.IncludingTax);
    }
}