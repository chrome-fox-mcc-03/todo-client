const appName = "fancyTodoApp";
let appStorage = JSON.parse(localStorage.getItem(appName))

function saveState() {
    localStorage.setItem(appName, JSON.stringify(appStorage));
    appStorage = JSON.parse(localStorage.getItem(appName));
    load()
}
function load() {
    if(appStorage.message) {
        console.log(appStorage.message);
        delete appStorage.message;
    }
    if (appStorage.token) {
        $('#testLogin').show();
        $('#register-container').hide();
        $('#login-container').hide();
        $('#oauth-container').hide();
    } else {
        $('#testLogin').hide();
        $('#register-container').show();
        $('#login-container').show();
        $('#oauth-container').show();
    }
}
function logout() {
    delete appStorage.token;
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    saveState();
}
function login(email, password) {
    console.log('loading');
    // console.log(email, password)
    $.ajax({
        url: "http://localhost:3000/login",
        method: "POST",
        data: { email, password }
    })
    .done((response) => {
        //dapet token di sini
        appStorage.token = response;
        appStorage.httpCode = 200;
        $('#email-input').val('');
        $('#pass-input').val('');
    })
    .fail((response) => {
        // console.log(response.status, "yeh");
        appStorage.httpCode = response.status;
    })
    .always(() => {
        // console.log(response)
        // console.log('always bang');
        if (appStorage.httpCode === 200) {
            console.log("oke bang")
            saveState();
            // console.log(appStorage);
        } else {
            console.log("gagal bang")
            saveState();
        }
    });
}
function register(email, password, username = "User") {
    // console.log(email, password, username);
    $.ajax({
        url: "http://localhost:3000/register",
        method: "POST",
        data: { email, password }
    })
    .done((response) => {
        // console.log("done")
        appStorage.token = response.token;
        appStorage.httpCode = 201;
        $('#email-new').val('');
        $('#pass-new').val('');
        $('#name-new').val('');
    })
    .fail((response) => {
        // console.log("fail")
        appStorage.httpCode = response.status;
        appStorage.message = response.responseJSON.error[0]
    })
    .always(() => {
        // console.log("always")
        if (appStorage.httpCode === 201) {
            console.log("oke bang")
            saveState();
        } else {
            console.log("gagal bang")
            saveState();
        }
    });
}

$(document).ready(() => {
    if (!appStorage) {
        appStorage = {};
    }
    // console.log(appStorage, "<<<<");
    load()

    $("#register-form").on('keydown', (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            let email = $("#email-new").val();
            let pass = $("#pass-new").val();
            let name = $("#name-new").val();
            register(email, pass, name);
        }
    });
    $("#register-form").on('submit', () => {
        event.preventDefault();
        let email = $("#email-new").val();
        let pass = $("#pass-new").val();
        let name = $("#name-new").val();
        register(email, pass, name);
    })

    $("#login-form").on('keydown', (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            let email = $("#email-input").val();
            let pass = $("#pass-input").val();
            login(email, pass);
        }
    });
    $("#login-form").on('submit', () => {
        event.preventDefault();
        let email = $("#email-input").val();
        let pass = $("#pass-input").val();
        login(email, pass);
    })

    $("#logout-button").on('click', () => {
        event.preventDefault();
        logout();
        console.log(appStorage);
    })
});