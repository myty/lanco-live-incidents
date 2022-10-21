using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LancoIncidentsFunc.Interfaces;
using LancoIncidentsFunc.Models;

namespace LancoIncidentsFunc.Services
{
    public class FeedService : IFeedService
    {
        private readonly IEnumerable<IIncidentProvider> _incidentProviders;

        public FeedService(IEnumerable<IIncidentProvider> incidentProviders)
        {
            _incidentProviders = incidentProviders;
        }

        public async Task<Incident> GetIncidentAsync(GlobalId globalId)
        {
            var incidents = await GetIncidentsAsync();

            return incidents?.FirstOrDefault(i => i.GlobalId.Uid == globalId.Uid);
        }

        public Task<IEnumerable<Incident>> GetIncidentsAsync()
        {
            return Task.WhenAll(_incidentProviders.Select((i) => i.GetIncidentsAsync()))
                .ContinueWith(t => t.Result.SelectMany(i => i));
        }
    }
}
