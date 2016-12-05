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
            int year = now.Year;
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
            ViewData["costsLineData"] = LineChart(year);
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

        public JsonResult GetCosts(int year,int month,string queryString)
        {
            int days = DateTime.DaysInMonth(year,month);
            DateTime first = new DateTime(year,month,1,0,0,0);
            DateTime last = new DateTime(year,month,days,23,59,59);
            var list = from cost in db.Costs
                       join dictionaryCost in db.Dictionarys on cost.CostType equals dictionaryCost.ID
                       join dictionaryPay in db.Dictionarys on cost.PayType equals dictionaryPay.ID
                       where cost.CostDate >= first && cost.CostDate <= last 
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
            if (!String.IsNullOrEmpty(queryString))
            {
                list = list.Where(c=>c.GoodName.Contains(queryString));
            }
            return Json(list.ToList());
        }

        public JsonResult LineChart(int year)
        {
            DictionaryModel parentDic = db.Dictionarys.FirstOrDefault(d=>d.Name=="消费类型");
            List<DictionaryModel> dictionarys = (from costtype in db.Dictionarys
                                                 where costtype.ParentID == parentDic.ID
                                                 select costtype).ToList();
            List<CostTypeChartModel> list = CostInYear(dictionarys, year);            
            return Json(list.ToList());
        }

        public List<CostTypeChartModel> CostInYear(List<DictionaryModel> dics,int year)
        {
            List<CostTypeChartModel> list = new List<CostTypeChartModel>();            
            for (int i = 0, l = dics.Count(); i < l; i++)
            {
                CostTypeChartModel chart = new CostTypeChartModel();
                chart.name = dics[i].Name;
                decimal[] money = new decimal[12];
                int dicId = dics[i].ID;
                for (int j = 1; j <= 12; j++)
                {
                    int days = DateTime.DaysInMonth(year, j);
                    DateTime first = new DateTime(year, j, 1, 0, 0, 0);
                    DateTime last = new DateTime(year, j, days, 23, 59, 59);
                    var costs = from cost in db.Costs
                                where cost.CostDate >= first && cost.CostDate <= last && cost.CostType== dicId
                                select cost;
                    decimal? total = costs.Sum(c => c.Money);
                    money[j - 1] = Convert.ToDecimal(total);
                }
                chart.data = money;
                list.Add(chart);
            }
            CostTypeChartModel allChart = new CostTypeChartModel();
            allChart.name = "总计";
            decimal[] allMoney = new decimal[12];
            for (int i = 0; i < list.Count(); i++)
            {
                for (int j = 0; j <12 ; j++)
                {
                    allMoney[j] += list[i].data[j];
                }
            }
            allChart.data = allMoney;
            list.Add(allChart);
            return list;
        }
    }
}