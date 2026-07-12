using Microsoft.AspNetCore.Mvc;
using StockManagement.API.Requests;
using StockManagement.Application.DTOs;
using StockManagement.Application.UseCases.Stock;

namespace StockManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StockController : ControllerBase
{
    private readonly AddStockMovementUseCase _addStockMovement;
    private readonly GetStockHistoryUseCase _getStockHistory;

    public StockController(
        AddStockMovementUseCase addStockMovement,
        GetStockHistoryUseCase getStockHistory)
    {
        _addStockMovement = addStockMovement;
        _getStockHistory = getStockHistory;
    }

    [HttpPost("supply/{articleId:guid}")]
    public async Task<IActionResult> Supply(Guid articleId, [FromBody] StockMovementRequest request)
    {
        await _addStockMovement.SupplyAsync(articleId, request.Quantity, request.Comment);
        return NoContent();
    }

    [HttpPost("inventory/{articleId:guid}")]
    public async Task<IActionResult> Inventory(Guid articleId, [FromBody] StockMovementRequest request)
    {
        await _addStockMovement.InventoryAsync(articleId, request.Quantity, request.Comment);
        return NoContent();
    }

    [HttpGet("history/{articleId:guid}")]
    public async Task<ActionResult<IEnumerable<StockMovementDto>>> GetHistory(Guid articleId)
    {
        IEnumerable<StockMovementDto> history = await _getStockHistory.ExecuteAsync(articleId);
        return Ok(history);
    }
}