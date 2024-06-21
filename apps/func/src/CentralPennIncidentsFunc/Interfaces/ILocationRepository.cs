using System.Threading.Tasks;
using CentralPennIncidentsFunc.Models;
using Microsoft.Azure.Cosmos.Table;

namespace CentralPennIncidentsFunc.Interfaces
{
    public interface ILocationRepository
    {
        Task SaveAsync(ITableEntity locationEntity);
        Task<LocationEntity> FindByAddressAsync(string location, string area);
    }
}
