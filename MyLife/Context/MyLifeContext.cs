using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using MyLife.Models;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace MyLife.Context
{
    public class MyLifeContext:DbContext
    {
        public MyLifeContext() : base("MyLifeContext") {

        }
        public DbSet<AdminModel> Administrators { get; set; }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}