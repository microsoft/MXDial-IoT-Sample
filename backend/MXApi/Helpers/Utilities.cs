using System;
using System.Text.RegularExpressions;
using System.Security.Cryptography;
using MXApi.Models;
using System.Configuration;
using System.Net;
using System.Globalization;
using System.Text;
using Microsoft.Azure.Devices;

namespace MXApi.Helpers
{
  public static class Utilities
  {
    public const double GRAVITY = 9.81;

    public static double CalculateGForce(double x, double y, double z)
    {
      x = x / GRAVITY;
      y = y / GRAVITY;
      z = z / GRAVITY;

      var pt = Math.Sqrt(x * x + y * y + z * z);
      return pt / 100; // need to devide into 100 due to prescision from MX. This will give us the real G
    }

    public static double CalculateSingleMGauss(double x, double y, double z)
    {
      return Math.Sqrt(x * x + y * y + z * z);
    }

    public static string Truncate(this string value, int maxLength)
    {
      if (string.IsNullOrEmpty(value)) return value;
      return value.Length <= maxLength ? value : value.Substring(0, maxLength);
    }

    public static DeviceDetails GetDeviceConnectionString(Device device)
    {
      var hostName = GetHostNameFromIoTHubConnectionString(ConfigurationManager.AppSettings["IoTHubConnectionString"]);
      var deviceId = device.Id;
      var SharedAccessKey = device.Authentication.SymmetricKey.PrimaryKey;

      return new DeviceDetails
      {
        ConnectionString = $"HostName={hostName};DeviceId={deviceId};SharedAccessKey={SharedAccessKey}"
      };
    }

    public static string GetHostNameFromIoTHubConnectionString(string connectionString)
    {
      return connectionString.Split('=', ';')[1];
    }

    public static double GetRandomSpeakingDecibel(double minimum, double maximum)
    {
      var random = new Random();
      return random.NextDouble() * (maximum - minimum) + minimum;
    }
  }
}