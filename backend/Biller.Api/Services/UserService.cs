using Biller.Api.Data;
using Microsoft.EntityFrameworkCore;
using Biller.Api.Models;

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

    }
}
