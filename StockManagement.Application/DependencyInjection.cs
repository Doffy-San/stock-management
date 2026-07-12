using Microsoft.Extensions.DependencyInjection;
using StockManagement.Application.UseCases.Articles;
using StockManagement.Application.UseCases.Stock;

namespace StockManagement.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<CreateFoodArticleUseCase>();
        services.AddScoped<CreateNonFoodArticleUseCase>();
        services.AddScoped<UpdateFoodArticleUseCase>();
        services.AddScoped<UpdateNonFoodArticleUseCase>();
        services.AddScoped<DeleteArticleUseCase>();
        services.AddScoped<GetArticlesUseCase>();
        services.AddScoped<AddStockMovementUseCase>();
        services.AddScoped<GetStockHistoryUseCase>();

        return services;
    }
}