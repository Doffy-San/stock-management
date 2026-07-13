using StockManagement.Domain.Entities;
using StockManagement.Domain.Enums;
using StockManagement.Domain.ValueObjects;
using Xunit;

namespace StockManagement.Domain.Tests;

public class ArticleStockTests
{
    // Helper : crée un article non-alimentaire de test
    private static NonFoodArticle CreateTestArticle()
    {
        return NonFoodArticle.Create(
            new EAN13("3017620422003"),
            "Test Article",
            10.00m,
            UnitOfMeasure.Piece,
            PackagingLevel.New);
    }

    [Fact]
    public void GetCurrentStock_WithNoMovements_ReturnsZero()
    {
        // Arrange
        NonFoodArticle article = CreateTestArticle();

        // Act
        int stock = article.GetCurrentStock();

        // Assert
        Assert.Equal(0, stock);
    }

    [Fact]
    public void GetCurrentStock_AfterSupply_ReturnsSuppliedQuantity()
    {
        // Arrange
        NonFoodArticle article = CreateTestArticle();
        StockMovement supply = StockMovement.Create(article.Id, MovementType.Supply, 100, null);

        // Act
        article.AddMovement(supply);
        int stock = article.GetCurrentStock();

        // Assert
        Assert.Equal(100, stock);
    }

    [Fact]
    public void GetCurrentStock_AfterSupplyAndRelease_ReturnsDifference()
    {
        // Arrange
        NonFoodArticle article = CreateTestArticle();

        // Act
        article.AddMovement(StockMovement.Create(article.Id, MovementType.Supply, 100, null));
        article.AddMovement(StockMovement.Create(article.Id, MovementType.Sale, 30, null));
        int stock = article.GetCurrentStock();

        // Assert
        Assert.Equal(70, stock);
    }

    [Fact]
    public void GetCurrentStock_AfterInventory_UsesInventoryAsBaseline()
    {
        // Arrange
        NonFoodArticle article = CreateTestArticle();

        // Act
        article.AddMovement(StockMovement.Create(article.Id, MovementType.Supply, 100, null));
        // L'inventaire redéfinit le stock réel à 80 (20 perdus/volés)
        article.AddMovement(StockMovement.Create(article.Id, MovementType.Inventory, 80, null));
        int stock = article.GetCurrentStock();

        // Assert
        Assert.Equal(80, stock);
    }

    [Fact]
    public void GetCurrentStock_NeverReturnsNegative()
    {
        // Arrange
        NonFoodArticle article = CreateTestArticle();

        // Act : on retire plus que le stock disponible
        article.AddMovement(StockMovement.Create(article.Id, MovementType.Supply, 50, null));
        article.AddMovement(StockMovement.Create(article.Id, MovementType.Sale, 100, null));
        int stock = article.GetCurrentStock();

        // Assert : le stock est plafonné à 0
        Assert.Equal(0, stock);
    }
}