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

function displayLocation(latitude, longitude) {
    var request = new XMLHttpRequest();
    var method = 'GET';
    var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='
        + latitude + ',' + longitude + '&sensor=true';
    var async = false;
    var address;
    request.open(method, url, async);
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var data = JSON.parse(request.responseText);
            address = data.results[0];
            var value = address.formatted_address.split(",");
            count = value.length;
            country = value[count - 1];
            state = value[count - 2];
            city = value[count - 3];
        }
    };
    request.send();
    return address.formatted_address;
};

function placeMarker(map, location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
    var fullAdresa = displayLocation(location.lat(), location.lng());
    var delovi = fullAdresa.split(",");
    var ulicaIbroj = delovi[0];
    var ulica = ulicaIbroj.split(" ");
    var newUlica = ulica.slice(0, -1);
    var broj = ulica[ulica.length - 1];
    var temp = newUlica.join(' ');
    var grad = delovi[1];
    var drzava = delovi[2];
    var fulAdresa = location.lat() + "," + location.lng() + "," + ulicaIbroj + "," + grad + "," + drzava;
    $("#ulica").val(temp);
    $("#broj").val(broj);
    $("#naseljenoMesto").val(grad);
    $("#pozivniBroj").val(grad);
    $("#xKordinata").val(location.lat());
    $("#yKordinata").val(location.lng());
    //$("#pomoccc").val(1);
    //var infowindow = new google.maps.InfoWindow({
    //    content: 'Latitude: ' + location.lat() + '<br>Longitude: ' + location.lng() + '<br>Ulica i broj: ' + ulicaIbroj + '<br>Grad: ' + grad + '<br>Drzava: ' + drzava + '<br>=' + displayLocation(location.lat(), location.lng())
    //});
    infowindow.open(map, marker);
}

function myMap() {
    var mapCanvas = document.getElementById("map");
    var myCenter = new google.maps.LatLng(45.242630873254775, 19.842914435055945);
    var mapOptions = { center: myCenter, zoom: 15 };
    var map = new google.maps.Map(mapCanvas, mapOptions);
    google.maps.event.addListener(map, 'click', function (event) {
        placeMarker(map, event.latLng);
    });
}

idVoznje = 0;

$(document).ready(function () {

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
            var uloga = "Musterija";
            let musterija = {
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
                url: '/api/Musterija/IzmeniProfil',
                data: JSON.stringify(musterija),
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
                url: '/api/Musterija/IzmeniSifru',
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

   

    $('#buttonLogOff').click(function () {
        sessionStorage.removeItem('korisnik');
        window.location.href = "Index.html";
    });

    $("#pocetnaStranica").click(function () {

        korisnikJSON = sessionStorage.getItem('korisnik');
        korisnik = $.parseJSON(korisnikJSON);
          
        $.ajax({
            method: "GET",
            url: "/api/Musterija/GetVoznje",
            data: { username: korisnik.Username },
            dataType: "json",
            complete: function (data,status) {
                if (status == "success") {
                    var i;
                    var izgled = '<h3>Vase voznje</h3><label>Filtriraj:</label><select id="filterM"><option id="nista" display:none></option>';
                    izgled += '<option>Kreirana</option><option>Formirana</option><option>Obradjena</option><option>Prihvacena</option><option>Otkazana</option>';
                    izgled += '<option>Neuspesna</option><option>Uspesna</option></select><button id="filterButton">Filtriraj</button>';
                    izgled += '</br><label>Sortiraj po: </label><input type="checkbox" id="datumCheck"/>Datumu<input type="checkbox" id="ocenaCheck"/>Oceni<button id="sort">Sortiraj</button>';
                    izgled += '</br><label>Pretrazi po:</label>OD<input id="datumOD" type="date"/>DO<input id="datumDO" type="date"/>';
                    izgled += '<label>Oceni</label>OD<input type="number" min="0" max ="5" id="ocenaOD"/><input type="number" min="0" max ="5" id="ocenaDO"/>';
                    izgled += '<label>Ceni</label>OD<input id="cenaOD" type = "number" min="0" max ="100000"/>DO<input id="cenaDO" type = "number" min="0" max ="100000"/><button id="pretraga">Pretrazi</button>';
                    izgled += '<table class="table-style-three" border="1" id="tabelaVoznji"></table>';
                    $("#prikazVoznji").show();
                    $("#prikazVoznji").html(izgled);
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
                    var izgled7 = $("<th></th>").text("Iznos");
                    var izgled8 = $("<th></th>").text("Status voznje");
                    var izgled9 = $("<th></th>").text("Opcije");
                    var izgled10 = $("<th></th>").text("Komentar");
                    var izgled11 = $("<th></th>").text("Ocena");
                    $("#tabelaVoznji").append('<tr>', izgled1, izgled2, izgled3, izgled4, izgled5, izgled6, izgled7, izgled8, izgled9, izgled10, izgled11,'</tr>');

                    var lista = JSON.parse(data.responseText);
                    for (i = 0; i < lista.length; i++) {
                        var t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10;
                        t0 = $('<td></td>').text(lista[i].VremePorudzbine);
                         t1 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Ulica);
                         t2 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Broj);
                         t3 = $('<td></td>').text(lista[i].StartLokacija.Adresa.NaseljenoMesto);
                         t4 = $('<td></td>').text(lista[i].StartLokacija.Adresa.PozivniBrojMesta);
                         t5 = $('<td></td>').text(getNazivAuta(lista[i].ZeljeniTipAutomobila.toString()));
                         t6 = $('<td></td>').text(lista[i].Iznos);
                         t7 = $('<td></td>').text(getStatusVoznje(lista[i].Status));
                        if (getStatusVoznje(lista[i].Status) == "Kreirana") {
                             t8 = $('<td></td>').append('<button id="izmeniID" class="izmeni_buttonClass">Izmeni</button> <button id="otkaziID" class="odustani_buttonClass" > Odustani</button >');
                            var nazivIzmena = "izmeniID" + lista[i].IDVoznje.toString();
                            var nazivOtkaz = "otkaziID" + lista[i].IDVoznje.toString();
                             t9 = $('<td></td>').text("");
                             t10 = $('<td></td>').text("");
                            $("#tabelaVoznji").append('<tr>', t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, '</tr>');
                            document.getElementById("izmeniID").id = nazivIzmena;
                            document.getElementById(nazivIzmena).value = lista[i].IDVoznje;
                            document.getElementById("otkaziID").id = nazivOtkaz;
                            document.getElementById(nazivOtkaz).value = lista[i].IDVoznje;
                        } else if (getStatusVoznje(lista[i].Status) == "Uspesna") {
                            if (lista[i].Komentar.Opis != null && lista[i].Komentar.Opis != "") {
                                 t8 = $('<td></td>').text("");
                                 t9 = $('<td></td>').text(lista[i].Komentar.Opis);
                                 t10 = $('<td></td>').text(lista[i].Komentar.OcenaVoznje);
                                $("#tabelaVoznji").append('<tr>', t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, '</tr>');
                            } else {
                                 t8 = $('<td></td>').append('<button id="komentarID" class="komentarMusterija_buttonClass">Komentarisi</button>');
                                 t9 = $('<td></td>').text("");
                                 t10 = $('<td></td>').text("");
                                $("#tabelaVoznji").append('<tr>', t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, '</tr>');
                                var nazivKomentar = "komentarID" + lista[i].IDVoznje.toString();
                                document.getElementById("komentarID").id = nazivKomentar;
                                document.getElementById(nazivKomentar).value = lista[i].IDVoznje;
                            }
                        } else {
                             t8 = $('<td></td>').text("");
                             t9 = $('<td></td>').text("");
                             t10 = $('<td></td>').text("");
                            $("#tabelaVoznji").append('<tr>', t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, '</tr>');
                        }                        
                    }

                } else {
                    $("#prikazVoznji").show();
                    $("#prikazVoznji").html('<h4>Ne postoji ni jedna voznja koju ste kreirali.</h4>');
                }              
            }
        });
       
    }); 
});

$(document).on("click", "#sort", function () {
    var username = korisnik.Username;
    var flag1 = document.getElementById("datumCheck").checked;
    var flag2 = document.getElementById("ocenaCheck").checked;
    var prvi, drugi;
    prvi = "0";
    drugi = "0";
    if (flag1) {
        prvi = "1";
    }
    if (flag2) {
        drugi = "1";
    }
    var usernameIflagovi = username + '_' + prvi + '_' + drugi + '_' + '0';
    $.ajax({
        method: "GET",
        url: "/api/FilterSortPretraga/Sortiraj/" + usernameIflagovi,
        dataType: "json",
        complete: function (data) {
            if (data.status == 200) {
                var i;
                var izgled = '<h3>Vase voznje sortirane </h3><table class="table-style-three" border="1" id="tabelaVoznji"></table>';
                $("#prikazVoznji").show();
                $("#prikazVoznji").html(izgled);
                var izgled1 = $("<th></th>").text("Datum i vreme narudzbe");
                var izgled2 = $("<th></th>").text("[START]Ulica");
                var izgled3 = $("<th></th>").text("[START]Broj");
                var izgled4 = $("<th></th>").text("[START]Grad");
                var izgled5 = $("<th></th>").text("[START]Pozivni broj");
                var izgled6 = $("<th></th>").text("Zeljeni tip vozila");
                var izgled7 = $("<th></th>").text("Iznos");
                var izgled8 = $("<th></th>").text("Status voznje");
                var izgled9 = $("<th></th>").text("Opcije");
                var izgled10 = $("<th></th>").text("Komentar");
                var izgled11 = $("<th></th>").text("Ocena");
                $("#tabelaVoznji").append('<tr>', izgled1, izgled2, izgled3, izgled4, izgled5, izgled6, izgled7, izgled8, izgled9, izgled10, izgled11, '</tr>');

                var lista = JSON.parse(data.responseText);
                for (i = 0; i < lista.length; i++) {
                    var t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10;
                    t0 = $('<td></td>').text(lista[i].VremePorudzbine.toString());
                    t1 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Ulica);
                    t2 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Broj);
                    t3 = $('<td></td>').text(lista[i].StartLokacija.Adresa.NaseljenoMesto);
                    t4 = $('<td></td>').text(lista[i].StartLokacija.Adresa.PozivniBrojMesta);
                    t5 = $('<td></td>').text(getNazivAuta(lista[i].ZeljeniTipAutomobila.toString()));
                    t6 = $('<td></td>').text(lista[i].Iznos);
                    t7 = $('<td></td>').text(getStatusVoznje(lista[i].Status));
                    if (getStatusVoznje(lista[i].Status) == "Kreirana") {
                        t8 = $('<td></td>').append('<button id="izmeniID" class="izmeni_buttonClass">Izmeni</button> <button id="otkaziID" class="odustani_buttonClass" > Odustani</button >');
                        var nazivIzmena = "izmeniID" + lista[i].IDVoznje.toString();
                        var nazivOtkaz = "otkaziID" + lista[i].IDVoznje.toString();
                        t9 = $('<td></td>').text("");
                        t10 = $('<td></td>').text("");
                        $("#tabelaVoznji").append('<tr>', t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, '</tr>');
                        document.getElementById("izmeniID").id = nazivIzmena;
                        document.getElementById(nazivIzmena).value = lista[i].IDVoznje;
                        document.getElementById("otkaziID").id = nazivOtkaz;
                        document.getElementById(nazivOtkaz).value = lista[i].IDVoznje;
                    } else if (getStatusVoznje(lista[i].Status) == "Uspesna") {
                        if (lista[i].Komentar.Opis != null && lista[i].Komentar.Opis != "") {
                            t8 = $('<td></td>').text("");
                            t9 = $('<td></td>').text(lista[i].Komentar.Opis);
                            t10 = $('<td></td>').text(lista[i].Komentar.OcenaVoznje);
                            $("#tabelaVoznji").append('<tr>', t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, '</tr>');
                        } else {
                            t8 = $('<td></td>').append('<button id="komentarID" class="komentarMusterija_buttonClass">Komentarisi</button>');
                            t9 = $('<td></td>').text("");
                            t10 = $('<td></td>').text("");
                            $("#tabelaVoznji").append('<tr>', t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, '</tr>');
                            var nazivKomentar = "komentarID" + lista[i].IDVoznje.toString();
                            document.getElementById("komentarID").id = nazivKomentar;
                            document.getElementById(nazivKomentar).value = lista[i].IDVoznje;
                        }
                    } else {
                        t8 = $('<td></td>').text("");
                        t9 = $('<td></td>').text("");
                        t10 = $('<td></td>').text("");
                        $("#tabelaVoznji").append('<tr>', t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, '</tr>');
                    }
                }
            } else {
                var izgled = '';
                $("#prikazVoznji").html(izgled);
            }
        }
    });
});

$(document).on("click", "#pretraga", function () {
    var usernameUlogovanog =  korisnik.Username;
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
        url: "/api/FilterSortPretraga/Pretrazi",
        data: JSON.stringify(paket),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        complete: function (data) {
            if (data.status == 200) {
                var i;
                var izgled = '<h3>Vase voznje pretrazene </h3><table class="table-style-three" border="1" id="tabelaVoznji"></table>';
                $("#prikazVoznji").show();
                $("#prikazVoznji").html(izgled);
                var izgled1 = $("<th></th>").text("Datum i vreme narudzbe");
                var izgled2 = $("<th></th>").text("[START]Ulica");
                var izgled3 = $("<th></th>").text("[START]Broj");
                var izgled4 = $("<th></th>").text("[START]Grad");
                var izgled5 = $("<th></th>").text("[START]Pozivni broj");
                var izgled6 = $("<th></th>").text("Zeljeni tip vozila");
                var izgled7 = $("<th></th>").text("Iznos");
                var izgled8 = $("<th></th>").text("Status voznje");
                var izgled9 = $("<th></th>").text("Opcije");
                var izgled10 = $("<th></th>").text("Komentar");
                var izgled11 = $("<th></th>").text("Ocena");
                $("#tabelaVoznji").append('<tr>', izgled1, izgled2, izgled3, izgled4, izgled5, izgled6, izgled7, izgled8, izgled9, izgled10, izgled11, '</tr>');

                var lista = JSON.parse(data.responseText);
                for (i = 0; i < lista.length; i++) {
                    var t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10;
                    t0 = $('<td></td>').text(lista[i].VremePorudzbine.toString());
                    t1 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Ulica);
                    t2 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Broj);
                    t3 = $('<td></td>').text(lista[i].StartLokacija.Adresa.NaseljenoMesto);
                    t4 = $('<td></td>').text(lista[i].StartLokacija.Adresa.PozivniBrojMesta);
                    t5 = $('<td></td>').text(getNazivAuta(lista[i].ZeljeniTipAutomobila.toString()));
                    t6 = $('<td></td>').text(lista[i].Iznos);
                    t7 = $('<td></td>').text(getStatusVoznje(lista[i].Status));
                    if (getStatusVoznje(lista[i].Status) == "Kreirana") {
                        t8 = $('<td></td>').append('<button id="izmeniID" class="izmeni_buttonClass">Izmeni</button> <button id="otkaziID" class="odustani_buttonClass" > Odustani</button >');
                        var nazivIzmena = "izmeniID" + lista[i].IDVoznje.toString();
                        var nazivOtkaz = "otkaziID" + lista[i].IDVoznje.toString();
                        t9 = $('<td></td>').text("");
                        t10 = $('<td></td>').text("");
                        $("#tabelaVoznji").append('<tr>', t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, '</tr>');
                        document.getElementById("izmeniID").id = nazivIzmena;
                        document.getElementById(nazivIzmena).value = lista[i].IDVoznje;
                        document.getElementById("otkaziID").id = nazivOtkaz;
                        document.getElementById(nazivOtkaz).value = lista[i].IDVoznje;
                    } else if (getStatusVoznje(lista[i].Status) == "Uspesna") {
                        if (lista[i].Komentar.Opis != null && lista[i].Komentar.Opis != "") {
                            t8 = $('<td></td>').text("");
                            t9 = $('<td></td>').text(lista[i].Komentar.Opis);
                            t10 = $('<td></td>').text(lista[i].Komentar.OcenaVoznje);
                            $("#tabelaVoznji").append('<tr>', t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, '</tr>');
                        } else {
                            t8 = $('<td></td>').append('<button id="komentarID" class="komentarMusterija_buttonClass">Komentarisi</button>');
                            t9 = $('<td></td>').text("");
                            t10 = $('<td></td>').text("");
                            $("#tabelaVoznji").append('<tr>', t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, '</tr>');
                            var nazivKomentar = "komentarID" + lista[i].IDVoznje.toString();
                            document.getElementById("komentarID").id = nazivKomentar;
                            document.getElementById(nazivKomentar).value = lista[i].IDVoznje;
                        }
                    } else {
                        t8 = $('<td></td>').text("");
                        t9 = $('<td></td>').text("");
                        t10 = $('<td></td>').text("");
                        $("#tabelaVoznji").append('<tr>', t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, '</tr>');
                    }
                }
            } else {
                var izgled = '<h4>Nema rezultata za ovu pretragu!</h4>';
                $("#prikazVoznji").html(izgled);
            }
        }
    });
});

$(document).on("click","#izmeniVoznjuButton",function () {

    var voznja = {
        Ulica: `${$("#ulicaIzmenaV").val()}`,
        Broj: `${$("#brojIzmenaV").val()}`,
        Grad: `${$("#gradIzmenaV").val()}`,
        PozivBr: `${$("#pozivniBrV").val()}`,
        TipVozila: `${$("#selectVoziloV").val()}`,
        IndeksVoznje: idVoznje,
        ulogovani: `${korisnik.Username}`
    };

    $.ajax({
        type: 'POST',
        url: '/api/Musterija/IzmeniVoznju',
        data: JSON.stringify(voznja),
        contentType: 'application/json; charset=utf-8',
        dataType: 'html',
        complete: function (data) {
            if (data.status == 200) {
                $("#izmenaVoznje").show();
                $("#izmenaVoznje").html(data.responseText);
            } else {
                $("#izmenaVoznje").show();
                $("#izmenaVoznje").html(data.responseText);
            }
        }
    });
});

$(document).on("click",".izmeni_buttonClass",function () {
    $("#prikazVoznji").hide();
    idVoznje = `${$(this).val()}`;
    var paket = korisnik.Username.concat('_');
    paket = paket.concat(idVoznje.toString());
    
    $.ajax({
        method: "GET",
        url: "/api/Musterija/GetVoznja/" + paket,
       // data: { usernameiID: paket },
        dataType: "html",
        complete: function (data) {
            if (data.status == 200) {
                $('#izmenaVoznje').show();
                $("#izmenaVoznje").html(data.responseText);
            } else {
                $("#izmenaVoznje").html(data.responseText);
            }
        }
    });
});

$(document).on("click", "#zahtevForma", function () {
    var izgled = '<table><tr><th>Ulica: </th><td><input type="text" id="ulica" readonly /><label id="greskaUlica" class="labeleGresaka" hidden>Niste uneli dobru vrednost za ulicu!</label></td></tr>';
    izgled += '<tr><th> Broj: </th><td><input type="number" id="broj" min="1" max="1000" readonly></td></tr>';
    izgled += '<tr><th> Mesto: </th><td><input type="text" id="naseljenoMesto" readonly><label id="greskaMesto" class="labeleGresaka" hidden>Niste uneli dobru vrednost za mesto!</label></td></tr>';
    izgled += '<tr><th>Pozivni broj mesta:</th><td><input type="number" id="pozivniBroj" readonly min="10000" max="39000"></td></tr>';
    izgled += '<tr><th>X koordinata:</th><td><input type="text" id="xKordinata" readonly/></td></tr><tr><th>Y koordinata:</th><td><input type="text" id="yKordinata" readonly /></td></tr >';
    izgled += '<tr><th>Izaberite tip vozila:</th><td><select id="tipAutomobila" name="Automobil.tipAutomobila"><option id="putnickiAutomobil">PutnickiAutomobil</option><option id="kombiVozilo">KombiVozilo</option><option id="svj" selected>Svejedno</option></select></td></tr>';
    izgled += ' </table><button id = "zahtevVoznjeButton"> Posalji</button><br/><div hidden id="map"></div>';
    $('#zahtevVoznje').html(izgled);
    myMap();
    $("#map").show();
});

$(document).on("click", "#zahtevVoznjeButton", function () {
    retVal = true;

    if (retVal) {
        $('#greskaUlica').hide();
        $('#greskaMesto').hide();

        var voznja = {
            VremeZahteva: Date.now(),
            StartnaLokacija: `${$('#ulica').val()}`,
            Broj: `${$('#broj').val()}`,
            Mesto: `${$('#naseljenoMesto').val()}`,
            PozivniBroj: `${$('#pozivniBroj').val()}`,
            ZeljeniAuto: `${$('#tipAutomobila').val()}`,
            Musterija: `${korisnik.Username}`
        };

        $.ajax({
            type: 'POST',
            url: '/api/Musterija/PosaljiZahtev',
            data: JSON.stringify(voznja),
            contentType: 'application/json; charset=utf-8',
            dataType: 'html',
            complete: function (data) {
                if (data.status == 200) {
                    $('#neuspesanZahtev').hide();
                    $('#zahtevVoznje').show();
                    $('#zahtevVoznje').html(data.responseText);
                } else {
                    $('#neuspesanZahtev').html(data.responseText);
                }
            }
        });
    }

});


$(document).on("click", ".odustani_buttonClass", function () {

    idVoznje = `${$(this).val()}`;

    var izgled = '<div class="commentSection"><h3>Ostavljanje komentara je obavezno</h3><textarea id="komentarOtkaz" rows="4" cols="50" placeholder="Unesite komentar..."></textarea></br>';
    izgled += '<label>Ocena</label><select id="ocena"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select>';
    izgled += '<button id="komentarisi">Ostavi komentar</button></div>';
    $("#prikazVoznji").html(izgled);
    document.getElementById("komentarisi").value = idVoznje;
    $(':button').not('#prikazVoznji :button').attr('disabled', true);
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
        url: "/api/Musterija/OstaviKomentar",
        data: JSON.stringify(komentar),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        complete: function (data) {
            if (data.status == 200) {
                $(':button').not('#komentarisi :button').attr('disabled', false);
                $("#prikazVoznji").html('<h4>Uspesno ste otkazali voznju i ostavili komentar!</h4>');
            } else {
                $("#prikazVoznji").html('<h4>Desila se greska prilikom ostavljanja komentara!</h4>');
            }
        }
    });
});

$(document).on("click", ".komentarMusterija_buttonClass", function () {

    idVoznje = `${$(this).val()}`;

    var izgled = '<div class="commentSection"><h3>Ostavite komentar</h3><textarea id="komentarM" rows="4" cols="50" placeholder="Unesite komentar..."></textarea></br>';
    izgled += '<label>Ocena</label><select id="ocenaM"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select>';
    izgled += '<button id="komentarisiM">Ostavi komentar</button></div>';
    $("#prikazVoznji").html(izgled);
    document.getElementById("komentarisiM").value = idVoznje;
});

$(document).on("click", "#komentarisiM", function () {

    idVoznje = `${$(this).val()}`;

    var komentar = {
        IDVoznje: idVoznje,
        OpisKomentara: `${$('#komentarM').val()}`,
        KorisnikUsername: korisnik.Username,
        Ocena: `${$('#ocenaM').val()}`
    };

    $.ajax({
        method: "POST",
        url: "/api/Musterija/OstaviKomentar",
        data: JSON.stringify(komentar),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        complete: function (data) {
            if (data.status == 200) {
                $("#prikazVoznji").html('<h4>Uspesno ste ostavili komentar!</h4>');
            } else {
                $("#prikazVoznji").html('<h4>Desila se greska prilikom ostavljanja komentara!</h4>');
            }
        }
    });
});

$(document).on("click", "#filterButton", function () {
    var statusFilter = document.getElementById("filterM").value;
    var username = korisnik.Username;
    var usernameIstatusIflag = username + '_' + statusFilter + "_0";
    $.ajax({
        method: "GET",
        url: "/api/FilterSortPretraga/Filtriraj/" + usernameIstatusIflag,
        dataType: "json",
        complete: function (data) {
            if (data.status == 200) {
                var i;
                var izgled = '<h3>Vase voznje filtrirane po statusu </h3><label>Filtriraj:</label><select id="filterM"><option id="nista" display:none></option >';
                izgled += '<option>Kreirana</option><option>Formirana</option><option>Obradjena</option><option>Prihvacena</option><option>Otkazana</option>';
                izgled += '<option>Neuspesna</option><option>Uspesna</option></select><button id="filterButton">Filtriraj</button><table class="table-style-three" border="1" id="tabelaVoznji"></table>';
                $("#prikazVoznji").show();
                $("#prikazVoznji").html(izgled);
                var izgled1 = $("<th></th>").text("Datum i vreme narudzbe");
                var izgled2 = $("<th></th>").text("[START]Ulica");
                var izgled3 = $("<th></th>").text("[START]Broj");
                var izgled4 = $("<th></th>").text("[START]Grad");
                var izgled5 = $("<th></th>").text("[START]Pozivni broj");
                var izgled6 = $("<th></th>").text("Zeljeni tip vozila");
                var izgled7 = $("<th></th>").text("Iznos");
                var izgled8 = $("<th></th>").text("Status voznje");
                var izgled9 = $("<th></th>").text("Opcije");
                var izgled10 = $("<th></th>").text("Komentar");
                var izgled11 = $("<th></th>").text("Ocena");
                $("#tabelaVoznji").append('<tr>', izgled1, izgled2, izgled3, izgled4, izgled5, izgled6, izgled7, izgled8, izgled9, izgled10, izgled11, '</tr>');

                var lista = JSON.parse(data.responseText);
                for (i = 0; i < lista.length; i++) {
                    var t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10;
                    t0 = $('<td></td>').text(lista[i].VremePorudzbine.toString());
                    t1 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Ulica);
                    t2 = $('<td></td>').text(lista[i].StartLokacija.Adresa.Broj);
                    t3 = $('<td></td>').text(lista[i].StartLokacija.Adresa.NaseljenoMesto);
                    t4 = $('<td></td>').text(lista[i].StartLokacija.Adresa.PozivniBrojMesta);
                    t5 = $('<td></td>').text(getNazivAuta(lista[i].ZeljeniTipAutomobila.toString()));
                    t6 = $('<td></td>').text(lista[i].Iznos);
                    t7 = $('<td></td>').text(getStatusVoznje(lista[i].Status));
                    if (getStatusVoznje(lista[i].Status) == "Kreirana") {
                        t8 = $('<td></td>').append('<button id="izmeniID" class="izmeni_buttonClass">Izmeni</button> <button id="otkaziID" class="odustani_buttonClass" > Odustani</button >');
                        var nazivIzmena = "izmeniID" + lista[i].IDVoznje.toString();
                        var nazivOtkaz = "otkaziID" + lista[i].IDVoznje.toString();
                        t9 = $('<td></td>').text("");
                        t10 = $('<td></td>').text("");
                        $("#tabelaVoznji").append('<tr>', t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, '</tr>');
                        document.getElementById("izmeniID").id = nazivIzmena;
                        document.getElementById(nazivIzmena).value = lista[i].IDVoznje;
                        document.getElementById("otkaziID").id = nazivOtkaz;
                        document.getElementById(nazivOtkaz).value = lista[i].IDVoznje;
                    } else if (getStatusVoznje(lista[i].Status) == "Uspesna") {
                        if (lista[i].Komentar.Opis != null && lista[i].Komentar.Opis != "") {
                            t8 = $('<td></td>').text("");
                            t9 = $('<td></td>').text(lista[i].Komentar.Opis);
                            t10 = $('<td></td>').text(lista[i].Komentar.OcenaVoznje);
                            $("#tabelaVoznji").append('<tr>', t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, '</tr>');
                        } else {
                            t8 = $('<td></td>').append('<button id="komentarID" class="komentarMusterija_buttonClass">Komentarisi</button>');
                            t9 = $('<td></td>').text("");
                            t10 = $('<td></td>').text("");
                            $("#tabelaVoznji").append('<tr>', t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, '</tr>');
                            var nazivKomentar = "komentarID" + lista[i].IDVoznje.toString();
                            document.getElementById("komentarID").id = nazivKomentar;
                            document.getElementById(nazivKomentar).value = lista[i].IDVoznje;
                        }
                    } else {
                        t8 = $('<td></td>').text("");
                        t9 = $('<td></td>').text("0");
                        t10 = $('<td></td>').text("");
                        $("#tabelaVoznji").append('<tr>', t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, '</tr>');
                    }
                }
            } else {
                var izgled = '<h3>Vase voznje filtrirane po statusu</h3><label>Filtriraj:</label><select id="filterM"><option id="nista" display:none></option >';
                izgled += '<option>Kreirana</option><option>Formirana</option><option>Obradjena</option><option>Prihvacena</option><option>Otkazana</option>';
                izgled += '<option>Neuspesna</option><option>Uspesna</option></select><button id="filterButton">Filtriraj</button>';
                $("#prikazVoznji").html(izgled);
            }
        }
    });
});