using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CentralPennIncidentsFunc.Interfaces;
using CentralPennIncidentsFunc.Models;
using Microsoft.Extensions.Logging;

namespace CentralPennIncidentsFunc.Services;

public class FeedService : IFeedService
{
    private readonly IEnumerable<IIncidentProvider> _incidentProviders;
    private readonly ILogger<FeedService> _logger;

    public FeedService(
        IEnumerable<IIncidentProvider> incidentProviders,
        ILogger<FeedService> logger
    )
    {
        _incidentProviders = incidentProviders;
        _logger = logger;
    }

    public async Task<Incident> GetIncidentAsync(GlobalId globalId)
    {
        var incidents = await GetIncidentsAsync();

        return incidents?.FirstOrDefault(i => i.GlobalId.Uid == globalId.Uid);
    }

    public Task<IEnumerable<Incident>> GetIncidentsAsync()
    {
        return Task.WhenAll(
                _incidentProviders.Select(
                    async (i) =>
                    {
                        try
                        {
                            return await i.GetIncidentsAsync();
                        }
                        catch (System.Exception ex)
                        {
                            _logger.LogError(
                                ex,
                                $"Exception occured when calling GetIncidentsAsync",
                                $"Provider: {i.Key}"
                            );
                        }

                        return Enumerable.Empty<Incident>();
                    }
                )
            )
            .ContinueWith(t => t.Result.SelectMany(i => i));
    }
}
