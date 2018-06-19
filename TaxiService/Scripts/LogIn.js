function loadMusterije() {
    $("#registracija").hide();
    $("#login").load("~/Musterija.html");
}

function loadDispecere() {
}

function loadVozace() {

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