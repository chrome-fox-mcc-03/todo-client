$(document).ready(function() {
    $('#signup-form').on('submit', function(e) {
        e.preventDefault();
        const email = $('#signup-email').val();
        const password = $('#signup-password').val();
        console.log(email, password);
        // $.ajax({
        //     method: 'POST',
        //     url: 'http://localhost:3000/signup',
        //     data: {
        //         email,
        //         password
        //     }
        // })
        //     .done(result => {
        //         console.log('sign up success', result);
        //     })
        //     .fail(err => {
        //         console.log('sign up failed', err);
        //     })
    })

    $('#signin-form').on('submit', function(e) {
        e.preventDefault();
        const email = $('#signin-email').val();
        const password = $('#signin-password').val();
        // console.log(email, password);
        $.ajax({
            url: 'http://localhost:3000/signin',
            method: 'POST',
            data: {
                email,
                password
            }
        })
            .done(token => {
                localStorage.setItem('token', token)
                console.log('sign in success', token);
            })
            .fail(err => {
                console.log('sign in failed', err);
            })
    })

    $('#btn-signout').on('click', function() {
        localStorage.clear();
    })

    // $('#btn').on('click', function() {
    //     $('#dashboard-page').hide();
    // })
    // $('#landing-page').show();
})