﻿using Newtonsoft.Json;
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
        [HttpPost]
        [Route("PosaljiZahtev")]
        public HttpResponseMessage PosaljiZahtev([FromBody]JToken jToken)
        {
            var vreme = jToken.Value<double>("VremeZahteva");
            var lokacijastart = jToken.Value<string>("StartnaLokacija");
            var broj = jToken.Value<double>("Broj");
            var mesto = jToken.Value<string>("Mesto");
            var pozivniBroj = jToken.Value<double>("PozivniBroj");
            var autoTip = jToken.Value<string>("ZeljeniAuto");
            var musterija = jToken.Value<string>("Musterija");

            string result = "";
            var response = new HttpResponseMessage();

            if (lokacijastart == "" || autoTip == "" || musterija == "")
            {
                result = String.Format(@"<label id=""neuspesanZahtev"" class=""labeleGresaka"" hidden>Niste dobro popunili podatke. Molimo Vas pokusajte opet.</label>");
                response.Content = new StringContent(result);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                response.StatusCode = HttpStatusCode.BadRequest;
                return response;
            }

            if (lokacijastart == null || autoTip == null || musterija == null)
            {
                result = String.Format(@"<label id=""neuspesanZahtev"" class=""labeleGresaka"" hidden>Niste dobro popunili podatke. Molimo Vas pokusajte opet.</label>");
                response.Content = new StringContent(result);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                response.StatusCode = HttpStatusCode.BadRequest;
                return response;
            }

            Voznja v = new Voznja();
            Musterija m = ListeKorisnika.Instanca.Musterije.Find(x => x.Username.Equals(musterija));
            v.Musterija = m.Username;
            v.VremePorudzbine = DateTime.Now.ToString("R");
            v.ZeljeniTipAutomobila = (Enums.TipAutomobila)System.Enum.Parse(typeof(Enums.TipAutomobila), autoTip);
            v.StartLokacija.Adresa.Ulica = lokacijastart;
            v.StartLokacija.Adresa.Broj = (int)broj;
            v.StartLokacija.Adresa.NaseljenoMesto = mesto;
            v.StartLokacija.Adresa.PozivniBrojMesta = (int)pozivniBroj;
            v.IDVoznje = ListeKorisnika.Instanca.Voznje.Count + 1;
            v.Status = Enums.StatusVoznje.Kreirana;
            ListeKorisnika.Instanca.Voznje.Add(v);

            ListeKorisnika.Instanca.Musterije.Remove(m);
            m.Voznje.Add(v);
            ListeKorisnika.Instanca.Musterije.Add(m);
            if(HttpContext.Current.Application["voznjeNaCekanju"] == null)
            {
                HttpContext.Current.Application["voznjeNaCekanju"] = new List<Voznja>();
            }
            List<Voznja> listaVoznji = (List<Voznja>)HttpContext.Current.Application["voznjeNaCekanju"];
            listaVoznji.Add(v);
            HttpContext.Current.Application["voznjeNaCekanju"] = listaVoznji;

            result += "<h4>Uspesno ste poslali zahtev!</h4>";
            response.Content = new StringContent(result);
            response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
            response.StatusCode = HttpStatusCode.OK;
            return response;
        }
        [HttpGet]
        [Route("GetVoznje")]
        public HttpResponseMessage GetVoznje(string username)
        {
            Musterija ulogovan = ListeKorisnika.Instanca.Musterije.Find(x=> x.Username.Equals(username));
            string result = "";
            var response = new HttpResponseMessage();
            if (ulogovan.Voznje.Count > 0)
            {
                result += String.Format(@"<h3>Vase voznje:</h3><table border=""1"" id=""tabelaVoznji""><tr><th> Datum i vreme narudzbe </th><th>[START]Ulica </th>" +
                    "<th>[START]Broj </th><th>[START]Grad </th><th>[START]Pozivni broj </th><th> Zeljeni tip vozila </th><th> Iznos </th><th> Status voznje </th></tr>");
                foreach (var item in ulogovan.Voznje)
                {
                    result += String.Format(@"<tr><td>{0}</td>", item.VremePorudzbine);
                    result += String.Format(@"<td>{0}</td>", item.StartLokacija.Adresa.Ulica);
                    result += String.Format(@"<td>{0}</td>", item.StartLokacija.Adresa.Broj);
                    result += String.Format(@"<td>{0}</td>", item.StartLokacija.Adresa.NaseljenoMesto);
                    result += String.Format(@"<td>{0}</td>", item.StartLokacija.Adresa.PozivniBrojMesta);
                    result += String.Format(@"<td>{0}</td>", item.ZeljeniTipAutomobila.ToString());
                    result += String.Format(@"<td>{0}</td>", item.Iznos);
                    result += String.Format(@"<td>{0}</td>", item.Status.ToString());
                    if(item.Status == Enums.StatusVoznje.Kreirana)
                    {
                        result += String.Format(@"<td><button value=""{0}"" class =""izmeni_buttonClass"">Izmeni</button><button value=""{0}"" class = ""odustani_buttonClass"">Odustani</button></td>", item.IDVoznje);             
                    }
                    result += "</tr>";
                }
                result += "</table>";
                response.Content = new StringContent(result);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                response.StatusCode = HttpStatusCode.OK;
                return response;
            }
            else
            {
                result += "<h4>Ne postoji ni jedna voznja koju ste kreirali.</h4>";
                response.Content = new StringContent(result);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                response.StatusCode = HttpStatusCode.BadRequest;
                return response;
            }
        }

        [HttpGet]
        [Route("GetVoznja/{paket}")]
        public HttpResponseMessage GetVoznja(string paket)
        {
            //List<Korisnik> ulogovani = (List<Korisnik>)HttpContext.Current.Application["ulogovani"];
            //var usernameUlogovanog = HttpContext.Current.Application["ulogovani"].ToString();
            string[] parsiraj = paket.Split('_');
            var usernameUlogovanog = parsiraj[0];
            int id = Int32.Parse(parsiraj[1]);
            Musterija ulogovan = ListeKorisnika.Instanca.Musterije.Find(x => x.Username.Equals(usernameUlogovanog));
            string result = "";
            var response = new HttpResponseMessage();
            if (ulogovan != null)
            {
                Voznja v = ulogovan.Voznje.Find(x => x.IDVoznje == id);
                if(v != null)
                {
                    result += String.Format(@"<table id=""izmenaVoznjeK""><tr><th> Ulica </th><td><input type =""text"" id =""ulicaIzmenaV"" value=""{0}""/></td></tr>",v.StartLokacija.Adresa.Ulica);
                    result += String.Format(@"<tr><th> Broj </th><td><input type = ""number"" id = ""brojIzmenaV"" min = ""1"" max = ""1000"" value=""{0}""/></td></tr>",v.StartLokacija.Adresa.Broj);
                    result += String.Format(@"<tr><th> Grad </th><td><input type = ""text"" id = ""gradIzmenaV"" value=""{0}""/></td></tr>", v.StartLokacija.Adresa.NaseljenoMesto);
                    result += String.Format(@"<tr><th> Pozivni broj mesta </th><td><input type = ""number"" id = ""pozivniBrV"" min = ""10000"" max = ""39000"" value=""{0}""/></td></tr>",v.StartLokacija.Adresa.PozivniBrojMesta);
                    result += String.Format(@"<tr><th> Zeljeni tip vozila </th><td><select id = ""selectVoziloV"" ><option id = ""kom""> KombiVozilo </option><option id = ""au""> PutnickiAutomobil </option><option selected id = ""svejedno"">Svejedno</select></td></tr> ");
                    result += String.Format(@"<tr><td colspan = ""2""><button id = ""izmeniVoznjuButton""> Sacuvaj izmene </button></td></tr></table>");
                    response.Content = new StringContent(result);
                    response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                    response.StatusCode = HttpStatusCode.OK;
                    return response;
                }
                else
                {
                    result += "<h4>Desila se greska prilikom izmene voznje.</h4>";
                    response.Content = new StringContent(result);
                    response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                    response.StatusCode = HttpStatusCode.BadRequest;
                    return response;
                }
            }
            else
            {
                result += "<h4>Desila se greska prilikom izmene voznje.</h4>";
                response.Content = new StringContent(result);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                response.StatusCode = HttpStatusCode.BadRequest;
                return response;
            }
        }

        [Route("IzmeniVoznju")]
        public HttpResponseMessage IzmeniVoznju([FromBody]JToken jToken)
        {
            var ulica = jToken.Value<string>("Ulica");
            var broj = jToken.Value<int>("Broj");
            var mesto = jToken.Value<string>("Grad");
            var pozivniBroj = jToken.Value<int>("PozivBr");
            var tipVozila = jToken.Value<string>("TipVozila");
            var idVoznje = jToken.Value<int>("IndeksVoznje");
            var usernameUlogovanog = jToken.Value<string>("ulogovani");

            string result = "";
            var response = new HttpResponseMessage();

            Musterija ulogovan = ListeKorisnika.Instanca.Musterije.Find(x => x.Username.Equals(usernameUlogovanog));
            if (ulogovan != null)
            {
                Voznja v = ulogovan.Voznje.Find(x => x.IDVoznje==idVoznje);
                if (v != null)
                {
                    ulogovan.Voznje.Remove(v);
                    Voznja izmenjeno = new Voznja();
                    izmenjeno.Musterija = ulogovan.Username;
                    izmenjeno.StartLokacija.Adresa.Ulica = ulica;
                    izmenjeno.StartLokacija.Adresa.Broj = broj;
                    izmenjeno.StartLokacija.Adresa.NaseljenoMesto = mesto;
                    izmenjeno.StartLokacija.Adresa.PozivniBrojMesta = pozivniBroj;
                    izmenjeno.IDVoznje = idVoznje;
                    izmenjeno.VremePorudzbine = DateTime.Now.ToString("R");
                    izmenjeno.Status = Enums.StatusVoznje.Kreirana;
                    izmenjeno.ZeljeniTipAutomobila = (Enums.TipAutomobila)System.Enum.Parse(typeof(Enums.TipAutomobila), tipVozila);
                    ulogovan.Voznje.Add(izmenjeno);
                    ListeKorisnika.Instanca.Voznje.Remove(v);
                    ListeKorisnika.Instanca.Voznje.Add(izmenjeno);

                    List<Voznja> voznjeNaCekanju = (List<Voznja>)HttpContext.Current.Application["voznjeNaCekanju"];
                    voznjeNaCekanju.Remove(voznjeNaCekanju.Find(x => x.IDVoznje == idVoznje));
                    voznjeNaCekanju.Add(izmenjeno);
                    HttpContext.Current.Application["voznjeNaCekanju"] = voznjeNaCekanju;

                    result += "<h4>Uspesno ste izmenili voznju!</h4>";
                    response.Content = new StringContent(result);
                    response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                    response.StatusCode = HttpStatusCode.OK;
                    return response;
                }
                else
                {
                    result += "<h4>Desila se greska prilikom izmene voznje!</h4>";
                    response.Content = new StringContent(result);
                    response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                    response.StatusCode = HttpStatusCode.OK;
                    return response;
                }
            }
            else
            {
                result += "<h4>Desila se greska prilikom izmene voznje!</h4>";
                response.Content = new StringContent(result);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                response.StatusCode = HttpStatusCode.BadRequest;
                return response;
            }
        }

        [HttpGet]
        [Route("OtkaziVoznju/{IDVoznje}")]
        public HttpResponseMessage OtkaziVoznju(int IDVoznje)
        {

            string result = "";
            var response = new HttpResponseMessage();
            Voznja v = ListeKorisnika.Instanca.Voznje.Find(x => x.IDVoznje == IDVoznje);
            if(v != null)
            {
                result += String.Format(@"<div class=""commentSection""><h3>Ostavljanje komentara je obavezno</h3>");
                result += String.Format(@"<textarea id=""komentarOtkaz"" rows=""4"" cols=""50"" placeholder=""Unesite komentar...""></textarea></br>");
                result += String.Format(@"<label>Ocena</label><select id=""ocena""><option value=""1"">1</option><option value=""2"">2</option><option value=""3"">3</option><option value=""4"">4</option><option value=""5"">5</option></select>");
                result += String.Format(@"<button id=""komentarisi"" value=""{0}"">Ostavi komentar</button></div>",v.IDVoznje);
                response.Content = new StringContent(result);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                response.StatusCode = HttpStatusCode.OK;
                return response;
            }
            else
            {
                result += "<h4>Desila se greska prilikom otkazivanja!</h4>";
                response.Content = new StringContent(result);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                response.StatusCode = HttpStatusCode.BadRequest;
                return response;
            }
        }
        [HttpPost]
        [Route("OstaviKomentarOtkaz")]
        public HttpResponseMessage OstaviKomentarOtkaz([FromBody]JToken jToken)
        {
            var usernameKorisnika = jToken.Value<string>("KorisnikUsername");
            var idVoznje = jToken.Value<int>("IDVoznje");
            var opisKomentara = jToken.Value<string>("OpisKomentara");
            var ocena = jToken.Value<int>("Ocena");
            opisKomentara = opisKomentara.Replace("\n", "");

            string result = "";
            var response = new HttpResponseMessage();

            Musterija m = ListeKorisnika.Instanca.Musterije.Find(x => x.Username.Equals(usernameKorisnika));
            Voznja v = ListeKorisnika.Instanca.Voznje.Find(x => x.IDVoznje == idVoznje);
            if(m != null && v != null)
            {
                v.Komentar.IDVoznje = idVoznje;
                v.Komentar.Opis = opisKomentara;
                v.Komentar.OcenaVoznje = ocena;
                v.Komentar.DatumObjave = DateTime.Now.ToString("R");
                v.Komentar.Korisnik = usernameKorisnika;
                v.Status = Enums.StatusVoznje.Otkazana;
                ListeKorisnika.Instanca.UpisiUBazuVoznje();

                List<Voznja> naCekanju = (List<Voznja>)HttpContext.Current.Application["voznjeNaCekanju"];
                naCekanju.Remove(naCekanju.Find(x => x.IDVoznje == idVoznje));
                HttpContext.Current.Application["voznjeNaCekanju"] = naCekanju;

                result += "<h4>Uspesno ste otkazali voznju i ostavili komentar!</h4>";
                response.Content = new StringContent(result);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                response.StatusCode = HttpStatusCode.OK;
                return response;

            }
            else
            {
                result += "<h4>Desila se greska prilikom ostavljanja komentara!</h4>";
                response.Content = new StringContent(result);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
                response.StatusCode = HttpStatusCode.BadRequest;
                return response;
            }
        }
    }
}
