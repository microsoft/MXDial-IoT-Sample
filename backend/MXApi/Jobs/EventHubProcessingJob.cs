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
    private static CancellationTokenSource tokenSource;
    private static MessagingService _messagingService;

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
            return;

          CreateNewMessageService();
          _messagingService.ReadMessages(tokenSource.Token);
        }
      }
      catch (Exception e)
      {
        Trace.TraceError(e.ToString());
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
      if (_messagingService != null)
      {
        _messagingService.Dispose();
        _messagingService = null;
      }

      _messagingService = new MessagingService();
    }

    private void CancelExistingTasks()
    {
      if (tokenSource != null)
      {
        tokenSource.Cancel();
        tokenSource.Dispose();
      }
      tokenSource = new CancellationTokenSource();
    }
  }
}