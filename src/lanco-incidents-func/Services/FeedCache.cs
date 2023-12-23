using System;
using System.Collections.Generic;
using LancoIncidentsFunc.Interfaces;
using LancoIncidentsFunc.Models;
using Microsoft.Extensions.Caching.Memory;

namespace LancoIncidentsFunc.Services
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
