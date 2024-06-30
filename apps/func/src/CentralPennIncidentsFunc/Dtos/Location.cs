using System.Text.Json.Serialization;

namespace CentralPennIncidentsFunc.Dtos;

public class Location
{
    [JsonPropertyName("lat")]
    public double Lat { get; set; }

    [JsonPropertyName("lng")]
    public double Lng { get; set; }
}
