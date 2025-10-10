using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Biller.Api.Models
{

    public class BusinessProfile
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public string BusinessName { get; set; } = string.Empty;
        [Required]
        public string AddressLine1 { get; set; } = string.Empty;
        [Required]
        public string AddressLine2 { get; set; } = string.Empty;
        [Required]
        public string City { get; set; } = string.Empty;
        [Required]
        public string PostalCode { get; set; } = string.Empty;
        public string BusinessType { get; set; } = string.Empty;
        public string PrimaryCurrency { get; set; } = string.Empty;
        public string TimeZone { get; set; } = string.Empty;
        public DateTime StartingDate { get; set; } = DateTime.UtcNow;

        public bool MarketingPref { get; set; } = false;

        // Navigation property
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;
    }
}