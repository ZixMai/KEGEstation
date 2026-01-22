using KEGEstation.Presentation.Extensions;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddApplicationServices(builder.Configuration);

var app = builder.Build();
await app.ApplyMigrationsAsync();
app.ConfigureHttpPipeline(builder.Environment);

app.Run();