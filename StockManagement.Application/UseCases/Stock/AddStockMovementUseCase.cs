using StockManagement.Domain.Entities;
using StockManagement.Domain.Enums;
using StockManagement.Domain.Exceptions;
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

    public async Task ReleaseAsync(Guid articleId, MovementType type, int quantity, string? comment = null)
    {
        if (!IsReleaseType(type))
            throw new ArgumentException($"'{type}' is not a valid stock release type.");

        await AddMovementAsync(articleId, type, quantity, comment);
    }

    private static bool IsReleaseType(MovementType type)
    {
        return type == MovementType.Sale
            || type == MovementType.Loss
            || type == MovementType.Expiry;
    }

    private async Task AddMovementAsync(
        Guid articleId,
        MovementType type,
        int quantity,
        string? comment)
    {
        Article? article = await _articleRepository.GetByIdAsync(articleId);
        if (article == null)
            throw new NotFoundException($"Article with id '{articleId}' not found.");

        StockMovement movement = StockMovement.Create(articleId, type, quantity, comment);
        article.AddMovement(movement);
        await _stockMovementRepository.AddAsync(movement);
        await _articleRepository.UpdateAsync(article);
    }
}