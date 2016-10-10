using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MyLife.Controllers
{
    public class DictionaryController : BaseController
    {
        // GET: Dictionary
        public ActionResult DictionaryIndex()
        {
            return View();
        }
    }
}