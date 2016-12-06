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
            ViewData["costsPieCostTypeData"] = PieChartCostType().ToList();
            ViewData["costsPiePayTypeData"] = PieChartPayType().ToList();
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
        public List<CostPieModel> PieChartCostType()
        {
            DictionaryModel parentDic = db.Dictionarys.FirstOrDefault(d=>d.Name=="消费类型");
            List<DictionaryModel> dictionarys = (from costtype in db.Dictionarys
                                                 where costtype.ParentID == parentDic.ID
                                                 select costtype).ToList();
            List<CostPieModel> list = new List<CostPieModel>();
            decimal totalMoney=Convert.ToDecimal(db.Costs.Sum(c=>c.Money));
            for (int i = 0,l=dictionarys.Count(); i < l; i++)
            {
                CostPieModel pie = new CostPieModel();
                int id = dictionarys[i].ID;
                pie.name = dictionarys[i].Name;
                decimal costMoney =Convert.ToDecimal( db.Costs.Where(c=>c.CostType== id).Sum(c=>c.Money));
                decimal costPercentage = (decimal)costMoney / totalMoney;
                pie.Percentage = costPercentage;
                list.Add(pie);
            }
            return list;
        }
        public List<CostPieModel> PieChartPayType()
        {
            DictionaryModel parentDic = db.Dictionarys.FirstOrDefault(d => d.Name == "支付类型");
            List<DictionaryModel> dictionarys = (from paytype in db.Dictionarys
                                                 where paytype.ParentID == parentDic.ID
                                                 select paytype).ToList();
            List<CostPieModel> list = new List<CostPieModel>();
            decimal totalMoney = Convert.ToDecimal(db.Costs.Sum(c => c.Money));
            for (int i = 0, l = dictionarys.Count(); i < l; i++)
            {
                CostPieModel pie = new CostPieModel();
                int id = dictionarys[i].ID;
                pie.name = dictionarys[i].Name;
                decimal costMoney = Convert.ToDecimal(db.Costs.Where(c => c.PayType == id).Sum(c => c.Money));
                decimal costPercentage = (decimal)costMoney / totalMoney;
                pie.Percentage = costPercentage;
                list.Add(pie);
            }
            return list;
        }
        public JsonResult PieChart()
        {
            List<CostPieModel> costList = PieChartCostType().ToList();
            List<CostPieModel> payList = PieChartCostType().ToList();
            return Json(new {
                CostData =costList,
                PayData = payList
            });
        }
        public JsonResult LineChart(int year)
        {
            DictionaryModel parentDic = db.Dictionarys.FirstOrDefault(d=>d.Name=="消费类型");
            List<DictionaryModel> dictionarys = (from costtype in db.Dictionarys
                                                 where costtype.ParentID == parentDic.ID
                                                 select costtype).ToList();
            List<CostChartModel> list = CostInYear(dictionarys, year);            
            return Json(list.ToList());
        }

        public List<CostChartModel> CostInYear(List<DictionaryModel> dics,int year)
        {
            List<CostChartModel> list = new List<CostChartModel>();            
            for (int i = 0, l = dics.Count(); i < l; i++)
            {
                CostChartModel chart = new CostChartModel();
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
            CostChartModel allChart = new CostChartModel();
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