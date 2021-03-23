using System;

namespace LancoIncidentsFunc.Interfaces
{
    public interface IEnvironmentProvider
    {
        string GetEnvironmentVariable(string variable, EnvironmentVariableTarget target = EnvironmentVariableTarget.Process);
    }
}