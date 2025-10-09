using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Biller.Api.Models
{
    public class RefreshToken
    {
        [Key]
        public int Id { get; set; } // SERIAL primary key in DB

        [Required]
        public Guid UserId { get; set; } // UUID reference to User

        [Required]
        public string Token { get; set; } = string.Empty; // the refresh token string

        [Required]
        public DateTime ExpiresAt { get; set; } // token expiry time

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // creation time

        [Required]
        public bool Revoked { get; set; } = false; // revoked status

        [Required]
        public string UserAgent { get; set; } = String.Empty;

        // Navigation property for EF relationship
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;
    }
}
