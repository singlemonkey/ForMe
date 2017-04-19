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
using EntityFramework.Extensions;

namespace MyLife.Controllers
{
    public class AdminController : BaseController
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

        public JsonResult AvatarUpLoad()
        {
            HttpPostedFileBase file = Request.Files["img"];
            AdminModel admin = db.Administrators.Find(1);
            string fileName = DateTime.Now.ToString("yyyyMMddHHmmssms")+ file.FileName;
            string filePath = Server.MapPath("/Frontend/images/admin/")+fileName;
            file.SaveAs(filePath);
            admin.ImgUrl = "/Frontend/images/admin/" + fileName;
            db.Entry(admin).State = EntityState.Modified;
            db.SaveChanges();
            SyncUpdate("Admin");
            return Json(admin);
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
