namespace StockManagement.Domain.ValueObjects;

public class Price
{
    public decimal ExcludingTax { get; }
    public decimal VatRate { get; }
    public decimal IncludingTax => Math.Round(ExcludingTax * (1 + VatRate / 100), 2);

    private Price(decimal excludingTax, decimal vatRate)
    {
        ExcludingTax = excludingTax;
        VatRate = vatRate;
    }

    public static Price Create(decimal excludingTax, decimal vatRate)
    {
        if (excludingTax < 0)
            throw new ArgumentException("Excluding tax price cannot be negative.");
        if (vatRate < 0)
            throw new ArgumentException("VAT rate cannot be negative.");

        return new Price(excludingTax, vatRate);
    }

    public override bool Equals(object? obj) =>
        obj is Price other && ExcludingTax == other.ExcludingTax && VatRate == other.VatRate;

    public override int GetHashCode() => HashCode.Combine(ExcludingTax, VatRate);

    public override string ToString() =>
        $"Excl. Tax: {ExcludingTax}€ | VAT: {VatRate}% | Incl. Tax: {IncludingTax}€";
}