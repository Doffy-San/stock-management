using StockManagement.Domain.Entities;
using StockManagement.Domain.Enums;
using StockManagement.Domain.Repositories;
using StockManagement.Domain.ValueObjects;

namespace StockManagement.Application.UseCases.Articles;

public class UpdateNonFoodArticleUseCase
{
    private readonly IArticleRepository _articleRepository;

    public UpdateNonFoodArticleUseCase(IArticleRepository articleRepository)
    {
        _articleRepository = articleRepository;
    }

    public async Task ExecuteAsync(
        Guid id,
        string name,
        decimal priceExcludingTax,
        PackagingLevel packagingLevel)
    {
        Article? article = await _articleRepository.GetByIdAsync(id);
        if (article == null)
            throw new InvalidOperationException($"Article with id '{id}' not found.");

        if (article is not NonFoodArticle nonFoodArticle)
            throw new InvalidOperationException($"Article with id '{id}' is not a non-food article.");

        nonFoodArticle.UpdateName(name);
        nonFoodArticle.UpdatePrice(Price.Create(priceExcludingTax, nonFoodArticle.Price.VatRate));
        nonFoodArticle.UpdatePackagingLevel(packagingLevel);

        await _articleRepository.UpdateAsync(nonFoodArticle);
    }
}