if (sessionStorage.getItem('korisnik') == null) {
    windows.location.href = "Index.html";
} else {
    var korisnikJSON = sessionStorage.getItem('korisnik');
    korisnik = $.parseJSON(korisnikJSON);
}

function openPage(pageName, elmnt, color) {
    // Hide all elements with class="tabcontent" by default */
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    // Remove the background color of all tablinks/buttons
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }
    // Show the specific tab content
    document.getElementById(pageName).style.display = "block";
    // Add the specific color to the button used to open the tab content
    elmnt.style.backgroundColor = color;
}

function getStatusVoznje(id) {
    var status = "undefined";
    if (id == 0) {
        status = "Kreirana";
    } else if (id == 1) {
        status = "Formirana";
    } else if (id == 2) {
        status = "Obradjena";
    } else if (id == 3) {
        status = "Prihvacena";
    } else if (id == 4) {
        status = "Otkazana";
    } else if (id == 5) {
        status = "Neuspesna";
    } else if (id == 6) {
        status = "Uspesna";
    }

    return status;
}

function getNazivAuta(id) {
    var naziv = "undefined";
    if (id == 0) {
        naziv = "PutnickiAutomobil";
    } else if (id == 1) {
        naziv = "KombiVozilo";
    } else if (id == 2) {
        naziv = "Svejedno";
    }
    return naziv;
}

idVoznje = 0;

$(document).ready(function () {

    $('#buttonLogOff').click(function () {
        sessionStorage.removeItem('korisnik');
        window.location.href = "Index.html";
    });

    $("#viewProfile").click(function () {
        korisnikJSON = sessionStorage.getItem('korisnik');
        korisnik = $.parseJSON(korisnikJSON);
        $("#username").val(`${korisnik.Username}`);
        $("#ime").val(`${korisnik.Ime}`);
        $("#prezime").val(`${korisnik.Prezime}`);
        $("#pol").val(`${korisnik.Pol}`);
        $("#telefon").val(`${korisnik.Telefon}`);
        $("#jmbg").val(`${korisnik.Jmbg}`);
        $("#email").val(`${korisnik.Email}`);
        $("#voznje").val(`${korisnik.Voznje}`);
    });

    $("#izmena").click(function () {
        $("#usernameEdit").val(`${korisnik.Username}`);
        $("#imeEdit").val(`${korisnik.Ime}`);
        $("#prezimeEdit").val(`${korisnik.Prezime}`);
        if (`${korisnik.Pol}` == 0) {
            $("#MuskiEdit").attr("selected", "true");
        }
        else {
            $("#ZenskiEdit").attr("selected", "true");
        }
        $("#telefonEdit").val(`${korisnik.Telefon}`);
        $("#jmbgEdit").val(`${korisnik.Jmbg}`);
        $("#emailEdit").val(`${korisnik.Email}`);
    });

    $("#izmenaButton").click(function () {
        var retVal = true;

        let userinput = $('#imeEdit').val();
        let pattern = /^\b^[A-Za-z]+$/i;
        if (userinput != "") {
            if (!pattern.test(userinput)) {
                $('#imeGreska').show();
                retVal = false;
            } else {
                $('#imeGreska').hide();
                retVal = true;
            }
        } else {
            $('#imeGreska').show();
            retVal = false;
        }

        userinput = $('#prezimeEdit').val();
        pattern = /^\b^[A-Za-z]+$/i;
        if (userinput != "") {
            if (!pattern.test(userinput)) {
                $('#prezimeGreska').show();
                retVal = false;
            } else {
                $('#prezimeGreska').hide();
                retVal = true;
            }
        } else {
            $('#prezimeGreska').show();
            retVal = false;
        }

        userinput = $('#emailEdit').val();
        pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
        if (userinput != "") {
            if (!pattern.test(userinput)) {
                $('#emailGreska').show();
                retVal = false;
            }
            else {
                $('#emailGreska').hide();
                retVal = true;
            }
        } else {
            $('#emailGreska').show();
            retVal = false;
        }

        userinput = $('#jmbgEdit').val();
        pattern = /^\b\d{13}\b$/i;
        if (userinput != "") {
            if (!pattern.test(userinput)) {
                $('#jmbgGreska').show();
                retVal = false;
            } else {
                $('#jmbgGreska').hide();
                retVal = true;
            }
        } else {
            $('#jmbgGreska').show();
            retVal = false;
        }

        userinput = $('#telefonEdit').val();
        pattern = /^\b\d{8,10}\b$/i;
        if (userinput != "") {
            if (!pattern.test(userinput)) {
                $('#telefonGreska').show();
                retVal = false;
            } else {
                $('#telefonGreska').hide();
                retVal = true;
            }
        } else {
            $('#telefonGreska').show();
            retVal = false;
        }

        if (retVal) {
            var uloga = "Dispecer";
            let dispecer = {
                Username: `${$('#usernameEdit').val()}`,
                Ime: `${$('#imeEdit').val()}`,
                Prezime: `${$('#prezimeEdit').val()}`,
                Pol: `${$('#polEdit').val()}`,
                JMBG: `${$('#jmbgEdit').val()}`,
                Telefon: `${$('#telefonEdit').val()}`,
                Email: `${$('#emailEdit').val()}`,
                Password: `${korisnik.Username}`
            };

            $.ajax({
                type: 'POST',
                url: '/api/Dispecer/IzmeniProfil',
                data: JSON.stringify(dispecer),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (data) {
                    $('#korisnickoimeGreska').hide();
                    $('#izmenaPodataka').append('<label>Uspesno ste izmenili svoje podatke!</label><br/>');
                    sessionStorage.setItem('korisnik', JSON.stringify(data));
                },
                error: function (data) {
                    if (data.status === 409) {
                        $('#korisnickoimeGreska').show();
                    }
                }
            });
        }
    });

    $("#menjajSifruButton").click(function () {
        korisnikJSON = sessionStorage.getItem('korisnik');
        korisnik = $.parseJSON(korisnikJSON);

        var ulogovanaSifra = `${korisnik.Password}`;
        var unesena = `${$('#staraSifra').val()}`;
        var validno = false;
        if (`${$('#novaSifra').val()}` == "") {
            $('#greskaNovaSifra').show();
            validno = false;
        } else {
            $('#greskaNovaSifra').hide();
            validno = true;
        }

        if (ulogovanaSifra != unesena) {
            $('#greskaSifra').show();
            validno = false;
        }
        if (validno) {
            var sifra = {
                username: `${korisnik.Username}`,
                stara: `${$('#staraSifra').val()}`,
                nova: `${$('#novaSifra').val()}`
            };

            $('#greskaSifra').hide();
            $('#greskaNovaSifra').hide();
            $('#uspesnaSifra').show();

            $.ajax({
                type: 'POST',
                url: '/api/Dispecer/IzmeniSifru',
                data: JSON.stringify(sifra),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (data) {
                    sessionStorage.setItem('korisnik', JSON.stringify(data));
                },
                error: function (data) {
                    if (data.status === 409) {
                        $('#greskaSifra').show();
                    }
                }
            });
        }
    });

    $("#dodajVozacaButton").click(function () {
        var retVal = true;

        let userinput = $('#imeVozac').val();
        let pattern = /^\b^[A-Za-z]+$/i;
        if (userinput != "") {
            if (!pattern.test(userinput)) {
                $('#imeGreskaVozac').show();
                retVal = false;
            } else {
                $('#imeGreskaVozac').hide();
                retVal = true;
            }
        } else {
            $('#imeGreskaVozac').show();
            retVal = false;
        }

        userinput = $('#prezimeVozac').val();
        pattern = /^\b^[A-Za-z]+$/i;
        if (userinput != "") {
            if (!pattern.test(userinput)) {
                $('#prezimeGreskaVozac').show();
                retVal = false;
            } else {
                $('#prezimeGreskaVozac').hide();
                retVal = true;
            }
        } else {
            $('#prezimeGreskaVozac').show();
            retVal = false;
        }

        userinput = $('#emailVozac').val();
        pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
        if (userinput != "") {
            if (!pattern.test(userinput)) {
                $('#emailGreskaVozac').show();
                retVal = false;
            }
            else {
                $('#emailGreskaVozac').hide();
                retVal = true;
            }
        } else {
            $('#emailGreskaVozac').show();
            retVal = false;
        }

        userinput = $('#jmbgVozac').val();
        pattern = /^\b\d{13}\b$/i;
        if (userinput != "") {
            if (!pattern.test(userinput)) {
                $('#jmbgGreskaVozac').show();
                retVal = false;
            } else {
                $('#jmbgGreskaVozac').hide();
                retVal = true;
            }
        } else {
            $('#jmbgGreskaVozac').show();
            retVal = false;
        }

        userinput = $('#telefonVozac').val();
        pattern = /^\b\d{8,10}\b$/i;
        if (userinput != "") {
            if (!pattern.test(userinput)) {
                $('#telefonGreskaVozac').show();
                retVal = false;
            } else {
                $('#telefonGreskaVozac').hide();
                retVal = true;
            }
        } else {
            $('#telefonGreskaVozac').show();
            retVal = false;
        }

        userinput = $('#ulicaVozac').val();
        pattern = /^[a-zA-Z]+( [a-zA-Z]+)*$/i;
        if (userinput != "") {
            if (!pattern.test(userinput)) {
                $('#greskaUlicaVozac').show();
                retVal = false;
            } else {
                $('#greskaUlicaVozac').hide();
                retVal = true;
            }
        } else {
            $('#greskaUlicaVozac').show();
            retVal = false;
        }

        userinput = $('#mestoVozac').val();
        pattern = /^[a-zA-Z]+( [a-zA-Z]+)*$/i;
        if (userinput != "") {
            if (!pattern.test(userinput)) {
                $('#greskaMestoVozac').show();
                retVal = false;
            } else {
                $('#greskaMestoVozac').hide();
                retVal = true;
            }
        } else {
            $('#greskaMestoVozac').show();
            retVal = false;
        }

        if (retVal) {
            let vozac = {
                Username: `${$('#usernameVozac').val()}`,
                Password: `${$('#passwordVozac').val()}`,
                Ime: `${$('#imeVozac').val()}`,
                Prezime: `${$('#prezimeVozac').val()}`,
                Pol: `${$('#polVozac').val()}`,
                JMBG: `${$('#jmbgVozac').val()}`,
                Telefon: `${$('#telefonVozac').val()}`,
                Email: `${$('#emailVozac').val()}`,
                Ulica: `${$('#ulicaVozac').val()}`,
                Broj: `${$('#brojUliceVozac').val()}`,
                NaseljenoMesto: `${$('#mestoVozac').val()}`,
                PozivniBroj: `${$('#pozivniBrojVozac').val()}`,
                GodisteAutomobila: `${$('#godisteAutomobila').val()}`,
                RegistarskaOznaka: `${$('#registarskaOznaka').val()}`,
                IdVozila: `${$('#idVozila').val()}`,
                TipVozila: `${$('#tipVozila').val()}` 
            };

            $('#imeGreskaVozac').hide();
            $('#prezimeGreskaVozac').hide();
            $('#emailGreskaVozac').hide();
            $('#jmbgGreskaVozac').hide();
            $('#telefonGreskaVozac').hide();
            $('#greskaUlicaVozac').hide();
            $('#greskaMestoVozac').hide();
            
            $.ajax({
                type: 'POST',
                url: '/api/Dispecer/DodajVozaca',
                data: JSON.stringify(vozac),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (data) {
                    $('#uspesnoVozac').show();
                },
                error: function (data) {
                    if (data.status === 409) {
                        $('#korisnickoimeGreskaVozac').show();
                    } else if (data.status == 400) {
                        $('#greskaVozacForma').show();
                    }
                }
            });
        }
    });

    $("#formirajVoznjuButton").click(function () {
        
        var voznja = {
            Ulica: `${$('#ulica').val()}`,
            Broj: `${$('#broj').val()}`,
            NaseljenoMesto: `${$('#naseljenoMesto').val()}`,
            PozivniBroj: `${$('#pozivniBroj').val()}`,
            TipVozila: `${$('#tipAutomobila').val()}`,
            Username: korisnik.Username
        };
        $.ajax({
            type: 'POST',
            url: '/api/Dispecer/FormirajVoznju',
            data: JSON.stringify(voznja),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                $('#neuspesnoFormiranjeVoznje').hide();
                $('#uspesnoFormiranjeVoznje').show();
            },
            error: function (data) {
                if (data.status == 400) {
                    $('#neuspesnoFormiranjeVoznje').show();
                } else if (data.status == 409) {
                    $('#formirajVoznju').hide();
                    $('#formirajVoznju').append("<label id=\"nemaSlobodnihVozaca\">Trenutno nema slobodnih vozaca. Molimo Vas pokusajte malo kasnije... Hvala na poverenju!</label>");
                }
            }
        });
    });
    
    $("#obradaVoznje").click(function () {
        
        $.ajax({
            method: "GET",
            url: "/api/Dispecer/GetVoznjeZaObradu",
            dataType: 'html',
            complete: function (data) {
                if (data.status == 200) {
                    $("#obradiVoznju").html(data.responseText);
                }
                else {
                    $("#obradiVoznju").html(data.responseText);
                }
            }
        });
    });

});

$(document).on("click", ".obradi_buttonClass", function () {

    idVoznje = `${$(this).val()}`;
    $.ajax({
        method: "GET",
        url: "/api/Dispecer/GetVoznja",
        data: { id: idVoznje },
        dataType: "html",
        complete: function (data) {
            $("#obradiVoznju").html(data.responseText);
        }
    });
});

$(document).on('click', '#buttonObradiVoznju', function () {
    var voznja = {
        Vozac: `${$('#odabraniVozac').val()}`,
        IDVoznje: `${idVoznje}`,
        Dispecer: korisnik.Username
    };
    $.ajax({
        type: 'POST',
        url: '/api/Dispecer/ObradiVoznju',
        data: JSON.stringify(voznja),
        contentType: 'application/json; charset=utf-8',
        dataType: 'html',
        success: function (data, status) {
            $("#obradiVoznju").html(data);
            idVoznje = data.IDVoznje;
        },
        error: function (data) {
            $("#obradiVoznju").html(data);
        }
    });

});

$(document).on("click", "#pocetnaStranica", function () {
    var username = korisnik.Username;
    $.ajax({
        method: "GET",
        url: "/api/Dispecer/VratiVoznjePocetna/" + username,
        dataType: "json",
        complete: function (data,status) {
            if (status == "success") {
                var i;
                var izgled = '<h3>Vase voznje</h3><label>Filtriraj:</label><select id="filterD1"><option id="nista" display:none></option >';
                izgled += '<option>Kreirana</option><option>Formirana</option><option>Obradjena</option><option>Prihvacena</option><option>Otkazana</option>';
                izgled += '<option>Neuspesna</option><option>Uspesna</option></select><button id="filterButton1">Filtriraj</button>';
                izgled += '</br><label>Sortiraj po: </label><input type="checkbox" id="datumCheck"/>Datumu<input type="checkbox" id="ocenaCheck"/>Oceni<button id="sort">Sortiraj</button> ';
                izgled += '</br><label>Pretrazi po:</label>OD<input id="datumOD" type="date"/>DO<input id="datumDO" type="date"/>';
                izgled += '<label>Oceni</label>OD<input type="number" min="0" max ="5" id="ocenaOD"/><input type="number" min="0" max ="5" id="ocenaDO"/>';
                izgled += '<label>Ceni</label>OD<input id="cenaOD" type = "number" min="0" max ="100000"/>DO<input id="cenaDO" type = "number" min="0" max ="100000"/><button id="pretraga">Pretrazi</button>';
                izgled += '</br><label>Pretraga po vozacu:</label><label>Ime:</label><input id="vozacIme2" type="text"/><label>Prezime:</label><input id="vozacPrezime2" type="text"/><button id="pretraziVozacButton2">Pretrazi</button>';
                izgled += '</br><label>Pretraga po musteriji:</label><label>Ime:</label><input id="mustIme2" type="text"/><label>Prezime:</label><input id="mustPrezime2" type="text"/><button id="pretraziMusterijuButton2">Pretrazi</button>';
                izgled += '<table class="table-style-three" border="1" id="tabelaVoznji"></table>';   
                $("#pocetna").show();
                $("#pocetna").html(izgled);
                document.getElementById("ocenaOD").defaultValue = 0;
                document.getElementById("ocenaDO").defaultValue = 5;
                document.getElementById("cenaOD").defaultValue = 0;
                document.getElementById("cenaDO").defaultValue = 100000;   
                var izgled0 = $("<th></th>").text("ID Voznje");
                var izgled1 = $("<th></th>").text("Datum i vreme narudzbe");
                var izgled2 = $("<th></th>").text("Vozac");
                var izgled3 = $("<th></th>").text("Musterija");
                var izgled4 = $("<th></th>").text("[START]Ulica");
                var izgled5 = $("<th></th>").text("[START]Broj");
                var izgled6 = $("<th></th>").text("[START]Grad");
                var izgled7 = $("<th></th>").text("[START]Pozivni broj");
                var izgled8 = $("<th></th>").text("Zeljeni tip vozila");
                var izgled9 = $("<th></th>").text("Status voznje");
                var izgled10 = $("<th></th>").text("[END]Ulica");
                var izgled11 = $("<th></th>").text("[END]Broj");
                var izgled12 = $("<th></th>").text("[END]Grad");
                var izgled13 = $("<th></th>").text("[END]Pozivni broj");
                var izgled14 = $("<th></th>").text("Iznos");
                var izgled15 = $("<th></th>").text("Ocena");
                $("#tabelaVoznji").append('<tr>', izgled0, izgled1, izgled2, izgled3, izgled4, izgled5, izgled6, izgled7, izgled8, izgled9, izgled10, izgled11, izgled12, izgled13, izgled14, izgled15, '</tr>');

                var lista = JSON.parse(data.responseText);
                for (i = 0; i < lista.length; i++) {
                    var t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15;
                    t0 = $('<td></td>').text(lista[i].IDVoznje);
                    t1 = $('<td></td>').text(lista[i].VremePorudzbine.toString());
                    t2 = $('<td></td>').text(lista[i].Vozac.Username);
                    t3 = $('<td></td>').text(lista[i].Musterija);
                    t4 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Ulica);
                    t5 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Broj);
                    t6 = $('<td></td>').text(lista[i].StartLokacija.Adresa.NaseljenoMesto);
                    t7 = $('<td></td>').text(lista[i].StartLokacija.Adresa.PozivniBrojMesta);
                    t8 = $('<td></td>').text(getNazivAuta(lista[i].ZeljeniTipAutomobila.toString()));
                    t9 = $('<td></td>').text(getStatusVoznje(lista[i].Status));
                    if (getStatusVoznje(lista[i].Status) === "Uspesna" || getStatusVoznje(lista[i].Status) === "Neuspesna" || getStatusVoznje(lista[i].Status) === "Otkazana") {
                        t10 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Ulica);
                        t11 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Broj);
                        t12 = $('<td></td>').text(lista[i].EndLokacija.Adresa.NaseljenoMesto);
                        t13 = $('<td></td>').text(lista[i].EndLokacija.Adresa.PozivniBrojMesta);
                        t14 = $('<td></td>').text(lista[i].Iznos);
                        t14 = $('<td></td>').text(lista[i].Komentar.OcenaVoznje);
                        
                    } else {
                        t10 = $('<td></td>').text("");
                        t11 = $('<td></td>').text("");
                        t12 = $('<td></td>').text("");
                        t13 = $('<td></td>').text("");
                        t14 = $('<td></td>').text("0");
                        t15 = $('<td></td>').text("0");
                    }
                    $("#tabelaVoznji").append('<tr>', t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15, '</tr>');
                }
            
            } else {
                $("#pocetna").show();
                $("#pocetna").html('<h4>Ne postoji ni jedna voznja za koju ste bili angazovani.</h4>');
            }              
        }
    });
});

$(document).on("click", "#sveVoznje", function () {

    $.ajax({
        method: "GET",
        url: "/api/Dispecer/VratiSveVoznje",
        dataType: "json",
        complete: function (data, status) {
            if (status == "success") {
                $("#prikaziSveVoznje").html("");
                var i;
                var izgled = '<h3>Sve voznje u sistemu</h3><label>Filtriraj:</label><select id="filterD2"><option id="nista" display:none></option >';
                izgled += '<option>Kreirana</option><option>Formirana</option><option>Obradjena</option><option>Prihvacena</option><option>Otkazana</option>';
                izgled += '<option>Neuspesna</option><option>Uspesna</option></select><button id="filterButton2">Filtriraj</button>';
                izgled += '</br><label>Sortiraj po: </label><input type="checkbox" id="datumCheckSve"/>Datumu<input type="checkbox" id="ocenaCheckSve"/>Oceni<button id="sortSve">Sortiraj</button>';
                izgled += '</br><label>Pretrazi po:</label>OD<input id="datumOD2" type="date"/>DO<input id="datumDO2" type="date"/>';
                izgled += '<label>Oceni</label>OD<input type="number" min="0" max ="5" id="ocenaOD2"/><input type="number" min="0" max ="5" id="ocenaDO2"/>';
                izgled += '<label>Ceni</label>OD<input id="cenaOD2" type = "number" min="0" max ="100000"/>DO<input id="cenaDO2" type = "number" min="0" max ="100000"/><button id="pretraga2">Pretrazi</button>';
                izgled += '</br><label>Pretraga po vozacu:</label><label>Ime:</label><input id="vozacIme1" type="text"/><label>Prezime:</label><input id="vozacPrezime1" type="text"/><button id="pretraziVozacButton1">Pretrazi</button>';
                izgled += '</br><label>Pretraga po musteriji:</label><label>Ime:</label><input id="mustIme1" type="text"/><label>Prezime:</label><input id="mustPrezime1" type="text"/><button id="pretraziMusterijuButton1">Pretrazi</button>';
                izgled += '<table class="table-style-three" border="1" id="tabelaSvihVoznji"></table>';   
                $("#prikaziSveVoznje").show();
                $("#prikaziSveVoznje").html(izgled);
                document.getElementById("ocenaOD2").defaultValue = 0;
                document.getElementById("ocenaDO2").defaultValue = 5;
                document.getElementById("cenaOD2").defaultValue = 0;
                document.getElementById("cenaDO2").defaultValue = 100000;   
                var izgled0 = $("<th></th>").text("ID Voznje");
                var izgled1 = $("<th></th>").text("Datum i vreme narudzbe");
                var izgled2 = $("<th></th>").text("Vozac");
                var izgled3 = $("<th></th>").text("Musterija");
                var izgled4 = $("<th></th>").text("[START]Ulica");
                var izgled5 = $("<th></th>").text("[START]Broj");
                var izgled6 = $("<th></th>").text("[START]Grad");
                var izgled7 = $("<th></th>").text("[START]Pozivni broj");
                var izgled8 = $("<th></th>").text("Zeljeni tip vozila");
                var izgled9 = $("<th></th>").text("Status voznje");
                var izgled10 = $("<th></th>").text("[END]Ulica");
                var izgled11 = $("<th></th>").text("[END]Broj");
                var izgled12 = $("<th></th>").text("[END]Grad");
                var izgled13 = $("<th></th>").text("[END]Pozivni broj");
                var izgled14 = $("<th></th>").text("Iznos");
                var izgled15 = $("<th></th>").text("Ocena");
                $("#tabelaSvihVoznji").append('<tr>', izgled0, izgled1, izgled2, izgled3, izgled4, izgled5, izgled6, izgled7, izgled8, izgled9, izgled10, izgled11, izgled12, izgled13, izgled14, izgled15, '</tr>');

                var lista = JSON.parse(data.responseText);
                var t001, t0, t1, t01, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13;
                for (i = 0; i < lista.length; i++) {
                    t001 = $('<td></td>').text(lista[i].IDVoznje);
                    t0 = $('<td></td>').text(lista[i].VremePorudzbine.toString());
                    t1 = $('<td></td>').text(lista[i].Vozac.Username);
                    t01 = $('<td></td>').text(lista[i].Musterija);
                    t2 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Ulica);
                    t3 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Broj);
                    t4 = $('<td></td>').text(lista[i].StartLokacija.Adresa.NaseljenoMesto);
                    t5 = $('<td></td>').text(lista[i].StartLokacija.Adresa.PozivniBrojMesta);
                    t6 = $('<td></td>').text(getNazivAuta(lista[i].ZeljeniTipAutomobila.toString()));
                    t7 = $('<td></td>').text(getStatusVoznje(lista[i].Status));
                    if (getStatusVoznje(lista[i].Status) != "Uspesna" && getStatusVoznje(lista[i].Status) != "Neuspesna" && getStatusVoznje(lista[i].Status) != "Otkazana") {
                        t8 = $('<td></td>').text("");
                        t9 = $('<td></td>').text("");
                        t10 = $('<td></td>').text("");
                        t11 = $('<td></td>').text("");
                        t12 = $('<td></td>').text("");
                        t13 = $('<td></td>').text("");
                        $("#tabelaSvihVoznji").append('<tr>', t001, t0, t1, t01, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, '</tr>');
                    } else {
                        t8 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Ulica);
                        t9 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Broj);
                        t10 = $('<td></td>').text(lista[i].EndLokacija.Adresa.NaseljenoMesto);
                        t11 = $('<td></td>').text(lista[i].EndLokacija.Adresa.PozivniBrojMesta);
                        t12 = $('<td></td>').text(lista[i].Iznos);
                        t13 = $('<td></td>').text(lista[i].Komentar.OcenaVoznje);
                        $("#tabelaSvihVoznji").append('<tr>', t001, t0, t1, t01, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, '</tr>');
                     }
                }
            }else {
                $("#prikaziSveVoznje").html("<h3>Trenutno nema voznji u sistemu!</h3>");
            }
        }
                      
    });
});

$(document).on("click", "#pretraziVozacButton2", function () {
    var usernameUlogovanog = korisnik.Username;
    var imeVozaca = document.getElementById("vozacIme2").value;
    var prezimeVozaca = document.getElementById("vozacPrezime2").value;
    var flagic = "0";
    var paket = {
        usernameDispecera: usernameUlogovanog,
        ime: imeVozaca,
        prezime: prezimeVozaca,
        flag: flagic
    };
    $.ajax({
        method: "GET",
        url: "/api/FilterSortPretraga/PretraziPoVozacu",
        data: JSON.stringify(paket),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        complete: function (data, status) {
            if (status == "success") {
                var i;
                var izgled = '<h3>Rezultati pretrage Vasih voznji po vozacu</h3>';
                izgled += '<table class="table-style-three" border="1" id="tabelaVoznji"></table>';
                $("#pocetna").show();
                $("#pocetna").html(izgled);
                var izgled0 = $("<th></th>").text("ID Voznje");
                var izgled1 = $("<th></th>").text("Datum i vreme narudzbe");
                var izgled2 = $("<th></th>").text("Vozac");
                var izgled3 = $("<th></th>").text("Musterija");
                var izgled4 = $("<th></th>").text("[START]Ulica");
                var izgled5 = $("<th></th>").text("[START]Broj");
                var izgled6 = $("<th></th>").text("[START]Grad");
                var izgled7 = $("<th></th>").text("[START]Pozivni broj");
                var izgled8 = $("<th></th>").text("Zeljeni tip vozila");
                var izgled9 = $("<th></th>").text("Status voznje");
                var izgled10 = $("<th></th>").text("[END]Ulica");
                var izgled11 = $("<th></th>").text("[END]Broj");
                var izgled12 = $("<th></th>").text("[END]Grad");
                var izgled13 = $("<th></th>").text("[END]Pozivni broj");
                var izgled14 = $("<th></th>").text("Iznos");
                var izgled15 = $("<th></th>").text("Ocena");
                $("#tabelaVoznji").append('<tr>', izgled0, izgled1, izgled2, izgled3, izgled4, izgled5, izgled6, izgled7, izgled8, izgled9, izgled10, izgled11, izgled12, izgled13, izgled14, izgled15, '</tr>');

                var lista = JSON.parse(data.responseText);
                for (i = 0; i < lista.length; i++) {
                    var t001, t0, t1, t01, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13;
                    t001 = $('<td></td>').text(lista[i].IDVoznje);
                    t0 = $('<td></td>').text(lista[i].VremePorudzbine.toString());
                    t1 = $('<td></td>').text(lista[i].Vozac.Username);
                    t01 = $('<td></td>').text(lista[i].Musterija);
                    t2 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Ulica);
                    t3 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Broj);
                    t4 = $('<td></td>').text(lista[i].StartLokacija.Adresa.NaseljenoMesto);
                    t5 = $('<td></td>').text(lista[i].StartLokacija.Adresa.PozivniBrojMesta);
                    t6 = $('<td></td>').text(getNazivAuta(lista[i].ZeljeniTipAutomobila.toString()));
                    t7 = $('<td></td>').text(getStatusVoznje(lista[i].Status));
                    if (getStatusVoznje(lista[i].Status) === "Uspesna" || getStatusVoznje(lista[i].Status) === "Neuspesna" || getStatusVoznje(lista[i].Status) === "Otkazana") {
                        t8 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Ulica);
                        t9 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Broj);
                        t10 = $('<td></td>').text(lista[i].EndLokacija.Adresa.NaseljenoMesto);
                        t11 = $('<td></td>').text(lista[i].EndLokacija.Adresa.PozivniBrojMesta);
                        t12 = $('<td></td>').text(lista[i].Iznos);
                        t13 = $('<td></td>').text(lista[i].OcenaVoznje);
                    } else {
                        t8 = $('<td></td>').text("");
                        t9 = $('<td></td>').text("");
                        t10 = $('<td></td>').text("");
                        t11 = $('<td></td>').text("");
                        t12 = $('<td></td>').text("");
                        t13 = $('<td></td>').text("");
                    }
                    $("#tabelaVoznji").append('<tr>', t001, t0, t1, t01, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13,'</tr>');
                }

            } else {
                var izgled = '<h3>Nema rezultata za ovu pretragu!</h3>';
                $("#pocetna").show();
                $("#pocetna").html(izgled);
            }
        }
    });

});

$(document).on("click", "#pretraziVozacButton1", function () {
    var usernameUlogovanog = korisnik.Username;
    var imeVozaca = document.getElementById("vozacIme1").value;
    var prezimeVozaca = document.getElementById("vozacPrezime1").value;
    var flagic = "1";
    var paket = {
        usernameDispecera: usernameUlogovanog,
        ime: imeVozaca,
        prezime: prezimeVozaca,
        flag: flagic
    };
    $.ajax({
        method: "GET",
        url: "api/FilterSortPretraga/PretraziPoVozacu",
        data: JSON.stringify(paket),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        complete: function (data, status) {
            if (status == "success") {
                var i;
                var izgled = '<h3>Rezultati svih voznji nakon pretrage po vozacu</h3>';
                izgled += '<table class="table-style-three" border="1" id="tabelaSvihVoznji"></table>';
                $("#prikaziSveVoznje").show();
                $("#prikaziSveVoznje").html(izgled);
                var izgled0 = $("<th></th>").text("ID Voznje");
                var izgled1 = $("<th></th>").text("Datum i vreme narudzbe");
                var izgled2 = $("<th></th>").text("Vozac");
                var izgled3 = $("<th></th>").text("[START]Ulica");
                var izgled4 = $("<th></th>").text("[START]Broj");
                var izgled5 = $("<th></th>").text("[START]Grad");
                var izgled6 = $("<th></th>").text("[START]Pozivni broj");
                var izgled7 = $("<th></th>").text("Zeljeni tip vozila");
                var izgled8 = $("<th></th>").text("Status voznje");
                var izgled9 = $("<th></th>").text("[END]Ulica");
                var izgled10 = $("<th></th>").text("[END]Broj");
                var izgled11 = $("<th></th>").text("[END]Grad");
                var izgled12 = $("<th></th>").text("[END]Pozivni broj");
                var izgled13 = $("<th></th>").text("Iznos");
                $("#tabelaSvihVoznji").append('<tr>', izgled0, izgled1, izgled2, izgled3, izgled4, izgled5, izgled6, izgled7, izgled8, izgled9, izgled10, izgled11, izgled12, izgled13, '</tr>');

                var lista = JSON.parse(data.responseText);
                for (i = 0; i < lista.length; i++) {
                    var t001, t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10;
                    t001 = $('<td></td>').text(lista[i].IDVoznje);
                    t0 = $('<td></td>').text(lista[i].VremePorudzbine.toString());
                    t1 = $('<td></td>').text(lista[i].Vozac.Username);
                    t2 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Ulica);
                    t3 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Broj);
                    t4 = $('<td></td>').text(lista[i].StartLokacija.Adresa.NaseljenoMesto);
                    t5 = $('<td></td>').text(lista[i].StartLokacija.Adresa.PozivniBrojMesta);
                    t6 = $('<td></td>').text(getNazivAuta(lista[i].ZeljeniTipAutomobila.toString()));
                    t7 = $('<td></td>').text(getStatusVoznje(lista[i].Status));
                    if (getStatusVoznje(lista[i].Status) === "Uspesna" || getStatusVoznje(lista[i].Status) === "Neuspesna" || getStatusVoznje(lista[i].Status) === "Otkazana") {
                        t8 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Ulica);
                        t9 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Broj);
                        t10 = $('<td></td>').text(lista[i].EndLokacija.Adresa.NaseljenoMesto);
                        t11 = $('<td></td>').text(lista[i].EndLokacija.Adresa.PozivniBrojMesta);
                        t12 = $('<td></td>').text(lista[i].Iznos);
                    } else {
                        t8 = $('<td></td>').text("");
                        t9 = $('<td></td>').text("");
                        t10 = $('<td></td>').text("");
                        t11 = $('<td></td>').text("");
                        t12 = $('<td></td>').text("");
                    }
                    $("#tabelaSvihVoznji").append('<tr>', t001, t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, '</tr>');
                }
            } else {
                var izgled = '<h4>Nema rezultata za ovu pretragu!</h4>';
                $("#prikaziSveVoznje").show();
                $("#prikaziSveVoznje").html(izgled);
            }
        }
    });
});

$(document).on("click", "#pretraziMusterijuButton2", function () {

    var usernameUlogovanog = korisnik.Username;
    var imeMusterije = document.getElementById("mustIme2").value;
    var prezimeMusterije = document.getElementById("mustPrezime2").value;
    var flagic = "0";
    var paket = {
        usernameDispecera: usernameUlogovanog,
        ime: imeMusterije,
        prezime: prezimeMusterije,
        flag: flagic
    };

    $.ajax({
        method: "GET",
        url: "/api/FilterSortPretraga/PretraziPoMusteriji",
        data: JSON.stringify(paket),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        complete: function (data, status) {
            if (status == "success") {
                var i;
                var izgled = '<h3>Rezultati pretrage Vasih voznji po musteriji</h3>';
                izgled += '<table class="table-style-three" border="1" id="tabelaVoznji"></table>';
                $("#pocetna").show();
                $("#pocetna").html(izgled);
                var izgled0 = $("<th></th>").text("ID Voznje");
                var izgled1 = $("<th></th>").text("Datum i vreme narudzbe");
                var izgled2 = $("<th></th>").text("Vozac");
                var izgled3 = $("<th></th>").text("[START]Ulica");
                var izgled4 = $("<th></th>").text("[START]Broj");
                var izgled5 = $("<th></th>").text("[START]Grad");
                var izgled6 = $("<th></th>").text("[START]Pozivni broj");
                var izgled7 = $("<th></th>").text("Zeljeni tip vozila");
                var izgled8 = $("<th></th>").text("Status voznje");
                var izgled9 = $("<th></th>").text("[END]Ulica");
                var izgled10 = $("<th></th>").text("[END]Broj");
                var izgled11 = $("<th></th>").text("[END]Grad");
                var izgled12 = $("<th></th>").text("[END]Pozivni broj");
                var izgled13 = $("<th></th>").text("Iznos");
                $("#tabelaVoznji").append('<tr>', izgled0, izgled1, izgled2, izgled3, izgled4, izgled5, izgled6, izgled7, izgled8, izgled9, izgled10, izgled11, izgled12, izgled13, '</tr>');

                var lista = JSON.parse(data.responseText);
                for (i = 0; i < lista.length; i++) {
                    var t001, t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10,t11,t12;
                    t001 = $('<td></td>').text(lista[i].IDVoznje);
                    t0 = $('<td></td>').text(lista[i].VremePorudzbine.toString());
                    t1 = $('<td></td>').text(lista[i].Vozac.Username);
                    t2 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Ulica);
                    t3 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Broj);
                    t4 = $('<td></td>').text(lista[i].StartLokacija.Adresa.NaseljenoMesto);
                    t5 = $('<td></td>').text(lista[i].StartLokacija.Adresa.PozivniBrojMesta);
                    t6 = $('<td></td>').text(getNazivAuta(lista[i].ZeljeniTipAutomobila.toString()));
                    t7 = $('<td></td>').text(getStatusVoznje(lista[i].Status));
                    if (getStatusVoznje(lista[i].Status) === "Uspesna" || getStatusVoznje(lista[i].Status) === "Neuspesna" || getStatusVoznje(lista[i].Status) === "Otkazana") {
                        t8 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Ulica);
                        t9 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Broj);
                        t10 = $('<td></td>').text(lista[i].EndLokacija.Adresa.NaseljenoMesto);
                        t11 = $('<td></td>').text(lista[i].EndLokacija.Adresa.PozivniBrojMesta);
                        t12 = $('<td></td>').text(lista[i].Iznos);
                    } else {
                        t8 = $('<td></td>').text("");
                        t9 = $('<td></td>').text("");
                        t10 = $('<td></td>').text("");
                        t11 = $('<td></td>').text("");
                        t12 = $('<td></td>').text("");
                    }
                    $("#tabelaVoznji").append('<tr>', t001, t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, '</tr>');
                }

            } else {
                var izgled = '<h3>Nema rezultata za ovu pretragu!</h3>';
                $("#pocetna").show();
                $("#pocetna").html(izgled);
            }
        }
    });
});

$(document).on("click", "#pretraziMusterijuButton1", function () {
    var usernameUlogovanog = korisnik.Username;
    var imeMusterije = document.getElementById("mustIme1").value;
    var prezimeMusterije = document.getElementById("mustPrezime1").value;
    var flagic = "1";
    var paket = {
        usernameDispecera: usernameUlogovanog,
        ime: imeMusterije,
        prezime: prezimeMusterije,
        flag: flagic
    };
    $.ajax({
        method: "GET",
        url: "api/FilterSortPretraga/PretraziPoMusteriji",
        data: JSON.stringify(paket),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        complete: function (data, status) {
            if (status == "success") {
                var i;
                var izgled = '<h3>Rezultati svih voznji nakon pretrage po musteriji</h3>';
                izgled += '<table class="table-style-three" border="1" id="tabelaSvihVoznji"></table>';
                $("#prikaziSveVoznje").show();
                $("#prikaziSveVoznje").html(izgled);
                var izgled0 = $("<th></th>").text("ID Voznje");
                var izgled1 = $("<th></th>").text("Datum i vreme narudzbe");
                var izgled2 = $("<th></th>").text("Vozac");
                var izgled3 = $("<th></th>").text("[START]Ulica");
                var izgled4 = $("<th></th>").text("[START]Broj");
                var izgled5 = $("<th></th>").text("[START]Grad");
                var izgled6 = $("<th></th>").text("[START]Pozivni broj");
                var izgled7 = $("<th></th>").text("Zeljeni tip vozila");
                var izgled8 = $("<th></th>").text("Status voznje");
                var izgled9 = $("<th></th>").text("[END]Ulica");
                var izgled10 = $("<th></th>").text("[END]Broj");
                var izgled11 = $("<th></th>").text("[END]Grad");
                var izgled12 = $("<th></th>").text("[END]Pozivni broj");
                var izgled13 = $("<th></th>").text("Iznos");
                $("#tabelaSvihVoznji").append('<tr>', izgled0, izgled1, izgled2, izgled3, izgled4, izgled5, izgled6, izgled7, izgled8, izgled9, izgled10, izgled11, izgled12, izgled13, '</tr>');

                var lista = JSON.parse(data.responseText);
                for (i = 0; i < lista.length; i++) {
                    var t001, t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10;
                    t001 = $('<td></td>').text(lista[i].IDVoznje);
                    t0 = $('<td></td>').text(lista[i].VremePorudzbine.toString());
                    t1 = $('<td></td>').text(lista[i].Vozac.Username);
                    t2 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Ulica);
                    t3 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Broj);
                    t4 = $('<td></td>').text(lista[i].StartLokacija.Adresa.NaseljenoMesto);
                    t5 = $('<td></td>').text(lista[i].StartLokacija.Adresa.PozivniBrojMesta);
                    t6 = $('<td></td>').text(getNazivAuta(lista[i].ZeljeniTipAutomobila.toString()));
                    t7 = $('<td></td>').text(getStatusVoznje(lista[i].Status));
                    if (getStatusVoznje(lista[i].Status) === "Uspesna" || getStatusVoznje(lista[i].Status) === "Neuspesna" || getStatusVoznje(lista[i].Status) === "Otkazana") {
                        t8 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Ulica);
                        t9 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Broj);
                        t10 = $('<td></td>').text(lista[i].EndLokacija.Adresa.NaseljenoMesto);
                        t11 = $('<td></td>').text(lista[i].EndLokacija.Adresa.PozivniBrojMesta);
                        t12 = $('<td></td>').text(lista[i].Iznos);
                    } else {
                        t8 = $('<td></td>').text("");
                        t9 = $('<td></td>').text("");
                        t10 = $('<td></td>').text("");
                        t11 = $('<td></td>').text("");
                        t12 = $('<td></td>').text("");
                    }
                    $("#tabelaSvihVoznji").append('<tr>', t001, t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, '</tr>');
                }
            } else {
                var izgled = '<h4>Nema rezultata za ovu pretragu!</h4>';
                $("#prikaziSveVoznje").show();
                $("#prikaziSveVoznje").html(izgled);
            }
        }
    });
});

$(document).on("click", "#pretraga", function () {
    var usernameUlogovanog = korisnik.Username;
    var datumOd = document.getElementById("datumOD").value;
    var datumDo = document.getElementById("datumDO").value;
    var cena1 = document.getElementById("cenaOD").value;
    var cena2 = document.getElementById("cenaDO").value;
    var ocena1 = document.getElementById("ocenaOD").value;
    var ocena2 = document.getElementById("ocenaDO").value;
    var flagic = "0";
    var paket = {
        username: usernameUlogovanog,
        datum1: datumOd,
        datum2: datumDo,
        cenaOd: cena1,
        cenaDo: cena2,
        ocenaOd: ocena1,
        ocenaDo: ocena2,
        flag: flagic
    };
    $.ajax({
        method: "GET",
        url: "api/FilterSortPretraga/Pretrazi",
        data: JSON.stringify(paket),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        complete: function (data, status) {
            if (status == "success") {
                var i;
                var izgled = '<h3>Rezultati Vasih voznji nakon pretrage</h3>';
                izgled += '<table class="table-style-three" border="1" id="tabelaVoznji"></table>';
                $("#pocetna").show();
                $("#pocetna").html(izgled);
                var izgled0 = $("<th></th>").text("ID Voznje");
                var izgled1 = $("<th></th>").text("Datum i vreme narudzbe");
                var izgled2 = $("<th></th>").text("Vozac");
                var izgled3 = $("<th></th>").text("[START]Ulica");
                var izgled4 = $("<th></th>").text("[START]Broj");
                var izgled5 = $("<th></th>").text("[START]Grad");
                var izgled6 = $("<th></th>").text("[START]Pozivni broj");
                var izgled7 = $("<th></th>").text("Zeljeni tip vozila");
                var izgled8 = $("<th></th>").text("Status voznje");
                var izgled9 = $("<th></th>").text("[END]Ulica");
                var izgled10 = $("<th></th>").text("[END]Broj");
                var izgled11 = $("<th></th>").text("[END]Grad");
                var izgled12 = $("<th></th>").text("[END]Pozivni broj");
                var izgled13 = $("<th></th>").text("Iznos");
                $("#tabelaVoznji").append('<tr>', izgled0, izgled1, izgled2, izgled3, izgled4, izgled5, izgled6, izgled7, izgled8, izgled9, izgled10, izgled11, izgled12, izgled13, '</tr>');

                var lista = JSON.parse(data.responseText);
                for (i = 0; i < lista.length; i++) {
                    var t001, t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10;
                    t001 = $('<td></td>').text(lista[i].IDVoznje);
                    t0 = $('<td></td>').text(lista[i].VremePorudzbine.toString());
                    t1 = $('<td></td>').text(lista[i].Vozac.Username);
                    t2 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Ulica);
                    t3 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Broj);
                    t4 = $('<td></td>').text(lista[i].StartLokacija.Adresa.NaseljenoMesto);
                    t5 = $('<td></td>').text(lista[i].StartLokacija.Adresa.PozivniBrojMesta);
                    t6 = $('<td></td>').text(getNazivAuta(lista[i].ZeljeniTipAutomobila.toString()));
                    t7 = $('<td></td>').text(getStatusVoznje(lista[i].Status));
                    if (getStatusVoznje(lista[i].Status) === "Uspesna" || getStatusVoznje(lista[i].Status) === "Neuspesna" || getStatusVoznje(lista[i].Status) === "Otkazana") {
                        t8 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Ulica);
                        t9 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Broj);
                        t10 = $('<td></td>').text(lista[i].EndLokacija.Adresa.NaseljenoMesto);
                        t11 = $('<td></td>').text(lista[i].EndLokacija.Adresa.PozivniBrojMesta);
                        t12 = $('<td></td>').text(lista[i].Iznos);
                    } else {
                        t8 = $('<td></td>').text("");
                        t9 = $('<td></td>').text("");
                        t10 = $('<td></td>').text("");
                        t11 = $('<td></td>').text("");
                        t12 = $('<td></td>').text("");
                    }
                    $("#tabelaVoznji").append('<tr>', t001, t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, '</tr>');
                }
            } else {
                var izgled = '<h4>Nema rezultata za ovu pretragu!</h4>';
                $("#pocetna").show();
                $("#pocetna").html(izgled);
            }
        }
    });
});

$(document).on("click", "#pretraga2", function () {
    var usernameUlogovanog = korisnik.Username;
    var datumOd = document.getElementById("datumOD2").value;
    var datumDo = document.getElementById("datumDO2").value;
    var cena1 = document.getElementById("cenaOD2").value;
    var cena2 = document.getElementById("cenaDO2").value;
    var ocena1 = document.getElementById("ocenaOD2").value;
    var ocena2 = document.getElementById("ocenaDO2").value;
    var flagic = "1";
    var paket = {
        username: usernameUlogovanog,
        datum1: datumOd,
        datum2: datumDo,
        cenaOd: cena1,
        cenaDo: cena2,
        ocenaOd: ocena1,
        ocenaDo: ocena2,
        flag: flagic
    };
    $.ajax({
        method: "GET",
        url: "api/FilterSortPretraga/Pretrazi",
        data: JSON.stringify(paket),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        complete: function (data, status) {
            if (status == "success") {
                var i;
                var izgled = '<h3>Rezultati svih voznji nakon pretrage</h3>';
                izgled += '<table class="table-style-three" border="1" id="tabelaSvihVoznji"></table>';
                $("#prikaziSveVoznje").show();
                $("#prikaziSveVoznje").html(izgled);
                var izgled0 = $("<th></th>").text("ID Voznje");
                var izgled1 = $("<th></th>").text("Datum i vreme narudzbe");
                var izgled2 = $("<th></th>").text("Vozac");
                var izgled3 = $("<th></th>").text("[START]Ulica");
                var izgled4 = $("<th></th>").text("[START]Broj");
                var izgled5 = $("<th></th>").text("[START]Grad");
                var izgled6 = $("<th></th>").text("[START]Pozivni broj");
                var izgled7 = $("<th></th>").text("Zeljeni tip vozila");
                var izgled8 = $("<th></th>").text("Status voznje");
                var izgled9 = $("<th></th>").text("[END]Ulica");
                var izgled10 = $("<th></th>").text("[END]Broj");
                var izgled11 = $("<th></th>").text("[END]Grad");
                var izgled12 = $("<th></th>").text("[END]Pozivni broj");
                var izgled13 = $("<th></th>").text("Iznos");
                $("#tabelaSvihVoznji").append('<tr>', izgled0, izgled1, izgled2, izgled3, izgled4, izgled5, izgled6, izgled7, izgled8, izgled9, izgled10, izgled11, izgled12, izgled13, '</tr>');

                var lista = JSON.parse(data.responseText);
                for (i = 0; i < lista.length; i++) {
                    var t001, t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10;
                    t001 = $('<td></td>').text(lista[i].IDVoznje);
                    t0 = $('<td></td>').text(lista[i].VremePorudzbine.toString());
                    t1 = $('<td></td>').text(lista[i].Vozac.Username);
                    t2 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Ulica);
                    t3 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Broj);
                    t4 = $('<td></td>').text(lista[i].StartLokacija.Adresa.NaseljenoMesto);
                    t5 = $('<td></td>').text(lista[i].StartLokacija.Adresa.PozivniBrojMesta);
                    t6 = $('<td></td>').text(getNazivAuta(lista[i].ZeljeniTipAutomobila.toString()));
                    t7 = $('<td></td>').text(getStatusVoznje(lista[i].Status));
                    if (getStatusVoznje(lista[i].Status) === "Uspesna" || getStatusVoznje(lista[i].Status) === "Neuspesna" || getStatusVoznje(lista[i].Status) === "Otkazana") {
                        t8 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Ulica);
                        t9 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Broj);
                        t10 = $('<td></td>').text(lista[i].EndLokacija.Adresa.NaseljenoMesto);
                        t11 = $('<td></td>').text(lista[i].EndLokacija.Adresa.PozivniBrojMesta);
                        t12 = $('<td></td>').text(lista[i].Iznos);
                    } else {
                        t8 = $('<td></td>').text("");
                        t9 = $('<td></td>').text("");
                        t10 = $('<td></td>').text("");
                        t11 = $('<td></td>').text("");
                        t12 = $('<td></td>').text("");
                    }
                    $("#tabelaSvihVoznji").append('<tr>', t001, t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, '</tr>');
                }
            } else {
                var izgled = '<h4>Nema rezultata za ovu pretragu!</h4>';
                $("#prikaziSveVoznje").show();
                $("#prikaziSveVoznje").html(izgled);
            }
        }
    });
});

$(document).on("click", "#filterButton1", function () {
    var username = korisnik.Username;
    var statusFiltera = document.getElementById('filterD1').value;
    var usernameIstatusIflag = username + '_' + statusFiltera + '_0';
    $("#pocetna").html("");
    $.ajax({
        method: "GET",
        url: "/api/FilterSortPretraga/Filtriraj/" + usernameIstatusIflag,
        dataType: "json",
        complete: function (data, status) {
            if (status == "success") {
                var i;
                var izgled = '<h3>Vase voznje filtrirane po statusu</h3><label>Filtriraj:</label><select id="filterD1"><option id="nista" display:none></option >';
                izgled += '<option>Kreirana</option><option>Formirana</option><option>Obradjena</option><option>Prihvacena</option><option>Otkazana</option>';
                izgled += '<option>Neuspesna</option><option>Uspesna</option></select><button id="filterButton1">Filtriraj</button><table class="table-style-three" border="1" id="tabelaVoznji"></table>';
                $("#pocetna").show();
                $("#pocetna").html(izgled);
                var izgled0 = $("<th></th>").text("ID Voznje");
                var izgled1 = $("<th></th>").text("Datum i vreme narudzbe");
                var izgled2 = $("<th></th>").text("Vozac");
                var izgled3 = $("<th></th>").text("[START]Ulica");
                var izgled4 = $("<th></th>").text("[START]Broj");
                var izgled5 = $("<th></th>").text("[START]Grad");
                var izgled6 = $("<th></th>").text("[START]Pozivni broj");
                var izgled7 = $("<th></th>").text("Zeljeni tip vozila");
                var izgled8 = $("<th></th>").text("Status voznje");
                var izgled9 = $("<th></th>").text("[END]Ulica");
                var izgled10 = $("<th></th>").text("[END]Broj");
                var izgled11 = $("<th></th>").text("[END]Grad");
                var izgled12 = $("<th></th>").text("[END]Pozivni broj");
                var izgled13 = $("<th></th>").text("Iznos");
                $("#tabelaVoznji").append('<tr>', izgled0, izgled1, izgled2, izgled3, izgled4, izgled5, izgled6, izgled7, izgled8, izgled9, izgled10, izgled11, izgled12, izgled13, '</tr>');

                var lista = JSON.parse(data.responseText);
                for (i = 0; i < lista.length; i++) {
                    var t001, t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10;
                    t001 = $('<td></td>').text(lista[i].IDVoznje);
                    t0 = $('<td></td>').text(lista[i].VremePorudzbine.toString());
                    t1 = $('<td></td>').text(lista[i].Vozac.Username);
                    t2 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Ulica);
                    t3 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Broj);
                    t4 = $('<td></td>').text(lista[i].StartLokacija.Adresa.NaseljenoMesto);
                    t5 = $('<td></td>').text(lista[i].StartLokacija.Adresa.PozivniBrojMesta);
                    t6 = $('<td></td>').text(getNazivAuta(lista[i].ZeljeniTipAutomobila.toString()));
                    t7 = $('<td></td>').text(getStatusVoznje(lista[i].Status));
                    if (getStatusVoznje(lista[i].Status) === "Uspesna" || getStatusVoznje(lista[i].Status) === "Neuspesna" || getStatusVoznje(lista[i].Status) === "Otkazana") {
                        t8 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Ulica);
                        t9 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Broj);
                        t10 = $('<td></td>').text(lista[i].EndLokacija.Adresa.NaseljenoMesto);
                        t11 = $('<td></td>').text(lista[i].EndLokacija.Adresa.PozivniBrojMesta);
                        t12 = $('<td></td>').text(lista[i].Iznos);
                    } else {
                        t8 = $('<td></td>').text("");
                        t9 = $('<td></td>').text("");
                        t10 = $('<td></td>').text("");
                        t11 = $('<td></td>').text("");
                        t12 = $('<td></td>').text("");
                    }
                    $("#tabelaVoznji").append('<tr>', t001, t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, '</tr>');
                }

            } else {
                var izgled = '<h3>Vase voznje filtrirane po statusu</h3><label>Filtriraj:</label><select id="filterD1"><option id="nista" display:none></option >';
                izgled += '<option>Kreirana</option><option>Formirana</option><option>Obradjena</option><option>Prihvacena</option><option>Otkazana</option>';
                izgled += '<option>Neuspesna</option><option>Uspesna</option></select><button id="filterButton1">Filtriraj</button>';
                $("#pocetna").show();
                $("#pocetna").html(izgled);
            }
        }
    });
});

$(document).on("click", "#filterButton2", function () {
    var username = korisnik.Username;
    var statusFiltera = document.getElementById('filterD2').value;
    var usernameIstatusIflag = username + '_' + statusFiltera + '_1';
    $("#prikaziSveVoznje").html("");
    $.ajax({
        method: "GET",
        url: "/api/FilterSortPretraga/Filtriraj/" + usernameIstatusIflag,
        dataType: "json",
        complete: function (data, status) {
            if (status == "success") {
                var i;
                var izgled = '<h3>Sve voznje filtrirane po statusu</h3><label>Filtriraj:</label><select id="filterD2"><option id="nista" display:none></option >';
                izgled += '<option>Kreirana</option><option>Formirana</option><option>Obradjena</option><option>Prihvacena</option><option>Otkazana</option>';
                izgled += '<option>Neuspesna</option><option>Uspesna</option></select><button id="filterButton2">Filtriraj</button><table class="table-style-three" border="1" id="tabelaVoznji2"></table>';
                $("#prikaziSveVoznje").show();
                $("#prikaziSveVoznje").html(izgled);
                var izgled0 = $("<th></th>").text("ID Voznje");
                var izgled1 = $("<th></th>").text("Datum i vreme narudzbe");
                var izgled2 = $("<th></th>").text("Vozac");
                var izgled3 = $("<th></th>").text("[START]Ulica");
                var izgled4 = $("<th></th>").text("[START]Broj");
                var izgled5 = $("<th></th>").text("[START]Grad");
                var izgled6 = $("<th></th>").text("[START]Pozivni broj");
                var izgled7 = $("<th></th>").text("Zeljeni tip vozila");
                var izgled8 = $("<th></th>").text("Status voznje");
                var izgled9 = $("<th></th>").text("[END]Ulica");
                var izgled10 = $("<th></th>").text("[END]Broj");
                var izgled11 = $("<th></th>").text("[END]Grad");
                var izgled12 = $("<th></th>").text("[END]Pozivni broj");
                var izgled13 = $("<th></th>").text("Iznos");
                $("#tabelaVoznji2").append('<tr>', izgled0, izgled1, izgled2, izgled3, izgled4, izgled5, izgled6, izgled7, izgled8, izgled9, izgled10, izgled11, izgled12, izgled13, '</tr>');

                var lista = JSON.parse(data.responseText);
                for (i = 0; i < lista.length; i++) {
                    var t001, t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10;
                    t001 = $('<td></td>').text(lista[i].IDVoznje);
                    t0 = $('<td></td>').text(lista[i].VremePorudzbine.toString());
                    t1 = $('<td></td>').text(lista[i].Vozac.Username);
                    t2 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Ulica);
                    t3 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Broj);
                    t4 = $('<td></td>').text(lista[i].StartLokacija.Adresa.NaseljenoMesto);
                    t5 = $('<td></td>').text(lista[i].StartLokacija.Adresa.PozivniBrojMesta);
                    t6 = $('<td></td>').text(getNazivAuta(lista[i].ZeljeniTipAutomobila.toString()));
                    t7 = $('<td></td>').text(getStatusVoznje(lista[i].Status));
                    if (getStatusVoznje(lista[i].Status) === "Uspesna" || getStatusVoznje(lista[i].Status) === "Neuspesna" || getStatusVoznje(lista[i].Status) === "Otkazana") {
                        t8 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Ulica);
                        t9 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Broj);
                        t10 = $('<td></td>').text(lista[i].EndLokacija.Adresa.NaseljenoMesto);
                        t11 = $('<td></td>').text(lista[i].EndLokacija.Adresa.PozivniBrojMesta);
                        t12 = $('<td></td>').text(lista[i].Iznos);
                    } else {
                        t8 = $('<td></td>').text("");
                        t9 = $('<td></td>').text("");
                        t10 = $('<td></td>').text("");
                        t11 = $('<td></td>').text("");
                        t12 = $('<td></td>').text("");
                    }
                    $("#tabelaVoznji2").append('<tr>', t001, t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, '</tr>');
                }

            } else {
                var izgled = '<h3>Sve voznje filtrirane po statusu</h3><label>Filtriraj:</label><select id="filterD2"><option id="nista" display:none></option >';
                izgled += '<option>Kreirana</option><option>Formirana</option><option>Obradjena</option><option>Prihvacena</option><option>Otkazana</option>';
                izgled += '<option>Neuspesna</option><option>Uspesna</option></select><button id="filterButton2">Filtriraj</button>';
                $("#prikaziSveVoznje").show();
                $("#prikaziSveVoznje").html(izgled);
            }
        }
    });
});

$(document).on("click", "#sortSve", function () {
    var username = korisnik.Username;
    var flag1 = document.getElementById('datumCheckSve').checked;
    var flag2 = document.getElementById('ocenaCheckSve').checked;
    var prvi = "0";
    var drugi = "0";
    if (flag1) {
        prvi = "1";
    }
    if (flag2) {
        drugi = "1";
    }
    var usernameIflagovi = username + '_' + prvi + '_' + drugi + '_1';
    $("#prikaziSveVoznje").html("");
    $.ajax({
        method: "GET",
        url: "/api/FilterSortPretraga/Sortiraj/" + usernameIflagovi,
        dataType: "json",
        complete: function (data, status) {
            if (status == "success") {
                var i;
                var izgled = '<h3>Sve voznje sortirane</h3>';
                izgled += '<table class="table-style-three" border="1" id="tabelaVoznji2"></table>';
                $("#prikaziSveVoznje").show();
                $("#prikaziSveVoznje").html(izgled);
                var izgled0 = $("<th></th>").text("ID Voznje");
                var izgled1 = $("<th></th>").text("Datum i vreme narudzbe");
                var izgled2 = $("<th></th>").text("Vozac");
                var izgled3 = $("<th></th>").text("[START]Ulica");
                var izgled4 = $("<th></th>").text("[START]Broj");
                var izgled5 = $("<th></th>").text("[START]Grad");
                var izgled6 = $("<th></th>").text("[START]Pozivni broj");
                var izgled7 = $("<th></th>").text("Zeljeni tip vozila");
                var izgled8 = $("<th></th>").text("Status voznje");
                var izgled9 = $("<th></th>").text("[END]Ulica");
                var izgled10 = $("<th></th>").text("[END]Broj");
                var izgled11 = $("<th></th>").text("[END]Grad");
                var izgled12 = $("<th></th>").text("[END]Pozivni broj");
                var izgled13 = $("<th></th>").text("Iznos");
                $("#tabelaVoznji2").append('<tr>', izgled0, izgled1, izgled2, izgled3, izgled4, izgled5, izgled6, izgled7, izgled8, izgled9, izgled10, izgled11, izgled12, izgled13, '</tr>');

                var lista = JSON.parse(data.responseText);
                for (i = 0; i < lista.length; i++) {
                    var t001, t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10;
                    t001 = $('<td></td>').text(lista[i].IDVoznje);
                    t0 = $('<td></td>').text(lista[i].VremePorudzbine.toString());
                    t1 = $('<td></td>').text(lista[i].Vozac.Username);
                    t2 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Ulica);
                    t3 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Broj);
                    t4 = $('<td></td>').text(lista[i].StartLokacija.Adresa.NaseljenoMesto);
                    t5 = $('<td></td>').text(lista[i].StartLokacija.Adresa.PozivniBrojMesta);
                    t6 = $('<td></td>').text(getNazivAuta(lista[i].ZeljeniTipAutomobila.toString()));
                    t7 = $('<td></td>').text(getStatusVoznje(lista[i].Status));
                    if (getStatusVoznje(lista[i].Status) === "Uspesna" || getStatusVoznje(lista[i].Status) === "Neuspesna" || getStatusVoznje(lista[i].Status) === "Otkazana") {
                        t8 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Ulica);
                        t9 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Broj);
                        t10 = $('<td></td>').text(lista[i].EndLokacija.Adresa.NaseljenoMesto);
                        t11 = $('<td></td>').text(lista[i].EndLokacija.Adresa.PozivniBrojMesta);
                        t12 = $('<td></td>').text(lista[i].Iznos);
                    } else {
                        t8 = $('<td></td>').text("");
                        t9 = $('<td></td>').text("");
                        t10 = $('<td></td>').text("");
                        t11 = $('<td></td>').text("");
                        t12 = $('<td></td>').text("");
                    }
                    $("#tabelaVoznji2").append('<tr>', t001, t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, '</tr>');
                }

            } else {
                var izgled = '';
                $("#prikaziSveVoznje").show();
                $("#prikaziSveVoznje").html(izgled);
            }
        }
    });
});

$(document).on("click", "#sort", function () {
    var username = korisnik.Username;
    var flag1 = document.getElementById('datumCheck').checked;
    var flag2 = document.getElementById('ocenaCheck').checked;
    var prvi = "0";
    var drugi = "0";
    if (flag1) {
        prvi = "1";
    }
    if (flag2) {
        drugi = "1";
    }
    var usernameIflagovi = username + '_' + prvi + '_' + drugi + '_0';
    $("#pocetna").html("");
    $.ajax({
        method: "GET",
        url: "/api/FilterSortPretraga/Sortiraj/" + usernameIflagovi,
        dataType: "json",
        complete: function (data, status) {
            if (status == "success") {
                var i;
                var izgled = '<h3>Voznje na kojima ste Vi angazovani sortirane</h3>';
                izgled += '<table class="table-style-three" border="1" id="tabelaVoznji"></table>';
                $("#pocetna").show();
                $("#pocetna").html(izgled);
                var izgled0 = $("<th></th>").text("ID Voznje");
                var izgled1 = $("<th></th>").text("Datum i vreme narudzbe");
                var izgled2 = $("<th></th>").text("Vozac");
                var izgled3 = $("<th></th>").text("[START]Ulica");
                var izgled4 = $("<th></th>").text("[START]Broj");
                var izgled5 = $("<th></th>").text("[START]Grad");
                var izgled6 = $("<th></th>").text("[START]Pozivni broj");
                var izgled7 = $("<th></th>").text("Zeljeni tip vozila");
                var izgled8 = $("<th></th>").text("Status voznje");
                var izgled9 = $("<th></th>").text("[END]Ulica");
                var izgled10 = $("<th></th>").text("[END]Broj");
                var izgled11 = $("<th></th>").text("[END]Grad");
                var izgled12 = $("<th></th>").text("[END]Pozivni broj");
                var izgled13 = $("<th></th>").text("Iznos");
                $("#tabelaVoznji").append('<tr>', izgled0, izgled1, izgled2, izgled3, izgled4, izgled5, izgled6, izgled7, izgled8, izgled9, izgled10, izgled11, izgled12, izgled13, '</tr>');

                var lista = JSON.parse(data.responseText);
                for (i = 0; i < lista.length; i++) {
                    var t001, t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10;
                    t001 = $('<td></td>').text(lista[i].IDVoznje);
                    t0 = $('<td></td>').text(lista[i].VremePorudzbine.toString());
                    t1 = $('<td></td>').text(lista[i].Vozac.Username);
                    t2 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Ulica);
                    t3 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Broj);
                    t4 = $('<td></td>').text(lista[i].StartLokacija.Adresa.NaseljenoMesto);
                    t5 = $('<td></td>').text(lista[i].StartLokacija.Adresa.PozivniBrojMesta);
                    t6 = $('<td></td>').text(getNazivAuta(lista[i].ZeljeniTipAutomobila.toString()));
                    t7 = $('<td></td>').text(getStatusVoznje(lista[i].Status));
                    if (getStatusVoznje(lista[i].Status) === "Uspesna" || getStatusVoznje(lista[i].Status) === "Neuspesna" || getStatusVoznje(lista[i].Status) === "Otkazana") {
                        t8 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Ulica);
                        t9 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Broj);
                        t10 = $('<td></td>').text(lista[i].EndLokacija.Adresa.NaseljenoMesto);
                        t11 = $('<td></td>').text(lista[i].EndLokacija.Adresa.PozivniBrojMesta);
                        t12 = $('<td></td>').text(lista[i].Iznos);
                    } else {
                        t8 = $('<td></td>').text("");
                        t9 = $('<td></td>').text("");
                        t10 = $('<td></td>').text("");
                        t11 = $('<td></td>').text("");
                        t12 = $('<td></td>').text("");
                    }
                    $("#tabelaVoznji").append('<tr>', t001, t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, '</tr>');
                }

            } else {
                var izgled = '';
                $("#pocetna").show();
                $("#pocetna").html(izgled);
            }
        }
    });
});