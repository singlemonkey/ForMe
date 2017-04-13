using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using MyLife.Models;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using EntityFramework.Extensions;

namespace MyLife.Context
{
    public class MyLifeContext:DbContext
    {
        public MyLifeContext() : base("MyLifeConnection") {

        }
        public DbSet<AdminModel> Administrators { get; set; }
        public DbSet<BlogModel> Blogs { get; set; }
        public DbSet<DictionaryModel> Dictionarys { get; set; }
        public DbSet<CostModel> Costs { get; set; }
        public DbSet<WishModel> Wishs { get; set; }
        public DbSet<SyncStateModel> SyncStates { get; set; }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AdminModel>().ToTable("Admin");
            modelBuilder.Entity<BlogModel>().ToTable("Blog");
            modelBuilder.Entity<DictionaryModel>().ToTable("Dictionary");
            modelBuilder.Entity<CostModel>().ToTable("Cost");
            modelBuilder.Entity<WishModel>().ToTable("Wish");
            modelBuilder.Entity<SyncStateModel>().ToTable("SyncState");
            base.OnModelCreating(modelBuilder);
        }
    }
}