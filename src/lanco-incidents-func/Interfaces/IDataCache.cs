using System.Collections.Generic;
using LancoIncidentsFunc.Models;

namespace LancoIncidentsFunc.Interfaces
{
    public interface IDataCache<TKey, TValue>
    {
        bool TryGetValue(TKey key, out TValue value);
        void SaveValue(TKey key, TValue value);
    }
}
