using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TaxiService.Models
{
    public class Adresa
    {
        public Adresa() { }
        public string Ulica { get; set; }
        public int Broj { get; set; }
        public string NaseljenoMesto { get; set; }
        public int PozivniBrojMesta { get; set; }
    }
}