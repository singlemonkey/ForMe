using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using MyLife.Context;
using MyLife.Models;

namespace MyLife.Controllers
{
    public class AdminController : Controller
    {
        private MyLifeContext db = new MyLifeContext();

        [HttpPost]
        public JsonResult Login() {
            var result = new {
            };
            return Json(result);
        }

        public ActionResult Admin()
        {
            AdminModel admin = db.Administrators.Where(a=>a.ID==1).SingleOrDefault();
            ViewData["Admin"] = admin;
            return View();
            
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
