using StockManagement.Application.DTOs;
using StockManagement.Application.Mappers;
using StockManagement.Domain.Entities;
using StockManagement.Domain.Repositories;

namespace StockManagement.Application.UseCases.Articles;

public class GetArticlesUseCase
{
    private readonly IArticleRepository _articleRepository;

    public GetArticlesUseCase(IArticleRepository articleRepository)
    {
        _articleRepository = articleRepository;
    }

    public async Task<IEnumerable<ArticleDto>> ExecuteAsync()
    {
        IEnumerable<Article> articles = await _articleRepository.GetAllAsync();
        return articles.Select(ArticleMapper.ToDto);
    }
}