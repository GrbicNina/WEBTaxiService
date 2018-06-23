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
                    vozac.Automobil.TipAutomobila = (parsirani[16].Equals("KombiVozilo") ? TipAutomobila.KombiVozilo : TipAutomobila.PutnickiAutomobil);


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
    }
}