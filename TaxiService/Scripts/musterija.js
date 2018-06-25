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

    //$("#zahtevVoznjeButton").click(function () {
    //    $('#zahtevVoznje').hide(); 
    //    $('#prikazVoznji').show(); 
    //});

    $("#pocetnaStranica").click(function () {

        korisnikJSON = sessionStorage.getItem('korisnik');
        korisnik = $.parseJSON(korisnikJSON);
          
        $.ajax({
            method: "GET",
            url: "/api/Musterija/GetVoznje",
            data: { username: korisnik.Username },
          //  contentType: 'application/json; charset=utf-8',
            dataType: "html",
            complete: function (data, status) {
                if (status == 200) {
                    $("#prikazVoznji").show();
                    $("#prikazVoznji").html(data.responseText);
                } else {
                    $("#prikazVoznji").show();
                    $("#prikazVoznji").html(data.responseText);
                }              
            }
        });
       
    }); 
});

$(document).on("click","#izmeniVoznjuButton",function () {

    var voznja = {
        Ulica: `${$("#ulicaIzmenaV").val()}`,
        Broj: `${$("#brojIzmenaV").val()}`,
        Grad: `${$("#gradIzmenaV").val()}`,
        PozivBr: `${$("#pozivniBrV").val()}`,
        TipVozila: `${$("#selectVoziloV").val()}`,
        IndeksVoznje: idVoznje
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
                $("#izmenaVoznje").html(data);
            } else {
                $("#izmenaVoznje").show();
                $("#izmenaVoznje").html(data);
            }
        }
    });
});

$(document).on("click",".izmeni_buttonClass",function () {
    $("#prikazVoznji").hide();
    $("#izmenaVoznje").show();

    idVoznje = `${$(this).val()}`;
    $.ajax({
        method: "GET",
        url: "/api/Musterija/GetVoznja",
        data: { id: idVoznje },
        dataType: "html",
        complete: function (data) {
            if (data.status == 200) {
                $("#izmenaVoznje").html(data.responseText);
            } else {
                $("#izmenaVoznje").html(data.responseText);
            }
        }
    });
});

$(document).on("click","#zahtevVoznjeButton", function () {
    var userinput = $('#ulica').val();
    var pattern = /^[a-zA-Z]+( [a-zA-Z]+)*$/i;
    if (userinput != "") {
        if (!pattern.test(userinput)) {
            $('#greskaUlica').show();
            retVal = false;
        } else {
            $('#greskaUlica').hide();
            retVal = true;
        }
    } else {
        $('#greskaUlica').show();
        retVal = false;
    }
    userinput = $('#naseljenoMesto').val();
    pattern = /^[a-zA-Z]+( [a-zA-Z]+)*$/i;
    if (userinput != "") {
        if (!pattern.test(userinput)) {
            $('#greskaMesto').show();
            retVal = false;
        } else {
            $('#greskaMesto').hide();
            retVal = true;
        }
    } else {
        $('#greskaMesto').show();
        retVal = false;
    }

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
                    $('#zahtevVoznje').html(data.responseText);
                } else {
                    $('#neuspesanZahtev').html(data.responseText);
                }
            }
        });
    }

});