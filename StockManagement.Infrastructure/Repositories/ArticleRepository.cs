using Microsoft.EntityFrameworkCore;
using StockManagement.Domain.Entities;
using StockManagement.Domain.Repositories;
using StockManagement.Domain.ValueObjects;
using StockManagement.Infrastructure.Persistence;

namespace StockManagement.Infrastructure.Repositories;

public class ArticleRepository : IArticleRepository
{
    private readonly StockDbContext _context;

    public ArticleRepository(StockDbContext context)
    {
        _context = context;
    }

    public async Task<Article?> GetByIdAsync(Guid id)
    {
        return await _context.Articles
            .Include(a => a.Movements)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<Article?> GetByReferenceAsync(EAN13 reference)
    {
        return await _context.Articles
            .Include(a => a.Movements)
            .FirstOrDefaultAsync(a => a.Reference == reference);
    }

    public async Task<IEnumerable<Article>> GetAllAsync()
    {
        return await _context.Articles
            .Include(a => a.Movements)
            .ToListAsync();
    }

    public async Task AddAsync(Article article)
    {
        await _context.Articles.AddAsync(article);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Article article)
    {
        _context.Articles.Update(article);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        Article? article = await _context.Articles.FindAsync(id);
        if (article != null)
        {
            _context.Articles.Remove(article);
            await _context.SaveChangesAsync();
        }
    }
}