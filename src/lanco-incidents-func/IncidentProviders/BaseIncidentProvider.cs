using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LancoIncidentsFunc.Interfaces;
using LancoIncidentsFunc.Models;

namespace LancoIncidentsFunc.IncidentProviders
{
    public abstract class BaseIncidentProvider : IIncidentProvider
    {
        private readonly IEnvironmentProvider _env;

        public BaseIncidentProvider(IEnvironmentProvider env)
        {
            _env = env;
        }

        public string RssFeed => _env.GetEnvironmentVariable($"RSS_FEED_{Key}");

        public abstract string Key { get; }

        public async Task<Incident> GetIncidentAsync(Guid id)
        {
            var incidents = await GetIncidentsAsync();

            return incidents?.FirstOrDefault(i => i.Id == id);
        }

        public abstract Task<IEnumerable<Incident>> GetIncidentsAsync();
    }
}
