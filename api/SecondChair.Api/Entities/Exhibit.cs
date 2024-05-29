namespace SecondChair.Api.Entities
{
    public class Exhibit
    {
        public Guid Id { get; set; }
        public string Marker { get; set; }
        public string Description { get; set; }
        public string Notes { get; set; }
        public string SupportingWitness { get; set; }
        public string AdmittanceStoplight { get; set; }
    }
}
