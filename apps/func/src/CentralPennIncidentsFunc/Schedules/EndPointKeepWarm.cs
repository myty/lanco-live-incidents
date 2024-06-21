using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using LancoIncidentsFunc.Interfaces;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace LancoIncidentsFunc.Schedules
{
    public class EndPointKeepWarm
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<EndPointKeepWarm> _log;
        private readonly IEnvironmentProvider _env;

        public EndPointKeepWarm(
            IHttpClientFactory httpClientFactory,
            ILogger<EndPointKeepWarm> log,
            IEnvironmentProvider env
        )
        {
            _env = env;
            _log = log;
            _httpClient = httpClientFactory.CreateClient();
        }

        // run every 15 minutes..
        [Function("EndPointKeepWarm")]
        public async Task Run([TimerTrigger("0 */4 * * * *")] MyInfo timerInfo)
        {
            _log.LogInformation(
                "Function Ran. Next timer schedule = {TimerSchedule}",
                timerInfo.ScheduleStatus.Next
            );

            _log.LogInformation(
                "Run(): EndPointKeepWarm function executed at: {Now}. Past due? {PastDue}",
                DateTime.Now,
                timerInfo.IsPastDue
            );

            foreach (var endpointFunc in GetEndpoints())
            {
                try
                {
                    var endpoint = endpointFunc();

                    _log.LogInformation("Run(): About to hit URL: '{Endpoint}'", endpoint);
                    _ = await HitUrl(endpoint);
                }
                catch (Exception ex)
                {
                    _log.LogError(ex, "{Message}", ex.Message);
                }
            }

            _log.LogInformation($"Run(): Completed.");
        }

        private IEnumerable<Func<string>> GetEndpoints()
        {
            var endPointsString = _env.GetEnvironmentVariable("EndPointUrls");

            if (!string.IsNullOrEmpty(endPointsString))
            {
                string[] endPoints = endPointsString.Split(';');
                foreach (string endPoint in endPoints)
                {
                    yield return () => endPoint.Trim();
                }
            }
            else
            {
                yield return () =>
                    throw new Exception(
                        $"Run(): No URLs specified in environment variable 'EndPointUrls'. Expected a single URL or multiple URLs "
                            + "separated with a semi-colon (;). Please add this config to use the tool."
                    );
            }
        }

        private async Task<HttpResponseMessage> HitUrl(string url)
        {
            HttpResponseMessage response = await _httpClient.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                _log.LogInformation("hitUrl(): Successfully hit URL: '{Url}'", url);
            }
            else
            {
                _log.LogError(
                    "hitUrl(): Failed to hit URL: '{Url}'. Response: {StatusCode}:{ReasonPhrase}",
                    url,
                    (int)response.StatusCode,
                    response.ReasonPhrase
                );
            }

            return response;
        }

        public class MyInfo
        {
            public MyScheduleStatus ScheduleStatus { get; set; }
            public bool IsPastDue { get; set; }
        }

        public class MyScheduleStatus
        {
            public DateTime Last { get; set; }
            public DateTime Next { get; set; }
            public DateTime LastUpdated { get; set; }
        }
    }
}
