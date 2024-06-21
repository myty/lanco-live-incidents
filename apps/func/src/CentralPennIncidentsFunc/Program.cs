using System.Collections.Generic;
using System.Threading.Tasks;
using CentralPennIncidentsFunc.IncidentProviders;
using CentralPennIncidentsFunc.Interfaces;
using CentralPennIncidentsFunc.Models;
using CentralPennIncidentsFunc.Providers;
using CentralPennIncidentsFunc.Repositories;
using CentralPennIncidentsFunc.Services;
using CentralPennIncidentsFunc.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace CentralPennIncidentsFunc
{
    public class Program
    {
        static async Task Main(string[] args)
        {
            var host = new HostBuilder()
                .ConfigureFunctionsWorkerDefaults()
                .ConfigureServices(
                    (context, services) =>
                    {
                        services.AddMemoryCache();
                        services.AddHttpClient();

                        services.AddSingleton<IEnvironmentProvider, EnvironmentProvider>();
                        services.AddScoped<ILocationRepository, LocationRepository>();
                        services.AddScoped<ILocationService, LocationService>();
                        services.AddScoped<IFeedService, FeedService>();
                        services.AddSingleton<
                            IDataCache<string, IEnumerable<Incident>>,
                            FeedCache
                        >();
                        services.AddSingleton<
                            IDataCache<(string, string), LocationEntity>,
                            LocationCache
                        >();

                        // Incident Providers
                        services.AddScoped<IIncidentProvider, YorklIncidentProvider>();
                        services.AddScoped<IIncidentProvider, LancasterIncidentProvider>();

                        services.AddAutoMapper(typeof(Program));
                    }
                )
                .Build();

            await host.RunAsync();
        }
    }
}
