using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyLife.Models
{
    public class WishModel
    {
        public int ID { get; set; }
        public string Name { get; set; }

        /// <summary>
        /// 心急程度0->1,1->0.9,2->0.7,3->0.5,4->0.3,5->0.1
        /// </summary>
        public int Degree { get; set; }
        /// <summary>
        /// 1=>已买，0=>可买，-1=>冷冻期
        /// </summary>
        public int Flag { get; set; }

        /// <summary>
        /// 说明为何想要买这个东西
        /// </summary>
        public string Info { get; set; }
        public decimal Price { get; set; }

        public DateTime? CreateDate { get; set; }
        /// <summary>
        /// 过了解冻期的物品方可购买
        /// </summary>
        public DateTime? EndDate { get; set; }
    }
    public class WishQueryModel
    {
        public string Name { get; set; }
    }
    public class WishPageQuery
    {
        public PageInfo PageInfo { get; set; }
        public WishQueryModel QueryInfo { get; set; }
    }
}