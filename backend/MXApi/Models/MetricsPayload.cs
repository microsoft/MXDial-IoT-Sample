using Newtonsoft.Json;

namespace MXApi.Models
{
  public class MetricsPayload
  {
    [JsonProperty(PropertyName = "id")]
    public string Id { get; set; }

    [JsonProperty(PropertyName = "gravity")]
    public double Gravity { get; set; }

    [JsonProperty(PropertyName = "temperature")]
    public double Temperature { get; set; }

    [JsonProperty(PropertyName = "humidity")]
    public double Humidity { get; set; }

    [JsonProperty(PropertyName = "pressure")]
    public double Pressure { get; set; }

    [JsonProperty(PropertyName = "decibels")]
    public double Decibels { get; set; }

    [JsonProperty(PropertyName = "magnetometer")]
    public double Magnetometer { get; set; }
  }
}