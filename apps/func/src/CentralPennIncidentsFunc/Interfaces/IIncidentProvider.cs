using System.Collections.Generic;
using System.Threading.Tasks;
using CentralPennIncidentsFunc.Models;

namespace CentralPennIncidentsFunc.Interfaces;

public interface IIncidentProvider
{
    string Key { get; }
    Task<Incident> GetIncidentAsync(string id);
    Task<IEnumerable<Incident>> GetIncidentsAsync();
}
