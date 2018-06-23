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
        public string Musterija { get; set; }
        public Lokacija EndLokacija { get; set; }
        public string Dispecer { get; set; }
        public string Vozac { get; set; }
        public double Iznos { get; set; }
        public string Komentar { get; set; }
        public StatusVoznje Status { get; set; }
        public string IDVoznje { get; set; }
    }
}