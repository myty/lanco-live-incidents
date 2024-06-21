using System;

namespace CentralPennIncidentsFunc.Interfaces
{
    public interface IEnvironmentProvider
    {
        string GetEnvironmentVariable(
            string variable,
            EnvironmentVariableTarget target = EnvironmentVariableTarget.Process
        );
    }
}
