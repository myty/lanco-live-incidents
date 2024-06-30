using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using CentralPennIncidentsFunc.Interfaces;
using CentralPennIncidentsFunc.Models;
using Microsoft.Azure.Cosmos.Table;

namespace CentralPennIncidentsFunc.Repositories;

public class LocationRepository : ILocationRepository
{
    private readonly CloudTableClient _tableClient;
    private readonly CloudTable _incidentTable;

    public LocationRepository(IEnvironmentProvider env)
    {
        var connectionString = env.GetEnvironmentVariable("AzureTableStorage");

        // Connect to the Storage account.
        _tableClient = CloudStorageAccount.Parse(connectionString).CreateCloudTableClient();

        _incidentTable = _tableClient.GetTableReference("IncidentLocations");
    }

    public async Task SaveAsync(ITableEntity locationEntity)
    {
        try
        {
            await _incidentTable.CreateIfNotExistsAsync();

            var insertOperation = TableOperation.InsertOrReplace(locationEntity);
            await _incidentTable.ExecuteAsync(insertOperation);
        }
        catch (Exception ex)
        {
            throw new SaveException(locationEntity.RowKey, ex);
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
            var retrieveOperation = TableOperation.Retrieve<LocationEntity>(
                area,
                WebUtility.UrlEncode(address),
                columns
            );

            await _incidentTable.CreateIfNotExistsAsync();
            var result = await _incidentTable.ExecuteAsync(retrieveOperation);

            return (LocationEntity)result.Result;
        }
        catch (Exception ex)
        {
            throw new FindByAddressException(address, ex);
        }
    }

    public class FindByAddressException(string key, Exception ex)
        : Exception($"Method: LocationRepository.FindByAddressAsync, RowKey: {key}", ex) { }

    public class SaveException(string key, Exception ex)
        : Exception($"Method: LocationRepository.SaveAsync, RowKey: {key}", ex) { }
}
