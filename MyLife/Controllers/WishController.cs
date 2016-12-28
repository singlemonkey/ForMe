using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using MyLife.Models;
using MyLife.Context;
using System.Data.Entity;

namespace MyLife.Controllers
{
    public class WishController : BaseController
    {
        private MyLifeContext db = new MyLifeContext();
        // GET: Wish
        public ActionResult WishIndex()
        {
            List<WishUnit> unitList = new List<WishUnit>();
            var wishs = from wish in db.Wishs
                        where wish.ParentID == 0
                        select wish;
            List<WishModel> wishList = wishs.ToList();
            for (int i = 0; i < wishList.Count(); i++)
            {
                WishUnit unit = new WishUnit();
                unit.ID = wishList[i].ID;
                unit.Name = wishList[i].Name;
                unit.Raty = wishList[i].Degree;
                unit.EndDate = wishList[i].EndDate;
                unit.Flag = wishList[i].Flag;
                int ParentID = wishList[i].ID;
                List<WishModel> childWishs = db.Wishs.Where(w => w.ParentID == ParentID).ToList();
                unit.Total = childWishs.Sum(w=>w.Price);
                unit.WishUnitList = childWishs;
                unitList.Add(unit);
            }
            ViewData["wishUnits"] = unitList;
            return View();
        }
        public JsonResult AddWish(string name)
        {
            WishModel model = new WishModel();
            model.ParentID = 0;
            model.ImgUrl = "../Frontend/images/wish/buy.gif";
            model.Degree = 0;
            model.Flag = 0;
            model.Name = name;
            db.Entry(model).State = EntityState.Added;
            db.SaveChanges();
            return Json(model);
        }
    }
}