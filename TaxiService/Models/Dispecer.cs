using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TaxiService.Models
{
    public class Dispecer : Korisnik
    {
        public Dispecer()
        {
            Uloga = Enums.Uloga.Dispecer;
            Voznje = new List<Voznja>();
        }
    }
}