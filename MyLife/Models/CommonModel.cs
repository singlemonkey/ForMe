using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyLife.Models
{
    public class CommonModel
    {

    }
    public class PageInfo
    {
        public bool IsPaging { get; set; }
        public int PageSize { get; set; }
        public int PageIndex { get; set; }
    }
}