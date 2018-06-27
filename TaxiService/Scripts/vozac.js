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
    var status = "undefined";
    if (id == 0) {
        status = "PutnickiAutomobil";
    } else if (id == 1) {
        status = "KombiVozilo";
    } else if (id == 2) {
        status = "Svejedno";
    }
    return naziv;
}

$(document).ready(function () {

    $('#buttonLogOff').click(function () {
        sessionStorage.removeItem('korisnik');
        window.location.href = "Index.html";
    });

    $("#prikaz").click(function () {
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
            var uloga = "Vozac";
            let vozac = {
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
                url: '/api/Vozac/IzmeniProfil',
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
                url: '/api/Vozac/IzmeniSifru',
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
    $("#prihvatajVoznju").click(function () {
        var username = korisnik.Username;
        $.ajax({
            type: 'GET',
            url: '/api/Vozac/VratiVoznjeNaCekanju/' + username,
            dataType: 'html',
            complete: function (data) {
                if (data.status == 200) {
                    $('#prihvatVoznje').show();
                    $('#prihvatVoznje').html(data.responseText);
                } else {
                    $('#prihvatVoznje').show();
                    $('#prihvatVoznje').html(data.responseText);
                }
            }
        });
    });

    $("#menjajLokaciju").click(function () {
        $('#promenaLokacije').show();
        $('#LokacijaPromenaDiv').hide();
    });

    $("#novaLokacijaButton").click(function () {
        var lokacija =
            {
                username: `${korisnik.Username}`,
                novaUlica: `${$('#novaUlica').val()}`,
                noviBroj: `${$('#noviBroj').val()}`,
                novoMesto: `${$('#novoMesto').val()}`,
                noviPozivniBroj: `${$('#noviPozivniBroj').val()}`
            };
        $.ajax({
            type: 'POST',
            url: '/api/Vozac/IzmeniLokaciju',
            data: JSON.stringify(lokacija),
            contentType: 'application/json; charset=utf-8',
            dataType: 'html',
            success: function (data) {
                $('#promenaLokacije').hide();
                $('#LokacijaPromenaDiv').html(data);
                $('#LokacijaPromenaDiv').show();
            },
            error: function (data) {
                $('#promenaLokacije').hide();
                $('#LokacijaPromenaDiv').html(data);
            }
        });
    });
});

$(document).on("click", ".prihvatiVoznjuButtonClass", function () {
    $('#prihvatVoznje').html("");
    var voznja = {
        IDVoznje: `${$(this).val()}`,
        username: `${korisnik.Username}`
    };
    $.ajax({
        type: 'POST',
        url: '/api/Vozac/PrihvatiVoznju',
        data: JSON.stringify(voznja),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            $('#prihvatVoznje').html(data.responseText);
        },
        error: function (data) {
            $('#prihvatVoznje').html(data.responseText);
        }
    });
});

$(document).on("click", "#menjajStatus", function () {

    var usernameVozaca =  `${korisnik.Username}`;
    $.ajax({
        type: 'GET',
        url: '/api/Vozac/GetVoznjaZaIzmenuStatusa', 
        data: { username: usernameVozaca},
        dataType: 'html',
        complete: function (data) {
            if (data.status == 200) {
                $('#promenaStatusa').html(data.responseText);
            } else {
                $('#promenaStatusa').html(data.responseText);
            }
        }
    });
});

$(document).on("click", "#promenaStatusaButton", function () {

    var voznja =
        {
            username: `${korisnik.Username}`,
            idVoznje: `${$('#promenaStatusaButton').val()}`,
            status: `${$('#izabraniNoviStatus').val()}`
        };
    $.ajax({
        type: 'POST',
        url: '/api/Vozac/IzmeniStatus',
        data: JSON.stringify(voznja),
        contentType: 'application/json; charset=utf-8',
        dataType: 'html',
        complete: function (data) {
            if (data.status == 200) {
                $('#promenaStatusa').html(data.responseText);

            } else if (data.status == 303) {
                $('#promenaStatusa').html("");
                var izgled = '<div class="commentSection"><h3>Ostavljanje komentara je obavezno</h3><textarea id="komentarV" rows="4" cols="50" placeholder="Unesite komentar..."></textarea></br>';
                izgled += '<label>Ocena</label><select id="ocenaV"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select>';
                izgled += '<button id="komentarisiV">Ostavi komentar</button></div>';
                $("#promenaStatusa").html(izgled);
                document.getElementById("komentarisiV").value = parseInt(data.responseText);
                $(':button').not('#promenaStatusa :button').attr('disabled', true);
            } else {
                $('#promenaStatusa').html(data.responseText);
            }
        }
    });
});

$(document).on("click", "#potvrdiUspesnoButton", function () {

    var podaci =
        {
            username: `${korisnik.Username}`,
            idVoznje: `${$('#potvrdiUspesnoButton').val()}`,
            odredisteUlica: `${$('#ulicaOdredista').val()}`,
            odredisteBroj: `${$('#brojOdredista').val()}`,
            odredisteMesto: `${$('#mestoOdredista').val()}`,
            odredistePozivniBr: `${$('#pozivniBrojOdredista').val()}`,
            cena: `${$('#cenaVoznje').val()}`
        };
    $.ajax({
        type: 'POST',
        url: '/api/Vozac/UspesnaVoznja',
        data: JSON.stringify(podaci),
        contentType: 'application/json; charset=utf-8',
        dataType: 'html',
        complete: function (data) {
            if (data.status == 200) {
                $('#promenaStatusa').html(data.responseText);
            } else {
                $('#promenaStatusa').html(data.responseText);
            }
        }
    });
});

$(document).on("click", "#komentarisiV", function () {

    idVoznje = `${$(this).val()}`;

    var komentar = {
        IDVoznje: idVoznje,
        OpisKomentara: `${$('#komentarV').val()}`,
        KorisnikUsername: korisnik.Username,
        Ocena: `${$('#ocenaV').val()}`
    };

    $.ajax({
        method: "POST",
        url: "/api/Vozac/OstaviKomentar",
        data: JSON.stringify(komentar),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        complete: function (data) {
            if (data.status == 200) {
                $(':button').not('#komentarisi :button').attr('disabled', false);
                $("#promenaStatusa").html('<h4>Uspesno ste ostavili komentar!</h4>');
            } else {
                $("#promenaStatusa").html('<h4>Desila se greska prilikom ostavljanja komentara!</h4>');
            }
        }
    });
});

$(document).on("click", "#pocetnaStranica", function () {
    var username = korisnik.Username;
    $.ajax({
        method: "GET",
        url: "/api/Vozac/VratiVoznjePocetna/" + username,
        dataType: "json",
        complete: function (data,status) {
            if (status == "success") {
                $("#pocetna").html("");
                var i;
                var izgled = '<h3>Voznje na kojima ste Vi angazovani</h3><label>Filtriraj:</label><select id="filter"><option id="nista" display:none></option >';
                izgled += '<option>Kreirana</option><option>Formirana</option><option>Obradjena</option><option>Prihvacena</option><option>Otkazana</option>';
                izgled += '<option>Neuspesna</option><option>Uspesna</option></select><button id="filterButton">Filtriraj</button>';
                izgled += '</br><label>Sortiraj po: </label><input type="checkbox" id="datumCheck"/>Datumu<input type="checkbox" id="ocenaCheck"/>Oceni<button id="sort">Sortiraj</button>';
                izgled += '</br><label>Pretrazi po:</label>OD<input id="datumOD" type="date"/>DO<input id="datumDO" type="date"/>';
                izgled += '<label>Oceni</label>OD<input type="number" min="0" max ="5" id="ocenaOD"/><input type="number" min="0" max ="5" id="ocenaDO"/>';
                izgled += '<label>Ceni</label>OD<input id="cenaOD" type = "number" min="0" max ="100000"/>DO<input id="cenaDO" type = "number" min="0" max ="100000"/><button id="pretraga">Pretrazi</button>';
                izgled += '<table border="1" id="tabelaSvihVoznji"></table>';   
                $("#pocetna").show();
                $("#pocetna").html(izgled);
                document.getElementById("ocenaOD").defaultValue = 0;
                document.getElementById("ocenaDO").defaultValue = 5;
                document.getElementById("cenaOD").defaultValue = 0;
                document.getElementById("cenaDO").defaultValue = 100000;   
                var izgled1 = $("<th></th>").text("Datum i vreme narudzbe");
                var izgled2 = $("<th></th>").text("[START]Ulica");
                var izgled3 = $("<th></th>").text("[START]Broj");
                var izgled4 = $("<th></th>").text("[START]Grad");
                var izgled5 = $("<th></th>").text("[START]Pozivni broj");
                var izgled6 = $("<th></th>").text("Zeljeni tip vozila");
                var izgled7 = $("<th></th>").text("Status voznje");
                var izgled8 = $("<th></th>").text("[END]Ulica");
                var izgled9 = $("<th></th>").text("[END]Broj");
                var izgled10 = $("<th></th>").text("[END]Grad");
                var izgled11 = $("<th></th>").text("[END]Pozivni broj");
                var izgled12 = $("<th></th>").text("Iznos");
                var izgled13 = $("<th></th>").text("Vas komentar");
                $("#tabelaSvihVoznji").append('<tr>', izgled1, izgled2, izgled3, izgled4, izgled5, izgled6, izgled7, izgled8, izgled9, izgled10, izgled11, izgled12, izgled13, '</tr>');
                var lista = JSON.parse(data.responseText);
                var t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12;
                for (i = 0; i < lista.length; i++) {
                    if (getStatusVoznje(lista[i].Status) === "Uspesna" || getStatusVoznje(lista[i].Status) === "Neuspesna" || getStatusVoznje(lista[i].Status) === "Otkazana") {
                        t0 = $('<td></td>').text(lista[i].VremePorudzbine.toString());
                        t1 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Ulica);
                        t2 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Broj);
                        t3 = $('<td></td>').text(lista[i].StartLokacija.Adresa.NaseljenoMesto);
                        t4 = $('<td></td>').text(lista[i].StartLokacija.Adresa.PozivniBrojMesta);
                        t5 = $('<td></td>').text(getNazivAuta(lista[i].ZeljeniTipAutomobila.toString()));
                        t6 = $('<td></td>').text(getStatusVoznje(lista[i].Status));
                        t7 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Ulica);
                        t8 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Broj);
                        t9 = $('<td></td>').text(lista[i].EndLokacija.Adresa.NaseljenoMesto);
                        t10 = $('<td></td>').text(lista[i].EndLokacija.Adresa.PozivniBrojMesta);
                        t11 = $('<td></td>').text(lista[i].Iznos);
                        if (getStatusVoznje(lista[i].Status) === "Neuspesna") {
                            t12 = $('<td></td>').text(lista[i].komentar);
                        } else {
                            t12 = $('<td></td>').text("");
                        }

                    } else {
                        t7 = $('<td></td>').text("");
                        t8 = $('<td></td>').text("");
                        t9 = $('<td></td>').text("");
                        t10 = $('<td></td>').text("");
                        t11 = $('<td></td>').text("");
                        t12 = $('<td></td>').text("");                      
                    }
                    $("#tabelaSvihVoznji").append('<tr>', t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, '</tr>');
                }
            } else {
                $("#pocetna").html('<h4>Niste bili angazovani ni na jednoj voznji!</h4>');
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
                $("#pocetna").html("");
                var i;
                var izgled = '<h3>Rezultati pretrage voznji na kojima ste Vi angazovani</h3>';
                izgled += '<table border="1" id="tabelaSvihVoznji"></table>';   
                $("#pocetna").show();
                $("#pocetna").html(izgled);
                var izgled1 = $("<th></th>").text("Datum i vreme narudzbe");
                var izgled2 = $("<th></th>").text("[START]Ulica");
                var izgled3 = $("<th></th>").text("[START]Broj");
                var izgled4 = $("<th></th>").text("[START]Grad");
                var izgled5 = $("<th></th>").text("[START]Pozivni broj");
                var izgled6 = $("<th></th>").text("Zeljeni tip vozila");
                var izgled7 = $("<th></th>").text("Status voznje");
                var izgled8 = $("<th></th>").text("[END]Ulica");
                var izgled9 = $("<th></th>").text("[END]Broj");
                var izgled10 = $("<th></th>").text("[END]Grad");
                var izgled11 = $("<th></th>").text("[END]Pozivni broj");
                var izgled12 = $("<th></th>").text("Iznos");
                var izgled13 = $("<th></th>").text("Vas komentar");
                $("#tabelaSvihVoznji").append('<tr>', izgled1, izgled2, izgled3, izgled4, izgled5, izgled6, izgled7, izgled8, izgled9, izgled10, izgled11, izgled12, izgled13, '</tr>');
                var lista = JSON.parse(data.responseText);
                var t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12;
                for (i = 0; i < lista.length; i++) {
                    if (getStatusVoznje(lista[i].Status) === "Uspesna" || getStatusVoznje(lista[i].Status) === "Neuspesna" || getStatusVoznje(lista[i].Status) === "Otkazana") {
                        t0 = $('<td></td>').text(lista[i].VremePorudzbine.toString());
                        t1 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Ulica);
                        t2 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Broj);
                        t3 = $('<td></td>').text(lista[i].StartLokacija.Adresa.NaseljenoMesto);
                        t4 = $('<td></td>').text(lista[i].StartLokacija.Adresa.PozivniBrojMesta);
                        t5 = $('<td></td>').text(getNazivAuta(lista[i].ZeljeniTipAutomobila.toString()));
                        t6 = $('<td></td>').text(getStatusVoznje(lista[i].Status));
                        t7 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Ulica);
                        t8 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Broj);
                        t9 = $('<td></td>').text(lista[i].EndLokacija.Adresa.NaseljenoMesto);
                        t10 = $('<td></td>').text(lista[i].EndLokacija.Adresa.PozivniBrojMesta);
                        t11 = $('<td></td>').text(lista[i].Iznos);
                        if (getStatusVoznje(lista[i].Status) === "Neuspesna") {
                            t12 = $('<td></td>').text(lista[i].komentar);
                        } else {
                            t12 = $('<td></td>').text("");
                        }

                    } else {
                        t7 = $('<td></td>').text("");
                        t8 = $('<td></td>').text("");
                        t9 = $('<td></td>').text("");
                        t10 = $('<td></td>').text("");
                        t11 = $('<td></td>').text("");
                        t12 = $('<td></td>').text("");
                    }
                    $("#tabelaSvihVoznji").append('<tr>', t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, '</tr>');
                }
            } else {
                var izgled = '<h4>Nema rezultata za ovu pretragu!</h4>';
                $("#pocetna").html(izgled);
            }
        }
    });
});

$(document).on("click", "#filterButton", function () {
    var username = korisnik.Username;
    var statusFiltera = document.getElementById("filter").value;
    var usernameIstatusIflag = username + '_' + statusFiltera + '_0';
    $.ajax({
        method: "GET",
        url: "api/FilterSortPretraga/Filtriraj/" + usernameIstatusIflag,
        dataType: "json",
        complete: function (data, status) {
            if (status == "success") {
                $("#pocetna").html("");
                var i;
                var izgled = '<h3>Filtrirane voznje na kojima ste Vi angazovani</h3><label>Filtriraj:</label><select id="filter"><option id="nista" display:none></option >';
                izgled += '<option>Kreirana</option><option>Formirana</option><option>Obradjena</option><option>Prihvacena</option><option>Otkazana</option>';
                izgled += '<option>Neuspesna</option><option>Uspesna</option></select><button id="filterButton">Filtriraj</button>';
                izgled +='<table border ="1" id="tabelaSvihVoznji"></table>';
                $("#pocetna").show();
                $("#pocetna").html(izgled);
                var izgled1 = $("<th></th>").text("Datum i vreme narudzbe");
                var izgled2 = $("<th></th>").text("[START]Ulica");
                var izgled3 = $("<th></th>").text("[START]Broj");
                var izgled4 = $("<th></th>").text("[START]Grad");
                var izgled5 = $("<th></th>").text("[START]Pozivni broj");
                var izgled6 = $("<th></th>").text("Zeljeni tip vozila");
                var izgled7 = $("<th></th>").text("Status voznje");
                var izgled8 = $("<th></th>").text("[END]Ulica");
                var izgled9 = $("<th></th>").text("[END]Broj");
                var izgled10 = $("<th></th>").text("[END]Grad");
                var izgled11 = $("<th></th>").text("[END]Pozivni broj");
                var izgled12 = $("<th></th>").text("Iznos");
                var izgled13 = $("<th></th>").text("Vas komentar");
                $("#tabelaSvihVoznji").append('<tr>', izgled1, izgled2, izgled3, izgled4, izgled5, izgled6, izgled7, izgled8, izgled9, izgled10, izgled11, izgled12, izgled13, '</tr>');
                var lista = JSON.parse(data.responseText);
                var t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12;
                for (i = 0; i < lista.length; i++) {
                    if (getStatusVoznje(lista[i].Status) === "Uspesna" || getStatusVoznje(lista[i].Status) === "Neuspesna" || getStatusVoznje(lista[i].Status) === "Otkazana") {
                        t0 = $('<td></td>').text(lista[i].VremePorudzbine.toString());
                        t1 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Ulica);
                        t2 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Broj);
                        t3 = $('<td></td>').text(lista[i].StartLokacija.Adresa.NaseljenoMesto);
                        t4 = $('<td></td>').text(lista[i].StartLokacija.Adresa.PozivniBrojMesta);
                        t5 = $('<td></td>').text(getNazivAuta(lista[i].ZeljeniTipAutomobila.toString()));
                        t6 = $('<td></td>').text(getStatusVoznje(lista[i].Status));
                        t7 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Ulica);
                        t8 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Broj);
                        t9 = $('<td></td>').text(lista[i].EndLokacija.Adresa.NaseljenoMesto);
                        t10 = $('<td></td>').text(lista[i].EndLokacija.Adresa.PozivniBrojMesta);
                        t11 = $('<td></td>').text(lista[i].Iznos);
                        if (getStatusVoznje(lista[i].Status) === "Neuspesna") {
                            t12 = $('<td></td>').text(lista[i].komentar);
                        } else {
                            t12 = $('<td></td>').text("");
                        }

                    } else {
                        t7 = $('<td></td>').text("");
                        t8 = $('<td></td>').text("");
                        t9 = $('<td></td>').text("");
                        t10 = $('<td></td>').text("");
                        t11 = $('<td></td>').text("");
                        t12 = $('<td></td>').text("");
                    }
                    $("#tabelaSvihVoznji").append('<tr>', t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, '</tr>');
                }
            } else {
                var izgled = '<h3>Filtrirane voznje na kojima ste Vi angazovani</h3><label>Filtriraj:</label><select id="filter"><option id="nista" display:none></option >';
                izgled += '<option>Kreirana</option><option>Formirana</option><option>Obradjena</option><option>Prihvacena</option><option>Otkazana</option>';
                izgled += '<option>Neuspesna</option><option>Uspesna</option></select><button id="filterButton">Filtriraj</button>';
                $("#pocetna").html(izgled);
            }
        }
    });
});

$(document).on("click", "#sort", function () {
    var username = korisnik.Username;
    var prvi = "0";
    var drugi = "0";
    var flag1 = document.getElementById("datumCheck").checked;
    var flag2 = document.getElementById("ocenaCheck").checked;
    if (flag1) {
        prvi = "1";
    }
    if (flag2) {
        drugi = "1";
    }
    var usernameIflagovi = username + '_' + prvi + '_' + drugi + '_0';
    $.ajax({
        method: "GET",
        url: "api/FilterSortPretraga/Sortiraj/" + usernameIflagovi,
        dataType: "json",
        complete: function (data, status) {
            if (status == "success") {
                $("#pocetna").html("");
                var i;
                var izgled = '<h3>Sortirane voznje na kojima ste Vi angazovani</h3>';
                izgled += '<table border="1" id="tabelaSvihVoznji"></table>';
                $("#pocetna").show();
                $("#pocetna").html(izgled);
                var izgled1 = $("<th></th>").text("Datum i vreme narudzbe");
                var izgled2 = $("<th></th>").text("[START]Ulica");
                var izgled3 = $("<th></th>").text("[START]Broj");
                var izgled4 = $("<th></th>").text("[START]Grad");
                var izgled5 = $("<th></th>").text("[START]Pozivni broj");
                var izgled6 = $("<th></th>").text("Zeljeni tip vozila");
                var izgled7 = $("<th></th>").text("Status voznje");
                var izgled8 = $("<th></th>").text("[END]Ulica");
                var izgled9 = $("<th></th>").text("[END]Broj");
                var izgled10 = $("<th></th>").text("[END]Grad");
                var izgled11 = $("<th></th>").text("[END]Pozivni broj");
                var izgled12 = $("<th></th>").text("Iznos");
                var izgled13 = $("<th></th>").text("Vas komentar");
                $("#tabelaSvihVoznji").append('<tr>', izgled1, izgled2, izgled3, izgled4, izgled5, izgled6, izgled7, izgled8, izgled9, izgled10, izgled11, izgled12, izgled13, '</tr>');
                var lista = JSON.parse(data.responseText);
                var t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12;
                for (i = 0; i < lista.length; i++) {
                    if (getStatusVoznje(lista[i].Status) === "Uspesna" || getStatusVoznje(lista[i].Status) === "Neuspesna" || getStatusVoznje(lista[i].Status) === "Otkazana") {
                        t0 = $('<td></td>').text(lista[i].VremePorudzbine.toString());
                        t1 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Ulica);
                        t2 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Broj);
                        t3 = $('<td></td>').text(lista[i].StartLokacija.Adresa.NaseljenoMesto);
                        t4 = $('<td></td>').text(lista[i].StartLokacija.Adresa.PozivniBrojMesta);
                        t5 = $('<td></td>').text(getNazivAuta(lista[i].ZeljeniTipAutomobila.toString()));
                        t6 = $('<td></td>').text(getStatusVoznje(lista[i].Status));
                        t7 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Ulica);
                        t8 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Broj);
                        t9 = $('<td></td>').text(lista[i].EndLokacija.Adresa.NaseljenoMesto);
                        t10 = $('<td></td>').text(lista[i].EndLokacija.Adresa.PozivniBrojMesta);
                        t11 = $('<td></td>').text(lista[i].Iznos);
                        if (getStatusVoznje(lista[i].Status) === "Neuspesna") {
                            t12 = $('<td></td>').text(lista[i].komentar);
                        } else {
                            t12 = $('<td></td>').text("");
                        }

                    } else {
                        t7 = $('<td></td>').text("");
                        t8 = $('<td></td>').text("");
                        t9 = $('<td></td>').text("");
                        t10 = $('<td></td>').text("");
                        t11 = $('<td></td>').text("");
                        t12 = $('<td></td>').text("");
                    }
                    $("#tabelaSvihVoznji").append('<tr>', t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, '</tr>');
                }
            } else {
                var izgled = '';
                $("#pocetna").html(izgled);
            }
        }
    });
});

$(document).on("click", "#komentarisi", function () {
    idVoznje = `${$(this).val()}`;

    var komentar = {
        IDVoznje: idVoznje,
        OpisKomentara: `${$('#komentarOtkaz').val()}`,
        KorisnikUsername: korisnik.Username,
        Ocena: `${$('#ocena').val()}`
    };

    $.ajax({
        method: "POST",
        url: "/api/Vozac/OstaviKomentar",
        data: JSON.stringify(komentar),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        complete: function (data) {
            if (data.status == 200) {
                $(':button').not('#komentarisi :button').attr('disabled', false);
                $("#prikazVoznji").html('<h4>Uspesno ste ostavili komentar!</h4>');
            } else {
                $("#prikazVoznji").html('<h4>Desila se greska prilikom ostavljanja komentara!</h4>');
            }
        }
    });
});