using StockManagement.Application.DTOs;
using StockManagement.Domain.Entities;

namespace StockManagement.Application.Mappers;

public static class StockMovementMapper
{
    public static StockMovementDto ToDto(StockMovement movement) => new()
    {
        Id = movement.Id,
        ArticleId = movement.ArticleId,
        Type = movement.Type.ToString(),
        Quantity = movement.Quantity,
        Date = movement.Date,
        Comment = movement.Comment
    };
}