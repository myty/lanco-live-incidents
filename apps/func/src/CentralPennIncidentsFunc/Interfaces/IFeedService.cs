using System.Collections.Generic;
using System.Threading.Tasks;
using CentralPennIncidentsFunc.Models;

namespace CentralPennIncidentsFunc.Interfaces;

public interface IFeedService
{
    Task<Incident> GetIncidentAsync(GlobalId globalId);
    Task<IEnumerable<Incident>> GetIncidentsAsync();
}
