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
                    Title="第一条博客",
                    Introduction="这些年空空如也",
                    Content="个人博客系统正式启动，将作为技术与生活的新载体",
                    IsPublish=true,
                    IsStar=false,  
                    FileType="document",
                    ParentID=0,                  
                    PublishDate=DateTime.Now
                }
            };
            blogs.ForEach(b=>context.Blogs.Add(b));
            context.SaveChanges();
        }
    }
}