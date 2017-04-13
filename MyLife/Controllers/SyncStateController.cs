using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using MyLife.Context;
using MyLife.Models;
using System.Data.Entity;

namespace MyLife.Controllers
{
    public class SyncStateController : Controller
    {

        private MyLifeContext db = new MyLifeContext();

        // GET: SyncState
        public ActionResult SyncStateIndex()
        {
            List<SyncStateModel> SyncStates = db.SyncStates.ToList();
            ViewData["SyncStateList"] = SyncStates;
            return View();
        }

        public JsonResult AddSyncState(SyncStateModel model)
        {
            model.SyncDate = DateTime.Now;
            db.Entry(model).State = EntityState.Added;
            db.SaveChanges();
            return Json(model);
        }

    }
}