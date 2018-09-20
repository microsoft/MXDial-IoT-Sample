using System;
using System.Configuration;
using System.Diagnostics;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.Devices;
using Microsoft.Azure.Devices.Common.Exceptions;
using MXApi.Helpers;
using MXApi.Models;
using Newtonsoft.Json;

namespace MXApi.Services
{
  public class IoTHubService : IIoTHubService
  {
    private readonly ServiceClient _serviceClient;
    private readonly RegistryManager _registryManager;

    public IoTHubService()
    {
      _serviceClient = ServiceClient.CreateFromConnectionString(ConfigurationManager.AppSettings["IoTHubConnectionString"]);
      _registryManager =  RegistryManager.CreateFromConnectionString(ConfigurationManager.AppSettings["IoTHubConnectionString"]);
    }

    public async Task<bool> InvokeDeviceMethod(string deviceId, string message, string methodName)
    {
      try
      {
        var methodInvocation = new CloudToDeviceMethod(methodName) { ResponseTimeout = TimeSpan.FromSeconds(30) };
        methodInvocation.SetPayloadJson($"'{message.Truncate(Constants.MaxMessageLength)}'");

        await _serviceClient.InvokeDeviceMethodAsync(deviceId, methodInvocation);
      }
      catch (Exception e)
      {
        Trace.TraceError($"Failed to invoke device method: {e}");
        return false;
      }

      return true;
    }

    public async Task<Device> GetDeviceAsync(string deviceId)
    {
      Device device;
      try
      {
        device = await _registryManager.AddDeviceAsync(new Device(deviceId));
        Trace.TraceInformation($"Created device: {deviceId}" );
      }
      catch (DeviceAlreadyExistsException)
      {
        device = await _registryManager.GetDeviceAsync(deviceId);
        Trace.TraceInformation($"Retrieved existing device: {deviceId}");
      }

      return device;
    }
  }
}
