using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using LancoIncidentsFunc.Interfaces;
using LancoIncidentsFunc.Models;
using QuickType;

namespace LancoIncidentsFunc.Services
{
    public class LocationService : ILocationService
    {
        private readonly IDataCache<(string, string), LocationEntity> _locationCache;
        private readonly ILocationRepository _locationRepository;
        private readonly HttpClient _client;
        private readonly ILogger<LocationService> _log;
        private readonly string _googleApiKey;

        public LocationService(
            ILocationRepository locationRepository,
            IDataCache<(string, string), LocationEntity> locationCache,
            IHttpClientFactory httpClientFactory,
            IEnvironmentProvider env,
            ILogger<LocationService> log)
        {
            _locationCache = locationCache;
            _locationRepository = locationRepository;
            _log = log;
            _client = httpClientFactory.CreateClient();
            _googleApiKey = env.GetEnvironmentVariable("GOOGLE_API_KEY");
        }

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
            var apiBaseUrl = "https://maps.googleapis.com/maps/api/geocode/json";
            var encodedAddress = WebUtility.UrlEncode(address);
            var apiFetchUrl = $"{apiBaseUrl}?address={encodedAddress}&key={apiKey}&_={DateTime.Now.Ticks}";

            var res = await _client.GetAsync(apiFetchUrl);
            res.EnsureSuccessStatusCode();

            var json = await res.Content.ReadAsStringAsync();

            return Geocode.FromJson(json);
        }
    }
}
