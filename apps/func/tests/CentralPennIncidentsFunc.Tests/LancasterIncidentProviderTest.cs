using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CentralPennIncidentsFunc.IncidentProviders;
using CentralPennIncidentsFunc.Interfaces;
using CentralPennIncidentsFunc.Models;
using CentralPennIncidentsFunc.Tests.Utils;
using FakeItEasy;

namespace CentralPennIncidentsFunc.Tests;

public class LancasterlIncidentProviderTest
{
    public static LancasterIncidentProvider SetupSut()
    {
        var environmentProvider = A.Fake<IEnvironmentProvider>();

        A.CallTo(
                () =>
                    environmentProvider.GetEnvironmentVariable(
                        A<string>.Ignored,
                        A<EnvironmentVariableTarget>.Ignored
                    )
            )
            .Returns("http://faked.url.com");

        return new LancasterIncidentProvider(
            env: environmentProvider,
            feedCache: A.Fake<IDataCache<string, IEnumerable<Incident>>>(),
            httpClientFactory: TestingUtils.MockHttpClientFactory("./fixtures/lancaster.html")
        );
    }

    [Fact]
    public async Task When_GetIncidentsAsync_It_Returns_Results()
    {
        // Arrange
        var sut = SetupSut();

        // Act
        var incidents = await sut.GetIncidentsAsync();

        // Assert
        Assert.NotEmpty(incidents);
        Assert.Equal(6, incidents.Count());
    }

    [Fact]
    public async Task When_GetIncidentsAsync_GlobalId_It_Has_Correct_Key()
    {
        // Arrange
        var sut = SetupSut();

        // Act
        var incidents = await sut.GetIncidentsAsync();
        var incident = incidents.First();

        // Assert
        Assert.True(incident.GlobalId.Key == sut.Key);
    }

    [Fact]
    public async Task When_GetIncidentsAsync_GlobalId_It_Has_Correct_Uid()
    {
        // Arrange
        var sut = SetupSut();
        var expectedUid = "TGFuY2FzdGVyOjkxYjkzMjc5LTIyNWUtNDQxMi05NGY3LWE5N2JjNWVhZmVkOQ==";

        // Act
        var incidents = await sut.GetIncidentsAsync();
        var incident = incidents.First();

        // Assert
        Assert.True(incident.GlobalId.Uid == expectedUid);
    }
}
