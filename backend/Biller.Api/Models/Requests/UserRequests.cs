namespace Biller.Api.Models.Requests
{
    public class OnboardingRequest
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string BusinessName { get; set; } = string.Empty;

        public string AddressLine1 { get; set; } = string.Empty;
        public string AddressLine2 { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
        public string BusinessType { get; set; } = string.Empty;
        public string PrimaryCurrency { get; set; } = string.Empty;
        public string TimeZone { get; set; } = string.Empty;
        public string StartingDate { get; set; } = string.Empty;

        public bool MarketingPref { get; set; } = false;
        public string Email { get; set; } = string.Empty;
        public string JobTitle { get; set; } = string.Empty;
    }
}