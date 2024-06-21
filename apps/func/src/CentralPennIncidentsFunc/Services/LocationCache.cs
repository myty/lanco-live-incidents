using System;
using CentralPennIncidentsFunc.Interfaces;
using CentralPennIncidentsFunc.Models;
using Microsoft.Extensions.Caching.Memory;

namespace CentralPennIncidentsFunc.Services;

public class LocationCache(IMemoryCache memoryCache) : IDataCache<(string, string), LocationEntity>
{
    private readonly IMemoryCache _memoryCache = memoryCache;

    public void SaveValue((string, string) key, LocationEntity value)
    {
        using var entry = _memoryCache.CreateEntry(key);
        entry.Value = value;
        entry.AbsoluteExpiration = DateTime.UtcNow.AddHours(24);
    }

    public bool TryGetValue((string, string) key, out LocationEntity value)
    {
        return _memoryCache.TryGetValue(key, out value);
    }
}
