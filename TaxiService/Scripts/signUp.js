$(document).ready(function () {

    //otvaranje sign up forme
    $('#linkRegistracija').click(function () {
        $('.container1').css('display', 'none');
        $('.container2').css('display', 'block');
        
    });


    $('#buttonRegistracija').click(function () {
        var retVal = true;
    //#region validacija

        let userinput = $('#ime').val();
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
    
        userinput = $('#prezime').val();
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
 

        userinput = $('#email').val();
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

        userinput = $('#jmbg').val();
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

        userinput = $('#telefon').val();
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
  

    //if (this.id == "korisnickoIme") {
    //    userinput = $(this).val();
    //    pattern = /^\b[A-Za-z]+[0-9]*[A-Za-z]*\b$/i;
    //    pattern2 = /^\b^[A-Za-z]+.*$/i

    //    if (userinput != "") {
    //        if (!pattern2.test(userinput)) {
    //            SignUpNaznaci($(this), 'Mora poceti slovom');
    //        } else if (!pattern.test(userinput)) {
    //            SignUpNaznaci($(this), 'Samo slova i cifre su dozvoljeni');
    //        }
    //    } else {
    //        SignUpNaznaci($(this), 'Polje ne sme biti prazno');
    //    }
    //}





        //#endregion
        if (retVal) {
            let musterija = {
                Username: `${$('#korisnickoIme').val()}`,
                Ime: `${$('#ime').val()}`,
                Prezime: `${$('#prezime').val()}`,
                Pol: `${$('#pol').val()}`,
                JMBG: `${$('#jmbg').val()}`,
                Telefon: `${$('#telefon').val()}`,
                Email: `${$('#email').val()}`,
                Password: `${$('#psw').val()}`
            };

            $.ajax({
                type: 'POST',
                url: '/api/Korisnik/RegistrujSe',
                data: JSON.stringify(musterija),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            }).done(function (data) {
                if (data == "ERROR") {
                    $('#registracija').css('display', 'none');
                    $('#registracija').after('<p style="color: red; font-size: 22px;">Doslo je do neke greske! <p>');
                    $('#registracija').after('<button type="button" class="okButton">OK</button>');
                } else if (data == "DUPLIKAT") {
                    $('#korisnickoimeGreska').show();
                    //$('#korimeSignUp').focus();
                } else {
                    $('#korisnickoimeGreska').hide();
                    $('#registracija').css('display', 'none');
                    $('#registracija').after('<button type="button" class="okButton">OK</button>');
                    $('#registracija').after('<p style="color: blue; font-size: 22px;">Uspesno ste kreirali nalog! <p>');
                }
             });
        }

        //$('.okButton').click(function () {
        //    $('.okButton').remove();
        //    $('.container2').css('display', 'none');
        //    $('.container1').css('display', 'block');
        //});
    });
});