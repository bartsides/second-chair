using MediatR;

namespace SecondChair.Api.Commands
{
    public class AddCaseCommand : IRequest
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Strikes Strikes { get; set; }
    }

    public class Strikes
    {
        public int Total { get; set; }
        public int Plaintiff { get; set; }
        public int Defendant { get; set; }
    }
}
