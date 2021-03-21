using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Xml.Linq;
using LancoIncidentsFunc.Interfaces;
using LancoIncidentsFunc.Models;

namespace LancoIncidentsFunc.Services
{
    public class FeedService : IFeedService
    {
        const string RSS_FEED = "https://webcad.lcwc911.us/Pages/Public/LiveIncidentsFeed.aspx";

        private readonly IDataCache<string, IEnumerable<Incident>> _feedCache;
        private readonly HttpClient _client;

        public FeedService(
            IHttpClientFactory httpClientFactory,
            IDataCache<string, IEnumerable<Incident>> feedCache)
        {
            _feedCache = feedCache;
            _client = httpClientFactory.CreateClient();
        }

        public async Task<Incident> GetIncidentAsync(Guid id)
        {
            var incidents = await GetIncidentsAsync();

            return incidents?.FirstOrDefault(i => i.Id == id);
        }

        public async Task<IEnumerable<Incident>> GetIncidentsAsync()
        {
            if (_feedCache.TryGetValue(RSS_FEED, out var feed))
            {
                return feed;
            }

            var res = await _client.GetAsync($"{RSS_FEED}?_={DateTime.Now.Ticks}");
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
                    var units_assigned = descSplit.Length > numSections ?
                        descSplit[numSections]
                            .ToLower()
                            .Split("<br>")
                            .Select(s => s.Trim().ToUpper()) :
                        Enumerable.Empty<string>();

                    var incident = new Incident
                    {
                        Id = Guid.Parse(itm.Element("guid").Value),
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

                    incident.UnitsAssigned = gi
                        .SelectMany(i => i.UnitsAssigned)
                        .ToArray();

                    return incident;
                });

            _feedCache.SaveValue(RSS_FEED, incidentsTallied);

            return incidentsTallied;
        }
    }
}
