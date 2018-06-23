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
            TipVozila: `${$('#tipAutomobila').val()}`
        }
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

});