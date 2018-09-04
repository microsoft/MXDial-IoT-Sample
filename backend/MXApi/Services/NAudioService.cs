using MXApi.Models;
using NAudio.Wave;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Web;

namespace MXApi.Services
{
  public class NAudioService
  {
    private List<double> _decibelPeaks = new List<double>();

    /// <summary>
    /// NOTE: This is here for reference and not currently used in the app. We may store data 
    /// from the chip in storage and run it through this in a future release.
    /// </summary>
    /// <param name="waveContent"></param>
    public double GetMaxDecibel(byte[] waveContent)
    {
      if (waveContent == null) return 0;

      _decibelPeaks.Clear();
      using (var reader = new MxAudioReader(new MemoryStream(waveContent)))
      {
        var samplesPerSecond = reader.WaveFormat.SampleRate;
        var bitsToRead = reader.WaveFormat.BitsPerSample;

        SampleAggregator aggregator = new SampleAggregator(reader);
        aggregator.NotificationCount = samplesPerSecond / 100;
        aggregator.MaximumCalculated += onMaximumCalculated;

        long toRead = reader.Length;
        float[] buffer = new float[bitsToRead];
        while (toRead > 0)
        {
          int bytesRead = aggregator.Read(buffer, 0, bitsToRead);
          if (bytesRead == 0) break;
          toRead -= bytesRead;
        }
      }

      return _decibelPeaks.OrderByDescending(x => x).First();
    }

    public double GetMaxDecibel(string filePath)
    {
      using (var reader = new AudioFileReader(filePath))
      {
        _decibelPeaks.Clear();
        var samplesPerSecond = reader.WaveFormat.SampleRate;
        var bitsToRead = reader.WaveFormat.BitsPerSample;

        SampleAggregator aggregator = new SampleAggregator(reader);
        aggregator.NotificationCount = samplesPerSecond / 100;
        aggregator.MaximumCalculated += onMaximumCalculated;

        long toRead = reader.Length;
        float[] buffer = new float[bitsToRead];
        while (toRead > 0)
        {
          int bytesRead = aggregator.Read(buffer, 0, bitsToRead);
          if (bytesRead == 0) break;
          toRead -= bytesRead;
        }
      }

      return _decibelPeaks.OrderByDescending(x => x).First();
    }

    private void onMaximumCalculated(object sender, MaxSampleEventArgs e)
    {
      double db = 20 * Math.Log10(e.MaxSample);
      _decibelPeaks.Add(db);
    }
  }
}