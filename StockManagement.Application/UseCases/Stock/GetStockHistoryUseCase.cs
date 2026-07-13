using StockManagement.Application.DTOs;
using StockManagement.Application.Mappers;
using StockManagement.Domain.Entities;
using StockManagement.Domain.Exceptions;
using StockManagement.Domain.Repositories;

namespace StockManagement.Application.UseCases.Stock;

public class GetStockHistoryUseCase
{
    private readonly IArticleRepository _articleRepository;
    private readonly IStockMovementRepository _stockMovementRepository;

    public GetStockHistoryUseCase(
        IArticleRepository articleRepository,
        IStockMovementRepository stockMovementRepository)
    {
        _articleRepository = articleRepository;
        _stockMovementRepository = stockMovementRepository;
    }

    public async Task<IEnumerable<StockMovementDto>> ExecuteAsync(Guid articleId)
    {
        Article? article = await _articleRepository.GetByIdAsync(articleId);
        if (article == null)
            throw new NotFoundException($"Article with id '{articleId}' not found.");

        IEnumerable<StockMovement> movements = await _stockMovementRepository.GetByArticleIdAsync(articleId);
        return movements.Select(StockMovementMapper.ToDto);
    }
}