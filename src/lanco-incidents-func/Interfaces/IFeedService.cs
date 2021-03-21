using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using LancoIncidentsFunc.Models;

namespace LancoIncidentsFunc.Interfaces
{
    public interface IFeedService
    {
        Task<Incident> GetIncidentAsync(Guid id);
        Task<IEnumerable<Incident>> GetIncidentsAsync();
    }
}
