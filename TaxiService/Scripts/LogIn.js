﻿if (sessionStorage.getItem('korisnik') === null) {
    var korisnik = null;
} else {
    var korisnikJSON = sessionStorage.getItem('korisnik');
    korisnik = $.parseJSON(korisnikJSON);
}

function loadMusterije() {
    $("#registracija").hide();
    $(".main").load("MusterijaUI.html");
}

function loadDispecere() {
    $("#registracija").hide();
    $(".main").load("Dispeceri.html");
}

function loadVozace() {
    $("#registracija").hide();
    $(".main").load("Vozaci.html");
}

$(document).ready(function () {
    $('#buttonLogIn').click(function () {
        var korisnik = {
            username: `${$('#username').val()}`,
            password: `${$('#password').val()}`
        };


        $.ajax({
            type: 'POST',
            url: '/api/Korisnik/LogIn',
            data: JSON.stringify(korisnik),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
        }).done(function (data) {
            if (data != null) {
                $('#greskaLogovanja').hide();
                sessionStorage.setItem('korisnik', JSON.stringify(data));
                if (data.Uloga == 0)
                {
                    loadMusterije();
                }
                else if (data.Uloga == 1)
                {
                    loadDispecere();
                }
                else if (data.Uloga == 2)
                {
                    loadVozace();
                }
            } else {
                $('#greskaLogovanja').show();
            }
        });
    });
});