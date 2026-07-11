using StockManagement.Domain.Enums;

namespace StockManagement.Domain.Entities;

public class StockMovement
{
    public Guid Id { get; private set; }
    public Guid ArticleId { get; private set; }
    public MovementType Type { get; private set; }
    public int Quantity { get; private set; }
    public DateTime Date { get; private set; }
    public string? Comment { get; private set; }

    private StockMovement() { }

    public static StockMovement Create(
        Guid articleId,
        MovementType type,
        int quantity,
        string? comment = null)
    {
        if (quantity <= 0)
            throw new ArgumentException("Quantity must be greater than zero.");

        return new StockMovement
        {
            Id = Guid.NewGuid(),
            ArticleId = articleId,
            Type = type,
            Quantity = quantity,
            Date = DateTime.UtcNow,
            Comment = comment
        };
    }
}