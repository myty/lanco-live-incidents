using System.Threading.Tasks;
using CentralPennIncidentsFunc.Models;

namespace CentralPennIncidentsFunc.Interfaces;

public interface ILocationService
{
    Task<LocationEntity> GetLocationAsync(string location, string area);
}
