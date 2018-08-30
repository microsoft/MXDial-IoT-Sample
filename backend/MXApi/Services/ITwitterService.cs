using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MXApi.Services
{
  public interface ITwitterService
  {
    void Post(string message);
  }
}