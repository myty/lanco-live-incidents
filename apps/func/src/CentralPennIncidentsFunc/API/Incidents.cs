using System;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using AutoMapper;
using CentralPennIncidentsFunc.Interfaces;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace CentralPennIncidentsFunc.API
{
    public class Incidents
    {
        private readonly IFeedService _feedService;
        private readonly ILocationService _locationService;
        private readonly ILogger<Incidents> _log;
        private readonly IMapper _mapper;

        public Incidents(
            IFeedService feedService,
            ILocationService locationService,
            ILogger<Incidents> log,
            IMapper mapper
        )
        {
            _feedService = feedService;
            _locationService = locationService;
            _log = log;
            _mapper = mapper;
        }

        [Function("incidents")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData req
        )
        {
            _log.LogInformation(
                "api/incidents - HTTP trigger function processed a request. {Request}",
                req
            );

            try
            {
                var incidents = await _feedService.GetIncidentsAsync();

                var incidentDtos = await Task.WhenAll(
                    incidents.Select(async i =>
                    {
                        var dto = _mapper.Map<Dtos.Incident>(i);

                        if (string.IsNullOrWhiteSpace(i.Location))
                        {
                            return dto;
                        }

                        var locationEntity = await _locationService.GetLocationAsync(
                            i.Location,
                            i.Area
                        );

                        dto.GeocodeLocation =
                            (locationEntity?.Lat_VC.HasValue ?? false)
                                ? _mapper.Map<Dtos.Location>(locationEntity)
                                : null;

                        return dto;
                    })
                );

                var response = req.CreateResponse(HttpStatusCode.OK);
                response.Headers.Add("Content-Type", "application/json; charset=utf-8");
                await response.WriteStringAsync(JsonSerializer.Serialize(incidentDtos));

                return response;
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "Execution Error: {Exception}", ex);
                throw;
            }
        }
    }
}
