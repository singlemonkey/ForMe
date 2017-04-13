using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using MyLife.Models;

namespace MyLife.Context
{
    public class MyLifeInitializer : System.Data.Entity.DropCreateDatabaseAlways<MyLifeContext>
    {
        protected override void Seed(MyLifeContext context)
        {
            var SyncStates = new List<SyncStateModel>{
                new SyncStateModel{
                    Desc="用户信息数据更新",
                    IsSync=0,
                    TableName="Admin",
                    SyncDate=null
                }
            };
            SyncStates.ForEach(s=>context.SyncStates.Add(s));
            context.SaveChanges();

            var Wishs = new List<WishModel> {
                new WishModel {
                    ID=1,
                    CreateDate=DateTime.Parse("2016-11-24"),
                    Degree=5,
                    EndDate=DateTime.Parse("2017-12-24"),
                    Info="学习编程",
                    Name="imac台式电脑",
                    Price=300,
                    Flag=-1,
                   
                },
            };
            Wishs.ForEach(w=>context.Wishs.Add(w));
            context.SaveChanges();

            var costs = new List<CostModel> {
                new CostModel {
                    Money=2000,
                    GoodName="女朋友",
                    CostDate=DateTime.Parse("2016-11-24"),
                    Description="质量好，不漏气，值得拥有",
                    CostType=2,
                    PayType=6
                }
            };
            costs.ForEach(c=>context.Costs.Add(c));
            context.SaveChanges();

            var administrators = new List<AdminModel> {
                new AdminModel {
                    Account="903012206",
                    Password="missyou?",
                    Name="日光倾城",
                    Wages=3000,
                    ImgUrl="/Frontend/images/Admin/admin.jpeg",
                    Sign="我要怼死你"
               
                }
            };
            administrators.ForEach(a => context.Administrators.Add(a));
            context.SaveChanges();

            var blogs = new List<BlogModel> {
                new BlogModel {
                    Title="桌面",
                    Content="",
                    IsPublish=true,
                    IsStar=false,
                    FileType="folder",
                    ParentID=1,
                    CreateDate=DateTime.Parse("2016-06-24"),
                    DisplayIndex=1
                },
            };
            blogs.ForEach(b => context.Blogs.Add(b));
            context.SaveChanges();

            var dictionarys = new List<DictionaryModel> {
                new DictionaryModel {
                    Name="消费类型",
                    ParentID=0,
                    DisplayIndex=0
                },
                new DictionaryModel {
                    Name="学习",
                    ParentID=1,
                    DisplayIndex=1
                },
                new DictionaryModel {
                    Name="餐饮",
                    ParentID=1,
                    DisplayIndex=2
                },
                new DictionaryModel {
                    Name="穿着",
                    ParentID=1,
                    DisplayIndex=3
                },
                new DictionaryModel {
                    Name="支付类型",
                    ParentID=0,
                    DisplayIndex=0
                },
                new DictionaryModel {
                    Name="现金",
                    ParentID=5,
                    DisplayIndex=1
                },
                new DictionaryModel {
                    Name="刷卡",
                    ParentID=5,
                    DisplayIndex=2
                },
                new DictionaryModel {
                    Name="转账",
                    ParentID=5,
                    DisplayIndex=3
                },
            };
            dictionarys.ForEach(d=>context.Dictionarys.Add(d));
            context.SaveChanges();
        }
    }
}