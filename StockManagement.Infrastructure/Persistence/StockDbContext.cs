using Microsoft.EntityFrameworkCore;
using StockManagement.Domain.Entities;

namespace StockManagement.Infrastructure.Persistence;

public class StockDbContext : DbContext
{
    public DbSet<Article> Articles => Set<Article>();
    public DbSet<FoodArticle> FoodArticles => Set<FoodArticle>();
    public DbSet<NonFoodArticle> NonFoodArticles => Set<NonFoodArticle>();
    public DbSet<StockMovement> StockMovements => Set<StockMovement>();

    public StockDbContext(DbContextOptions<StockDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Article>(builder =>
        {
            builder.HasKey(a => a.Id);

            // EAN13 is a Value Object, stored as a string via conversion
            builder.Property(a => a.Reference)
                .HasConversion(
                    reference => reference.Value,
                    value => new Domain.ValueObjects.EAN13(value))
                .IsRequired();

            builder.HasIndex(a => a.Reference).IsUnique();

            builder.Property(a => a.Name).IsRequired();

            // Price is a Value Object, stored as owned entity
            builder.OwnsOne(a => a.Price, price =>
            {
                price.Property(p => p.ExcludingTax).HasColumnName("PriceExcludingTax");
                price.Property(p => p.VatRate).HasColumnName("VatRate");
            });

            // Table-Per-Hierarchy inheritance with a discriminator column
            builder.HasDiscriminator<string>("ArticleType")
                .HasValue<FoodArticle>("Food")
                .HasValue<NonFoodArticle>("NonFood");
        });

        modelBuilder.Entity<StockMovement>(builder =>
        {
            builder.HasKey(m => m.Id);
            builder.Property(m => m.Type).IsRequired();
            builder.Property(m => m.Quantity).IsRequired();
            builder.Property(m => m.Date).IsRequired();
        });
    }
}