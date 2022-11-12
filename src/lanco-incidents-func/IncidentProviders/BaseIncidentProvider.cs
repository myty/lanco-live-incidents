using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LancoIncidentsFunc.Interfaces;
using LancoIncidentsFunc.Models;

namespace LancoIncidentsFunc.IncidentProviders;

public abstract class BaseIncidentProvider : IIncidentProvider
{
    private readonly IEnvironmentProvider _env;

    public BaseIncidentProvider(IEnvironmentProvider env)
    {
        _env = env;
    }

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
