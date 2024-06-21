using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using CentralPennIncidentsFunc.Interfaces;
using CentralPennIncidentsFunc.Models;
using HtmlAgilityPack;
using Microsoft.OData.Edm;

namespace CentralPennIncidentsFunc.IncidentProviders;

public class YorklIncidentProvider : BaseIncidentProvider
{
    private readonly IDataCache<string, IEnumerable<Incident>> _feedCache;
    private readonly HttpClient _client;

    public YorklIncidentProvider(
        IEnvironmentProvider env,
        IDataCache<string, IEnumerable<Incident>> feedCache,
        IHttpClientFactory httpClientFactory
    )
        : base(env)
    {
        _feedCache = feedCache;
        _client = httpClientFactory.CreateClient();
    }

    public override string Key => "York";

    public override async Task<IEnumerable<Incident>> GetIncidentsAsync()
    {
        if (_feedCache.TryGetValue(Source, out var feed))
        {
            return feed;
        }

        var res = await _client.GetAsync($"{Source}?_={DateTime.Now.Ticks}");
        var htmlSource = await res.Content.ReadAsStringAsync();

        var doc = new HtmlDocument();
        doc.LoadHtml(htmlSource);

        var incidents = doc
            .DocumentNode.Descendants("table")
            .Where(x => x.Attributes["class"]?.Value == "incidentList")
            .SelectMany(y =>
                y.ChildNodes.Skip(2)
                    .Select(tr =>
                        tr.ChildNodes.Where(node => node.NodeType == HtmlNodeType.Element).ToList()
                    )
                    .Where(cells => cells.Count > 0)
                    .Select(cells =>
                    {
                        var type = cells.FirstOrDefault()?.InnerText;
                        var subType = cells.Skip(3).FirstOrDefault()?.InnerText;
                        var street = cells.Skip(4).FirstOrDefault()?.InnerText;
                        var crossStreet = cells.Skip(5).FirstOrDefault()?.InnerText;
                        var nearestIntersection = cells.Skip(6).FirstOrDefault()?.InnerText;
                        var area = cells.Skip(7).FirstOrDefault()?.InnerText;
                        var date = cells.Skip(1)?.FirstOrDefault()?.InnerText;
                        var id =
                            cells
                                .Skip(8)
                                ?.FirstOrDefault()
                                ?.InnerHtml.Split('?')
                                .Skip(1)
                                .FirstOrDefault()
                                ?.Split('"')
                                .FirstOrDefault() ?? $"{Guid.NewGuid()}";

                        return new Incident(Key, id)
                        {
                            Type = type,
                            SubType = subType,
                            Area = area,
                            Location = FormatLocation(street, crossStreet, nearestIntersection),
                            IncidentDate = Date.Parse(date)
                        };
                    })
            )
            .ToList();

        _feedCache.SaveValue(Source, incidents);

        return incidents;
    }

    private static string FormatLocation(
        string street,
        string crossStreet,
        string nearestIntersection
    )
    {
        if (!string.IsNullOrWhiteSpace(nearestIntersection))
        {
            return nearestIntersection;
        }

        return $"{street} / {crossStreet}";
    }
}
