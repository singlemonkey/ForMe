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
    
    public class DictionaryController : BaseController
    {
        private MyLifeContext db = new MyLifeContext();

        // GET: Dictionary
        public ActionResult DictionaryIndex()
        {
            var ParentDictionaries = from parentDictionary in db.Dictionarys
                                     where parentDictionary.ParentID == 0
                                     select parentDictionary;
            List<DictionaryUnit> DictionaryUnit = new List<Models.DictionaryUnit>();
            foreach (var dictionary in ParentDictionaries)
            {
                DictionaryUnit unit = new DictionaryUnit();
                unit.ID = dictionary.ID;
                unit.Name = dictionary.Name;

                var ChildrenDictionaries = from childrenDictionary in db.Dictionarys
                                           where childrenDictionary.ParentID == unit.ID orderby childrenDictionary.DisplayIndex
                                           select childrenDictionary;
                unit.Dictionaries = ChildrenDictionaries;
                DictionaryUnit.Add(unit);
            }
            ViewData["data"] = DictionaryUnit;
            return View();
        }

        public JsonResult AddDictionary(string name)
        {
            var list = from item in db.Dictionarys
                       where item.Name==name
                       select item;
            if (list.Count() == 0)
            {
                DictionaryModel dictionary = new DictionaryModel();
                dictionary.Name = name;
                dictionary.DisplayIndex = 0;
                dictionary.ParentID = 0;
                db.Entry(dictionary).State = EntityState.Added;
                db.SaveChanges();
                return Json(dictionary);
            }
            else
            {
                return Json("");
            }
        }

        public JsonResult AddDictionaryItem(int id,string name)
        {
            var list = from item in db.Dictionarys
                       where item.ParentID==id && item.Name == name
                       select item;
            if (list.Count() == 0)
            {
                DictionaryModel dictionary = new DictionaryModel();
                dictionary.DisplayIndex = 0;
                dictionary.Name = name;
                dictionary.ParentID = id;
                db.Entry(dictionary).State = EntityState.Added;
                db.SaveChanges();
                return Json(dictionary);
            }
            else
            {
                return Json("");
            }
        }

        public JsonResult DeleteDictionary(int id)
        {
            DictionaryModel dictionary = db.Dictionarys.Find(id);
            db.Entry(dictionary).State = EntityState.Deleted;
            var dictionarys = from childrenDictionary in db.Dictionarys
                              where childrenDictionary.ParentID == id
                              select childrenDictionary;
            foreach (var item in dictionarys)
            {
                db.Entry(item).State = EntityState.Deleted;
            }
            db.SaveChanges();
            return Json(dictionary);
        }

        public JsonResult GetDictionary(string dictionary)
        {
            DictionaryModel parent = db.Dictionarys.FirstOrDefault(d=>d.Name==dictionary);
            List<DictionaryModel> children= db.Dictionarys.Where(d=>d.ParentID==parent.ID).ToList();
            return Json(children);
        }
    }
}