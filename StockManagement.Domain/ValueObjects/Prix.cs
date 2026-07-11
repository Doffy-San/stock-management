namespace StockManagement.Domain.ValueObjects;

public class EAN13
{
    public string Value { get; }

    public EAN13(string value)
    {
        if (!IsValid(value))
            throw new ArgumentException($"'{value}' is not a valid EAN-13 code.");
        Value = value;
    }

    private static bool IsValid(string value)
    {
        if (string.IsNullOrWhiteSpace(value) || value.Length != 13 || !value.All(char.IsDigit))
            return false;

        int sum = 0;
        for (int i = 0; i < 12; i++)
            sum += (value[i] - '0') * (i % 2 == 0 ? 1 : 3);

        int checkDigit = (10 - (sum % 10)) % 10;
        return checkDigit == (value[12] - '0');
    }

    public override string ToString() => Value;

    public override bool Equals(object? obj) =>
        obj is EAN13 other && Value == other.Value;

    public override int GetHashCode() => Value.GetHashCode();
}