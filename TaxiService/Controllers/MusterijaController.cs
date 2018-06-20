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
            Vozac tempV = null;
            Dispecer tempD = null;
            bool istoKorIme = musterija.Username.Equals(musterija.Password);

            foreach (var item in ListeKorisnika.Instanca.Musterije)
            {
                if (istoKorIme && musterija.Username.Equals(item.Username))
                {
                    tempM = item;
                }
                else if (!istoKorIme && musterija.Username.Equals(item.Username))
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest);
                }
                else if (!istoKorIme && musterija.Password.Equals(item.Username))
                {
                    tempM = item;
                }
            }

            if (tempM == null)
            {
                foreach (var item in ListeKorisnika.Instanca.Dispeceri)
                {
                    if (istoKorIme && musterija.Username.Equals(item.Username))
                    {
                        tempD = item;
                    }
                    else if (!istoKorIme && musterija.Username.Equals(item.Username))
                    {
                        return Request.CreateResponse(HttpStatusCode.BadRequest);
                    }
                    else if (!istoKorIme && musterija.Password.Equals(item.Username))
                    {
                        tempD = item;
                    }
                }
                if (tempD == null)
                {
                    foreach (var item in ListeKorisnika.Instanca.Vozaci)
                    {
                        if (istoKorIme && musterija.Username.Equals(item.Username))
                        {
                            tempV = item;
                        }
                        else if (!istoKorIme && musterija.Username.Equals(item.Username))
                        {
                            return Request.CreateResponse(HttpStatusCode.BadRequest);
                        }
                        else if (!istoKorIme && musterija.Password.Equals(item.Username))
                        {
                            tempV = item;
                        }
                    }
                    if (tempV == null)
                    {
                        return Request.CreateResponse(HttpStatusCode.BadRequest);
                    }
                    else
                    {
                        ListeKorisnika.Instanca.Vozaci.Remove(tempV);
                        tempV.Username = musterija.Username;
                        tempV.Ime = musterija.Ime;
                        tempV.Prezime = musterija.Prezime;
                        tempV.Jmbg = musterija.Jmbg;
                        tempV.Email = musterija.Email;
                        tempV.Telefon = musterija.Telefon;
                        ListeKorisnika.Instanca.Vozaci.Add(tempV);
                        ListeKorisnika.Instanca.UpisiUBazuVozace();
                        return Request.CreateResponse(HttpStatusCode.OK, tempV);
                    }
                }
                else
                {
                    ListeKorisnika.Instanca.Dispeceri.Remove(tempD);
                    tempD.Username = musterija.Username;
                    tempD.Ime = musterija.Ime;
                    tempD.Prezime = musterija.Prezime;
                    tempD.Jmbg = musterija.Jmbg;
                    tempD.Email = musterija.Email;
                    tempD.Telefon = musterija.Telefon;
                    ListeKorisnika.Instanca.Dispeceri.Add(tempD);
                    ListeKorisnika.Instanca.UpisiUBazuDispecere();
                    return Request.CreateResponse(HttpStatusCode.OK, tempD);
                }
            }
            else
            {
                ListeKorisnika.Instanca.Musterije.Remove(tempM);
                musterija.Password = tempM.Password;
                ListeKorisnika.Instanca.Musterije.Add(musterija);
                ListeKorisnika.Instanca.UpisiUBazuMusterije();
                return Request.CreateResponse(HttpStatusCode.OK, musterija);
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
