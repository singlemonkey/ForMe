using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyLife.Models
{
    public class SyncStateModel
    {
        public int ID { get; set; }
        public string TableName { get; set; }
        public string Desc { get; set; }
        /// <summary>
        /// 同步状态，为1则已同步，为0则未同步
        /// </summary>
        public int IsSync { get; set; }
        public DateTime? SyncDate { get; set; }
    }
}