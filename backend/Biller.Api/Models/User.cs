namespace Biller.Api.Models
{

    public class User
    {
        public Guid Id { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Name { get; set; } = string.Empty;
        public string Role { get; set; } = "user"; // default
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsOnboarded { get; set; } = false;
        public string Email { get; set; } = string.Empty;
        public string JobTitle { get; set; } = string.Empty;
    }
}