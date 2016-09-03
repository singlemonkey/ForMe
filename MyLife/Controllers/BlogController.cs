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

        public ActionResult Edit()
        {
            return View();
        }

        [HttpPost]
        public JsonResult BlogList(int id) {
            BlogModel model = db.Blogs.Find(id);
            List<BlogModel> crumbList = new List<BlogModel>();
            crumbList.Add(model);
            if (id != 0) {
                crumbList = GetCrumbList(model.ParentID, crumbList).OrderBy(blog => blog.PublishDate).ToList();
            }
            var ContainerList = from blog in db.Blogs
                                where blog.ParentID==id && blog.ID!=0 orderby blog.PublishDate
                                select blog;
            return Json( new {
                crumbList = crumbList,
                containerList = ContainerList.ToList()
            });            
        }

        public List<BlogModel> GetCrumbList(int parentID, List<BlogModel> list) {
            BlogModel parentBlog = db.Blogs.SingleOrDefault(b => b.ID == parentID);
            list.Add(parentBlog);      
            if (parentID != 0)
            {
                list = GetCrumbList(parentBlog.ParentID, list);
            }
            return list;
        }

        [HttpPost]
        public JsonResult UpdateTitle(BlogModel model) {
            BlogModel blog = db.Blogs.Find(model.ID);
            blog.Title = model.Title;
            db.Entry(blog).State = EntityState.Modified;
            db.SaveChanges();
            return Json(blog);
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