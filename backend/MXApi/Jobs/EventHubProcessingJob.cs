using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Hosting;
using FluentScheduler;
using MXApi.Services;

namespace MXApi.Jobs
{
  public class EventHubProcessingJob : IJob, IRegisteredObject, IDisposable
  {
    private static readonly object Lock = new object();
    private static CancellationTokenSource _tokenSource;
    private static volatile MessagingService _messagingService;

    private bool _shuttingDown;

    public EventHubProcessingJob()
    {
      HostingEnvironment.RegisterObject(this);
    }

    public void Execute()
    {
      try
      {
        CancelExistingTasks();
        lock (Lock)
        {
          if (_shuttingDown)
          {
            return;
          }

          CreateNewMessageService();
          _messagingService.ReadMessages(_tokenSource.Token);
        }
      }
      catch (Exception e)
      {
        Trace.TraceError($"Failed to execute event hub processing job: {e}");
        throw;
      }
    }

    public void Stop(bool immediate)
    {
      lock (Lock)
      {
        _shuttingDown = true;
      }

      HostingEnvironment.UnregisterObject(this);
    }

    public void Dispose()
    {
      HostingEnvironment.UnregisterObject(this);
    }

    private void CreateNewMessageService()
    {
      _messagingService = new MessagingService();
    }

    private void CancelExistingTasks()
    {
      if (_tokenSource != null)
      {
        _tokenSource.Cancel();
        _tokenSource.Dispose();
      }

      _tokenSource = new CancellationTokenSource();
    }
  }
}