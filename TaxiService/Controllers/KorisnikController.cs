using Newtonsoft.Json;
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
        public HttpResponseMessage LogIn([FromBody]JToken jToken)
        {
            var username = jToken.Value<string>("username");
            var password = jToken.Value<string>("password");

            var response = new HttpResponseMessage();

            Korisnik kor = ListeKorisnika.Instanca.NadjiKorisnika(username);
            try
            {
                if (kor.Password.Equals(password))
                {
                    if (HttpContext.Current.Application["ulogovani"] == null)
                    {
                        HttpContext.Current.Application["ulogovani"] = new List<Korisnik>();
                    }
                    List<Korisnik> ulogovani = (List<Korisnik>)HttpContext.Current.Application["ulogovani"];
                    ulogovani.Add(kor);
                    HttpContext.Current.Application["ulogovani"] = ulogovani;
                    //kor.Voznje = null;
                    var json = JsonConvert.SerializeObject(kor);
                    return Request.CreateResponse(HttpStatusCode.OK, json);
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest);
                }
            }
            catch
            {
                return Request.CreateResponse(HttpStatusCode.Conflict);
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
