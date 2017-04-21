using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using MyLife.Models;
using MyLife.Context;
using System.Data.Entity;
using PagedList;

namespace MyLife.Controllers
{
    public class WishController : BaseController
    {
        private MyLifeContext db = new MyLifeContext();
        // GET: Wish
        public ActionResult WishIndex()
        {
            return View();
        }

        public JsonResult AddWish(WishModel model)
        {
            WishModel wish = new WishModel();
            wish.CreateDate = DateTime.Now;
            wish.Degree = model.Degree;
            wish.EndDate = DateTime.Now.AddMinutes(GetMinute(model.Price, model.Degree));
            wish.Flag = -1;
            wish.Info = model.Info;
            wish.Name = model.Name;
            wish.Price = model.Price;
            db.Entry(wish).State = EntityState.Added;
            db.SaveChanges();
            return Json(wish);
        }

        public JsonResult GetPageList(WishPageQuery query)
        {
            var wishs = from w in db.Wishs
                        select w;
            if (query.QueryInfo != null)
            {
                if (!String.IsNullOrEmpty(query.QueryInfo.Name))
                {
                    wishs = wishs.Where(w => w.Name.Contains(query.QueryInfo.Name));
                }
            }
            wishs = wishs.OrderBy(w=>w.Price);
            int count = wishs.Count();
            //如果不分页，则加载所有数据
            if (!query.PageInfo.IsPaging)
            {
                return Json(new {
                    List=wishs.ToList(),
                    Count=count
                });   
            }
            else
            {
                return Json(new {
                    List= wishs.ToPagedList(query.PageInfo.PageIndex, query.PageInfo.PageSize).ToList(),
                    Count= count
                });
            }
        }

        //根据金额与期望值，随机计算出一个时间点
        public int GetMinute(decimal price,int raty)
        {
            decimal?  money=db.Administrators.SingleOrDefault(a=>a.ID==1).Wages/10;
            decimal totalMoney = db.Wishs.Where(w => w.Flag == -1).Sum(w=>w.Price)+ price;
            int totalMinutes=Convert.ToInt32((totalMoney/money) * 3*24*6);
            Random random = new Random();
            int degree= random.Next(100-raty*10,100);
            int minutes =Convert.ToInt32(totalMinutes * degree);
            return minutes;
        }
    }
}