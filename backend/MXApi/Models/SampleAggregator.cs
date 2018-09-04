using System;
using System.Diagnostics;
using NAudio.Dsp;
using NAudio.Wave;

namespace MXApi.Models
{
  public class SampleAggregator : ISampleProvider
  {
    public event EventHandler<MaxSampleEventArgs> MaximumCalculated;
    public event EventHandler<FftEventArgs> FftCalculated;
    
    private readonly Complex[] _fftBuffer;
    private readonly FftEventArgs _fftArgs;
    private readonly int _fftLength;
    private readonly int _m;
    private readonly ISampleProvider _source;
    private readonly int _channels;

    private float _maxValue;
    private float _minValue;    
    private int _count;
    private int _fftPos;

    public SampleAggregator(ISampleProvider source, int fftLength = 1024)
    {
      _channels = source.WaveFormat.Channels;
      if (!IsPowerOfTwo(fftLength))
      {
          throw new ArgumentException("FFT Length must be a power of two");
      }

      _m = (int)Math.Log(fftLength, 2.0);
      _fftLength = fftLength;
      _fftBuffer = new Complex[_fftLength];
      _fftArgs = new FftEventArgs(_fftBuffer);
      _source = source;
    }

    public int NotificationCount { get; set; }

    public bool PerformFFT { get; set; }

    public WaveFormat WaveFormat => _source.WaveFormat;

    public void Reset()
    {
      _count = 0;
      _maxValue = _minValue = 0;
    }

    public int Read(float[] buffer, int offset, int count)
    {
      var samplesRead = _source.Read(buffer, offset, count);
      for (int n = 0; n < samplesRead; n += _channels)
      {
        Add(buffer[n+offset]);
      }

      return samplesRead;
    }

    private static bool IsPowerOfTwo(int x)
    {
      return (x & (x - 1)) == 0;
    }

    private void Add(float value)
    {
      if (PerformFFT && FftCalculated != null)
      {
        _fftBuffer[_fftPos].X = (float)(value * FastFourierTransform.HammingWindow(_fftPos, _fftLength));
        _fftBuffer[_fftPos].Y = 0;
        _fftPos++;
        if (_fftPos >= _fftBuffer.Length)
        {
          _fftPos = 0;
          FastFourierTransform.FFT(true, _m, _fftBuffer);
          FftCalculated(this, _fftArgs);
        }
      }

      _maxValue = Math.Max(_maxValue, value);
      _minValue = Math.Min(_minValue, value);
      _count++;

      if (_count >= NotificationCount && NotificationCount > 0)
      {
        MaximumCalculated?.Invoke(this, new MaxSampleEventArgs(_minValue, _maxValue));
        Reset();
      }
    }
  }

  public class MaxSampleEventArgs : EventArgs
  {
    [DebuggerStepThrough]
    public MaxSampleEventArgs(float minValue, float maxValue)
    {
        MaxSample = maxValue;
        MinSample = minValue;
    }

    public float MaxSample { get; private set; }
    public float MinSample { get; private set; }
  }

  public class FftEventArgs : EventArgs
  {
    [DebuggerStepThrough]
    public FftEventArgs(Complex[] result)
    {
        Result = result;
    }

    public Complex[] Result { get; private set; }
  }
}
