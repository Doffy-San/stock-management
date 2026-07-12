namespace StockManagement.Application.DTOs;

public class StockMovementDto
{
    public Guid Id { get; init; }
    public Guid ArticleId { get; init; }
    public string Type { get; init; } = string.Empty;
    public int Quantity { get; init; }
    public DateTime Date { get; init; }
    public string? Comment { get; init; }
}