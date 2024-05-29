using MediatR;
using SecondChair.Api.Queries.Results;

namespace SecondChair.Api.Queries
{
    public class GetCasesQuery : IRequest<GetCasesQueryResult>
    {
    }
}
