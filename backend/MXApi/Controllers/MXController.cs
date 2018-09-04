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
    private readonly IIoTHubService _iotHubService;
    private readonly ITwitterService _tweeterService;

    public MXController(IIoTHubService iotHubService, ITwitterService tweeterService)
    {
      _iotHubService = iotHubService;
      _tweeterService = tweeterService;
    }

    [Route("hub")]
    [HttpPost]
    public HttpResponseMessage TestHub([FromBody] MxPayload payload)
    {
      var hubContext = GlobalHost.ConnectionManager.GetHubContext<MessageHub>();
      hubContext.Clients.All.Message(JsonConvert.SerializeObject(payload));

      return Request.CreateResponse(HttpStatusCode.OK);
    }

    [Route("device-messages")]
    [HttpPost]
    public async Task<HttpResponseMessage> SendDeviceMessage([FromBody] BroadcastMessage message)
    {
      var success = await _iotHubService.InvokeDeviceMethod(message.DeviceId, message.MessageContents, Constants.MessageMethodName);

      return success
        ? Request.CreateResponse(HttpStatusCode.OK)
        : Request.CreateResponse(HttpStatusCode.InternalServerError, "Could not find device");
    }

    [Route("twitter")]
    [HttpGet]
    public string GetTwitterAccount()
    {
      return ConfigurationManager.AppSettings["TwitterAccountUrl"];
    }

    [Route("twitter/messages")]
    [HttpPost]
    public HttpResponseMessage PostTweet([FromBody] BroadcastMessage message)
    {
      _tweeterService.Post(message.MessageContents);
      return Request.CreateResponse(HttpStatusCode.OK);
    }

    [Route("device-credentials/{deviceId}")]
    [HttpGet]
    public async Task<DeviceDetails> GetDeviceCredentials(string deviceId)
    {
      var device = await _iotHubService.GetDeviceAsync(deviceId);
      return GetDeviceConnectionString(device);
    }
  }
}
