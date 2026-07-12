using StockManagement.Domain.Enums;
using StockManagement.Domain.ValueObjects;

namespace StockManagement.Domain.Entities;

public class FoodArticle : Article
{
    public DateTime ExpiryDate { get; private set; }
    public SaleType SaleType { get; private set; }

    private const decimal TakeawayVatRate = 5.5m;
    private const decimal OnSiteVatRate = 10m;

    private FoodArticle(
        EAN13 reference,
        string name,
        Price price,
        DateTime expiryDate,
        SaleType saleType) : base(reference, name, price)
    {
        ExpiryDate = expiryDate;
        SaleType = saleType;
    }

    // Required by EF Core
    private FoodArticle() : base() { }

    public static FoodArticle Create(
        EAN13 reference,
        string name,
        decimal priceExcludingTax,
        DateTime expiryDate,
        SaleType saleType)
    {
        decimal vatRate = saleType == SaleType.Takeaway
            ? TakeawayVatRate
            : OnSiteVatRate;

        Price price = Price.Create(priceExcludingTax, vatRate);
        return new FoodArticle(reference, name, price, expiryDate, saleType);
    }

    public void UpdateExpiryDate(DateTime expiryDate)
    {
        if (expiryDate <= DateTime.UtcNow)
            throw new ArgumentException("Expiry date must be in the future.");
        ExpiryDate = expiryDate;
    }

    public void UpdateSaleType(SaleType saleType)
    {
        SaleType = saleType;
        decimal vatRate = saleType == SaleType.Takeaway
            ? TakeawayVatRate
            : OnSiteVatRate;
        Price = Price.Create(Price.ExcludingTax, vatRate);
    }
}