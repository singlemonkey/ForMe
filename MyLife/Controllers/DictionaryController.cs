using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using MyLife.Models;
using MyLife.Context;

namespace MyLife.Controllers
{
    
    public class DictionaryController : BaseController
    {
        private MyLifeContext db = new MyLifeContext();

        // GET: Dictionary
        public ActionResult DictionaryIndex()
        {
            var dictionarys = db.Dictionarys.ToLookup(i=>i.ParentID,i=>i.Name);
            return View();
        }
    }
}