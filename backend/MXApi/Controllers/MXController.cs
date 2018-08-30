using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNet.SignalR;
using MXApi.Models;
using MXApi.Services;
using MXApi.SigR;
using Newtonsoft.Json;
using static MXApi.Helpers.Utilities;


namespace MXApi.Controllers
{

  [RoutePrefix("api/mx")]
  public class MXController : ApiController
  {

    private readonly IIoTHubService _ioTHubService;
    private readonly ITwitterService _tweeterService;

    public MXController(IIoTHubService ioTHubService, ITwitterService tweeterService)
    {
      _ioTHubService = ioTHubService;
      _tweeterService = tweeterService;
    }

    [Route("TestHub")]
    [HttpPost]
    public HttpResponseMessage TestHub([FromBody] MxPayload payload)
    {
      var hubContext = GlobalHost.ConnectionManager.GetHubContext<MessageHub>();
      hubContext.Clients.All.Message(JsonConvert.SerializeObject(payload));

      return Request.CreateResponse(HttpStatusCode.OK);
    }

    [Route("SendDeviceMessage")]
    [HttpPost]
    public async Task<HttpResponseMessage> SendDeviceMessage([FromBody] BroadcastMessage message)
    {
      var success = await _ioTHubService.InvokeDeviceMethod(message.DeviceId, message.MessageContents , Constants.MessageMethodName);

      if (success) return Request.CreateResponse(HttpStatusCode.OK);
      return Request.CreateResponse(HttpStatusCode.InternalServerError, "could not find device");
    }

    [Route("GetDeviceId")]
    [HttpGet]
    public HttpResponseMessage GetDeviceId()
    {
      return Request.CreateResponse(HttpStatusCode.OK);
    }

    [Route("TwitterAccount")]
    [HttpGet]
    public string GetTwitterAccount()
    {
      return ConfigurationManager.AppSettings["TwitterAccountUrl"];
    }


    [Route("Tweet")]
    [HttpPost]
    public HttpResponseMessage PostTweet([FromBody] BroadcastMessage message)
    {
      _tweeterService.Post(message.MessageContents);
      return Request.CreateResponse(HttpStatusCode.OK);
    }

    [Route("GetDeviceCredentials")]
    [HttpGet]
    public async Task<DeviceDetails> GetDeviceCredentials(string deviceId)
    {
      var device = await _ioTHubService.GetDeviceAsync(deviceId);
      return GetDeviceConnectionString(device);
    }
  }
}
