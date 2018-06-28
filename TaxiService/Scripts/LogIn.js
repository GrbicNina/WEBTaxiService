﻿if (sessionStorage.getItem('korisnik') === null) {
    var korisnik = null;
} else {
    var korisnikJSON = sessionStorage.getItem('korisnik');
    korisnik = $.parseJSON(korisnikJSON);
}

function loadMusterije() {
    $("#registracija").hide();
    window.location.href = "MusterijaUI.html";
}

function loadDispecere() {
    $("#registracija").hide();
    window.location.href = "DispecerUI.html";
}

function loadVozace() {
    $("#registracija").hide();
    window.location.href = "VozacUI.html";
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
        }).complete(function (data,status) {
            if (status == "success") {
                $('#greskaLogovanja').hide();
                sessionStorage.setItem('korisnik', data.responseJSON);
                ulogovan = JSON.parse(data.responseJSON);
                if (ulogovan.Uloga == 0) {
                    loadMusterije();
                }
                else if (ulogovan.Uloga== 1) {
                    loadDispecere();
                }
                else if (ulogovan.Uloga == 2) {
                    loadVozace();
                }
            } else {
                $('#greskaLogovanja').show();
                if (status == 409) {
                    $('#greskaLogovanja').html("<label>Desila se greska prilikom logovanja!</label>");
                }
                $('#greskaLogovanja').html("<label>Desila se greska prilikom logovanja!</label>");
            }
        });
    });
});