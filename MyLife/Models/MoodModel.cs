using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyLife.Models
{
    public class MoodModel
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime Datetime { get; set; }
        /// <summary>
        /// 数据同步状态0=>已同步，1=>添加未同步，2=>修改未同步，3=>删除未同步
        /// </summary>
        public int SyncState { get; set; }
    }
}