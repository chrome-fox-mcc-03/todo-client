$(document).ready(function() {
    if (localStorage.getItem('token')) {
        $('#dashboard-page').show();
        $('#signup-page').hide();
        $('#signin-page').hide();
    } else {
        $('#dashboard-page').hide();
        $('#signup-page').hide();
        $('#signin-page').show();
    }

    $('#signup-form').on('submit', function(e) {
        e.preventDefault();
        const email = $('#signup-email').val();
        const password = $('#signup-password').val();
        $.ajax({
            method: 'POST',
            url: 'http://localhost:3000/signup',
            data: {
                email,
                password
            }
        })
            .done(result => {
                console.log('sign up success', result);
            })
            .fail(err => {
                console.log('sign up failed', err);
            })
    })

    $('#signin-form').on('submit', function(e) {
        e.preventDefault();
        const email = $('#signin-email').val();
        const password = $('#signin-password').val();
        $.ajax({
            url: 'http://localhost:3000/signin',
            method: 'POST',
            data: {
                email,
                password
            }
        })
            .done(token => {
                localStorage.setItem('token', token);
                console.log('sign in success', token);
                $('#dashboard-page').show();
                $('#signup-page').hide();
                $('#signin-page').hide();
            })
            .fail(err => {
                console.log('sign in failed', err);
            })
    })

    $('#btn-signout').on('click', function() {
        localStorage.clear();
        $('dashboard-page').hide();
        $('#signup-form').show();
        $('#signin-form').show();
    })

    $('#btn-redir-signup').on('click', function() {
        $('#dashboard-page').hide();
        $('#signup-page').show();
        $('#signin-page').hide();
    })

    $('#btn-redir-signin').on('click', function() {
        $('#dashboard-page').hide();
        $('#signup-page').hide();
        $('#signin-page').show();
    })

    // $('#btn').on('click', function() {
    //     $('#dashboard-page').hide();
    // })
    // $('#landing-page').show();
})