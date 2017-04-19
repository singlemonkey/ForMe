using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using MyLife.Context;
using MyLife.Models;
using EntityFramework.Extensions;

namespace MyLife.Controllers
{
    public class BaseController: Controller
    {
        private MyLifeContext db = new MyLifeContext();
        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        protected override void OnException(ExceptionContext filterContext)
        {
            //获取异常信息
            Exception Error = filterContext.Exception;
            logger.Error(Error);
        }

        public void SyncUpdate(string tableName)
        {
            db.SyncStates.Where(s => s.TableName == tableName).Update(s => new SyncStateModel
            {
                IsSync = 0
            });
        }
    }
}