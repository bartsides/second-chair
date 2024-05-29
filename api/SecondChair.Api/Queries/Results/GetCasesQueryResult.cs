using SecondChair.Api.ViewModels;

namespace SecondChair.Api.Queries.Results
{
    public class GetCasesQueryResult
    {
        public IList<CaseSummary> CaseSummaries { get; set; }
    }
}
