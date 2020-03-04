function showMessage(arr){
    $('#section-message').empty() ;

    arr.forEach(element => {
        $('#section-message').append(`<li>${element}</li>`)
    });
}

function showTodos(){
    $('#section-list').empty() ;

    const token = localStorage.getItem('token');

    $.ajax({
        method : 'GET',
        url : 'http://localhost:3000/todos',
        headers : {
            token
        }
    })
        .done (function(response){
            console.log(response.data);
            response.data.forEach(element => {
                $('#section-list').append(`<li>${element.title}</li>`)
            });

        })
        .fail (function(err){
            console.log(err);
        })
}

$(document).ready (function(){

    const token = localStorage.getItem('token') ;
    if (token) {
        $('#section-message').empty() ;
        $("#page-home").hide();
        $("#page-signup").hide();
        $("#page-login").hide();
        $("#page-dashboard").show();
        $("#page-createtodo").hide();
        $("#page-updatetodo").hide();
    } else {
        $('#section-message').empty() ;
        $("#page-home").show();
        $("#page-signup").hide();
        $("#page-login").hide();
        $("#page-dashboard").hide();
        $("#page-createtodo").hide();
        $("#page-updatetodo").hide();
    }

    $('#btn-signup').on('click', function(){
        $('#section-message').empty() ;
        $("#page-home").hide();
        $("#page-signup").show();
        $("#page-login").hide();
        $("#page-dashboard").hide();
        $("#page-createtodo").hide();
        $("#page-updatetodo").hide();
    })

    $('#btn-login').on('click', function(){
        $('#section-message').empty() ;
        $("#page-home").hide();
        $("#page-signup").hide();
        $("#page-login").show();
        $("#page-dashboard").hide();
        $("#page-createtodo").hide();
        $("#page-updatetodo").hide();
    })


    $('#btn-logout').on('click', function(){
        $('#section-message').empty() ;
        localStorage.clear()
        $("#page-home").show();
        $("#page-signup").hide();
        $("#page-login").hide();
        $("#page-dashboard").hide();
        $("#page-createtodo").hide();
        $("#page-updatetodo").hide();
    })


    $('#btn-home').on('click', function(){
        $('#section-message').empty() ;
        if (token) {
            $("#page-home").hide();
            $("#page-signup").hide();
            $("#page-login").hide();
            $("#page-dashboard").show();
            $("#page-createtodo").hide();
            $("#page-updatetodo").hide();
        } else {
            $("#page-home").show();
            $("#page-signup").hide();
            $("#page-login").hide();
            $("#page-dashboard").hide();
            $("#page-createtodo").hide();
            $("#page-updatetodo").hide();
        }
    })

    $('#page-signup').on('submit', function(e){
        e.preventDefault() ;
        const email = $('#email-signup').val();
        const password = $('#password-signup').val()

        $.ajax({
            method : 'POST',
            url : 'http://localhost:3000/users/register',
            data : {
                email,
                password
            }
        })
            .done(function (response) {
                showMessage(['Signed up success'])
                $("#page-home").hide();
                $("#page-signup").hide();
                $("#page-login").show();
                $("#page-dashboard").hide();
                $("#page-createtodo").hide();
                $("#page-updatetodo").hide();
            })
            .fail(function (err) {
                showMessage(err.responseJSON.message)
            })
    })

    $('#page-login').on('submit',function(e){
        e.preventDefault() ;
        const email = $('#email-login').val();
        const password = $('#password-login').val()

        $.ajax({
            method : 'POST',
            url : 'http://localhost:3000/users/login',
            data : {
                email,
                password
            }
        })
            .done(function (response) {
                const token = response.token ;
                localStorage.setItem ('token', token) ;
                showTodos()
                $("#page-home").hide();
                $("#page-signup").hide();
                $("#page-login").hide();
                $("#page-dashboard").show();
                $("#page-createtodo").hide();
                $("#page-updatetodo").hide();
            })
            .fail(function (err) {
                showMessage([err.responseJSON.message])
            })        
    })




})