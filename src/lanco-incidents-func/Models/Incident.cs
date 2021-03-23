using System;

namespace LancoIncidentsFunc.Models
{
    public class Incident
    {
        public Guid Id { get; set; }
        public DateTime IncidentDate { get; set; }
        public string Type { get; set; }
        public string SubType { get; set; }
        public string Location { get; set; }
        public string Area { get; set; }
        public string[] UnitsAssigned { get; set; }
    }
}
