namespace SecondChair.Api.ViewModels
{
    public class Juror
    {
        public Guid Id { get; set; }
        public Guid CaseId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Stoplight { get; set; }
        public string Notes { get; set; }
        public string Selected { get; set; }
        public int Number { get; set; }
        public decimal? PositionX { get; set; }
        public decimal? PositionY { get; set; }
    }
}
