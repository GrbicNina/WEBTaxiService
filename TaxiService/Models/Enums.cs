using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TaxiService.Models
{
    public static class Enums
    {
        public enum Pol
        {
            Muski,
            Zenski
        }

        public enum Uloga
        {
            Musterija,
            Dispecer,
            Vozac
        }

        public enum TipAutomobila
        {
            PutnickiAutomobil,
            KombiVozilo,
            Svejedno
        }

        public enum StatusVoznje
        {
            Kreirana,
            Formirana,
            Obradjena,
            Prihvacena,
            Otkazana,
            Neuspesna,
            Uspesna
        }
    }
}