namespace SecondChair.Api.Entities
{
    public class Case
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Strikes Strikes { get; set; }
        public ICollection<Juror> Jurors { get; set; }

        public Case() { }

        protected Case(Guid id, string name, int totalStrikes, int plaintiffStrikes, 
            int defendantStrikes)
        {
            Id = id;
            Name = name;
            Strikes = new Strikes { Total = totalStrikes, Plaintiff = plaintiffStrikes, Defendant = defendantStrikes };
        }

        public static Case Create(Guid id, string name, int totalStrikes, 
           int plaintiffStrikes, int defendantStrikes)
        {
            return new Case(id, name, totalStrikes, plaintiffStrikes, defendantStrikes);
        }
    }
}
