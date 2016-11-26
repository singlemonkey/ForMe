using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.ComponentModel.DataAnnotations.Schema;

namespace MyLife.Models
{
    public class CostModel
    {
        public int ID { get; set; }
        public decimal Money { get; set; }
        /// <summary>
        /// 消费类型
        /// </summary>
        public int CostType { get; set; }
        public DateTime CostDate { get; set; }
        /// <summary>
        /// 支付类型
        /// </summary>
        public int PayType { get; set; }
        public string Description { get; set; }
    }
}