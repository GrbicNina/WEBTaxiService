using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Web.Http;
using TaxiService.Models;

namespace TaxiService.Controllers
{
    [RoutePrefix("api/Musterija")]
    public class MusterijaController : ApiController
    {
        [HttpPost]
        [Route("IzmeniProfil")]
        public HttpResponseMessage IzmeniProfil([FromBody]Musterija musterija)
        {
            
            if (musterija.Username == null || musterija.Ime == null || musterija.Prezime == null || musterija.Jmbg == null ||  musterija.Email ==null)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            if(musterija.Username == "" || musterija.Ime == "" || musterija.Prezime == "" || musterija.Jmbg == "" || musterija.Email == "")
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            var input = musterija.Telefon;
            Regex pattern = new Regex(@"\d{8,10}");
            Match match = pattern.Match(input);
            if (!match.Success)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest); 
            }

            input = musterija.Jmbg;
            pattern = new Regex(@"\d{13}");
            match = pattern.Match(input);
            if (!match.Success)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            Musterija tempM = null;
            Korisnik k = null;
            k = ListeKorisnika.Instanca.NadjiKorisnika(musterija.Username);
            bool istoKorIme = musterija.Username.Equals(musterija.Password);

            if (!istoKorIme)
            {
                if (k == null)
                {
                    tempM = (Musterija)(k);
                    ListeKorisnika.Instanca.Musterije.Remove(tempM);
                    tempM.Username = musterija.Username;
                    tempM.Ime = musterija.Ime;
                    tempM.Prezime = musterija.Prezime;
                    tempM.Jmbg = musterija.Jmbg;
                    tempM.Telefon = musterija.Telefon;
                    tempM.Email = musterija.Email;
                    ListeKorisnika.Instanca.Musterije.Add(tempM);
                    ListeKorisnika.Instanca.UpisiUBazuMusterije();
                    return Request.CreateResponse(HttpStatusCode.OK, tempM);
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.Conflict);
                }
            }
            else
            {
                tempM = (Musterija)(k);
                ListeKorisnika.Instanca.Musterije.Remove(tempM);
                tempM.Username = musterija.Username;
                tempM.Ime = musterija.Ime;
                tempM.Prezime = musterija.Prezime;
                tempM.Jmbg = musterija.Jmbg;
                tempM.Telefon = musterija.Telefon;
                tempM.Email = musterija.Email;
                ListeKorisnika.Instanca.Musterije.Add(tempM);
                ListeKorisnika.Instanca.UpisiUBazuMusterije();
                return Request.CreateResponse(HttpStatusCode.OK, tempM);
            }
        }
        [Route("IzmeniSifru")]
        public HttpResponseMessage IzmeniSifru([FromBody]JToken jToken)
        {
            var username = jToken.Value<string>("username");
            var stara = jToken.Value<string>("stara");
            var nova = jToken.Value<string>("nova");
            if(stara.Equals("") || nova.Equals(""))
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            Korisnik k = ListeKorisnika.Instanca.NadjiKorisnika(username);
            ListeKorisnika.Instanca.Musterije.Remove((Musterija)k);
            k.Password = nova;
            ListeKorisnika.Instanca.Musterije.Add((Musterija)k);
            ListeKorisnika.Instanca.UpisiUBazuMusterije();
            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}
