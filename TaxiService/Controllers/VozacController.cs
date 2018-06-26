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
        [Route("VratiVoznjePocetna/{username}")]
        public HttpResponseMessage VratiVoznjePocetna(string username)
        {
            var response = new HttpResponseMessage();
            string result = "";
            List<Voznja> voznjeVozaca = new List<Voznja>();
            foreach (var item in ListeKorisnika.Instanca.Voznje)
            {
                if(item.Vozac.Username != null)
                {
                    if (item.Vozac.Username.Equals(username))
                    {
                        voznjeVozaca.Add(item);
                    }
                }
            }
            if (voznjeVozaca.Count != 0)
            {
                result += "<h4>Voznje na kojima ste angazovani</h4>";
                result += String.Format(@"<table align = ""center"" border = ""1"">");
                result += "<tr><th>Vreme porudzbine:</th>";
                result += "<th>[START]Ulica:</th>";
                result += "<th>[START]Broj:</th>";
                result += "<th>[START]Mesto:</th>";
                result += "<th>[START]Pozivni broj mesta:</th>";
                result += "<th>Zeljeni tip vozila:</th>";
                result += "<th>Status voznje</th>";
                result += "<th>[END]Ulica</th>";
                result += "<th>[END]Broj</th>";
                result += "<th>[END]Mesto</th>";
                result += "<th>[END]Pozivni broj mesta:</th>";
                result += "<th>Iznos voznje</th><tr>";
                foreach (var item in voznjeVozaca)
                {
                    if(item.Status == Enums.StatusVoznje.Uspesna || item.Status == Enums.StatusVoznje.Neuspesna || item.Status == Enums.StatusVoznje.Otkazana)
                    {
                        result += String.Format("<tr><td>{0}</td>", item.VremePorudzbine);
                        result += String.Format("<td>{0}</td>", item.StartLokacija.Adresa.Ulica);
                        result += String.Format("<td>{0}</td>", item.StartLokacija.Adresa.Broj);
                        result += String.Format("<td>{0}</td>", item.StartLokacija.Adresa.NaseljenoMesto);
                        result += String.Format("<td>{0}</td>", item.StartLokacija.Adresa.PozivniBrojMesta);
                        result += String.Format("<td>{0}</td>", item.ZeljeniTipAutomobila.ToString());
                        result += String.Format("<td>{0}</td>", item.Status);
                        result += String.Format("<td>{0}</td>", item.EndLokacija.Adresa.Ulica);
                        result += String.Format("<td>{0}</td>", item.EndLokacija.Adresa.Broj);
                        result += String.Format("<td>{0}</td>", item.EndLokacija.Adresa.NaseljenoMesto);
                        result += String.Format("<td>{0}</td>", item.EndLokacija.Adresa.PozivniBrojMesta);
                        result += String.Format("<td>{0}</td></tr>", item.Iznos);
                    }else
                    {
                        result += String.Format("<tr><td>{0}</td>", item.VremePorudzbine);
                        result += String.Format("<td>{0}</td>", item.StartLokacija.Adresa.Ulica);
                        result += String.Format("<td>{0}</td>", item.StartLokacija.Adresa.Broj);
                        result += String.Format("<td>{0}</td>", item.StartLokacija.Adresa.NaseljenoMesto);
                        result += String.Format("<td>{0}</td>", item.StartLokacija.Adresa.PozivniBrojMesta);
                        result += String.Format("<td>{0}</td>", item.ZeljeniTipAutomobila.ToString());
                        result += String.Format("<td>{0}</td>", item.Status);
                        result += String.Format("<td> </td>");
                        result += String.Format("<td> </td>");
                        result += String.Format("<td> </td>");
                        result += String.Format("<td> </td>");
                        result += String.Format("<td> </td></tr>");
                    }
                   
                }
                result += "</table>";
                response.Content = new StringContent(result);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                response.StatusCode = HttpStatusCode.OK;
                return response;
            }
            else
            {
                result += "<h4>Niste bili angazovani ni na jednoj voznji!</h4>";
                response.Content = new StringContent(result);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                response.StatusCode = HttpStatusCode.BadRequest;
                return response;
            }
        }

        [HttpGet]
        [Route("VratiVoznjeNaCekanju/{username}")]
        public HttpResponseMessage VratiVoznjeNaCekanju(string username)
        {
            var response = new HttpResponseMessage();
            string result = "";
            List<Voznja> sveVoznjeNaCekanju = (List<Voznja>)HttpContext.Current.Application["voznjeNaCekanju"];
            if(sveVoznjeNaCekanju == null)
            {
                result += "<h4>Trenutno nema voznji na cekanju!</h4>";
                response.Content = new StringContent(result);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                response.StatusCode = HttpStatusCode.BadRequest;
                return response;
            }

            Vozac v = ListeKorisnika.Instanca.Vozaci.Find(x => x.Username.Equals(username));
            List<Voznja> voznjeCekaju = new List<Voznja>();
            foreach (var item in sveVoznjeNaCekanju)
            {
                if (item.ZeljeniTipAutomobila == Enums.TipAutomobila.Svejedno || item.ZeljeniTipAutomobila == v.Automobil.TipAutomobila)
                {
                    voznjeCekaju.Add(item);
                }
            }

            if (voznjeCekaju.Count == 0)
            {
                result += "<h4>Trenutno nema voznji na cekanju!</h4>";
                response.Content = new StringContent(result);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                response.StatusCode = HttpStatusCode.BadRequest;
                return response;
            }
            else
            {
                result += String.Format(@"<table align = ""center"" border = ""1"">");
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
                    HttpContext.Current.Application["voznjeNaCekanju"] = voznjeCekaju;

                    ListeKorisnika.Instanca.Voznje.Remove(v);
                    v.Status = Enums.StatusVoznje.Prihvacena;
                    temp.Zauzet = true;
                    v.Vozac.Username = temp.Username;
                    v.Vozac.Zauzet = true;
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

        [HttpPost]
        [Route("IzmeniLokaciju")]
        public HttpResponseMessage IzmeniLokaciju([FromBody]JToken jToken)
        {
            var username = jToken.Value<string>("username");
            var novaUlica = jToken.Value<string>("novaUlica");
            var noviBroj = jToken.Value<int>("noviBroj");
            var novoMesto = jToken.Value<string>("novoMesto");
            var noviPozivniBroj = jToken.Value<int>("noviPozivniBroj");

            string result = "";
            HttpResponseMessage response = new HttpResponseMessage();

            if (novaUlica == "" || noviBroj == 0 || novoMesto == "" || noviPozivniBroj == 0)
            {
                result += "<h4>Niste dobro popunili podatke o svojoj trenutnoj lokaciji!</h4>";
                response.Content = new StringContent(result);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                response.StatusCode = HttpStatusCode.BadRequest;
                return response;
            }

            Vozac v = ListeKorisnika.Instanca.Vozaci.Find(x => x.Username.Equals(username));
            if (v != null)
            {
                ListeKorisnika.Instanca.Vozaci.Remove(v);
                v.Lokacija.Adresa.Ulica = novaUlica;
                v.Lokacija.Adresa.Broj = noviBroj;
                v.Lokacija.Adresa.NaseljenoMesto = novoMesto;
                v.Lokacija.Adresa.PozivniBrojMesta = noviPozivniBroj;
                ListeKorisnika.Instanca.Vozaci.Add(v);
                ListeKorisnika.Instanca.UpisiUBazuVozace();
                result += "<h4>Uspesno ste promenili svoju trenutnu lokaciju!</h4>";
                response.Content = new StringContent(result);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                response.StatusCode = HttpStatusCode.OK;
                return response;
            }
            else
            {
                result += "<h4>Desila se greska prilikom izmene Vase lokacije!</h4>";
                response.Content = new StringContent(result);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                response.StatusCode = HttpStatusCode.Conflict;
                return response;
            }
        }

        [HttpGet]
        [Route("GetVoznjaZaIzmenuStatusa")]
        public HttpResponseMessage GetVoznjaZaIzmenuStatusa(string username)
        {
            //string username = HttpContext.Current.Application["ulogovani"].ToString();
            string usernameUlogovanog = username;
            Vozac v = ListeKorisnika.Instanca.Vozaci.Find(x => x.Username.Equals(usernameUlogovanog));
            string result = "";
            HttpResponseMessage response = new HttpResponseMessage();
            if (v.Username != "")
            {
                Voznja voznjaVozaca = new Voznja();
                foreach (var item in ListeKorisnika.Instanca.Voznje)
                {
                    if(item.Vozac.Username != null)
                    {
                        if (item.Vozac.Username.Equals(v.Username) && item.Vozac.Zauzet)
                        {
                            voznjaVozaca = item;
                            break;
                        }
                    }

                }

                if (voznjaVozaca.Vozac.Username != null)
                {
                    result += String.Format("<table><tr><th>Vreme porudzbine</th><td>{0}</td></tr>", voznjaVozaca.VremePorudzbine);
                    result += String.Format("<tr><th>Ulica</th><td>{0}</td></tr>", voznjaVozaca.StartLokacija.Adresa.Ulica);
                    result += String.Format("<tr><th>Broj</th><td>{0}</td></tr>", voznjaVozaca.StartLokacija.Adresa.Broj);
                    result += String.Format("<tr><th>Mesto</th><td>{0}</td></tr>", voznjaVozaca.StartLokacija.Adresa.NaseljenoMesto);
                    result += String.Format("<tr><th>Pozivni broj</th><td>{0}</td></tr>", voznjaVozaca.StartLokacija.Adresa.PozivniBrojMesta);
                    string status = "";
                    if(voznjaVozaca.Status == Enums.StatusVoznje.Prihvacena)
                    {
                        status = "Prihvacena";
                    }else if(voznjaVozaca.Status == Enums.StatusVoznje.Formirana)
                    {
                        status = "Formirana";
                    }else if(voznjaVozaca.Status == Enums.StatusVoznje.Obradjena)
                    {
                        status = "Obradjena";
                    }
                    result += String.Format("<tr><th>Trenutni status</th><td>{0}</td></tr>", status);                                     
                    result += String.Format(@"<tr><th>Novi status</th><td><select id=""izabraniNoviStatus""><option>Uspesna</option><option>Neuspesna</option></select></td></tr></table>");
                    result += String.Format(@"<button value=""{0}"" id=""promenaStatusaButton"">Potvrdi</button>",voznjaVozaca.IDVoznje);

                    response.Content = new StringContent(result);
                    response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                    response.StatusCode = HttpStatusCode.OK;
                    return response;

                } else
                {
                    result += "<h4>Trenutno niste angazovani ni na jednoj voznji!<h4>";
                    response.Content = new StringContent(result);
                    response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                    response.StatusCode = HttpStatusCode.BadRequest;
                    return response;
                }
            }
            else
            {
                result += "<h4>Desila se greska prilikom odabira opcije -Promeni status voznje-<h4>";
                response.Content = new StringContent(result);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                response.StatusCode = HttpStatusCode.Conflict;
                return response;
            }
        }
        [HttpPost]
        [Route("IzmeniStatus")]
        public HttpResponseMessage IzmeniStatus([FromBody]JToken jToken)
        {
            string username = jToken.Value<string>("username");
            int idVoznje = jToken.Value<int>("idVoznje");
            string status = jToken.Value<string>("status");
            string result = "";
            HttpResponseMessage response = new HttpResponseMessage();

            Vozac v = ListeKorisnika.Instanca.Vozaci.Find(x => x.Username.Equals(username));
            if(v != null)
            {
                Voznja voznja = ListeKorisnika.Instanca.Voznje.Find(x => x.IDVoznje == idVoznje);
                if(voznja != null)
                {
                    Enums.StatusVoznje noviStatus;
                    if (status.Equals("Uspesna"))
                    {
                        result += String.Format(@"<table><tr><th>Ulica odredista:</th><td><input id=""ulicaOdredista"" type=""text""/></td></tr>");
                        result += String.Format(@"<tr><th>Broj odredista:</th><td><input id=""brojOdredista"" type=""number"" min=""1"" max=""1000""/></td></tr>");
                        result += String.Format(@"<tr><th>Mesto odredista:</th><td><input id=""mestoOdredista"" type=""text""/></td></tr>");
                        result += String.Format(@"<tr><th>Pozivni broj mesta odredista:</th><td><input id=""pozivniBrojOdredista"" type=""number"" min=""10000"" max=""39000""/></td></tr>");
                        result += String.Format(@"<tr><th>Cena voznje:</th><td><input id=""cenaVoznje"" type=""number"" min=""100"" max=""100000""/></td></tr></table>");
                        result += String.Format(@"<button value=""{0}"" id=""potvrdiUspesnoButton"">Potvrdi</button>",voznja.IDVoznje);

                    }
                    else
                    {
                        List<Voznja> voznjeCekaju = (List<Voznja>)HttpContext.Current.Application["voznjeNaCekanju"];
                        voznjeCekaju.Remove(voznjeCekaju.Find(x=> x.IDVoznje == voznja.IDVoznje));
                        HttpContext.Current.Application["voznjeNaCekanju"] = voznjeCekaju;

                        noviStatus = Enums.StatusVoznje.Neuspesna;
                        ListeKorisnika.Instanca.Voznje.Remove(voznja);
                        voznja.Status = noviStatus;                       
                        voznja.Iznos = 0;
                        voznja.EndLokacija.Adresa.Ulica = "";
                        voznja.EndLokacija.Adresa.Broj = 0;
                        voznja.EndLokacija.Adresa.NaseljenoMesto = "";
                        voznja.EndLokacija.Adresa.PozivniBrojMesta = 0;
                        voznja.Vozac.Zauzet = false;
                        ListeKorisnika.Instanca.Vozaci.Remove(v);
                        v.Zauzet = false;
                        ListeKorisnika.Instanca.Vozaci.Add(v);

                        ListeKorisnika.Instanca.Voznje.Add(voznja);
                        ListeKorisnika.Instanca.UpisiUBazuVoznje();
                        result = "<h4>Uspesno ste izmenili status voznje!</h4>";
                    }

                    ListeKorisnika.Instanca.Vozaci.Remove(v);
                    v.Zauzet = false;
                    ListeKorisnika.Instanca.Vozaci.Add(v);

                    response.Content = new StringContent(result);
                    response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                    response.StatusCode = HttpStatusCode.OK;
                    return response;
                }
                else
                {
                    result += "<h4>Desila se greska prilikom odabira opcije -Promeni status voznje-<h4>";
                    response.Content = new StringContent(result);
                    response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                    response.StatusCode = HttpStatusCode.Conflict;
                    return response;
                }
            }else
            {
                result += "<h4>Desila se greska prilikom odabira opcije -Promeni status voznje-<h4>";
                response.Content = new StringContent(result);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                response.StatusCode = HttpStatusCode.Conflict;
                return response;
            }
        }
        [HttpPost]
        [Route("UspesnaVoznja")]
        public HttpResponseMessage UspesnaVoznja([FromBody]JToken jToken)
        {
            var username = jToken.Value<string>("username");
            var idVoznje = jToken.Value<int>("idVoznje");
            var odredisteUlica = jToken.Value<string>("odredisteUlica");
            var odredisteBroj = jToken.Value<int>("odredisteBroj");
            var odredisteMesto = jToken.Value<string>("odredisteMesto");
            var odredistePozivniBr = jToken.Value<int>("odredistePozivniBr");
            var cena = jToken.Value<int>("cena");

            string result = "";
            var response = new HttpResponseMessage();

            Voznja voznja = ListeKorisnika.Instanca.Voznje.Find(x => x.IDVoznje == idVoznje);
            if(voznja != null)
            {
                ListeKorisnika.Instanca.Voznje.Remove(voznja);
                Voznja temp = voznja;
                temp.EndLokacija.Adresa.Ulica = odredisteUlica;
                temp.EndLokacija.Adresa.Broj = odredisteBroj;
                temp.EndLokacija.Adresa.NaseljenoMesto = odredisteMesto;
                temp.EndLokacija.Adresa.PozivniBrojMesta = odredistePozivniBr;
                temp.Status = Enums.StatusVoznje.Uspesna;
                temp.Iznos = cena;
                Vozac v = ListeKorisnika.Instanca.Vozaci.Find(x => x.Username.Equals(temp.Vozac.Username));
                ListeKorisnika.Instanca.Vozaci.Remove(v);
                v.Zauzet = false;
                ListeKorisnika.Instanca.Vozaci.Add(v);
                temp.Vozac.Zauzet = false;

                List<Voznja> voznjeCekaju = (List<Voznja>)HttpContext.Current.Application["voznjeNaCekanju"];
                voznjeCekaju.Remove(voznjeCekaju.Find(x => x.IDVoznje == voznja.IDVoznje));
                HttpContext.Current.Application["voznjeNaCekanju"] = voznjeCekaju;

                foreach (var item in ListeKorisnika.Instanca.Musterije)
                {
                    if(item.Voznje.Find(x => x.IDVoznje == idVoznje) != null)
                    {
                        item.Voznje.Remove(voznja);
                        item.Voznje.Add(temp);
                    }
                }
                foreach (var item in ListeKorisnika.Instanca.Dispeceri)
                {
                    if(item.Voznje.Find(x => x.IDVoznje == idVoznje) != null)
                    {
                        item.Voznje.Remove(voznja);
                        item.Voznje.Add(temp);
                    }
                }
                foreach (var item in ListeKorisnika.Instanca.Vozaci)
                {
                    if(item.Voznje.Find(x => x.IDVoznje == idVoznje) != null)
                    {
                        item.Voznje.Remove(voznja);
                        item.Voznje.Add(temp);
                    }
                }
                ListeKorisnika.Instanca.Voznje.Add(temp);
                ListeKorisnika.Instanca.UpisiUBazuVoznje();
                result = "<h4>Uspesno ste izvrsili svoju voznju!</h4>";
                response.Content = new StringContent(result);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                response.StatusCode = HttpStatusCode.OK;
                return response;
            }
            else
            {
                result = "<h4>Desila se greska prilikom promene voznje na status Uspesna!</h4>";
                response.Content = new StringContent(result);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                response.StatusCode = HttpStatusCode.BadRequest;
                return response;
            }
        }
    }
}
