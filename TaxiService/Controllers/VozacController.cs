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
    [RoutePrefix("api/Vozac")]
    public class VozacController : ApiController
    {
        [HttpPost]
        [Route("IzmeniProfil")]
        public HttpResponseMessage IzmeniProfil([FromBody]Vozac vozac)
        {

            if (vozac.Username == null || vozac.Ime == null || vozac.Prezime == null || vozac.Jmbg == null || vozac.Email == null)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            if (vozac.Username == "" || vozac.Ime == "" || vozac.Prezime == "" || vozac.Jmbg == "" || vozac.Email == "")
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            var input = vozac.Telefon;
            Regex pattern = new Regex(@"\d{8,10}");
            Match match = pattern.Match(input);
            if (!match.Success)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            input = vozac.Jmbg;
            pattern = new Regex(@"\d{13}");
            match = pattern.Match(input);
            if (!match.Success)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            Vozac tempV = null;
            Korisnik k = null;
            k = ListeKorisnika.Instanca.NadjiKorisnika(vozac.Username);
            bool istoKorIme = vozac.Username.Equals(vozac.Password);

            if (!istoKorIme)
            {
                if (k == null)
                {
                    tempV = (Vozac)(k);
                    ListeKorisnika.Instanca.Vozaci.Remove(tempV);
                    tempV.Username = vozac.Username;
                    tempV.Ime = vozac.Ime;
                    tempV.Prezime = vozac.Prezime;
                    tempV.Jmbg = vozac.Jmbg;
                    tempV.Telefon = vozac.Telefon;
                    tempV.Email = vozac.Email;
                    ListeKorisnika.Instanca.Vozaci.Add(tempV);
                    ListeKorisnika.Instanca.UpisiUBazuVozace();
                    return Request.CreateResponse(HttpStatusCode.OK, tempV);
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.Conflict);
                }
            }
            else
            {
                tempV = (Vozac)(k);
                ListeKorisnika.Instanca.Vozaci.Remove(tempV);
                tempV.Username = vozac.Username;
                tempV.Ime = vozac.Ime;
                tempV.Prezime = vozac.Prezime;
                tempV.Jmbg = vozac.Jmbg;
                tempV.Telefon = vozac.Telefon;
                tempV.Email = vozac.Email;
                ListeKorisnika.Instanca.Vozaci.Add(tempV);
                ListeKorisnika.Instanca.UpisiUBazuVozace();
                return Request.CreateResponse(HttpStatusCode.OK, tempV);
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
            ListeKorisnika.Instanca.Vozaci.Remove((Vozac)k);
            k.Password = nova;
            ListeKorisnika.Instanca.Vozaci.Add((Vozac)k);
            ListeKorisnika.Instanca.UpisiUBazuVozace();
            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}
