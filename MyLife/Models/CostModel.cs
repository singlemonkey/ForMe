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
        public decimal Amount { get; set; }
        public int CostType { get; set; }
        public DateTime CostDate { get; set; }
        public int PayType { get; set; }
        public decimal Wages { get; set; }
    }
}