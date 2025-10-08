namespace Biller.Api.Models
{

    public class User
    {
        public Guid Id { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        public String? Name { get; set; } = string.Empty;
        public string Role { get; set; } = "user"; // default
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Boolean IsOnboarded { get; set; } = false;
    }
}