using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using MyLife.Models;

namespace MyLife.Context
{
    public class MyLifeInitializer:System.Data.Entity.DropCreateDatabaseIfModelChanges<MyLifeContext>
    {
        protected override void Seed(MyLifeContext context)
        {
            var administrators = new List<AdminModel> {
                new AdminModel {
                    Account="903012206",
                    Password="missyou?",
                    Name="日光倾城",
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
            blogs.ForEach(b=>context.Blogs.Add(b));
            context.SaveChanges();
        }
    }
}