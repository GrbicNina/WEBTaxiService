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

            foreach (var item in listeKorisnika.Dispeceri)
            {
                if(item.Username.Equals(username) && item.Password.Equals(password))
                {
                    return item;
                }
            }
            foreach (var item in listeKorisnika.Vozaci)
            {
                if (item.Username.Equals(username) && item.Password.Equals(password))
                {
                    return item;
                }
            }

            foreach (var item in listeKorisnika.Musterije)
            {
                if (item.Username.Equals(username) && item.Password.Equals(password))
                {
                    return item;
                }
            }
            return null;
        }
    }
}
