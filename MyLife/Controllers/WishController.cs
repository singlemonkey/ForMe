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
            return View();
        }

        public JsonResult AddWish(WishModel model)
        {
            WishModel wish = new WishModel();
            wish.CreateDate = DateTime.Now;
            wish.Degree = model.Degree;
            wish.EndDate = DateTime.Now.AddSeconds(GetSecond(model.Price, model.Degree));
            wish.Flag = -1;
            wish.Info = model.Info;
            wish.Name = model.Name;
            wish.Price = model.Price;
            db.Entry(wish).State = EntityState.Added;
            db.SaveChanges();
            return Json(wish);
        }

        //根据金额与期望值，随机计算出一个时间点
        public int GetSecond(decimal price,int raty)
        {
            decimal?  money=db.Administrators.SingleOrDefault(a=>a.ID==1).Wages/10;
            decimal totalMoney = db.Wishs.Where(w => w.Flag == -1).Sum(w=>w.Price)+ price;
            int totalSecond =Convert.ToInt32((totalMoney/money) * 30*24*6*6);
            Random random = new Random();
            int degree= random.Next(100-raty*10,100);
            int second =Convert.ToInt32(totalSecond * degree);
            return second;
        }
    }
}