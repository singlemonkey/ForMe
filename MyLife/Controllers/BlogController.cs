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
    public class BlogController:BaseController
    {
        private MyLifeContext db = new MyLifeContext();

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Edit(int id)
        {
            BlogModel blog = db.Blogs.Find(id);
            ViewData["blog"] = blog;
            return View(blog);
        }

        [HttpPost]
        public JsonResult ResetStructure(int ID,int ParentID)
        {
            BlogModel blog = db.Blogs.Find(ID);
            blog.ParentID = ParentID;
            blog.DisplayIndex = 0;
            db.Entry(blog).State = EntityState.Modified;
            db.SaveChanges();
            return Json(blog);
        }

        [HttpPost]
        public ActionResult UpdateDisplayIndex(string widget,int parentID)
        {
            if (widget != "")
            {
                char[] separator = { ',' };
                string[] BlogWidget = widget.Split(separator);
                List<BlogModel> blogList = new List<BlogModel>();
                for (int i = 0; i < BlogWidget.ToArray().Length; i++)
                {
                    BlogModel blog = db.Blogs.Find(int.Parse(BlogWidget[i]));
                    blog.DisplayIndex = parentID + i + 1;
                    db.Entry(blog).State = EntityState.Modified;
                    blogList.Add(blog);
                }
                db.SaveChanges();
                return Json(blogList);
            }
            else
            {
                return Json(new { });
            }     
        }

        [HttpPost]
        public JsonResult Save(BlogModel model)
        {
            BlogModel blog = db.Blogs.Find(model.ID);
            blog.Content = model.Content;
            blog.Title = model.Title;
            blog.UpdateDate = DateTime.Now;
            db.Entry(blog).State = EntityState.Modified;
            db.SaveChanges();
            return Json(blog);
        }

        [HttpPost]
        public JsonResult Add(int parentID, string fileType)
        {
            BlogModel blog = new BlogModel();
            blog.Content = "";
            blog.CreateDate = DateTime.Now;
            blog.DisplayIndex =0;
            blog.FileType = fileType;
            blog.IsPublish = true;
            blog.IsStar = false;
            blog.ParentID = parentID;
            blog.Title = fileType == "document" ? "新建文档" : "新建文件夹";
            blog.UpdateDate = DateTime.Now;
            db.Entry(blog).State = EntityState.Added;
            db.SaveChanges();

            return BlogList(parentID);
        }

        [HttpPost]
        public JsonResult BlogList(int id)
        {            
            BlogModel model = db.Blogs.Find(id);
            List<BlogModel> crumbList = new List<BlogModel>();
            crumbList.Add(model);
            if (id != 1)
            {
                crumbList = GetCrumbList(model.ParentID, crumbList).ToList();
                crumbList.Reverse();
            }
            var ContainerList = from blog in db.Blogs
                                where blog.ParentID==id && blog.ID!=1 orderby blog.DisplayIndex
                                select blog;
            return Json( new
            {
                crumbList = crumbList,
                containerList = ContainerList.ToList()
            });            
        }

        public List<BlogModel> GetCrumbList(int parentID, List<BlogModel> list)
        {
            BlogModel parentBlog = db.Blogs.SingleOrDefault(b => b.ID == parentID);
            list.Add(parentBlog);      
            if (parentID != 1)
            {
                list = GetCrumbList(parentBlog.ParentID, list);
            }
            return list;
        }

        [HttpPost]
        public JsonResult UpdateTitle(BlogModel model)
        {
            BlogModel blog = db.Blogs.Find(model.ID);
            blog.Title = model.Title;
            db.Entry(blog).State = EntityState.Modified;
            db.SaveChanges();
            return Json(blog);
        }

        [HttpPost]
        public JsonResult DeleteBlog(BlogModel model)
        {
            int parentID = model.ParentID;
            BlogModel blog = db.Blogs.Find(model.ID);
            db.Entry(blog).State = EntityState.Deleted;
            if (model.FileType == "folder")
            {
                var folder = GetFolder(model.ID);
                folder.ToList().ForEach(item=> {
                    db.Entry(item).State = EntityState.Deleted;
                });                
            }
            db.SaveChanges();
            return BlogList(parentID);
        }

        public IEnumerable<BlogModel> GetFolder(int id)
        {
            var query = from blog in db.Blogs
                        where blog.ParentID == id
                        select blog;
            return query.ToList().Concat(query.ToList().SelectMany(t=> GetFolder(t.ID)));
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