using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using TaxiService.Models;

namespace TaxiService.Controllers
{
    [RoutePrefix("api/Korisnik")]
    public class KorisnikController : ApiController
    {
        [Route("LogIn")]
        public Korisnik LogIn([FromBody]JToken jToken)
        {
            var username = jToken.Value<string>("username");
            var password = jToken.Value<string>("password");

            Korisnik kor = ListeKorisnika.Instanca.NadjiKorisnika(username);
            if(kor.Password.Equals(password))
            {
                if(HttpContext.Current.Application["ulogovani"] == null)
                {
                    HttpContext.Current.Application["ulogovani"] = username;
                }
                var ulogovan = HttpContext.Current.Application["ulogovani"];

                return kor;
            }else
            {
                return null;
            }
        }

        [Route("RegistrujSe")]
        public string KreirajNalog([FromBody]Musterija musterija)
        {
            string retVal = "ADDED";

            if (musterija.Username == "" || musterija.Username == null)
            {
                return "ERROR";
            }

            Korisnik k = ListeKorisnika.Instanca.NadjiKorisnika(musterija.Username);

            if (k == null)
            {
                ListeKorisnika.Instanca.RegistracijaKorisnika(musterija);
            }
            else
            {
                retVal = "DUPLIKAT";
            }

            return retVal;
        }
    }
}
