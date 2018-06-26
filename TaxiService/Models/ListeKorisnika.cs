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
        public List<Voznja> Voznje { get; set; }
        private static ListeKorisnika instance;
        private ListeKorisnika()
        {
            Musterije = new List<Musterija>();
            Dispeceri = new List<Dispecer>();
            Vozaci = new List<Vozac>();
            Voznje = new List<Voznja>();
        }
        public static ListeKorisnika Instanca
        {
            get
            {
                if (instance == null)
                {
                    instance = new ListeKorisnika();
                }
                return instance;
            }
        }
        private void LoadDispecere()
        {
            using (TextReader tr = new StreamReader(@"D:\TaxiService\WEBTaxiService\WEBTaxiService\TaxiService\App_Data\dispeceri.txt"))
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

        private void LoadMusterije()
        {
            using (TextReader tr = new StreamReader(@"D:\TaxiService\WEBTaxiService\WEBTaxiService\TaxiService\App_Data\musterije.txt"))
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

        private void LoadVozaci()
        {
            using (TextReader tr = new StreamReader(@"D:\TaxiService\WEBTaxiService\WEBTaxiService\TaxiService\App_Data\vozaci.txt"))
            {
                Vozac vozac = null;
                string podaci = "";
                while ((podaci = tr.ReadLine()) != null)
                {
                    string[] parsirani = podaci.Split(';');
                    vozac = new Vozac();
                    vozac.Username = parsirani[0];
                    vozac.Password = parsirani[1];
                    vozac.Ime = parsirani[2];
                    vozac.Prezime = parsirani[3];
                    vozac.Pol = (parsirani[4].Equals("Zenski") ? Pol.Zenski : Pol.Muski);
                    vozac.Jmbg = parsirani[5];
                    vozac.Telefon = parsirani[6];
                    vozac.Email = parsirani[7];
                    vozac.Lokacija.Adresa.Ulica = parsirani[8];
                    vozac.Lokacija.Adresa.Broj = Int32.Parse(parsirani[9]);
                    vozac.Lokacija.Adresa.NaseljenoMesto = parsirani[10];
                    vozac.Lokacija.Adresa.PozivniBrojMesta = Int32.Parse(parsirani[11]);
                    vozac.Automobil.Vozac = parsirani[12];
                    vozac.Automobil.IdVozila = parsirani[13];
                    vozac.Automobil.BrojRegistarskeOznake = parsirani[14];
                    vozac.Automobil.GodisteAutomobila = parsirani[15];
                    vozac.Automobil.TipAutomobila = (Enums.TipAutomobila)System.Enum.Parse(typeof(Enums.TipAutomobila), parsirani[16]);


                    Vozaci.Add(vozac);
                }
            }
        }
        private void LoadVoznje()
        {
            using (TextReader tr = new StreamReader(@"D:\TaxiService\WEBTaxiService\WEBTaxiService\TaxiService\App_Data\voznje.txt"))
            {
                Voznja voznja = null;
                Musterija m = null;
                Dispecer d = null;
                Vozac v = null;
                string podaci = "";
                int idVoznje = 1;
                while ((podaci = tr.ReadLine()) != null)
                {
                    string[] parsirani = podaci.Split(';');
                    voznja = new Voznja();
                    voznja.IDVoznje = idVoznje;
                    voznja.VremePorudzbine = parsirani[0];
                    voznja.StartLokacija.Adresa.Ulica = parsirani[1];
                    voznja.StartLokacija.Adresa.Broj = Int32.Parse(parsirani[2]);
                    voznja.StartLokacija.Adresa.NaseljenoMesto = parsirani[3];
                    voznja.StartLokacija.Adresa.PozivniBrojMesta = Int32.Parse(parsirani[4]);
                    voznja.ZeljeniTipAutomobila = (Enums.TipAutomobila)System.Enum.Parse(typeof(Enums.TipAutomobila), parsirani[5]);
                    if(!parsirani[6].Equals(""))
                    {
                        m = ListeKorisnika.Instanca.Musterije.Find(x => x.Username.Equals(parsirani[6]));
                        voznja.Musterija = m.Username;
                    }else
                    {
                        voznja.Musterija = "";
                    }

                    if(!parsirani[7].Equals(""))
                    {
                        d = ListeKorisnika.Instanca.Dispeceri.Find(x => x.Username.Equals(parsirani[7]));
                        voznja.Dispecer = d.Username;
                    }
                    else
                    {
                        voznja.Dispecer = "";
                    }
                    v = ListeKorisnika.Instanca.Vozaci.Find(x => x.Username.Equals(parsirani[8]));
                    if(v != null)
                    {
                        voznja.Vozac.Username = v.Username;
                    }

                    voznja.EndLokacija.Adresa.Ulica = parsirani[9];
                    voznja.EndLokacija.Adresa.Broj = Int32.Parse(parsirani[10]);
                    voznja.EndLokacija.Adresa.NaseljenoMesto = parsirani[11];
                    voznja.EndLokacija.Adresa.PozivniBrojMesta = Int32.Parse(parsirani[12]);
                    voznja.Iznos = double.Parse(parsirani[13]);
                    voznja.Status = (Enums.StatusVoznje)System.Enum.Parse(typeof(Enums.StatusVoznje), parsirani[14]);
                    if(parsirani[15] != "")
                    {
                        voznja.Komentar.DatumObjave = parsirani[15];
                        voznja.Komentar.Opis = parsirani[16];
                        voznja.Komentar.OcenaVoznje = Int32.Parse(parsirani[17]);
                        voznja.Komentar.Korisnik = parsirani[18];
                    }
                    else {
                        voznja.Komentar.DatumObjave = "";
                        voznja.Komentar.Opis = "";
                        voznja.Komentar.OcenaVoznje = 0;
                        voznja.Komentar.Korisnik = "";
                    }

                    if (m != null)
                    {
                        ListeKorisnika.Instanca.Musterije.Remove(m);
                        m.Voznje.Add(voznja);
                        ListeKorisnika.Instanca.Musterije.Add(m);
                    }
                    if(d != null)
                    {
                        ListeKorisnika.Instanca.Dispeceri.Remove(d);
                        d.Voznje.Add(voznja);
                        ListeKorisnika.Instanca.Dispeceri.Add(d);
                    }
                    if(v != null)
                    {
                        ListeKorisnika.Instanca.Vozaci.Remove(v);
                        if(voznja.Status == StatusVoznje.Obradjena || voznja.Status == StatusVoznje.Prihvacena || voznja.Status == StatusVoznje.Formirana)
                        {
                            voznja.Vozac.Zauzet = true;
                            v.Zauzet = true;
                        }
                        v.Voznje.Add(voznja);
                        ListeKorisnika.Instanca.Vozaci.Add(v);     
                    }
                    Voznje.Add(voznja);

                    ++idVoznje;
                }
            }
        }

        public void UcitajSveListe()
        {
            LoadDispecere();
            LoadMusterije();
            LoadVozaci();
            LoadVoznje();
        }

        public Korisnik NadjiKorisnika(string username)
        {
            Korisnik k = null;
            foreach (var item in Dispeceri)
            {
                if(item.Username.Equals(username))
                {
                    k = item;
                }
            }
            foreach (var item in Vozaci)
            {
                if (item.Username.Equals(username))
                {
                    k = item;
                }
            }
            foreach (var item in Musterije)
            {
                if (item.Username.Equals(username))
                {
                    k = item;
                }
            }

            return k;
        }

        public void RegistracijaKorisnika(Korisnik k)
        {
            Musterije.Add((Musterija)k);
            using(TextWriter tw = new StreamWriter(@"D:\TaxiService\WEBTaxiService\WEBTaxiService\TaxiService\App_Data\musterije.txt", append:true))
            {

                    tw.Write(k.Username);
                    tw.Write(";");
                    tw.Write(k.Password);
                    tw.Write(";");
                    tw.Write(k.Ime);
                    tw.Write(";");
                    tw.Write(k.Prezime);
                    tw.Write(";");
                    tw.Write(k.Pol);
                    tw.Write(";");
                    tw.Write(k.Jmbg);
                    tw.Write(";");
                    tw.Write(k.Telefon);
                    tw.Write(";");
                    tw.Write(k.Email);
                    tw.Write(";\n");
            }
        }
        public void UpisiUBazuMusterije()
        {
            try
            {
                using (TextWriter tw = new StreamWriter(@"D:\TaxiService\WEBTaxiService\WEBTaxiService\TaxiService\App_Data\musterije.txt"))
                {
                    foreach (var item in Musterije)
                    {
                        tw.Write(item.Username);
                        tw.Write(";");
                        tw.Write(item.Password);
                        tw.Write(";");
                        tw.Write(item.Ime);
                        tw.Write(";");
                        tw.Write(item.Prezime);
                        tw.Write(";");
                        tw.Write(item.Pol);
                        tw.Write(";");
                        tw.Write(item.Jmbg);
                        tw.Write(";");
                        tw.Write(item.Telefon);
                        tw.Write(";");
                        tw.Write(item.Email);
                        if (Musterije.IndexOf(item) != Musterije.Count - 1)
                        {
                            tw.Write("\n");
                        }
                    }
                }
            }
            catch
            {

            }
        }

        public void UpisiUBazuDispecere()
        {
            try
            {
                using (TextWriter tw = new StreamWriter(@"D:\TaxiService\WEBTaxiService\WEBTaxiService\TaxiService\App_Data\dispeceri.txt"))
                {
                    foreach (var item in Dispeceri)
                    {
                        tw.Write(item.Username);
                        tw.Write(";");
                        tw.Write(item.Password);
                        tw.Write(";");
                        tw.Write(item.Ime);
                        tw.Write(";");
                        tw.Write(item.Prezime);
                        tw.Write(";");
                        tw.Write(item.Pol);
                        tw.Write(";");
                        tw.Write(item.Jmbg);
                        tw.Write(";");
                        tw.Write(item.Telefon);
                        tw.Write(";");
                        tw.Write(item.Email);
                        if (Dispeceri.IndexOf(item) != Dispeceri.Count - 1)
                        {
                            tw.Write("\n");
                        }
                    }
                }
            }
            catch
            {

            }
        }

        public void UpisiUBazuVozace()
        {
            try
            {
                using (TextWriter tw = new StreamWriter(@"D:\TaxiService\WEBTaxiService\WEBTaxiService\TaxiService\App_Data\vozaci.txt"))
                {
                    foreach (var item in Vozaci)
                    {
                        tw.Write(item.Username);
                        tw.Write(";");
                        tw.Write(item.Password);
                        tw.Write(";");
                        tw.Write(item.Ime);
                        tw.Write(";");
                        tw.Write(item.Prezime);
                        tw.Write(";");
                        tw.Write(item.Pol);
                        tw.Write(";");
                        tw.Write(item.Jmbg);
                        tw.Write(";");
                        tw.Write(item.Telefon);
                        tw.Write(";");
                        tw.Write(item.Email);
                        tw.Write(";");
                        tw.Write(item.Lokacija.Adresa.Ulica);
                        tw.Write(";");
                        tw.Write(item.Lokacija.Adresa.Broj);
                        tw.Write(";");                   
                        tw.Write(item.Lokacija.Adresa.NaseljenoMesto);
                        tw.Write(";");
                        tw.Write(item.Lokacija.Adresa.PozivniBrojMesta);
                        tw.Write(";");
                        tw.Write(item.Automobil.Vozac);
                        tw.Write(";");
                        tw.Write(item.Automobil.IdVozila);
                        tw.Write(";");
                        tw.Write(item.Automobil.BrojRegistarskeOznake);
                        tw.Write(";");
                        tw.Write(item.Automobil.GodisteAutomobila);
                        tw.Write(";");
                        tw.Write(item.Automobil.TipAutomobila);
                        if (Vozaci.IndexOf(item) != Vozaci.Count - 1)
                        {
                            tw.Write("\n");
                        }
                    }
                }
            }
            catch
            {

            }
        }

        public void UpisiUBazuVoznje()
        {

                using (TextWriter tw = new StreamWriter(@"D:\TaxiService\WEBTaxiService\WEBTaxiService\TaxiService\App_Data\voznje.txt"))
                {
                    foreach (var item in Voznje)
                    {
                        tw.Write(item.VremePorudzbine);
                        tw.Write(";");
                        tw.Write(item.StartLokacija.Adresa.Ulica);
                        tw.Write(";");
                        tw.Write(item.StartLokacija.Adresa.Broj);
                        tw.Write(";");
                        tw.Write(item.StartLokacija.Adresa.NaseljenoMesto);
                        tw.Write(";");
                        tw.Write(item.StartLokacija.Adresa.PozivniBrojMesta);
                        tw.Write(";");
                        tw.Write(item.ZeljeniTipAutomobila.ToString());
                        tw.Write(";");
                        if (item.Musterija == "")
                        {
                            tw.Write(";");
                        }else
                        {
                            tw.Write(item.Musterija);
                            tw.Write(";");
                        }
                        if(item.Dispecer == "")
                        {
                            tw.Write(";");
                        }else
                        {
                            tw.Write(item.Dispecer);
                            tw.Write(";");
                        }
                        tw.Write(item.Vozac.Username);
                        tw.Write(";");
                        tw.Write(item.EndLokacija.Adresa.Ulica);
                        tw.Write(";");
                        tw.Write(item.EndLokacija.Adresa.Broj);
                        tw.Write(";");
                        tw.Write(item.EndLokacija.Adresa.NaseljenoMesto);
                        tw.Write(";");
                        tw.Write(item.EndLokacija.Adresa.PozivniBrojMesta);
                        tw.Write(";");
                        tw.Write(item.Iznos);
                        tw.Write(";");
                        tw.Write(item.Status);                        
                        tw.Write(";");
                        if (item.Komentar!=null)
                        {
                            if(item.Komentar.DatumObjave != "")
                            {
                                tw.Write(item.Komentar.DatumObjave);
                                tw.Write(";");
                                tw.Write(item.Komentar.Opis);
                                tw.Write(";");
                                tw.Write(item.Komentar.OcenaVoznje);
                                tw.Write(";");
                                tw.Write(item.Komentar.Korisnik);
                            }                      
                        }else
                        {
                        tw.Write("");
                        tw.Write(";");
                        tw.Write("");
                        tw.Write(";");
                        tw.Write("");
                        tw.Write(";");
                        tw.Write("");
                        }
                       
                        if (Voznje.IndexOf(item) != Voznje.Count - 1)
                        {
                            tw.Write("\n");
                        }
                    }
                }           
        }
    }
}