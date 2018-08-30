using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;
using MXApi.Models;
using MXApi.SigR;
using Newtonsoft.Json;
using static MXApi.Helpers.Utilities;

namespace MXApi.Services
{
  public class MessagingService : IDisposable
  {
    private static readonly Random _rand = new Random();
    private EventHubClient _eventHubClient;
    private IHubContext _hubContext;

    public MessagingService()
    {
      _eventHubClient = CreateClient();
      _hubContext = GlobalHost.ConnectionManager.GetHubContext<MessageHub>();  
    }

    public void ReadMessages(CancellationToken ct)
    {
      var d2CPartitions = _eventHubClient.GetRuntimeInformation().PartitionIds;

      var tasks = new List<Task>();
      foreach (string partition in d2CPartitions)
      {
        tasks.Add(ReceiveMessagesFromDeviceAsync(partition, ct));
      }
      
      try
      {
        Task.WaitAll(tasks.ToArray());
      }
      catch (AggregateException e)
      {
        if (!(e.InnerException is OperationCanceledException))
        {
          Trace.TraceError(e.Message);
          throw;
        }
      }
    }

    public void Dispose()
    {
      _eventHubClient = null;
      _hubContext = null;
    }

    private EventHubClient CreateClient()
    {
      MessagingFactory factory = MessagingFactory.CreateFromConnectionString(ConfigurationManager.AppSettings["IoTHubConnectionString"] + ";TransportType=Amqp");

      factory.RetryPolicy = new RetryExponential(TimeSpan.FromSeconds(1), TimeSpan.FromSeconds(20), 3);

      return factory.CreateEventHubClient(ConfigurationManager.AppSettings["IotHubD2CEndpoint"]);
    }

    private async Task ReceiveMessagesFromDeviceAsync(string partition, CancellationToken ct)
    {
      var eventHubReceiver = _eventHubClient.GetConsumerGroup(ConfigurationManager.AppSettings["ConsumerGroup"])
        .CreateReceiver(partition, DateTime.UtcNow);

      while (_hubContext != null && !ct.IsCancellationRequested)
      {
        try
        {
          var eventData = await eventHubReceiver.ReceiveAsync();
          if (eventData == null) continue;

          var data = Encoding.UTF8.GetString(eventData.GetBytes());
          var deviceId = eventData.SystemProperties["iothub-connection-device-id"].ToString();
          var fromDeviceObject = JsonConvert.DeserializeObject<MxPayload>(data);

          var gForce = CalculateGForce(Convert.ToDouble(fromDeviceObject.AccelX),
            Convert.ToDouble(fromDeviceObject.AccelY), Convert.ToDouble(fromDeviceObject.AccelZ));

          var mgauss = CalculateSingleMGauss(fromDeviceObject.MagX, fromDeviceObject.MagY, fromDeviceObject.MagZ);

          //for now we are just going to simulate a DB reading as the sound file is too large to be sent in a message. 
          var decibel = 0.0;
          if (fromDeviceObject.SoundRecorded)
          {
            decibel = GetRandomSpeakingDecibel(Constants.LowSpeakingDbValue, Constants.HighSpeakingDbValue);
          }

          var metricsPayload = new MetricsPayload()
          {
            Id = deviceId,
            Gravity = Math.Round(gForce, 3),
            Temperature = Math.Round(fromDeviceObject.Temperature, 2),
            Humidity = Math.Round(fromDeviceObject.Humidity, 2),
            Pressure = Math.Round(fromDeviceObject.Pressure, 2),
            Magnetometer = mgauss,
            Decibels = decibel
          };

          var msg = JsonConvert.SerializeObject(metricsPayload);
          Trace.TraceInformation(msg);
          _hubContext.Clients.All.Message(msg);
        }
        catch(Exception e)
        {
          Trace.TraceError(e.ToString());
        }
      }
    }
  }
}