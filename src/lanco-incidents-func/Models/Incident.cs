using System;
using System.Linq;
using System.Text;

namespace LancoIncidentsFunc.Models
{
    public class Incident
    {
        public Incident(GlobalId globalId)
        {
            GlobalId = globalId;
        }

        public Incident(string globalId)
        {
            GlobalId = new GlobalId(globalId);
        }

        public Incident(string key, string id)
        {
            GlobalId = new GlobalId(key, id);
        }

        public GlobalId GlobalId { get; }
        public DateTime IncidentDate { get; set; }
        public string Type { get; set; }
        public string SubType { get; set; }
        public string Location { get; set; }
        public string Area { get; set; }
        public string[] UnitsAssigned { get; set; }
    }

    public class GlobalId
    {
        public GlobalId(string globalId)
        {
            var splitId = DecodeFrom64(globalId).Split(':');
            var key = splitId.First();
            var id = splitId.Skip(1).First();

            Key = key;
            Id = id;
            Uid = globalId;
        }

        public GlobalId(string key, string id)
        {
            Key = key;
            Id = id;
            Uid = EncodeTo64($"{key}:{id}");
        }

        public string Key { get; }
        public string Id { get; }
        public string Uid { get; }

        private static string DecodeFrom64(string encodedData)
        {
            var encodedDataAsBytes = Convert.FromBase64String(encodedData);
            var returnValue = Encoding.ASCII.GetString(encodedDataAsBytes);
            return returnValue;
        }

        private static string EncodeTo64(string toEncode)
        {
            var toEncodeAsBytes = Encoding.ASCII.GetBytes(toEncode);
            var returnValue = Convert.ToBase64String(toEncodeAsBytes);
            return returnValue;
        }
    }
}
