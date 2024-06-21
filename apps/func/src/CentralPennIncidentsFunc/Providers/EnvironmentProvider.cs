using System;
using CentralPennIncidentsFunc.Interfaces;

namespace CentralPennIncidentsFunc.Providers;

public class EnvironmentProvider : IEnvironmentProvider
{
    public string GetEnvironmentVariable(
        string variable,
        EnvironmentVariableTarget target = EnvironmentVariableTarget.Process
    )
    {
        return Environment.GetEnvironmentVariable(variable, target);
    }
}
