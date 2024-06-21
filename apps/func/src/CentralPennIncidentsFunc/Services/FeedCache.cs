using System;
using System.Collections.Generic;
using CentralPennIncidentsFunc.Interfaces;
using CentralPennIncidentsFunc.Models;
using Microsoft.Extensions.Caching.Memory;

namespace CentralPennIncidentsFunc.Services
{
    public class FeedCache : IDataCache<string, IEnumerable<Incident>>
    {
        private readonly IMemoryCache _memoryCache;

        public FeedCache(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
        }

        public void SaveValue(string key, IEnumerable<Incident> value)
        {
            using var entry = _memoryCache.CreateEntry(key);
            entry.Value = value;
            entry.AbsoluteExpiration = DateTime.UtcNow.AddSeconds(15);
        }

        public bool TryGetValue(string key, out IEnumerable<Incident> value)
        {
            return _memoryCache.TryGetValue(key, out value);
        }
    }
}
