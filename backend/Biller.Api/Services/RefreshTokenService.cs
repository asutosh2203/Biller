using Biller.Api.Data;
using Biller.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace Biller.Api.Services
{
    public class RefreshTokenService(AppDbContext context)
    {
        private readonly AppDbContext _db = context;

        public async Task<RefreshToken> CreateToken(Guid userId, string userAgent, int daysValid = 7)
        {
            var token = new RefreshToken
            {
                UserId = userId,
                Token = Guid.NewGuid().ToString(),
                ExpiresAt = DateTime.UtcNow.AddDays(daysValid),
                CreatedAt = DateTime.UtcNow,
                UserAgent = userAgent
            };

            _db.RefreshTokens.Add(token);
            await _db.SaveChangesAsync();
            return token;
        }

        public async Task<RefreshToken?> GetToken(string token)
        {
            return await _db.RefreshTokens
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Token == token && !t.Revoked);
        }

        public async Task RevokeToken(string token)
        {
            var entry = await _db.RefreshTokens.FirstOrDefaultAsync(t => t.Token == token);
            if (entry != null)
            {
                entry.Revoked = true;
                await _db.SaveChangesAsync();
            }
        }

        public async Task<bool> CheckValidity(string refreshToken)
        {
            var tokenEntry = await _db.RefreshTokens
            .FirstOrDefaultAsync(t => t.Token == refreshToken && !t.Revoked);

            if (tokenEntry == null || tokenEntry.ExpiresAt < DateTime.UtcNow) return false;

            return true;
        }
    }
}
