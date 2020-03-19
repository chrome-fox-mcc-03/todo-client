const appName = "fancyTodoApp";
let appStorage = JSON.parse(localStorage.getItem(appName))

function saveState() {
    localStorage.setItem(appName, JSON.stringify(appStorage));
    appStorage = JSON.parse(localStorage.getItem(appName));
    load()
}
function loadTodos() {
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
        })
        .fail()
        .always((response) => {
            if (response.todos.length > 0) {
                $('#todo-items').empty()
                response.todos.forEach(item => {
                    let todo = TodoItem.create(item);
                    $('#todo-items').append(todo.itemContent);
                })
                $("[class*='todo-edit-btn']").on("click", (event) => {
                    event.preventDefault()
                    let date = $(event.target).parent()[0].children[3].innerHTML.split('Due date: ')[1];
                    let title = $(event.target).parent()[0].children[0].innerHTML;
                    let desc = $(event.target).parent()[0].children[2].innerHTML;
                    let status = $(event.target).parent()[0].children[1].innerHTML;
                    editTodo(event.target.id, {title, desc, date, status})
                })
                $("[class*='todo-details-btn']").on('click', (event) => {
                    event.preventDefault();
                    detailsTodo(event.target.id)
                })
                $("[class*='todo-delete-btn']").on("click", (event) => {
                    event.preventDefault()
                    deleteTodo(event.target.id);
                })
            } else {
                $('#todo-items').append(`<div class="box">You have nothing To-do</div>`);
            }
        });
    } else {
        $('#todo-items').empty()
        $('#todo-items').append(`<div class="box">No Available user</div>`);
    }
}
function load() {
    if(appStorage.message) {
        delete appStorage.message;
    }
    if (appStorage.token) {
        $('#testLogin').show();
        $('#register-container').hide();
        $('#login-container').hide();
        $('#oauth-container').hide();

        $('.todouser-dashboard').show();
        $('.landing').hide();

        if (appStorage.userName) {
            $("#navbar-name-container").empty()
            $("#navbar-name-container").append(`Hello, ${appStorage.userName}`)
            setTimeout(() => {
                $('#navbar-name-container').empty()
            }, 2500)
            $(".todo-user-profile-container").empty()
            $(".todo-user-profile-container").append(`<p>Name: ${appStorage.userName}</p>`)
        } else {
            $("#navbar-name-container").empty()
        }
        if (appStorage.avaURL) {
            $(".todo-user-profile-container").append(`<img src="${appStorage.avaURL}">`)
        } else {
            $(".todo-user-profile-container").empty();
            $(".todo-user-profile-container").append(`<img src="https://api.adorable.io/avatars/120/${appStorage.token}@token.png">`)
        }
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
    appStorage = {};
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    loadElements();
    saveState();
    $('#front-message').append(`<p class="help is-success">User signed out</p>`);
}
function login(email, password) {
    $.ajax({
        url: "http://localhost:3000/login",
        method: "POST",
        data: { email, password }
    })
    .done((response) => {
        appStorage.token = response;
        appStorage.httpCode = 200;
        $('#email-input').val('');
        $('#pass-input').val('');
    })
    .fail((response) => {
        appStorage.httpCode = response.status;
        appStorage.msg = response.responseJSON.error;
    })
    .always(() => {
        if (appStorage.httpCode === 200) {
            saveState();
        } else {
            if (appStorage.msg) {
                $('#login-warning').empty();
                $('#login-warning').append(`<p class="help is-danger">${appStorage.msg}</p>`);
                delete appStorage.msg
            }
        }
    });
}
function register(email, password, username = "User") {
    $.ajax({
        url: "http://localhost:3000/register",
        method: "POST",
        data: { email, password }
    })
    .done((response) => {
        appStorage.token = response.token;
        appStorage.httpCode = 201;
        $('#email-new').val('');
        $('#pass-new').val('');
        $('#name-new').val('');
    })
    .fail((response) => {
        appStorage.httpCode = response.status;
        appStorage.messages = response.responseJSON.error
    })
    .always(() => {
        if (appStorage.httpCode === 201) {
            saveState();
        } else {
            if (appStorage.messages) {
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
    $('#message-container').append(`<br><p class="help">${msg}</p>`)
    setTimeout(() => {
        $('#message-container').empty()
    }, 2500)
}
function editTodo(id, obj) {
    appStorage.editItemId = id;
    $("#edit-todo-modal-submit").toggleClass("is-loading");
    $("#edit-todo-modal").toggleClass("is-active");
    $('#edit-todo-error-msg').empty();
    $('#edit-todo-modal > div.modal-card > section > div:nth-child(1) > div > input').val(obj.title)
    $('#edit-todo-modal > div.modal-card > section > div:nth-child(2) > div:nth-child(2) > textarea').val(obj.desc);
    $('input#edit-due-date').val(obj.date);
    $("#edit-todo-select-status").append(`<option selected value="${obj.status}">${obj.status}</option>`)
    $.ajax({
        url: `http://localhost:3000/todos/${id}`,
        method: "GET",
        headers: {
            token: appStorage.token
        }
    })
    .done((response) => {
        $("#edit-todo-modal-submit").toggleClass("is-loading");
        $("#edit-todo-select-status").empty()
        $("#edit-todo-select-status").append(`<option ${response.todo.status === 'todo' ? "selected" : ""} value="todo">Todo</option>`)
        $("#edit-todo-select-status").append(`<option ${response.todo.status === 'completed' ? "selected" : ""} value="completed">Completed</option>`)
    })
    .fail(() => {
        $("#edit-todo-modal").toggleClass("is-active");
        promptMessage("Gagal mendapatkan detail todo")
    })
}
function detailsTodo(id) {
    $("#details-todo-contents").empty()
    $("#details-todo-contents").append(`
    <p class="help">Loading</p>
    <progress class="progress is-small is-primary" max="100"></progress>`);
    $("#details-todo-modal").toggleClass("is-active");
    $.ajax({
        url: `http://localhost:3000/todos/${id}`,
        method: "GET",
        headers: {
            token: appStorage.token
        }
    })
    .done(response => {
        let todo = response.todo;
        let holidays = response.holidays;
        $("#details-todo-contents").empty()

        let title = `<p class="modal-card-title">${todo.title}`;
        let desc = `<p class="">${todo.description}`;
        let status = `<p class="">Status: ${todo.status}`;
        let due_date = `<p class="">Ekspektasi terlaksana: ${todo.due_date.split('T')[0]}`;
        $("#details-todo-contents").append(title);
        $("#details-todo-contents").append(desc);
        $("#details-todo-contents").append(status);
        $("#details-todo-contents").append(due_date);
        
        if (holidays.length > 0) {
            $("#details-todo-contents").append(`<br><p>Sampai tanggal ekspektasi anda akan melewati liburan-liburan berikut: </p>`);
            holidays.forEach(item => {
                $("#details-todo-contents").append(`<p>${item.date} : ${item.holiday}</p>`);
            })
        } else {
            $("#details-todo-contents").append(`<br><p>Tidak ada hari libur nasional sampai tanggal ekspektasi terlaksana</p>`);
        }
    })
    .fail(response => {
        $("#details-todo-contents").empty()
        $("#details-todo-contents").append(`<p class="help is-danger">${response.responseJSON.error}</p>`);
    })
}
function deleteTodo(id) {
    appStorage.deleteItemId = id;
    $("#delete-todo-modal").toggleClass("is-active");
}

$(document).ready(() => {
    if (!appStorage) {
        appStorage = {};
    }
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

    $(".todo-user-logout").on('click', () => {
        event.preventDefault();
        logout();
    })
});