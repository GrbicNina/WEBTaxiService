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
    }
}
