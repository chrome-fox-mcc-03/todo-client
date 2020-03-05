const appName = "fancyTodoApp";
let appStorage = JSON.parse(localStorage.getItem(appName))

function saveState() {
    localStorage.setItem(appName, JSON.stringify(appStorage));
    appStorage = JSON.parse(localStorage.getItem(appName));
    load()
}
function load() {
    $('#front-message').empty()
    if(appStorage.message) {
        // console.log(appStorage.message);
        delete appStorage.message;
    }
    if (appStorage.token) {
        $('#testLogin').show();
        $('#register-container').hide();
        $('#login-container').hide();
        $('#oauth-container').hide();

        $('.todouser-dashboard').show();
        $('.landing').hide();
    } else {
        $('#testLogin').hide();
        $('#register-container').show();
        $('#login-container').show();
        $('#oauth-container').show();

        $('.todouser-dashboard').hide();
        $('.landing').show();
    }
    loadTodos()
}
function logout() {
    delete appStorage.token;
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    loadElements();
    saveState();
    $('#front-message').append(`<p class="help is-success">User signed out</p>`);
}
function login(email, password) {
    // console.log('loading');
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
        // console.log(response)
        appStorage.httpCode = response.status;
        appStorage.msg = response.responseJSON.error;
    })
    .always(() => {
        // console.log('always bang');
        if (appStorage.httpCode === 200) {
            // console.log("oke bang")
            // console.log(appStorage);
            saveState();
        } else {
            // console.log("gagal bang")
            if (appStorage.msg) {
                // $('#login-warning').val(appStorage.msg)
                $('#login-warning').empty();
                $('#login-warning').append(`<p class="help is-danger">${appStorage.msg}</p>`);
                // $("#login-warning").val("Yeh");
                delete appStorage.msg
                // $("#login-warning").toggleClass("is-in");
            }
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
        // console.log(response);
        appStorage.httpCode = response.status;
        appStorage.messages = response.responseJSON.error
    })
    .always(() => {
        // console.log("always")
        if (appStorage.httpCode === 201) {
            // console.log("oke bang")
            saveState();
        } else {
            if (appStorage.messages) {
                // console.log(appStorage.messages)
                let messages = appStorage.messages;
                if (!Array.isArray(messages)) {
                    messages = [messages]
                } else {
                    
                }
                $('#register-warning').empty();
                messages.forEach(msg => {
                    $('#register-warning').append(`<p class="help is-danger">${msg}</p>`);
                })
                delete appStorage.messages
            }
            saveState();
        }
    });
}
function loadTodos() {
    // #todo-items
    if (appStorage.token) {
        $.ajax({
            url: "http://localhost:3000/todos",
            method: "GET",
            headers: {
                token: appStorage.token
            },
        })
        .done((response) => {
            $('#todo-items').empty()
            $('#todo-items').append(`<div class="box">Loading Items Bang</div>`);
        })
        .fail()
        .always((response) => {
            if (response.todos.length > 0) {
                $('#todo-items').empty()
                response.todos.forEach(item => {
                    let todo = TodoItem.create(item);
                    $('#todo-items').append(todo.itemContent);
                })
            }
        });
    }
}
function clearTodos() {
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
        // console.log(appStorage);
    })
});