using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using MyLife.Context;
using MyLife.Models;
using System.Data.Entity;
using EntityFramework.Extensions;

namespace MyLife.Controllers
{
    public class SyncStateController : Controller
    {
        private MyLifeContext db = new MyLifeContext();

        // GET: SyncState
        public ActionResult SyncStateIndex()
        {
            List<SyncStateModel> SyncStates = db.SyncStates.ToList();
            ViewData["SyncStateList"] = SyncStates;
            return View();
        }
        [HttpGet]
        public JsonResult GetSyncState()
        {
            int adminSync = db.SyncStates.Where(s => s.TableName == "Admin").FirstOrDefault().IsSync;
            int moodSync = db.SyncStates.Where(m => m.TableName == "Mood").FirstOrDefault().IsSync;
            SyncData syncdata = new SyncData();
            syncdata.Admin = GetAdmin(adminSync);
            syncdata.Moods = GetMoods(moodSync);
            return Json(syncdata,JsonRequestBehavior.AllowGet);
        }
        public String SetSyncState()
        {
            db.SyncStates.Where(s => s.IsSync == 0).Update(s=>new SyncStateModel{
                IsSync =1,
                SyncDate=DateTime.Now
            });
            db.Moods.Where(m => m.SyncState != 0).Update(m=>new MoodModel { SyncState=0});
            return "12345，上山打老虎";
        }
        public AdminModel GetAdmin(int sync)
        {
            if (sync == 1)
            {
                return null;
            }
            else
            {
                AdminModel admin=db.Administrators.Find(1);
                return admin;
            }            
        }
        public List<MoodModel> GetMoods(int sync)
        {
            if (sync == 1)
            {
                return null;
            }
            else
            {
                List<MoodModel> moods =db.Moods.Where(m=>m.SyncState!=0).ToList();
                return moods;
            }            
        }
        public JsonResult AddSyncState(SyncStateModel model)
        {
            model.SyncDate = DateTime.Now;
            db.Entry(model).State = EntityState.Added;
            db.SaveChanges();
            return Json(model);
        }

        public JsonResult RemoveSyncState(int[] stateList)
        {
            db.SyncStates.Where(s => stateList.Contains(s.ID)).Delete();
            return Json(stateList);
        }
    }
}