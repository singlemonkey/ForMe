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
            DateTime now = DateTime.Now;
            DateTime first = now.AddDays(1-now.Day).Date;
            DateTime last = now.AddDays(1-now.Day).AddMonths(1).Date;
            var list = from cost in db.Costs
                       join dictionaryCost in db.Dictionarys on cost.CostType equals dictionaryCost.ID
                       join dictionaryPay in db.Dictionarys on cost.PayType equals dictionaryPay.ID
                       where cost.CostDate >= first && cost.CostDate<=last
                       select new {
                           cost.ID,cost.Money,cost.GoodName,cost.Description,cost.CostDate,
                           CostName=dictionaryCost.Name,
                           PayName=dictionaryPay.Name
                       };
            ViewData["costs"] =list.ToList();
            return View();
        }

        public JsonResult AddCost(CostModel model)
        {
            CostModel costModel = new CostModel();
            costModel.CostDate = DateTime.Now;
            costModel.CostType = model.CostType;
            costModel.Description = model.Description;
            costModel.GoodName = model.GoodName;
            costModel.Money = model.Money;
            costModel.PayType = model.PayType;
            db.Entry(costModel).State = EntityState.Added;
            db.SaveChanges();
            var list= from cost in db.Costs
                      join dictionaryCost in db.Dictionarys on cost.CostType equals dictionaryCost.ID
                      join dictionaryPay in db.Dictionarys on cost.PayType equals dictionaryPay.ID
                      where cost.ID==costModel.ID
                      select new
                      {
                          cost.ID,
                          cost.Money,
                          cost.GoodName,
                          cost.Description,
                          cost.CostDate,
                          CostName = dictionaryCost.Name,
                          PayName = dictionaryPay.Name
                      };
            return Json(list.ToList()[0]);
        }
    }
}