using System;
using System.Web.Http;
using FluentScheduler;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using MXApi;
using MXApi.Config;
using MXApi.Filters;
using MXApi.Jobs;
using MXApi.Resolvers;
using Owin;
using Swashbuckle.Application;

[assembly: OwinStartup(typeof(Startup))]
namespace MXApi
{
  public class Startup
  {
    public void Configuration(IAppBuilder app)
    {
      var config = new HttpConfiguration();

      //config routes
      config.MapHttpAttributeRoutes();

      //enable swagger
      config.EnableSwagger(c => c.SingleApiVersion("v1", "MX API"))
        .EnableSwaggerUi();

      //di
      config.DependencyResolver = new NinjectResolver(NinjectConfig.CreateKernel());

      config.Filters.Add(new BasicAuthorizeFilter());

      //refresh the service every minute
      var registry = new Registry();
      registry.Schedule<EventHubProcessingJob>()
        .WithName("read-mx-messages")
        .ToRunOnceAt(DateTime.Now)
        .AndEvery(15).Minutes();

      //init
      JobManager.Initialize(registry);
      JobManager.JobException += (info) => JobManager.GetSchedule("read-mx-messages").Execute();

      //sigR config
      var sigConfiguration = new HubConfiguration { EnableJSONP = true };
      app.UseCors(CorsOptions.AllowAll);

      app.MapSignalR(sigConfiguration);
      app.UseWebApi(config);
    }
  }
}
