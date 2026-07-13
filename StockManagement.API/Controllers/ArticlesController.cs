using Microsoft.AspNetCore.Mvc;
using StockManagement.API.Requests;
using StockManagement.Application.DTOs;
using StockManagement.Application.UseCases.Articles;

namespace StockManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArticlesController : ControllerBase
{
    private readonly CreateFoodArticleUseCase _createFoodArticle;
    private readonly CreateNonFoodArticleUseCase _createNonFoodArticle;
    private readonly UpdateFoodArticleUseCase _updateFoodArticle;
    private readonly UpdateNonFoodArticleUseCase _updateNonFoodArticle;
    private readonly DeleteArticleUseCase _deleteArticle;
    private readonly GetArticlesUseCase _getArticles;

    public ArticlesController(
        CreateFoodArticleUseCase createFoodArticle,
        CreateNonFoodArticleUseCase createNonFoodArticle,
        UpdateFoodArticleUseCase updateFoodArticle,
        UpdateNonFoodArticleUseCase updateNonFoodArticle,
        DeleteArticleUseCase deleteArticle,
        GetArticlesUseCase getArticles)
    {
        _createFoodArticle = createFoodArticle;
        _createNonFoodArticle = createNonFoodArticle;
        _updateFoodArticle = updateFoodArticle;
        _updateNonFoodArticle = updateNonFoodArticle;
        _deleteArticle = deleteArticle;
        _getArticles = getArticles;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ArticleDto>>> GetAll()
    {
        IEnumerable<ArticleDto> articles = await _getArticles.ExecuteAsync();
        return Ok(articles);
    }

    [HttpPost("food")]
    public async Task<IActionResult> CreateFood([FromBody] CreateFoodArticleRequest request)
    {
        await _createFoodArticle.ExecuteAsync(
            request.Reference,
            request.Name,
            request.PriceExcludingTax,
            request.Unit,
            request.ExpiryDate,
            request.SaleType);

        return Created();
    }

    [HttpPost("non-food")]
    public async Task<IActionResult> CreateNonFood([FromBody] CreateNonFoodArticleRequest request)
    {
        await _createNonFoodArticle.ExecuteAsync(
            request.Reference,
            request.Name,
            request.PriceExcludingTax,
            request.Unit,
            request.PackagingLevel);

        return Created();
    }

    [HttpPut("food/{id:guid}")]
    public async Task<IActionResult> UpdateFood(Guid id, [FromBody] UpdateFoodArticleRequest request)
    {
        await _updateFoodArticle.ExecuteAsync(
            id,
            request.Name,
            request.PriceExcludingTax,
            request.ExpiryDate,
            request.SaleType);

        return NoContent();
    }

    [HttpPut("non-food/{id:guid}")]
    public async Task<IActionResult> UpdateNonFood(Guid id, [FromBody] UpdateNonFoodArticleRequest request)
    {
        await _updateNonFoodArticle.ExecuteAsync(
            id,
            request.Name,
            request.PriceExcludingTax,
            request.PackagingLevel);

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _deleteArticle.ExecuteAsync(id);
        return NoContent();
    }
}