using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TaxiService.Models;

namespace TaxiService.Controllers
{
    [RoutePrefix("api/Korisnik")]
    public class KorisnikController : ApiController
    {
        public static ListeKorisnika listeKorisnika = new ListeKorisnika();
        [Route("LogIn")]
        public Korisnik LogIn([FromBody]JToken jToken)
        {
            var username = jToken.Value<string>("username");
            var password = jToken.Value<string>("password");

            Korisnik kor = listeKorisnika.NadjiKorisnika(username);

            return kor;
        }

        [Route("RegistrujSe")]
        public string KreirajNalog([FromBody]Musterija musterija)
        {
            string retVal = "ADDED";

            if (musterija.Username == "" || musterija.Username == null)
            {
                return "ERROR";
            }

            Korisnik k = listeKorisnika.NadjiKorisnika(musterija.Username);

            if (k == null)
            {
                listeKorisnika.RegistracijaKorisnika(musterija);
            }
            else
            {
                retVal = "DUPLIKAT";
            }

            return retVal;
        }
    }
}
