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
        }
    }
}