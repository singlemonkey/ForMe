﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using MyLife.Models;

namespace MyLife.Context
{
    public class MyLifeInitializer:System.Data.Entity.DropCreateDatabaseAlways<MyLifeContext>
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
                    ID=0,
                    Title="桌面",
                    Content="",
                    IsPublish=true,
                    IsStar=false,
                    FileType="folder",
                    ParentID=0,
                    PublishDate=DateTime.Parse("2016-08-24")
                },
                new BlogModel {
                    ID=1,
                    Title="第一篇博客",
                    Content="个人博客系统正式启动，将作为技术与生活的新载体",
                    IsPublish=true,
                    IsStar=false,
                    FileType="document",
                    ParentID=0,
                    PublishDate=DateTime.Parse("2016-08-26")
                },
                new BlogModel {
                    ID=2,
                    Title="第二篇博客",
                    Content="个人博客系统正式启动，将作为技术与生活的新载体",
                    IsPublish=true,
                    IsStar=false,
                    FileType="document",
                    ParentID=0,
                    PublishDate=DateTime.Parse("2016-08-28")
                },
                new BlogModel {
                    ID=3,
                    Title="第一个文件夹",
                    Content="个人博客系统正式启动，将作为技术与生活的新载体",
                    IsPublish=true,
                    IsStar=false,
                    FileType="folder",
                    ParentID=0,
                    PublishDate=DateTime.Parse("2016-08-30")
                },
                new BlogModel {
                    ID=4,
                    Title="第一个文件夹第一篇博客",
                    Content="个人博客系统正式启动，将作为技术与生活的新载体",
                    IsPublish=true,
                    IsStar=false,
                    FileType="document",
                    ParentID=3,
                    PublishDate=DateTime.Parse("2016-09-01")
                }
            };
            blogs.ForEach(b=>context.Blogs.Add(b));
            context.SaveChanges();
        }
    }
}