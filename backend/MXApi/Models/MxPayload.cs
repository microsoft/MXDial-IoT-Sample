using Newtonsoft.Json;

namespace MXApi.Models
{

  public class MxPayload
  {
    [JsonProperty(PropertyName = "deviceId")]
    public string DeviceId { get; set; }

    [JsonProperty(PropertyName = "messageId")]
    public int MessageId { get; set; }

    [JsonProperty(PropertyName = "temperature")]
    public double Temperature { get; set; }

    [JsonProperty(PropertyName = "humidity")]
    public double Humidity { get; set; }

    [JsonProperty(PropertyName = "pressure")]
    public double Pressure { get; set; }

    [JsonProperty(PropertyName = "accelX")]
    public int AccelX { get; set; }

    [JsonProperty(PropertyName = "accelY")]
    public int AccelY { get; set; }

    [JsonProperty(PropertyName = "accelZ")]
    public int AccelZ { get; set; }

    [JsonProperty(PropertyName = "magX")]
    public int MagX { get; set; }

    [JsonProperty(PropertyName = "magY")]
    public int MagY { get; set; }

    [JsonProperty(PropertyName = "magZ")]
    public int MagZ { get; set; }

    [JsonProperty(PropertyName = "soundRecorded")]
    public bool SoundRecorded { get; set; }
  }
}

