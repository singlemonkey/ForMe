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
    public class CostController : BaseController
    {
        private MyLifeContext db = new MyLifeContext();
        // GET: Cost
        public ActionResult Index()
        {
            List<CostModel> costs = db.Costs.ToList();
            ViewData["costs"] = costs;
            return View();
        }

        public JsonResult AddCost(CostModel model)
        {
            CostModel cost = new CostModel();
            cost.CostDate = DateTime.Now;
            cost.CostType = model.CostType;
            cost.Description = model.Description;
            cost.GoodName = model.GoodName;
            cost.Money = model.Money;
            cost.PayType = model.PayType;
            db.Entry(cost).State = EntityState.Added;
            db.SaveChanges();
            return Json(cost);
        }
    }
}