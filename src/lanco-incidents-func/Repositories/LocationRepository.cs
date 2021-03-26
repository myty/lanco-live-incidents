using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using LancoIncidentsFunc.Interfaces;
using LancoIncidentsFunc.Models;
using Microsoft.Azure.Cosmos.Table;

namespace LancoIncidentsFunc.Repositories
{
    public class LocationRepository : ILocationRepository
    {
        private readonly CloudTableClient _tableClient;
        private readonly CloudTable _incidentTable;

        public LocationRepository(IEnvironmentProvider env)
        {
            var connectionString = env.GetEnvironmentVariable("AzureTableStorage");

            // Connect to the Storage account.
            _tableClient = CloudStorageAccount
                .Parse(connectionString)
                .CreateCloudTableClient();

            _incidentTable = _tableClient
                .GetTableReference("IncidentLocations");
        }

        public async Task SaveAsync(ITableEntity locationEntity)
        {
            try
            {
                var insertOperation = TableOperation.InsertOrReplace(locationEntity);

                await _incidentTable.CreateIfNotExistsAsync();
                await _incidentTable.ExecuteAsync(insertOperation);
            }
            catch (Exception ex)
            {
                throw new Exception($"Method: LocationService.SaveAsync, RowKey: {locationEntity.RowKey}", ex);
            }
        }

        public async Task<LocationEntity> FindByAddressAsync(string location, string area)
        {
            var address = $"{location}, {area}";

            try
            {
                if (String.IsNullOrEmpty(location?.Trim()))
                {
                    throw new ArgumentException($"{nameof(location)} is required.");
                }

                var columns = new List<string> { "Lat_VC", "Lng_VC" };
                var retrieveOperation = TableOperation
                    .Retrieve<LocationEntity>(area, WebUtility.UrlEncode(address), columns);

                await _incidentTable.CreateIfNotExistsAsync();
                var result = await _incidentTable.ExecuteAsync(retrieveOperation);

                return (LocationEntity)result.Result;
            }
            catch (Exception ex)
            {
                throw new Exception($"Method: LocationService.FindByAddressAsync, RowKey: {address}", ex);
            }
        }
    }
}
