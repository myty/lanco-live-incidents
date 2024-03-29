using System.Collections.Generic;
using System.Threading.Tasks;
using LancoIncidentsFunc.IncidentProviders;
using LancoIncidentsFunc.Interfaces;
using LancoIncidentsFunc.Models;
using LancoIncidentsFunc.Providers;
using LancoIncidentsFunc.Repositories;
using LancoIncidentsFunc.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace LancoIncidentsFunc
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
