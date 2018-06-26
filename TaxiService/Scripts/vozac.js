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
        $.ajax({
            type: 'GET',
            url: '/api/Vozac/VratiVoznjeNaCekanju',
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
        }
    $.ajax({
        type: 'POST',
        url: '/api/Vozac/IzmeniStatus',
        data: JSON.stringify(voznja),
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
        }
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

$(document).on("click", "#pocetnaStranica", function () {
    var username = korisnik.Username;
    $.ajax({
        method: "GET",
        url: "/api/Vozac/VratiVoznjePocetna/" + username,
        dataType: "html",
        complete: function (data) {
            if (data.status == 200) {
                $("#pocetna").html(data.responseText);
            } else {
                $("#pocetna").html(data.responseText);
            }
        }
    });
});