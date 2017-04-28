using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyLife.Models
{
    public class AdminModel
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Account { get; set; }
        public string Password { get; set; }
        /// <summary>
        /// 头像服务器地址
        /// </summary>
        public string ImgUrl { get; set; }
        /// <summary>
        /// 签名
        /// </summary>
        public string Sign { get; set; }

        public virtual IEnumerable<WorkModel> Works { get; set; }
    }

    public class WorkModel
    {
        public int ID { get; set; }
        /// <summary>
        /// 入职时间
        /// </summary>
        public DateTime Date { get; set; }
        /// <summary>
        /// 所在单位
        /// </summary>
        public string CompanyName { get; set; }
        /// <summary>
        /// 职位名称
        /// </summary>
        public string PostName { get; set; }
        /// <summary>
        /// 工资
        /// </summary>
        public decimal? Wages { get; set; }

        public virtual AdminModel Admin { get; set; }
    }
}