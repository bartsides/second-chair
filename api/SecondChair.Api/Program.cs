using MediatR;
using Microsoft.EntityFrameworkCore;
using SecondChair.Api.Commands;
using SecondChair.Api.Entities;
using SecondChair.Api.Queries;

var origins = "SecondChairOrigins";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<Program>());
builder.Services.AddSqlServer<SecondChairContext>(builder.Configuration.GetConnectionString("SecondChair"));
builder.Services.AddAutoMapper(typeof(Program));

builder.Services.AddCors(o => 
    o.AddPolicy(origins, policy => policy
        .WithOrigins("https://localhost:4200", "http://localhost:4200")
        .AllowAnyHeader()
        .AllowAnyMethod()));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(origins);

var scope = app.Services.CreateScope();
var databaseContext = scope.ServiceProvider.GetService<SecondChairContext>();
databaseContext?.Database.Migrate();

var casesApi = app.MapGroup("/cases").WithOpenApi();
casesApi.MapGet("/", async (IMediator mediator) =>
    Results.Ok(await mediator.Send(new GetCasesQuery())));
casesApi.MapGet("/{caseId}", async (IMediator mediator, Guid caseId) =>
    Results.Ok(await mediator.Send(new GetCaseQuery(caseId))));
casesApi.MapPost("/", async (IMediator mediator, AddCaseCommand command) =>
{
    await mediator.Send(command);
    return Results.Ok();
});

app.Run();

