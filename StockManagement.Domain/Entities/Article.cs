using StockManagement.Domain.ValueObjects;
using StockManagement.Domain.Enums;

namespace StockManagement.Domain.Entities;

public abstract class Article
{
    public Guid Id { get; protected set; }
    public EAN13 Reference { get; protected set; } = null!;
    public string Name { get; protected set; } = null!;
    public Price Price { get; protected set; } = null!;

    public UnitOfMeasure Unit { get; protected set; }

    private readonly List<StockMovement> _movements = new();
    public IReadOnlyCollection<StockMovement> Movements => _movements.AsReadOnly();

    protected Article(EAN13 reference, string name, Price price, UnitOfMeasure unit)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Article name cannot be empty.");

        Id = Guid.NewGuid();
        Reference = reference;
        Name = name;
        Price = price;
        Unit = unit;
    }

    protected Article()
    {
    }

    public int GetCurrentStock()
    {
        StockMovement? lastInventory = _movements
            .Where(m => m.Type == MovementType.Inventory)
            .OrderByDescending(m => m.Date)
            .FirstOrDefault();

        DateTime baseDate = lastInventory?.Date ?? DateTime.MinValue;
        int baseQuantity = lastInventory?.Quantity ?? 0;

        int supplied = _movements
            .Where(m => m.Type == MovementType.Supply && m.Date > baseDate)
            .Sum(m => m.Quantity);

        int sold = _movements
            .Where(m => m.Type == MovementType.Sale && m.Date > baseDate)
            .Sum(m => m.Quantity);

        return baseQuantity + supplied - sold;
    }

    public void AddMovement(StockMovement movement)
    {
        ArgumentNullException.ThrowIfNull(movement);
        _movements.Add(movement);
    }

    public void UpdateName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Article name cannot be empty.");
        Name = name;
    }

    public void UpdatePrice(Price price)
    {
        ArgumentNullException.ThrowIfNull(price);
        Price = price;
    }
}