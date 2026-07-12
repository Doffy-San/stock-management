using StockManagement.Domain.Entities;
using StockManagement.Domain.Enums;
using StockManagement.Domain.Repositories;
using StockManagement.Domain.ValueObjects;

namespace StockManagement.Application.UseCases.Articles;

public class UpdateFoodArticleUseCase
{
    private readonly IArticleRepository _articleRepository;

    public UpdateFoodArticleUseCase(IArticleRepository articleRepository)
    {
        _articleRepository = articleRepository;
    }

    public async Task ExecuteAsync(
        Guid id,
        string name,
        decimal priceExcludingTax,
        DateTime expiryDate,
        SaleType saleType)
    {
        Article? article = await _articleRepository.GetByIdAsync(id);
        if (article == null)
            throw new InvalidOperationException($"Article with id '{id}' not found.");

        if (article is not FoodArticle foodArticle)
            throw new InvalidOperationException($"Article with id '{id}' is not a food article.");

        foodArticle.UpdateName(name);
        foodArticle.UpdatePrice(Price.Create(priceExcludingTax, foodArticle.Price.VatRate));
        foodArticle.UpdateExpiryDate(expiryDate);
        foodArticle.UpdateSaleType(saleType);

        await _articleRepository.UpdateAsync(foodArticle);
    }
}