using NAudio.Wave;
using NAudio.Wave.SampleProviders;
using System.IO;

namespace MXApi.Models
{
  public class MxAudioReader : WaveStream, ISampleProvider
  {
    private readonly SampleChannel _sampleChannel; // sample provider that gives us most stuff we need
    private readonly int _destBytesPerSample;
    private readonly int _sourceBytesPerSample;
    private readonly long _length;
    private readonly object _lockObject = new object();
    private volatile WaveStream _readerStream; // the waveStream which we will use for all positioning

    /// <summary>
    /// Initializes a new instance of MxAudioReader
    /// </summary>
    /// <param name="inputStream">Audio stream</param>
    public MxAudioReader(Stream inputStream)
    {
      CreateReaderStream(inputStream);
      _sourceBytesPerSample = (_readerStream.WaveFormat.BitsPerSample / 8) * _readerStream.WaveFormat.Channels;
      _sampleChannel = new SampleChannel(_readerStream, false);
      _destBytesPerSample = 4 * _sampleChannel.WaveFormat.Channels;
      _length = SourceToDest(_readerStream.Length);
    }

    /// <summary>
    /// Creates the reader stream for wav audio
    /// </summary>
    /// <param name="inputStream">Audio stream</param>
    private void CreateReaderStream(Stream inputStream)
    {
      _readerStream = new WaveFileReader(inputStream);
      if (_readerStream.WaveFormat.Encoding != WaveFormatEncoding.Pcm && _readerStream.WaveFormat.Encoding != WaveFormatEncoding.IeeeFloat)
      {
        _readerStream = WaveFormatConversionStream.CreatePcmStream(_readerStream);
        _readerStream = new BlockAlignReductionStream(_readerStream);
      }
    }

    /// <summary>
    /// WaveFormat of this stream
    /// </summary>
    public override WaveFormat WaveFormat => _sampleChannel.WaveFormat;

    /// <summary>
    /// Length of this stream (in bytes)
    /// </summary>
    public override long Length => _length;

    /// <summary>
    /// Position of this stream (in bytes)
    /// </summary>
    public override long Position
    {
      get { return SourceToDest(_readerStream.Position); }
      set { lock (_lockObject) { _readerStream.Position = DestToSource(value); } }
    }

    /// <summary>
    /// Reads from this wave stream
    /// </summary>
    /// <param name="buffer">Audio buffer</param>
    /// <param name="offset">Offset into buffer</param>
    /// <param name="count">Number of bytes required</param>
    /// <returns>Number of bytes read</returns>
    public override int Read(byte[] buffer, int offset, int count)
    {
      var waveBuffer = new WaveBuffer(buffer);
      int samplesRequired = count / 4;
      int samplesRead = Read(waveBuffer.FloatBuffer, offset / 4, samplesRequired);
      return samplesRead * 4;
    }

    /// <summary>
    /// Reads audio from this sample provider
    /// </summary>
    /// <param name="buffer">Sample buffer</param>
    /// <param name="offset">Offset into sample buffer</param>
    /// <param name="count">Number of samples required</param>
    /// <returns>Number of samples read</returns>
    public int Read(float[] buffer, int offset, int count)
    {
      lock (_lockObject)
      {
        return _sampleChannel.Read(buffer, offset, count);
      }
    }

    /// <summary>
    /// Gets or Sets the Volume of this AudioFileReader. 1.0f is full volume
    /// </summary>
    public float Volume
    {
      get { return _sampleChannel.Volume; }
      set { _sampleChannel.Volume = value; }
    }

    /// <summary>
    /// Helper to convert source to dest bytes
    /// </summary>
    private long SourceToDest(long sourceBytes)
    {
      return _destBytesPerSample * (sourceBytes / _sourceBytesPerSample);
    }

    /// <summary>
    /// Helper to convert dest to source bytes
    /// </summary>
    private long DestToSource(long destBytes)
    {
      return _sourceBytesPerSample * (destBytes / _destBytesPerSample);
    }

    /// <summary>
    /// Disposes this AudioFileReader
    /// </summary>
    /// <param name="disposing">True if called from Dispose</param>
    protected override void Dispose(bool disposing)
    {
      if (disposing)
      {
        if (_readerStream != null)
        {
          _readerStream.Dispose();
          _readerStream = null;
        }
      }

      base.Dispose(disposing);
    }
  }
}