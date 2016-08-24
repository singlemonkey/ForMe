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
            var FolderList = from blog in db.Blogs
                                where blog.ParentID==id && blog.FileType=="floder" && blog.ID!=0 orderby blog.PublishDate
                                select blog;
            var DocumentList = from blog in db.Blogs
                                      where blog.ParentID == id && blog.FileType == "document" orderby blog.PublishDate
                               select blog;
            return Json(new {
                crumList = crumbList,
                FolderList = FolderList.ToList(),
                DocumentList = DocumentList.ToList(),
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