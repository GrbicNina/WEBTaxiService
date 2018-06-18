using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using static TaxiService.Models.Enums;

namespace TaxiService.Models
{
    public class ListeKorisnika
    {
        public List<Musterija> Musterije { get; set; }
        public List<Dispecer> Dispeceri { get; set; }
        public List<Vozac> Vozaci { get; set; }

        public ListeKorisnika()
        {
            Musterije = new List<Musterija>();
            Dispeceri = new List<Dispecer>();
            Vozaci = new List<Vozac>();
        }
        public void LoadDispecere()
        {
            using (TextReader tr = new StreamReader(@"D:\TaxiService\TaxiService\App_Data\dispeceri.txt"))
            {
                Dispecer dispecer = null;
                string podaci = "";
                while((podaci=tr.ReadLine()) != null)
                {
                    string[] parsirani = podaci.Split(';');
                    dispecer = new Dispecer()
                    {
                        Username = parsirani[0],
                        Password = parsirani[1],
                        Ime = parsirani[2],
                        Prezime = parsirani[3],
                        Pol = (parsirani[4].Equals("Zenski") ? Pol.Zenski : Pol.Muski),
                        Jmbg = parsirani[5],
                        Telefon = parsirani[6],
                        Email = parsirani[7]
                    };
                    Dispeceri.Add(dispecer);
                }
            }
        }

        public void LoadMusterije()
        {
            using (TextReader tr = new StreamReader(@"D:\TaxiService\TaxiService\App_Data\musterije.txt"))
            {
                Musterija musterija = null;
                string podaci = "";
                while ((podaci = tr.ReadLine()) != null)
                {
                    string[] parsirani = podaci.Split(';');
                    musterija = new Musterija()
                    {
                        Username = parsirani[0],
                        Password = parsirani[1],
                        Ime = parsirani[2],
                        Prezime = parsirani[3],
                        Pol = (parsirani[4].Equals("Zenski") ? Pol.Zenski : Pol.Muski),
                        Jmbg = parsirani[5],
                        Telefon = parsirani[6],
                        Email = parsirani[7]
                    };
                    Musterije.Add(musterija);
                }
            }
        }

        public void LoadVozaci()
        {
            using (TextReader tr = new StreamReader(@"D:\TaxiService\TaxiService\App_Data\vozaci.txt"))
            {
                Vozac vozac = null;
                string podaci = "";
                while ((podaci = tr.ReadLine()) != null)
                {
                    string[] parsirani = podaci.Split(';');
                    vozac = new Vozac()
                    {
                        Username = parsirani[0],
                        Password = parsirani[1],
                        Ime = parsirani[2],
                        Prezime = parsirani[3],
                        Pol = (parsirani[4].Equals("Zenski") ? Pol.Zenski : Pol.Muski),
                        Jmbg = parsirani[5],
                        Telefon = parsirani[6],
                        Email = parsirani[7]
                    };
                    Vozaci.Add(vozac);
                }
            }
        }

        public void UcitajSveListe()
        {
            LoadDispecere();
            LoadMusterije();
            LoadVozaci();
        }
    }
}