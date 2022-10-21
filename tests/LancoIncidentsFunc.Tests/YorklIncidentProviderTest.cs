using FakeItEasy;
using LancoIncidentsFunc.IncidentProviders;
using LancoIncidentsFunc.Interfaces;
using LancoIncidentsFunc.Models;
using System.Net;

namespace LancoIncidentsFunc.Tests;

public class YorklIncidentProviderTest
{
    public YorklIncidentProviderTest() { }

    public YorklIncidentProvider SetupSut()
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
            httpClientFactory: SetupDefaultPageHttpClientFactory()
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
        Assert.True(incidents.Count() >= 4);
    }

    private static IHttpClientFactory SetupDefaultPageHttpClientFactory()
    {
        var pageContent = File.ReadAllText("./fixtures/default.html");

        var handler = A.Fake<HttpMessageHandler>();
        var response = new HttpResponseMessage
        {
            StatusCode = HttpStatusCode.OK,
            Content = new StringContent(pageContent)
        };

        A.CallTo(handler)
            .Where(x => x.Method.Name == "SendAsync")
            .WithReturnType<Task<HttpResponseMessage>>()
            .Returns(Task.FromResult(response));

        var httpClient = new HttpClient(handler);
        var httpClientFactory = A.Fake<IHttpClientFactory>();
        A.CallTo(() => httpClientFactory.CreateClient(A<string>.Ignored)).Returns(httpClient);

        return httpClientFactory;
    }
}
