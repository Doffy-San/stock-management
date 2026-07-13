using StockManagement.Domain.Enums;

namespace StockManagement.API.Requests;

public record ReleaseStockRequest(
    MovementType Type,
    int Quantity,
    string? Comment);