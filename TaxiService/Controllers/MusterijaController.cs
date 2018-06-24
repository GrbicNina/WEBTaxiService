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

            if (lokacijastart == "" || autoTip == "" || musterija == "")
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            if (lokacijastart == null || autoTip == null || musterija == null)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            Voznja v = new Voznja();
            v.Musterija = musterija;         
            v.VremePorudzbine = DateTime.Now.ToString("R");
            v.ZeljeniTipAutomobila = (autoTip.Equals("Putnicki Automobil") ? Enums.TipAutomobila.PutnickiAutomobil : Enums.TipAutomobila.KombiVozilo);
            v.StartLokacija.Adresa.Ulica = lokacijastart;
            v.StartLokacija.Adresa.Broj = (int)broj;
            v.StartLokacija.Adresa.NaseljenoMesto = mesto;
            v.StartLokacija.Adresa.PozivniBrojMesta = (int)pozivniBroj;
            v.IDVoznje = (ListeKorisnika.Instanca.Voznje.Count + 1);
            v.Status = Enums.StatusVoznje.Kreirana;
            ListeKorisnika.Instanca.Voznje.Add(v);
            Korisnik k = ListeKorisnika.Instanca.NadjiKorisnika(musterija);
            k = (Musterija)k;
            k.Voznje.Add(v);
            if(HttpContext.Current.Application["voznjeNaCekanju"] == null)
            {
                HttpContext.Current.Application["voznjeNaCekanju"] = new List<Voznja>();
            }
            List<Voznja> listaVoznji = (List<Voznja>)HttpContext.Current.Application["voznjeNaCekanju"];
            listaVoznji.Add(v);
            HttpContext.Current.Application["voznjeNaCekanju"] = listaVoznji;
            return Request.CreateResponse(HttpStatusCode.OK,v);
        }
        [HttpGet]
        [Route("GetVoznje")]
        public HttpResponseMessage GetVoznje(string Username)
        {
            Korisnik ulogovan = ListeKorisnika.Instanca.NadjiKorisnika(Username);
            ulogovan = (Musterija)ulogovan;
            if (ulogovan != null)
            {
                return Request.CreateResponse(HttpStatusCode.OK, ulogovan.Voznje);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        [HttpGet]
        [Route("GetVoznja")]
        public HttpResponseMessage GetVoznja(int id)
        {
            var usernameUlogovanog = HttpContext.Current.Application["ulogovani"].ToString();
            Korisnik ulogovan = ListeKorisnika.Instanca.NadjiKorisnika(usernameUlogovanog);
            ulogovan = (Musterija)ulogovan;
            if (ulogovan != null)
            {
                Voznja v = ulogovan.Voznje.Find(x => x.IDVoznje == id);
                if(v != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, v);
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest);
                }
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        [Route("IzmeniVoznju")]
        public HttpResponseMessage IzmeniVoznju([FromBody]JToken jToken)
        {
            var ulica = jToken.Value<string>("Ulica");
            var broj = jToken.Value<double>("Broj");
            var mesto = jToken.Value<string>("Grad");
            var pozivniBroj = jToken.Value<double>("PozivBr");
            var tipVozila = jToken.Value<string>("TipVozila");
            var idVoznje = jToken.Value<double>("IndeksVoznje");
            var usernameUlogovanog = HttpContext.Current.Application["ulogovani"].ToString();

            Korisnik ulogovan = ListeKorisnika.Instanca.NadjiKorisnika(usernameUlogovanog);
            ulogovan = (Musterija)ulogovan;
            if (ulogovan != null)
            {
                Voznja v = ulogovan.Voznje.Find(x => x.IDVoznje==idVoznje);
                if (v != null)
                {
                    ulogovan.Voznje.Remove(v);
                    Voznja izmenjeno = new Voznja();
                    izmenjeno.Musterija = usernameUlogovanog;
                    izmenjeno.StartLokacija.Adresa.Ulica = ulica;
                    izmenjeno.StartLokacija.Adresa.Broj = (int)broj;
                    izmenjeno.StartLokacija.Adresa.NaseljenoMesto = mesto;
                    izmenjeno.StartLokacija.Adresa.PozivniBrojMesta = (int)pozivniBroj;
                    izmenjeno.IDVoznje = (int)idVoznje;
                    izmenjeno.VremePorudzbine = DateTime.Now.ToString("R");
                    izmenjeno.Status = Enums.StatusVoznje.Kreirana;
                    izmenjeno.ZeljeniTipAutomobila = (tipVozila.Equals("Kombi Vozilo") ? Enums.TipAutomobila.KombiVozilo : Enums.TipAutomobila.PutnickiAutomobil);
                    ulogovan.Voznje.Add(izmenjeno);
                    return Request.CreateResponse(HttpStatusCode.OK, izmenjeno);
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest);
                }
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

    }
}
