using StockManagement.Domain.Entities;
using StockManagement.Domain.Enums;
using StockManagement.Domain.Exceptions;
using StockManagement.Domain.Repositories;
using StockManagement.Domain.ValueObjects;

namespace StockManagement.Application.UseCases.Articles;

public class CreateFoodArticleUseCase
{
    private readonly IArticleRepository _articleRepository;

    public CreateFoodArticleUseCase(IArticleRepository articleRepository)
    {
        _articleRepository = articleRepository;
    }

    public async Task ExecuteAsync(
        string reference,
        string name,
        decimal priceExcludingTax,
        UnitOfMeasure unit,
        DateTime expiryDate,
        SaleType saleType)
    {
        EAN13 ean13 = new EAN13(reference);

        Article? existing = await _articleRepository.GetByReferenceAsync(ean13);
        if (existing != null)
            throw new DuplicateReferenceException(reference);

        FoodArticle article = FoodArticle.Create(ean13, name, priceExcludingTax, unit, expiryDate, saleType);

        await _articleRepository.AddAsync(article);
    }
}