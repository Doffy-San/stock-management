namespace StockManagement.Domain.Exceptions;

public class DuplicateReferenceException : DomainException
{
    public DuplicateReferenceException(string reference)
        : base($"An article with reference '{reference}' already exists.")
    {
    }
}