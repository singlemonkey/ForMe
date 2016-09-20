using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.ComponentModel.DataAnnotations.Schema;

namespace MyLife.Models
{
    public class BlogModel
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int ID { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public bool IsPublish { get; set; }
        public bool IsStar { get; set; }
        public string FileType { get; set; }
        public int ParentID { get; set; }
        public DateTime PublishDate { get; set; }
        public int DisplayIndex { get; set; }
    }
}