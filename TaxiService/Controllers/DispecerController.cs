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
    [RoutePrefix("api/Dispecer")]
    public class DispecerController : ApiController
    {
        [HttpPost]
        [Route("IzmeniProfil")]
        public HttpResponseMessage IzmeniProfil([FromBody]Dispecer dispecer)
        {

            if (dispecer.Username == null || dispecer.Ime == null || dispecer.Prezime == null || dispecer.Jmbg == null || dispecer.Email == null)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            if (dispecer.Username == "" || dispecer.Ime == "" || dispecer.Prezime == "" || dispecer.Jmbg == "" || dispecer.Email == "")
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            var input = dispecer.Telefon;
            Regex pattern = new Regex(@"\d{8,10}");
            Match match = pattern.Match(input);
            if (!match.Success)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            input = dispecer.Jmbg;
            pattern = new Regex(@"\d{13}");
            match = pattern.Match(input);
            if (!match.Success)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            Dispecer tempD = null;
            Korisnik k = null;
            k = ListeKorisnika.Instanca.NadjiKorisnika(dispecer.Username);
            bool istoKorIme = dispecer.Username.Equals(dispecer.Password);

            if(!istoKorIme)
            {
                if(k == null)
                {
                    tempD = (Dispecer)(k);
                    ListeKorisnika.Instanca.Dispeceri.Remove(tempD);
                    tempD.Username = dispecer.Username;
                    tempD.Ime = dispecer.Ime;
                    tempD.Prezime = dispecer.Prezime;
                    tempD.Jmbg = dispecer.Jmbg;
                    tempD.Telefon = dispecer.Telefon;
                    tempD.Email = dispecer.Email;
                    ListeKorisnika.Instanca.Dispeceri.Add(tempD);
                    ListeKorisnika.Instanca.UpisiUBazuDispecere();
                    return Request.CreateResponse(HttpStatusCode.OK, tempD);
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.Conflict);
                }
            }else
            {
                tempD = (Dispecer)(k);
                ListeKorisnika.Instanca.Dispeceri.Remove(tempD);
                tempD.Username = dispecer.Username;
                tempD.Ime = dispecer.Ime;
                tempD.Prezime = dispecer.Prezime;
                tempD.Jmbg = dispecer.Jmbg;
                tempD.Telefon = dispecer.Telefon;
                tempD.Email = dispecer.Email;
                ListeKorisnika.Instanca.Dispeceri.Add(tempD);
                ListeKorisnika.Instanca.UpisiUBazuDispecere();
                return Request.CreateResponse(HttpStatusCode.OK, tempD);
            }
          
        }
        [Route("IzmeniSifru")]
        public HttpResponseMessage IzmeniSifru([FromBody]JToken jToken)
        {
            var username = jToken.Value<string>("username");
            var stara = jToken.Value<string>("stara");
            var nova = jToken.Value<string>("nova");
            if (stara.Equals("") || nova.Equals(""))
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            Korisnik k = ListeKorisnika.Instanca.NadjiKorisnika(username);
            ListeKorisnika.Instanca.Dispeceri.Remove((Dispecer)k);
            k.Password = nova;
            ListeKorisnika.Instanca.Dispeceri.Add((Dispecer)k);
            ListeKorisnika.Instanca.UpisiUBazuDispecere();
            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}
