using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MXApi
{
  public static class Constants
  {
    public static string MessageMethodName = "message";
    public static string DefaultDeviceId = "AZ3166";
    public static int MaxMessageLength = 14;
    public static string DeviceIdHeader = "DeviceId";
    public static double LowSpeakingDbValue = 50.0;
    public static double HighSpeakingDbValue = 80.0;
  }
}