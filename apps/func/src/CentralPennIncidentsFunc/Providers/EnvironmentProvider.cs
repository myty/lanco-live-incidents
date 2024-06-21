using System;
using LancoIncidentsFunc.Interfaces;

namespace LancoIncidentsFunc.Providers
{
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
}
