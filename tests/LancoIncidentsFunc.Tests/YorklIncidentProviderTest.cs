using FakeItEasy;
using LancoIncidentsFunc.IncidentProviders;
using LancoIncidentsFunc.Interfaces;
using LancoIncidentsFunc.Models;
using LancoIncidentsFunc.Tests.Utils;

namespace LancoIncidentsFunc.Tests;

public class YorklIncidentProviderTest
{
    public static YorklIncidentProvider SetupSut()
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

        return new YorklIncidentProvider(
            env: environmentProvider,
            feedCache: A.Fake<IDataCache<string, IEnumerable<Incident>>>(),
            httpClientFactory: TestingUtils.MockHttpClientFactory("./fixtures/york.html")
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
        Assert.True(incidents.Count() == 4);
    }
}
