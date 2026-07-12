namespace StockManagement.Application.DTOs;

public class FoodArticleDto : ArticleDto
{
    public DateTime ExpiryDate { get; init; }
    public string SaleType { get; init; } = string.Empty;
}