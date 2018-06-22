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

        [Route("DodajVozaca")]
        public HttpResponseMessage DodajVozaca([FromBody]JToken jToken)
        {
            var username = jToken.Value<string>("Username");
            var password = jToken.Value<string>("Password");
            var ime = jToken.Value<string>("Ime");
            var prezime = jToken.Value<string>("Prezime");
            var pol = jToken.Value<string>("Pol");
            var jmbg = jToken.Value<string>("JMBG");
            var telefon = jToken.Value<string>("Telefon");
            var email = jToken.Value<string>("Email");
            var ulica = jToken.Value<string>("Ulica");
            var broj = jToken.Value<string>("Broj");
            var naseljenoMesto = jToken.Value<string>("NaseljenoMesto");
            var pozivniBroj = jToken.Value<string>("PozivniBroj");
            var godisteAutomobila = jToken.Value<string>("GodisteAutomobila");
            var registarkaOznaka = jToken.Value<string>("RegistarskaOznaka");
            var idVozila = jToken.Value<string>("IdVozila");
            var tipVozila = jToken.Value<string>("TipVozila");

            Enums.TipAutomobila tip;
            tip = (tipVozila.Equals("Kombi Vozilo")) ? Enums.TipAutomobila.KombiVozilo : Enums.TipAutomobila.PutnickiAutomobil;

            if (username == null || ime == null || prezime == null || jmbg == null || email == null || password == null || ulica == null || broj == null || 
                naseljenoMesto == null || pozivniBroj == null || godisteAutomobila == null || registarkaOznaka == null || idVozila == null || tipVozila == null)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            if (username == "" || ime == "" || prezime == "" || jmbg == "" || email == "" || password == "" || ulica == "" || broj == "" ||
                naseljenoMesto == "" || pozivniBroj == "" || godisteAutomobila == "" || registarkaOznaka == "" || idVozila == "" || tipVozila == "")
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            var input = telefon;
            Regex pattern = new Regex(@"\d{8,10}");
            Match match = pattern.Match(input);
            if (!match.Success)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            input = jmbg;
            pattern = new Regex(@"\d{13}");
            match = pattern.Match(input);
            if (!match.Success)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            Vozac tempV = null;
            Korisnik k = null;
            k = ListeKorisnika.Instanca.NadjiKorisnika(username);
            

            if (k == null)
            {
                tempV = new Vozac();
                tempV.Username = username;
                tempV.Password = password;
                tempV.Ime = ime;
                tempV.Prezime = prezime;
                tempV.Jmbg = jmbg;
                tempV.Telefon = telefon;
                tempV.Email = email;
                tempV.Lokacija.Adresa.NaseljenoMesto = naseljenoMesto;
                tempV.Lokacija.Adresa.UlicaBroj = ulica + " " + broj;
                tempV.Lokacija.Adresa.PozivniBrojMesta = pozivniBroj;
                tempV.Automobil.GodisteAutomobila = godisteAutomobila;
                tempV.Automobil.Vozac = username;
                tempV.Automobil.TipAutomobila = tip;
                tempV.Automobil.BrojRegistarskeOznake = registarkaOznaka;
                tempV.Automobil.IdVozila = idVozila;
                ListeKorisnika.Instanca.Vozaci.Add(tempV);
                ListeKorisnika.Instanca.UpisiUBazuVozace();
                return Request.CreateResponse(HttpStatusCode.OK, tempV);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.Conflict);
            }
           
        }
    }
}
