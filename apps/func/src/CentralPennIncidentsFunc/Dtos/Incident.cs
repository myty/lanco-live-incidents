using System;
using System.Text.Json.Serialization;

namespace CentralPennIncidentsFunc.Dtos
{
    public class Incident
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("incident_dt")]
        public DateTime IncidentDate { get; set; }

        [JsonPropertyName("type")]
        public string Type { get; set; }

        [JsonPropertyName("subType")]
        public string SubType { get; set; }

        [JsonPropertyName("location")]
        public string Location { get; set; }

        [JsonPropertyName("area")]
        public string Area { get; set; }

        [JsonPropertyName("units_assigned")]
        public string[] UnitsAssigned { get; set; }

        [JsonPropertyName("geocode_location")]
        public Location GeocodeLocation { get; set; }
    }
}
