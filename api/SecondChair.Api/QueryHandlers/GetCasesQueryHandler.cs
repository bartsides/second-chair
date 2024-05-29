using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SecondChair.Api.Queries;
using SecondChair.Api.Queries.Results;
using SecondChair.Api.ViewModels;
using SecondChair.Api.Entities;

namespace SecondChair.Api.QueryHandlers
{
    public class GetCasesQueryHandler : IRequestHandler<GetCasesQuery, GetCasesQueryResult>
    {
        private readonly SecondChairContext context;
        private readonly IMapper mapper;

        public GetCasesQueryHandler(SecondChairContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<GetCasesQueryResult> Handle(GetCasesQuery request, CancellationToken cancellationToken)
        {
            var cases = await context.Cases.ToListAsync(cancellationToken);
            return new GetCasesQueryResult() { CaseSummaries = mapper.Map<IList<CaseSummary>>(cases) };
        }
    }
}
