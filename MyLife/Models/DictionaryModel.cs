using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyLife.Models
{
    public class DictionaryModel
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public int ParentID { get; set; }
        public int DisplayIndex { get; set; }
    }

    public class DictionaryUnit
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public IEnumerable<DictionaryModel> Dictionaries  { get; set; }
    }
}