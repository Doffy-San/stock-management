using System;
using StockManagement.Domain.ValueObjects;
using Xunit;

namespace StockManagement.Domain.Tests;

public class EAN13Tests
{
    [Theory]
    [InlineData("3017620422003")] // Nutella
    [InlineData("5449000000996")] // Coca-Cola
    [InlineData("7622210449283")] // Prince
    public void Constructor_WithValidEan13_CreatesInstance(string validCode)
    {
        // Act
        EAN13 ean = new EAN13(validCode);

        // Assert
        Assert.Equal(validCode, ean.Value);
    }

    [Theory]
    [InlineData("1234567890123")] // checksum invalide
    [InlineData("0000000000001")] // checksum invalide
    public void Constructor_WithInvalidChecksum_ThrowsException(string invalidCode)
    {
        // Act & Assert
        Assert.Throws<ArgumentException>(() => new EAN13(invalidCode));
    }

    [Theory]
    [InlineData("301762042200")]    // 12 chiffres (trop court)
    [InlineData("30176204220033")]  // 14 chiffres (trop long)
    [InlineData("301762042200A")]   // contient une lettre
    [InlineData("")]                // vide
    public void Constructor_WithInvalidFormat_ThrowsException(string invalidCode)
    {
        // Act & Assert
        Assert.Throws<ArgumentException>(() => new EAN13(invalidCode));
    }

    [Fact]
    public void Equals_WithSameValue_ReturnsTrue()
    {
        // Arrange
        EAN13 first = new EAN13("3017620422003");
        EAN13 second = new EAN13("3017620422003");

        // Act & Assert
        Assert.Equal(first, second);
    }
}