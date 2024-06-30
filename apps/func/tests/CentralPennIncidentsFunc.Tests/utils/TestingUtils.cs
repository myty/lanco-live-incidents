using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using FakeItEasy;

namespace CentralPennIncidentsFunc.Tests.Utils;

public static class TestingUtils
{
    public static IHttpClientFactory MockHttpClientFactory(string fixturePath)
    {
        var pageContent = File.ReadAllText(fixturePath);

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
