using Microsoft.EntityFrameworkCore;
using Biller.Api.Models;

namespace Biller.Api.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;
        public DbSet<BusinessProfile> BusinessProfiles { get; set; } = null!;
    }


}
