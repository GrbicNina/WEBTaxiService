using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using static TaxiService.Models.Enums;

namespace TaxiService.Models
{
    public class Voznja
    {
        public DateTime VremePorudzbine { get; set; }
        public string LokacijaDolaska { get; set; }
        public TipAutomobila ZeljeniTipAutomobila { get; set; }
        public Musterija Musterija { get; set; }
        public string LokacijaOdlaska { get; set; }
        public Dispecer Dispecer { get; set; }
        public Vozac Vozac { get; set; }
        public double Iznos { get; set; }
        public string Komentar { get; set; }
        public StatusVoznje Status { get; set; }
    }
}