using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Filters;
using System.Web.Http.Results;

namespace MXApi.Filters
{
  public class BasicAuthorizeFilter : IAuthenticationFilter
  {
    private string _password;

    public BasicAuthorizeFilter()
    {
      _password = ConfigurationManager.AppSettings["BasicAuthPassword"];
    }

    public virtual bool AllowMultiple
    {
      get { return false; }
    }

    public async Task AuthenticateAsync(HttpAuthenticationContext context, CancellationToken cancellationToken)
    {
      HttpRequestMessage request = context.Request;
      AuthenticationHeaderValue authorization = request.Headers.Authorization;

      if (authorization != null && authorization.Scheme.Equals("basic", StringComparison.OrdinalIgnoreCase))
      {
        Tuple<string, string> userNameAndPasword = ExtractUserNameAndPassword(authorization.Parameter);
        string username = userNameAndPasword.Item1;
        string password = userNameAndPasword.Item2;
        // Check if login is correct
        if (IsAuthorized(username, password))
        {
          context.Principal = GetPrincipal(username, password);
          HttpContext.Current.Response.Headers.Add("Access-Control-Expose-Headers", Constants.DeviceIdHeader);
          HttpContext.Current.Response.Headers.Add(Constants.DeviceIdHeader, username);
          return;
        }
      }

#if DEBUG
      HttpContext.Current.Response.Headers.Add("Access-Control-Expose-Headers", Constants.DeviceIdHeader);
      HttpContext.Current.Response.Headers.Add(Constants.DeviceIdHeader, Constants.DefaultDeviceId);
#else
      context.ErrorResult = new UnauthorizedResult(
      new AuthenticationHeaderValue[] { new AuthenticationHeaderValue("Basic", "realm=Web") },
      context.Request);
#endif

      await Task.FromResult(0);
    }

    public Task ChallengeAsync(HttpAuthenticationChallengeContext context, CancellationToken cancellationToken)
    {
      var challenge = new AuthenticationHeaderValue("Basic", "realm=Web");
      context.Result = new AddChallengeOnUnauthorizedResult(challenge, context.Result);
      return Task.FromResult(0);
    }

    public bool IsAuthorized(string username, string password)
    {
      // Check that username and password are correct
      return !string.IsNullOrEmpty(password) && password.Equals(_password);
    }

    private static IPrincipal GetPrincipal(string userName, string password)
    {
      // Create a ClaimsIdentity with all the claims for this user.
      Claim nameClaim = new Claim(ClaimTypes.Name, userName);
      List<Claim> claims = new List<Claim> { nameClaim };

      // important to set the identity this way, otherwise IsAuthenticated will be false
      // see: http://leastprivilege.com/2012/09/24/claimsidentity-isauthenticated-and-authenticationtype-in-net-4-5/
      ClaimsIdentity identity = new ClaimsIdentity(claims, "Basic");

      var principal = new ClaimsPrincipal(identity);
      return principal;
    }

    private static Tuple<string, string> ExtractUserNameAndPassword(string authorizationParameter)
    {
      byte[] credentialBytes;

      try
      {
        credentialBytes = Convert.FromBase64String(authorizationParameter);
      }
      catch (FormatException)
      {
        return null;
      }

      // The currently approved HTTP 1.1 specification says characters here are ISO-8859-1.
      // However, the current draft updated specification for HTTP 1.1 indicates this encoding is infrequently
      // used in practice and defines behavior only for ASCII.
      Encoding encoding = Encoding.ASCII;
      // Make a writable copy of the encoding to enable setting a decoder fallback.
      encoding = (Encoding)encoding.Clone();
      // Fail on invalid bytes rather than silently replacing and continuing.
      encoding.DecoderFallback = DecoderFallback.ExceptionFallback;
      string decodedCredentials;

      try
      {
        decodedCredentials = encoding.GetString(credentialBytes);
      }
      catch (DecoderFallbackException)
      {
        return null;
      }

      if (String.IsNullOrEmpty(decodedCredentials))
      {
        return null;
      }

      int colonIndex = decodedCredentials.IndexOf(':');

      if (colonIndex == -1)
      {
        return null;
      }

      string userName = decodedCredentials.Substring(0, colonIndex);
      string password = decodedCredentials.Substring(colonIndex + 1);
      return new Tuple<string, string>(userName, password);
    }
  }
}