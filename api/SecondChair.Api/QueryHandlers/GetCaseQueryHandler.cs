using AutoMapper;
using MediatR;
using SecondChair.Api.Entities;
using SecondChair.Api.Queries;
using SecondChair.Api.Queries.Results;
using SecondChair.Api.ViewModels;

namespace SecondChair.Api.QueryHandlers
{
    public class GetCaseQueryHandler(SecondChairContext context, IMapper mapper) 
        : IRequestHandler<GetCaseQuery, GetCaseQueryResult>
    {
        private readonly SecondChairContext context = context;
        private readonly IMapper mapper = mapper;

        public async Task<GetCaseQueryResult> Handle(GetCaseQuery request, CancellationToken cancellationToken)
        {
            var caseEntity = await context.Cases.FindAsync(request.CaseId, cancellationToken);
            return new GetCaseQueryResult { CaseDetails = mapper.Map<CaseDetails>(caseEntity) };
        }
    }
}
