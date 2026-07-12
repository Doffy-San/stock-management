using StockManagement.Domain.Entities;
using StockManagement.Domain.Enums;
using StockManagement.Domain.Repositories;

namespace StockManagement.Application.UseCases.Stock;

public class AddStockMovementUseCase
{
    private readonly IArticleRepository _articleRepository;
    private readonly IStockMovementRepository _stockMovementRepository;

    public AddStockMovementUseCase(
        IArticleRepository articleRepository,
        IStockMovementRepository stockMovementRepository)
    {
        _articleRepository = articleRepository;
        _stockMovementRepository = stockMovementRepository;
    }

    public async Task SupplyAsync(Guid articleId, int quantity, string? comment = null)
        => await AddMovementAsync(articleId, MovementType.Supply, quantity, comment);

    public async Task InventoryAsync(Guid articleId, int quantity, string? comment = null)
        => await AddMovementAsync(articleId, MovementType.Inventory, quantity, comment);

    private async Task AddMovementAsync(
        Guid articleId,
        MovementType type,
        int quantity,
        string? comment)
    {
        Article? article = await _articleRepository.GetByIdAsync(articleId);
        if (article == null)
            throw new InvalidOperationException($"Article with id '{articleId}' not found.");

        StockMovement movement = StockMovement.Create(articleId, type, quantity, comment);
        article.AddMovement(movement);
        await _stockMovementRepository.AddAsync(movement);
        await _articleRepository.UpdateAsync(article);
    }
}