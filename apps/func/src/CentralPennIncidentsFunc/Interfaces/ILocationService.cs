using System.Threading.Tasks;
using LancoIncidentsFunc.Models;

namespace LancoIncidentsFunc.Interfaces
{
    public interface ILocationService
    {
        Task<LocationEntity> GetLocationAsync(string location, string area);
    }
}
