using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using static TaxiService.Models.Enums;

namespace TaxiService.Models
{
    public class Automobil
    {
        public string Vozac { get; set; }
        public string GodisteAutomobila { get; set; }
        public string BrojRegistarskeOznake { get; set; }
        public string IdVozila { get; set; }
        public TipAutomobila TipAutomobila { get; set; }
    }
}