using Microsoft.EntityFrameworkCore;
using StockManagement.Domain.Entities;
using StockManagement.Domain.Repositories;
using StockManagement.Infrastructure.Persistence;

namespace StockManagement.Infrastructure.Repositories;

public class StockMovementRepository : IStockMovementRepository
{
    private readonly StockDbContext _context;

    public StockMovementRepository(StockDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<StockMovement>> GetByArticleIdAsync(Guid articleId)
    {
        return await _context.StockMovements
            .Where(m => m.ArticleId == articleId)
            .OrderByDescending(m => m.Date)
            .ToListAsync();
    }

    public async Task AddAsync(StockMovement movement)
    {
        await _context.StockMovements.AddAsync(movement);
        await _context.SaveChangesAsync();
    }
}