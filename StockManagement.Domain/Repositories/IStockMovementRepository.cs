using StockManagement.Domain.Entities;

namespace StockManagement.Domain.Repositories;

public interface IStockMovementRepository
{
    Task<IEnumerable<StockMovement>> GetByArticleIdAsync(Guid articleId);
    Task AddAsync(StockMovement movement);
}