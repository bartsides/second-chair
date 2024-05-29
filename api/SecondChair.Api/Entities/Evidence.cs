namespace SecondChair.Api.Entities
{
    public class Evidence
    {
        public Exhibit[] PlaintiffEvidence { get; set; }
        public Exhibit[] DefendantEvidence { get; set; }
        public bool DefendantNumbered { get; set; }
    }
}
