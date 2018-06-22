using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TaxiService.Models
{
    public class Lokacija
    {
        public Lokacija()
        {
            Adresa = new Adresa();
        }
        public string XKoordinata { get; set; }
        public string YKoordinata { get; set; }
        public Adresa Adresa { get; set; }
    }
}