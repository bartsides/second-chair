using MediatR;
using SecondChair.Api.Queries.Results;

namespace SecondChair.Api.Queries
{
    public class GetCaseQuery : IRequest<GetCaseQueryResult>
    {
        public Guid CaseId { get; set; }

        public GetCaseQuery(Guid caseId)
        {
            CaseId = caseId;
        }
    }
}
