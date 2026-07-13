using StockManagement.Domain.Entities;
using StockManagement.Domain.Exceptions;
using StockManagement.Domain.Repositories;

namespace StockManagement.Application.UseCases.Articles;

public class DeleteArticleUseCase
{
    private readonly IArticleRepository _articleRepository;
    public DeleteArticleUseCase(IArticleRepository articleRepository)
    {
        _articleRepository = articleRepository;
    }
    public async Task ExecuteAsync(Guid id)
    {
        Article? article = await _articleRepository.GetByIdAsync(id);
        if (article == null)
            throw new NotFoundException($"Article with id '{id}' not found.");
        await _articleRepository.DeleteAsync(id);
    }
}
