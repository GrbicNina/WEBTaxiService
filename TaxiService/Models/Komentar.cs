using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TaxiService.Models
{
    public class Komentar
    {
        public string Opis { get; set; }
        public DateTime DatumObjave { get; set; }
        public string Korisnik { get; set; }
        public string IDVoznje { get; set; }
        public string OcenaVoznje { get; set; }
    }
}