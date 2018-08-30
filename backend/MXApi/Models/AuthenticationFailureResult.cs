using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;

namespace MXApi.Filters
{
  public class AuthenticationFailureResult : IHttpActionResult
  {
    public AuthenticationFailureResult(string reasonPhrase, HttpRequestMessage request)
    {
      ReasonPhrase = reasonPhrase;
      Request = request;
    }

    public string ReasonPhrase { get; private set; }

    public HttpRequestMessage Request { get; private set; }

    public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
    {
      return Task.FromResult(Execute());
    }

    private HttpResponseMessage Execute()
    {
      HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
      response.RequestMessage = Request;
      response.ReasonPhrase = ReasonPhrase;
      return response;
    }
  }

  public class AddChallengeOnUnauthorizedResult : IHttpActionResult
  {
    public AddChallengeOnUnauthorizedResult(AuthenticationHeaderValue challenge, IHttpActionResult innerResult)
    {
      Challenge = challenge;
      InnerResult = innerResult;
    }

    public AuthenticationHeaderValue Challenge { get; private set; }

    public IHttpActionResult InnerResult { get; private set; }

    public async Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
    {
      HttpResponseMessage response = await InnerResult.ExecuteAsync(cancellationToken);

      if (response.StatusCode == HttpStatusCode.Unauthorized)
      {
        // Only add one challenge per authentication scheme.
        if (!response.Headers.WwwAuthenticate.Any((h) => h.Scheme == Challenge.Scheme))
        {
          response.Headers.WwwAuthenticate.Add(Challenge);
        }
      }

      return response;
    }
  }
}