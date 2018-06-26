using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TaxiService.Models
{
    public class Komentar
    {
        public string Opis { get; set; }
        public string DatumObjave { get; set; }
        public string Korisnik { get; set; }
        public int IDVoznje { get; set; }
        public int OcenaVoznje { get; set; }
    }
}