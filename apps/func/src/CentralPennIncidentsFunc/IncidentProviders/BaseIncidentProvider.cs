using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CentralPennIncidentsFunc.Interfaces;
using CentralPennIncidentsFunc.Models;

namespace CentralPennIncidentsFunc.IncidentProviders;

public abstract class BaseIncidentProvider(IEnvironmentProvider env) : IIncidentProvider
{
    private readonly IEnvironmentProvider _env = env;

    public string Source => _env.GetEnvironmentVariable($"IncidentSources__{Key}");

    public abstract string Key { get; }

    public virtual async Task<Incident> GetIncidentAsync(string id)
    {
        var globalId = new GlobalId(id);
        var incidents = await GetIncidentsAsync();

        return incidents?.FirstOrDefault(i => i.GlobalId.Uid == id);
    }

    public abstract Task<IEnumerable<Incident>> GetIncidentsAsync();
}
