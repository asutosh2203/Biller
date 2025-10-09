using Biller.Api.Services;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddMyAppServices(this IServiceCollection services)
    {
        services.AddScoped<RefreshTokenService>();
        services.AddScoped<UserService>();
        services.AddSingleton<JwtService>();
        return services;
    }
}
