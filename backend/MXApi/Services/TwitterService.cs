using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using System.Web;
using TweetSharp;

namespace MXApi.Services
{
  public class TwitterIoTService : ITwitterService
  {
    private TwitterService _twitterService;

    public void Post(string message)
    {
      if (_twitterService == null)
      {
        var consumerKey = ConfigurationManager.AppSettings["TwitterConsumerKey"];
        var consumerSecret = ConfigurationManager.AppSettings["TwitterConsumerSecret"];
        var accessToken = ConfigurationManager.AppSettings["TwitterAccessToken"]; ;
        var accessTokenSecret = ConfigurationManager.AppSettings["TwitterAccessTokenSecret"]; ;
        CreateAuthenticatedService(consumerKey, consumerSecret, accessToken, accessTokenSecret);
      }

      _twitterService.SendTweet(new SendTweetOptions { Status = message });
    }

    private void CreateAuthenticatedService(string consumerKey, string consumerSecret, string accessToken, string accessTokenSecret)
    {
      _twitterService = new TwitterService(consumerKey, consumerSecret);
      _twitterService.AuthenticateWith(accessToken, accessTokenSecret);
    }
  }
}