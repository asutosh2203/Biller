using Biller.Api.Data;
using Microsoft.EntityFrameworkCore;
using Biller.Api.Models;
using Biller.Api.Models.Requests;

namespace Biller.Api.Services
{
    public class UserService(AppDbContext db)
    {
        private readonly AppDbContext _db = db;

        public async Task<User?> GetUserByPhoneAsync(string phone) =>
            await _db.Users.FirstOrDefaultAsync(u => u.PhoneNumber == phone);

        public async Task<User> CreateUserAsync(string phone)
        {
            var user = new User { PhoneNumber = phone, Id = Guid.NewGuid() };
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            return user;
        }

        public User? GetUserByPhone(string phone)
        {
            return _db.Users.FirstOrDefault(u => u.PhoneNumber == phone);
        }

        public async Task<BusinessProfile> SetOnboardingData(Guid userGuid, OnboardingRequest request)
        {

            var user = await _db.Users.FindAsync(userGuid) ?? throw new KeyNotFoundException("User not found");

            // Create BusinessProfile
            var business = new BusinessProfile
            {
                Id = Guid.NewGuid(),
                UserId = userGuid,
                BusinessName = request.BusinessName,
                AddressLine1 = request.AddressLine1,
                AddressLine2 = request.AddressLine2,
                City = request.City,
                BusinessType = request.BusinessType,
                MarketingPref = request.MarketingPref,
                PostalCode = request.PostalCode,
                PrimaryCurrency = request.PrimaryCurrency,
                TimeZone = request.TimeZone,
            };

            // Set necessary fields in user table
            user.IsOnboarded = true;
            user.Name = request.FullName;
            user.Email = request.Email;
            user.JobTitle = request.JobTitle;

            _db.BusinessProfiles.Add(business);
            await _db.SaveChangesAsync();

            return business;
        }

    }
}
