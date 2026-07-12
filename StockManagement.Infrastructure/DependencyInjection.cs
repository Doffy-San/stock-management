using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using StockManagement.Domain.Repositories;
using StockManagement.Infrastructure.Persistence;
using StockManagement.Infrastructure.Repositories;

namespace StockManagement.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        string connectionString)
    {
        services.AddDbContext<StockDbContext>(options =>
            options.UseSqlite(connectionString));

        services.AddScoped<IArticleRepository, ArticleRepository>();
        services.AddScoped<IStockMovementRepository, StockMovementRepository>();

        return services;
    }
}