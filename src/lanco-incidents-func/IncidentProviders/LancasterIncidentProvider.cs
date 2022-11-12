using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Xml.Linq;
using LancoIncidentsFunc.Interfaces;
using LancoIncidentsFunc.Models;

namespace LancoIncidentsFunc.IncidentProviders;

public class LancasterIncidentProvider : BaseIncidentProvider
{
    private readonly IDataCache<string, IEnumerable<Incident>> _feedCache;
    private readonly HttpClient _client;

    public LancasterIncidentProvider(
        IEnvironmentProvider env,
        IDataCache<string, IEnumerable<Incident>> feedCache,
        IHttpClientFactory httpClientFactory
    ) : base(env)
    {
        _feedCache = feedCache;
        _client = httpClientFactory.CreateClient();
    }

    public override string Key => "Lancaster";

    public override async Task<IEnumerable<Incident>> GetIncidentsAsync()
    {
        if (_feedCache.TryGetValue(Source, out var feed))
        {
            return feed;
        }

        var res = await _client.GetAsync($"{Source}?_={DateTime.Now.Ticks}");
        var xmlStream = await res.Content.ReadAsStreamAsync();

        var cts = new CancellationTokenSource();
        var rss = await XDocument.LoadAsync(xmlStream, LoadOptions.None, cts.Token);

        var incidents = rss.Root
            .Descendants("item")
            .Select(itm =>
            {
                var descSplit = itm.Element("description").Value.Split(';');
                var townshipOrCounty = descSplit[0].Trim();
                var isCounty = townshipOrCounty.ToUpper().Contains("COUNTY");
                var numSections = isCounty ? 1 : 2;
                var typeSplit = itm.Element("title").Value.Split('-');
                var units_assigned =
                    descSplit.Length > numSections
                        ? descSplit[numSections]
                            .ToLower()
                            .Split("<br>")
                            .Select(s => s.Trim().ToUpper())
                        : Enumerable.Empty<string>();

                var incident = new Incident(Key, itm.Element("guid").Value)
                {
                    IncidentDate = DateTime.Parse(itm.Element("pubDate").Value),
                    Type = typeSplit[0].Trim(),
                    SubType = typeSplit.Length > 1 ? typeSplit[1].Trim() : string.Empty,
                    Location = isCounty ? null : descSplit[1].Trim(),
                    Area = townshipOrCounty,
                    UnitsAssigned = units_assigned.ToArray()
                };

                return incident;
            });

        var incidentsTallied = incidents
            .GroupBy(i => $"{i.Location?.Trim()}, {i.Area?.Trim()}")
            .Select(gi =>
            {
                var incident = gi.First();

                incident.UnitsAssigned = gi.SelectMany(i => i.UnitsAssigned).ToArray();

                return incident;
            });

        _feedCache.SaveValue(Source, incidentsTallied);

        return incidentsTallied;
    }
}
