using System.Net;
using Microsoft.Azure.Cosmos.Table;

namespace CentralPennIncidentsFunc.Models;

public class LocationEntity : TableEntity
{
    public LocationEntity(string skey, string srow)
    {
        this.PartitionKey = skey;
        this.RowKey = WebUtility.UrlEncode(srow);
    }

    public LocationEntity() { }

    public double? Lat_VC { get; set; }
    public double? Lng_VC { get; set; }
}
