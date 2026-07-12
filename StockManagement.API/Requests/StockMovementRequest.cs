namespace StockManagement.API.Requests;

public record StockMovementRequest(
    int Quantity,
    string? Comment);