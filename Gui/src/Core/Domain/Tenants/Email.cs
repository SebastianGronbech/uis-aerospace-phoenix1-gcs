namespace Core.Domain.Tenants;

public class Email
{
    public string Value { get; private set; }

    public Email(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Email cannot be empty", nameof(value));
        }

        if (!value.Contains("@"))
        {
            throw new ArgumentException("Email is invalid", nameof(value));
        }

        Value = value;
    }
}