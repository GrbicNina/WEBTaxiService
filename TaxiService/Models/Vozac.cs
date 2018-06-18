using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TaxiService.Models
{
    public class Vozac : Korisnik
    {
        public Vozac()
        {
            Uloga = Enums.Uloga.Vozac;
            Voznje = new List<Voznja>();
        }
        public Lokacija Lokacija { get; set; }
        public Automobil Automobil { get; set; }
    }
}