using StockManagement.Application;
using StockManagement.Infrastructure;
using StockManagement.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Register controllers
builder.Services.AddControllers();

// Swagger for API testing
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register application and infrastructure layers
string connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Data Source=stock.db";

builder.Services.AddApplication();
builder.Services.AddInfrastructure(connectionString);

// CORS to allow the React frontend to call the API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

WebApplication app = builder.Build();

// Apply migrations automatically on startup
using (IServiceScope scope = app.Services.CreateScope())
{
    StockDbContext dbContext = scope.ServiceProvider.GetRequiredService<StockDbContext>();
    dbContext.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();