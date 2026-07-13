using StockManagement.Domain.Enums;
using StockManagement.Domain.ValueObjects;

namespace StockManagement.Domain.Entities;

public class NonFoodArticle : Article
{
    public PackagingLevel PackagingLevel { get; private set; }

    private const decimal VatRate = 20m;

    private NonFoodArticle(
        EAN13 reference,
        string name,
        Price price,
        UnitOfMeasure unit,
        PackagingLevel packagingLevel) : base(reference, name, price, unit)
    {
        PackagingLevel = packagingLevel;
    }

    // Required by EF Core
    private NonFoodArticle() : base() { }

    public static NonFoodArticle Create(
        EAN13 reference,
        string name,
        decimal priceExcludingTax,
        UnitOfMeasure unit,
        PackagingLevel packagingLevel)
    {
        Price price = Price.Create(priceExcludingTax, VatRate);
        return new NonFoodArticle(reference, name, price, unit, packagingLevel);
    }

    public void UpdatePackagingLevel(PackagingLevel packagingLevel)
    {
        PackagingLevel = packagingLevel;
    }
}