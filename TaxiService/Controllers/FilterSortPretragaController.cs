using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TaxiService.Models;

namespace TaxiService.Controllers
{
    [RoutePrefix("api/FilterSortPretraga")]
    public class FilterSortPretragaController : ApiController
    {
        [HttpGet]
        [Route("Filtriraj/{usernameIstatusIflag}")]
        public HttpResponseMessage Filtriraj(string usernameIstatusIflag)
        {
            string[] splitovano = usernameIstatusIflag.Split('_');
            string username = splitovano[0];
            string status = splitovano[1];
            int flag = Int32.Parse(splitovano[2]);
            List<Voznja> filtrirane = new List<Voznja>();
            Korisnik k = ListeKorisnika.Instanca.NadjiKorisnika(username);
            List<Voznja> sveVoznje = new List<Voznja>();
            if (k.Uloga == Enums.Uloga.Musterija)
            {
                Musterija m = ListeKorisnika.Instanca.Musterije.Find(x => x.Username.Equals(username));
                sveVoznje = m.Voznje;
            }
            else if (k.Uloga == Enums.Uloga.Vozac)
            {
                Vozac v = ListeKorisnika.Instanca.Vozaci.Find(x => x.Username.Equals(username));
                sveVoznje = v.Voznje;
            }
            else
            {
                Dispecer d = ListeKorisnika.Instanca.Dispeceri.Find(x => x.Username.Equals(username));
                
                if(flag == 0)
                {
                    sveVoznje = d.Voznje;
                }else
                {
                    sveVoznje = ListeKorisnika.Instanca.Voznje;
                }
            }
            
            if (sveVoznje.Count != 0)
            {
                if (status.Equals("Kreirana"))
                {
                    foreach (var item in sveVoznje)
                    {
                        if (item.Status == Enums.StatusVoznje.Kreirana)
                        {
                            filtrirane.Add(item);
                        }
                    }
                   
                }
                else if (status.Equals("Obradjena"))
                {
                    foreach (var item in sveVoznje)
                    {
                        if (item.Status == Enums.StatusVoznje.Obradjena)
                        {
                            filtrirane.Add(item);
                        }
                    }
                    
                }
                else if (status.Equals("Formirana"))
                {
                    foreach (var item in sveVoznje)
                    {
                        if (item.Status == Enums.StatusVoznje.Formirana)
                        {
                            filtrirane.Add(item);
                        }
                    }
                   
                }
                else if (status.Equals("Prihvacena"))
                {
                    foreach (var item in sveVoznje)
                    {
                        if (item.Status == Enums.StatusVoznje.Prihvacena)
                        {
                            filtrirane.Add(item);
                        }
                    }
                    
                }
                else if (status.Equals("Otkazana"))
                {
                    foreach (var item in sveVoznje)
                    {
                        if (item.Status == Enums.StatusVoznje.Otkazana)
                        {
                            filtrirane.Add(item);
                        }
                    }
                  
                }
                else if (status.Equals("Neuspesna"))
                {
                    foreach (var item in sveVoznje)
                    {
                        if (item.Status == Enums.StatusVoznje.Neuspesna)
                        {
                            filtrirane.Add(item);
                        }
                    }
                   
                }
                else if (status.Equals("Uspesna"))
                {
                    foreach (var item in sveVoznje)
                    {
                        if (item.Status == Enums.StatusVoznje.Uspesna)
                        {
                            filtrirane.Add(item);
                        }
                    }
                   
                }
                else
                {
                    filtrirane = sveVoznje;
                }

                if(filtrirane.Count != 0)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, filtrirane);
                }else
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest);
                }
            } else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }
        [HttpGet]
        [Route("Sortiraj/{usernameIflagovi}")]
        public HttpResponseMessage Sortiraj(string usernameIflagovi)
        {
            string[] splitovano = usernameIflagovi.Split('_');
            string username = splitovano[0];
            int flag1 = Int32.Parse(splitovano[1]);
            int flag2 = Int32.Parse(splitovano[2]);
            int flag3 = Int32.Parse(splitovano[3]);
            List<Voznja> sortirane = new List<Voznja>();

            Korisnik k = ListeKorisnika.Instanca.NadjiKorisnika(username);
            if(k.Uloga == Enums.Uloga.Musterija)
            {
                Musterija m = ListeKorisnika.Instanca.Musterije.Find(x => x.Username.Equals(username));
                sortirane = m.Voznje;

            }else if(k.Uloga == Enums.Uloga.Vozac)
            {
                Vozac v = ListeKorisnika.Instanca.Vozaci.Find(x => x.Username.Equals(username));
                sortirane = k.Voznje;
            }else
            {
                Dispecer d = ListeKorisnika.Instanca.Dispeceri.Find(x => x.Username.Equals(username));
                if(flag3 == 0)
                {
                    sortirane = d.Voznje;
                }else
                {
                    sortirane = ListeKorisnika.Instanca.Voznje;
                }
            }

            if (flag1 == 1 && flag2 == 0)
            {
                sortirane = sortirane.OrderByDescending(x => x.VremePorudzbine).ToList();
            }
            else if (flag1 == 0 && flag2 == 1)
            {
                sortirane = sortirane.OrderByDescending(x => x.Komentar.OcenaVoznje).ToList();
            }
            else if (flag1 == 1 && flag2 == 1)
            {
                sortirane = sortirane.OrderByDescending(x => x.VremePorudzbine).ThenByDescending(x => x.Komentar.OcenaVoznje).ToList();
            }
            else
            {

            }

            return Request.CreateResponse(HttpStatusCode.OK, sortirane);
        }

        [HttpGet]
        [Route("Pretrazi")]
        public HttpResponseMessage Pretrazi()
        {
            var jToken = JToken.Parse(Request.RequestUri.ToString().Split('?').Last());
            var username = jToken.Value<string>("username");
            var datumOd = jToken.Value<string>("datum1");
            var datumDo = jToken.Value<string>("datum2");
            var cenaOd = jToken.Value<int>("cenaOd");
            var cenaDo = jToken.Value<int>("cenaDo");
            var ocenaOd = jToken.Value<int>("ocenaOd");
            var ocenaDo = jToken.Value<int>("ocenaDo");
            var flag = jToken.Value<int>("flag");
            List<Voznja> pretrazene = new List<Voznja>();
            List<Voznja> rezultatPretrage = new List<Voznja>();
            Korisnik k = ListeKorisnika.Instanca.NadjiKorisnika(username);
            if(k.Uloga == Enums.Uloga.Musterija)
            {
                Musterija m = ListeKorisnika.Instanca.Musterije.Find(x => x.Username.Equals(username));
                pretrazene = m.Voznje;
            }else if(k.Uloga == Enums.Uloga.Vozac)
            {
                Vozac v = ListeKorisnika.Instanca.Vozaci.Find(x => x.Username.Equals(username));
                pretrazene = v.Voznje;
            }else
            {
                Dispecer d = ListeKorisnika.Instanca.Dispeceri.Find(x => x.Username.Equals(username));
                if(flag == 0)
                {
                    pretrazene = d.Voznje;
                }else
                {
                    pretrazene = ListeKorisnika.Instanca.Voznje;
                }
            }

            if(!datumOd.Equals("") && datumDo.Equals(""))
            {
                foreach (var item in pretrazene)
                {
                    if(item.VremePorudzbine >= DateTime.Parse(datumOd) && item.Iznos >= cenaOd && item.Iznos <= cenaDo && item.Komentar.OcenaVoznje >= ocenaOd && item.Komentar.OcenaVoznje <= ocenaDo)
                    {
                        rezultatPretrage.Add(item);
                    }
                }
            }else if(datumOd.Equals("") && !datumDo.Equals(""))
            {
                foreach (var item in pretrazene)
                {
                    if (item.VremePorudzbine <= DateTime.Parse(datumDo).AddHours(23).AddMinutes(59) && item.Iznos >= cenaOd && item.Iznos <= cenaDo && item.Komentar.OcenaVoznje >= ocenaOd && item.Komentar.OcenaVoznje <= ocenaDo)
                    {
                        rezultatPretrage.Add(item);
                    }
                }
            }else if(!datumOd.Equals("") && !datumDo.Equals(""))
            {
                foreach (var item in pretrazene)
                {
                    if(item.VremePorudzbine >= DateTime.Parse(datumOd) && item.VremePorudzbine <= DateTime.Parse(datumDo).AddHours(23).AddMinutes(59) && item.Iznos >= cenaOd && item.Iznos <= cenaDo && item.Komentar.OcenaVoznje >= ocenaOd && item.Komentar.OcenaVoznje <= ocenaDo)
                    {
                        rezultatPretrage.Add(item);
                    }
                }
            }

            else
            {
                foreach (var item in pretrazene)
                {
                    if (item.Iznos >= cenaOd && item.Iznos <= cenaDo && item.Komentar.OcenaVoznje >= ocenaOd && item.Komentar.OcenaVoznje <= ocenaDo)
                    {
                        rezultatPretrage.Add(item);
                    }
                }
            }


            if(rezultatPretrage.Count != 0)
            {
                return Request.CreateResponse(HttpStatusCode.OK, rezultatPretrage);
            }else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }
    }
}
