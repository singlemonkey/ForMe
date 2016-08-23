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
    public class BlogController:Controller
    {
        private MyLifeContext db = new MyLifeContext();

        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult GetAllBlogs() {
            return Json(db.Blogs.ToList());
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