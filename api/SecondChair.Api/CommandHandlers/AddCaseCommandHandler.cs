using MediatR;
using SecondChair.Api.Commands;
using SecondChair.Api.Entities;

namespace SecondChair.Api.CommandHandlers
{
    public class AddCaseCommandHandler(SecondChairContext context) : IRequestHandler<AddCaseCommand>
    {
        private readonly SecondChairContext context = context;

        public async Task Handle(AddCaseCommand request, CancellationToken cancellationToken)
        {
            await context.BeginTransactionAsync();

            var entity = Case.Create(request.Id, request.Name, request.Strikes.Total, 
                request.Strikes.Plaintiff, request.Strikes.Defendant);
            context.Add(entity);
            await context.SaveChangesAsync(cancellationToken);

            await context.CloseTransactionAsync();
        }
    }
}
