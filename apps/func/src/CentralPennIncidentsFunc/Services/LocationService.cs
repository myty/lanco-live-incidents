using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using CentralPennIncidentsFunc.Interfaces;
using CentralPennIncidentsFunc.Models;
using Microsoft.Extensions.Logging;
using QuickType;

namespace CentralPennIncidentsFunc.Services;

public class LocationService(
    ILocationRepository locationRepository,
    IDataCache<(string, string), LocationEntity> locationCache,
    IHttpClientFactory httpClientFactory,
    IEnvironmentProvider env,
    ILogger<LocationService> log
) : ILocationService
{
    const string GEOCODE_API = "https://maps.googleapis.com/maps/api/geocode/json";

    private readonly IDataCache<(string, string), LocationEntity> _locationCache = locationCache;
    private readonly ILocationRepository _locationRepository = locationRepository;
    private readonly HttpClient _client = httpClientFactory.CreateClient();
    private readonly ILogger<LocationService> _log = log;
    private readonly string _googleApiKey = env.GetEnvironmentVariable("GOOGLE_API_KEY");

    public async Task<LocationEntity> GetLocationAsync(string location, string area)
    {
        if (string.IsNullOrEmpty(location) || string.IsNullOrEmpty(area))
        {
            return null;
        }

        var key = (location, area);

        if (_locationCache.TryGetValue(key, out var locationEntity))
        {
            return locationEntity;
        }

        try
        {
            locationEntity = await _locationRepository.FindByAddressAsync(location, area);

            if (locationEntity is null || !locationEntity.Lat_VC.HasValue)
            {
                var address = $"{location}, {area}";

                var geocode = await GetGeocodeAsync(address, _googleApiKey);
                var geocodeLocation = geocode?.Results?.FirstOrDefault()?.Geometry?.Location;
                if (geocodeLocation is null)
                {
                    return null;
                }

                locationEntity = new LocationEntity(area, address)
                {
                    Lat_VC = geocodeLocation.Lat,
                    Lng_VC = geocodeLocation.Lng
                };

                await _locationRepository.SaveAsync(locationEntity);
            }

            _locationCache.SaveValue(key, locationEntity);

            return locationEntity;
        }
        catch (Exception ex)
        {
            _log.LogError(ex, "LocationService.GetLocationAsync");
        }

        return null;
    }

    async Task<Geocode> GetGeocodeAsync(string address, string apiKey)
    {
        var encodedAddress = WebUtility.UrlEncode(address);
        var apiFetchUrl =
            $"{GEOCODE_API}?address={encodedAddress}&key={apiKey}&_={DateTime.Now.Ticks}";

        var res = await _client.GetAsync(apiFetchUrl);
        res.EnsureSuccessStatusCode();

        var json = await res.Content.ReadAsStringAsync();

        return Geocode.FromJson(json);
    }
}
