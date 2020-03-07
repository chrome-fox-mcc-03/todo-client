/* DEFAULT */
const defaultView = () => {
    $('#registerForm').show();
    // todoCards
    $('#todoCards').hide();
    // Login Form
    $('#loginForm').hide();
    // Logout Button
    $('#logout').hide();
    // Default Register Form Show
    $('#emailAlert').hide();
    $('#passwordAlert').hide();
};

const loginView = () => {
    $('#registerForm').hide();
    // todoCards
    $('#todoCards').hide();
    // Login Form
    $('#loginForm').show();
    // Logout Button
    $('#logout').hide();
    // Default Register Form Show
    $('#emailLoginAlert').hide();
    $('#passwordLoginAlert').hide();
}

const isLogin = () => {
    $('#registerForm').hide();
    $('#register').hide();
    // todoCards
    $('#todoCards').show();
    // Login Form
    $('#login').hide();
    $('#loginForm').hide();
    // Logout Button$('#login').hide();
    $('#logout').show();
    // Default Register Form Show
    $('#emailLoginAlert').hide();
    $('#passwordLoginAlert').hide();
}

/*  FUNCTIONS */

const registerSuccess = () => {
    $('#registerForm').hide();
    $('#loginForm').show();
};

/* HOME AREA */


/* REGISTER AREA */
const registerClick = () => {
    $('#register').on('click', () => {
        // register form;
        defaultView();
    });
}

/* LOGIN AREA */
const loginClick = () => {
    $('#login').on('click', () => {
        // login form;
        loginView();
    });
}

/* CLEAR INPUT */

const clearInput = () => {
    $('#inputEmail').val('');
    $('#inputPassword').val('');
}

$(document).ready(() => {
    if (!localStorage.token) {
        defaultView();
        registerClick();
        loginClick();

        $('#home').on('click', () => {
            defaultView();
        })
    } else {
        isLogin();
        // Show Todo Area
        $('#home').on('click', () => {
            isLogin();
        })
    }

    // Register Process
    $('#registerForm').submit((event) => {
        event.preventDefault();
        const payload = {
            email: $('#inputEmail').val(),
            password: $('#inputPassword').val()
        }

        register(payload).done(response => {
            $('#loginForm').show();
            $('#registerForm').hide();
            clearInput();
        }).fail(err => {
            defaultView();
        })
    })

    // Login Process

    $('#loginForm').submit((event) => {
        event.preventDefault();
        const payload = {
            email: $('#loginEmail').val(),
            password: $('#loginPassword').val()
        }
        console.log(payload)

        login(payload).done(response => {
            console.log(response)
            const token = response.token;
            localStorage.setItem('token', token);
            isLogin();
        }).fail(err => {
            loginView();
        })
    })


})

