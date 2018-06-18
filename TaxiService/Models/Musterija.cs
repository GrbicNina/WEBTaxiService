using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TaxiService.Models
{
    public class Musterija : Korisnik
    {
        public Musterija()
        {
            Uloga = Enums.Uloga.Musterija;
            Voznje = new List<Voznja>();
        }
    }
}