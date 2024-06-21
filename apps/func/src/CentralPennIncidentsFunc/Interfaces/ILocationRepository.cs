using System.Threading.Tasks;
using LancoIncidentsFunc.Models;
using Microsoft.Azure.Cosmos.Table;

namespace LancoIncidentsFunc.Interfaces
{
    public interface ILocationRepository
    {
        Task SaveAsync(ITableEntity locationEntity);
        Task<LocationEntity> FindByAddressAsync(string location, string area);
    }
}
