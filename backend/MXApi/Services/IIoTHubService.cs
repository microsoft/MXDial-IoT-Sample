using System.Threading.Tasks;
using Microsoft.Azure.Devices;

namespace MXApi.Services
{
  public interface IIoTHubService
  {
    Task<bool> InvokeDeviceMethod(string deviceId, string message, string methodName);
    Task<Device> GetDeviceAsync(string deviceId);
  }
}