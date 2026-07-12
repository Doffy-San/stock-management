using StockManagement.Domain.Entities;
using StockManagement.Domain.Enums;
using StockManagement.Domain.Repositories;
using StockManagement.Domain.ValueObjects;

namespace StockManagement.Application.UseCases.Articles;

public class CreateNonFoodArticleUseCase
{
	private readonly IArticleRepository _articleRepository;

	public CreateNonFoodArticleUseCase(IArticleRepository articleRepository)
	{
		_articleRepository = articleRepository;
	}

	public async Task ExecuteAsync(
		string reference,
		string name,
		decimal priceExcludingTax,
		PackagingLevel packagingLevel)
	{
		EAN13 ean13 = new EAN13(reference);

		Article? existing = await _articleRepository.GetByReferenceAsync(ean13);
		if (existing != null)
			throw new InvalidOperationException($"An article with reference '{reference}' already exists.");

		NonFoodArticle article = NonFoodArticle.Create(ean13, name, priceExcludingTax, packagingLevel);

		await _articleRepository.AddAsync(article);
	}
}