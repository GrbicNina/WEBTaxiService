using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Web;
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
        [HttpGet]
        [Route("VratiVoznjeNaCekanju")]
        public HttpResponseMessage VratiVoznjeNaCekanju()
        {
            var response = new HttpResponseMessage();
            string result = "";
            if (HttpContext.Current.Application["voznjeNaCekanju"] == null)
            {
                result += "<h4>Trenutno nema voznji na cekanju!</h4>";
                response.Content = new StringContent(result);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                response.StatusCode = HttpStatusCode.BadRequest;
                return response;
            }
            else
            {
                List<Voznja> voznjeCekaju = (List<Voznja>)HttpContext.Current.Application["voznjeNaCekanju"];
                result += String.Format(@"<table align = ""center"" border = ""2""><tr><th>Vreme porudzbine:</th></tr>");
                result += "<tr><th>Vreme porudzbine:</th>";
                result += "<th>Ulica:</th>";
                result += "<th>Broj:</th>";
                result += "<th>Mesto:</th>";
                result += "<th>Pozivni broj mesta:</th><tr>";
                foreach (var item in voznjeCekaju)
                {
                    result += String.Format("<tr><td>{0}</td>", item.VremePorudzbine);
                    result += String.Format("<td>{0}</td>", item.StartLokacija.Adresa.Ulica);
                    result += String.Format("<td>{0}</td>", item.StartLokacija.Adresa.Broj);
                    result += String.Format("<td>{0}</td>", item.StartLokacija.Adresa.PozivniBrojMesta);
                    result += String.Format(@"<td><button value=""{0}"" class=""prihvatiVoznjuButtonClass"">Prihvati</button></td></tr>", item.IDVoznje);

                }
                result += "</table>";
                response.Content = new StringContent(result);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                response.StatusCode = HttpStatusCode.OK;
                return response;
            }
        }
        [HttpPost]
        [Route("PrihvatiVoznju")]
        public HttpResponseMessage PrihvatiVoznju([FromBody]JToken jToken)
        {
            var idVoznje = jToken.Value<int>("IDVoznje");
            var username = jToken.Value<string>("username");
            var response = new HttpResponseMessage();
            string result = "";
            Voznja v = ListeKorisnika.Instanca.Voznje.Find(x => x.IDVoznje == idVoznje);
            if (v != null)
            {
                Vozac temp = ListeKorisnika.Instanca.Vozaci.Find(x => x.Username.Equals(username));
                if(temp != null)
                {
                    List<Voznja> voznjeCekaju = (List<Voznja>)HttpContext.Current.Application["voznjeNaCekanju"];
                    voznjeCekaju.Remove(v);

                    ListeKorisnika.Instanca.Voznje.Remove(v);
                    v.Status = Enums.StatusVoznje.Prihvacena;
                    temp.Zauzet = true;
                    v.Vozac = temp;
                    ListeKorisnika.Instanca.Voznje.Add(v);
                
                    ListeKorisnika.Instanca.Vozaci.Remove(ListeKorisnika.Instanca.Vozaci.Find(x => x.Username.Equals(username)));
                    ListeKorisnika.Instanca.Vozaci.Add(temp);
                    result += "<h4>Uspesno ste prihvatili voznju!</h4>";
                    response.Content = new StringContent(result);
                    response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                    response.StatusCode = HttpStatusCode.OK;
                    return response;
                }
                else
                {
                    result += "<h4>Desila se greska prilikom prihvacenja voznje!</h4>";
                    response.Content = new StringContent(result);
                    response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                    response.StatusCode = HttpStatusCode.BadRequest;
                    return response;
                }               
            }
            else
            {
                result += "<h4>Desila se greska prilikom prihvacenja voznje!</h4>";
                response.Content = new StringContent(result);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                response.StatusCode = HttpStatusCode.BadRequest;
                return response;
            }
        }
    }
}
