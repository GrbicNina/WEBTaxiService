using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using static TaxiService.Models.Enums;

namespace TaxiService.Models
{
    public class Voznja
    {
        public Voznja()
        {
            StartLokacija = new Lokacija();
            EndLokacija = new Lokacija();
        }
        public string VremePorudzbine { get; set; }
        public Lokacija StartLokacija { get; set; }
        public TipAutomobila ZeljeniTipAutomobila { get; set; }
        public Musterija Musterija { get; set; }
        public Dispecer Dispecer { get; set; }
        public Vozac Vozac { get; set; }
        public Lokacija EndLokacija { get; set; }
        public double Iznos { get; set; }
        public StatusVoznje Status { get; set; }
        public string Komentar { get; set; }
        public int IDVoznje { get; set; }
    }
}