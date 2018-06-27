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
            Vozac = new Vozac();
            Komentar = new Komentar();
        }
        public DateTime VremePorudzbine { get; set; }
        public Lokacija StartLokacija { get; set; }
        public TipAutomobila ZeljeniTipAutomobila { get; set; }
        public string Musterija { get; set; }
        public string Dispecer { get; set; }
        public Vozac Vozac { get; set; }
        public Lokacija EndLokacija { get; set; }
        public double Iznos { get; set; }
        public StatusVoznje Status { get; set; }
        public Komentar Komentar { get; set; }
        public int IDVoznje { get; set; }
    }
}