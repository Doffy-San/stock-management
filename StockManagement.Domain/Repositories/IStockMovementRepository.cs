using StockManagement.Domain.Entities;
using StockManagement.Domain.ValueObjects;

namespace StockManagement.Domain.Repositories;

public interface IArticleRepository
{
    Task<Article?> GetByIdAsync(Guid id);
    Task<Article?> GetByReferenceAsync(EAN13 reference);
    Task<IEnumerable<Article>> GetAllAsync();
    Task AddAsync(Article article);
    Task UpdateAsync(Article article);
    Task DeleteAsync(Guid id);
}