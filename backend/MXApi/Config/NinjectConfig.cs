using MXApi.Services;
using Ninject;

namespace MXApi.Config
{
  public static class NinjectConfig
  {
    public static IKernel CreateKernel()
    {
      var kernel = new StandardKernel();

      kernel.Bind<IIoTHubService>().To<IoTHubService>();
      kernel.Bind<ITwitterService>().To<TwitterIoTService>();

      return kernel;
    }
  }
}
