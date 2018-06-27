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
                izgled += '</br><label>Sortiraj po: </label><input type="checkbox" id="datumCheck"/>Datumu<input type="checkbox" id="ocenaCheck"/>Oceni<button id="sort">Sortiraj</button><table border ="1" id ="tabelaVoznji" ></table> ';
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
                    t6 = $('<td></td>').text(lista[i].ZeljeniTipAutomobila.toString());
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
                    $("#tabelaVoznji").append('<tr>', t001, t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, '</tr>' );
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
                var izgled = '<h3>Vase voznje</h3><label>Filtriraj:</label><select id="filterD2"><option id="nista" display:none></option >';
                izgled += '<option>Kreirana</option><option>Formirana</option><option>Obradjena</option><option>Prihvacena</option><option>Otkazana</option>';
                izgled += '<option>Neuspesna</option><option>Uspesna</option></select><button id="filterButton2">Filtriraj</button>';
                izgled += '</br><label>Sortiraj po: </label><input type="checkbox" id="datumCheckSve"/>Datumu<input type="checkbox" id="ocenaCheckSve"/>Oceni<button id="sortSve">Sortiraj</button><table border="1" id="tabelaSvihVoznji"></table>';
                $("#prikaziSveVoznje").show();
                $("#prikaziSveVoznje").html(izgled);
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
                $("#tabelaSvihVoznji").append('<tr>', izgled1, izgled2, izgled3, izgled4, izgled5, izgled6, izgled7, izgled8, izgled9, izgled10, izgled11, izgled12, '</tr>');

                var lista = JSON.parse(data.responseText);
                for (i = 0; i < lista.length; i++) {
                    var t0 = $('<td></td>').text(lista[i].VremePorudzbine.toString());
                    var t1 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Ulica);
                    var t2 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Broj);
                    var t3 = $('<td></td>').text(lista[i].StartLokacija.Adresa.NaseljenoMesto);
                    var t4 = $('<td></td>').text(lista[i].StartLokacija.Adresa.PozivniBrojMesta);
                    var t5 = $('<td></td>').text(lista[i].ZeljeniTipAutomobila.toString());
                    var t6 = $('<td></td>').text(getStatusVoznje(lista[i].Status));
                    if (getStatusVoznje(lista[i].Status) != "Uspesna" && getStatusVoznje(lista[i].Status) != "Neuspesna" && getStatusVoznje(lista[i].Status) != "Otkazana") {
                        var t7 = $('<td></td>').text("");
                        var t8 = $('<td></td>').text("");
                        var t9 = $('<td></td>').text("");
                        var t10 = $('<td></td>').text("");
                        var t11 = $('<td></td>').text("");
                        $("#tabelaSvihVoznji").append('<tr>', t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, '</tr>');
                    } else {
                        var t7 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Ulica);
                        var t8 = $('<td></td>').text(lista[i].EndLokacija.Adresa.Broj);
                        var t9 = $('<td></td>').text(lista[i].EndLokacija.Adresa.NaseljenoMesto);
                        var t10 = $('<td></td>').text(lista[i].EndLokacija.Adresa.PozivniBrojMesta);
                        var t11 = $('<td></td>').text(lista[i].Iznos);
                        $("#tabelaSvihVoznji").append('<tr>', t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, '</tr>');
                     }
                }
            }else {
                $("#prikaziSveVoznje").html("<h3>Trenutno nema voznji u sistemu!</h3>");
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
                izgled += '<option>Neuspesna</option><option>Uspesna</option></select><button id="filterButton1">Filtriraj</button><table border="1" id="tabelaVoznji"></table>';
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
                    t6 = $('<td></td>').text(lista[i].ZeljeniTipAutomobila.toString());
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
                izgled += '<option>Neuspesna</option><option>Uspesna</option></select><button id="filterButton2">Filtriraj</button><table border="1" id="tabelaVoznji2"></table>';
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
                    t6 = $('<td></td>').text(lista[i].ZeljeniTipAutomobila.toString());
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
                izgled += '<table border="1" id="tabelaVoznji2"></table>';
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
                    t6 = $('<td></td>').text(lista[i].ZeljeniTipAutomobila.toString());
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
                izgled += '<table border="1" id="tabelaVoznji"></table>';
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
                    t6 = $('<td></td>').text(lista[i].ZeljeniTipAutomobila.toString());
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