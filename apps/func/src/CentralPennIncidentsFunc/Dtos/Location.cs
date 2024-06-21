using System.Text.Json.Serialization;

namespace LancoIncidentsFunc.Dtos
{
    public class Location
    {
        [JsonPropertyName("lat")]
        public double Lat { get; set; }

        [JsonPropertyName("lng")]
        public double Lng { get; set; }
    }
}
