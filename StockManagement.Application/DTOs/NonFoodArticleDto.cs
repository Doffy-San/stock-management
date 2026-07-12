namespace StockManagement.Application.DTOs;

public class NonFoodArticleDto : ArticleDto
{
    public string PackagingLevel { get; init; } = string.Empty;
}