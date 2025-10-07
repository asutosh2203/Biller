using Biller.Api.Controllers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();

// Add CORS to let frontend talk
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://192.168.142.1:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Change the backend URL
builder.WebHost.UseUrls("http://localhost:5001");

var app = builder.Build();
app.UseCors();
app.MapControllers();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapGet("/health", () => { return Results.Ok("Server is up and running!"); });
// app.MapPost("api/auth/send-otp", () => { });
app.Run();
