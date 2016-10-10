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
        public MyLifeContext() : base("MyLifeConnection") {

        }
        public DbSet<AdminModel> Administrators { get; set; }
        public DbSet<BlogModel> Blogs { get; set; }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AdminModel>().ToTable("Admin");
            modelBuilder.Entity<BlogModel>().ToTable("Blog");
            base.OnModelCreating(modelBuilder);
        }

        public System.Data.Entity.DbSet<MyLife.Models.DictionaryModel> DictionaryModels { get; set; }
    }
}