const appName = "fancyTodoApp";
let appStorage = JSON.parse(localStorage.getItem(appName))

function saveState() {
    localStorage.setItem(appName, JSON.stringify(appStorage));
    appStorage = JSON.parse(localStorage.getItem(appName));
    load()
}
function loadTodos() {
    // #todo-items
    // promptMessage('Test prompt')
    $('#todo-items').empty()
    $('#todo-items').append(`<progress class="progress is-small is-primary" max="100">15%</progress>`);

    if (appStorage.token) {
        $('#todo-items').empty()
        $('#todo-items').append(`<div class="box">Loading Items</div>`);
        $.ajax({
            url: "http://localhost:3000/todos",
            method: "GET",
            headers: {
                token: appStorage.token
            },
        })
        .done((response) => {
            $('#todo-items').empty()
            console.log(response);
            let list = response.todos;
            if (list.length > 0) {
            } else {
                $('#todo-items').append(`<div class="box">There is no To-do</div>`);
            }
        })
        .fail()
        .always((response) => {
            if (response.todos.length > 0) {
                $('#todo-items').empty()
                response.todos.forEach(item => {
                    let todo = TodoItem.create(item);
                    // console.log(todo);
                    $('#todo-items').append(todo.itemContent);
                })
                $("[class*='todo-delete-btn']").on("click", (event) => {
                    event.preventDefault()
                    // console.log(event);
                    console.log('delete', event.target.id)
                })
                $("[class*='todo-edit-btn']").on("click", (event) => {
                    event.preventDefault()
                    // console.log(event);
                    // console.log('edit', event.target.id)
                    // console.log($(event.target).parent()[0].children[2].innerHTML.split('Due date: ')[1]);
                    let date = $(event.target).parent()[0].children[2].innerHTML.split('Due date: ')[1];
                    let title = $(event.target).parent()[0].children[0].innerHTML;
                    let desc = $(event.target).parent()[0].children[1].innerHTML;
                    editTodo(event.target.id, {title, desc, date})
                })
                $("[class*='todo-details-btn']").on('click', (event) => {
                    event.preventDefault();
                    console.log('details', event.target.id);
                })
            }
        });
    } else {
        $('#todo-items').empty()
        $('#todo-items').append(`<div class="box">No Available user</div>`);
    }
}
function load() {
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
function promptMessage(msg) {
    $('#message-container').empty()
    $('#message-container').append(msg)
    setTimeout(() => {
        $('#message-container').empty()
    }, 2500)
}
function clearTodos() {
}
function editTodo(id, obj) {
    // $(event.target).parent();
    // console.log(Number(id));
    // console.log(obj);
    appStorage.editItemId = id;
    $("#edit-todo-modal-submit").toggleClass("is-loading");
    $("#edit-todo-modal").toggleClass("is-active");
    $('#edit-todo-error-msg').empty();
    // $('#edit-todo-modal > div.modal-card > section > div:nth-child(1) > div').toggleClass('is-loading');
    $('#edit-todo-modal > div.modal-card > section > div:nth-child(1) > div > input').val(obj.title)
    $('#edit-todo-modal > div.modal-card > section > div:nth-child(2) > div:nth-child(2) > textarea').val(obj.desc);
    $('input#due-date').val(obj.date);
    $.ajax({
        url: `http://localhost:3000/todos/${id}`,
        method: "GET",
        headers: {
            token: appStorage.token
        }
    })
    .done((response) => {
        console.log(response);
        $("#edit-todo-modal-submit").toggleClass("is-loading");
        $("#edit-todo-select-status").empty()
        $("#edit-todo-select-status").append(`<option ${response.todo.status === 'todo' ? "selected" : ""} value="todo">Todo</option>`)
        $("#edit-todo-select-status").append(`<option ${response.todo.status === 'completed' ? "selected" : ""} value="completed">Completed</option>`)
        // $("#edit-todo-select-status").on('change', () => {
        //     console.log($("#edit-todo-select-status").val())
        // })
    })
    .fail(() => {
        // gagal loding prompt message tutup modal
        $("#edit-todo-modal").toggleClass("is-active");
        promptMessage("Gagal mendapatkan detail todo")
    })
    .always(() => {
        // berhasil: form edit kasih value promptmessage
        // gagal: promptMessage close modal
    })
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