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
            var administrators = new List<AdminModel> {
                new AdminModel {
                    Account="903012206",
                    Password="missyou?",
                    Name="日光倾城",
                    Balance=0
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