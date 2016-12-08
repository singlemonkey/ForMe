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
    public class WishController : Controller
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
                int ParentID = wishList[i].ID;
                List<WishModel> childWishs = db.Wishs.Where(w => w.ParentID == ParentID).ToList();
                unit.WishUnitList = childWishs;
                unitList.Add(unit);
            }
            ViewData["wishUnits"] = unitList;
            return View();
        }
    }
}