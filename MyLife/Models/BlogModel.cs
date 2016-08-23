using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyLife.Models
{
    public class BlogModel
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string Introduction { get; set; }
        public string Content { get; set; }
        public bool IsPublish { get; set; }
        public DateTime PublishDate { get; set; }
    }
}