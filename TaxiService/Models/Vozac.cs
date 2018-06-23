using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TaxiService.Models
{
    public class Vozac : Korisnik
    {
        public bool Zauzet { get; set; }
        public Vozac()
        {
            Uloga = Enums.Uloga.Vozac;
            Voznje = new List<Voznja>();
            Lokacija = new Lokacija();
            Automobil = new Automobil();
            Zauzet = false;
        }
        public Lokacija Lokacija { get; set; }
        public Automobil Automobil { get; set; }
    }
}