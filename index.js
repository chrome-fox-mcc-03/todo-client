$(document).ready(function () {
    if (!localStorage.token) {
        $("#welcome_container").show();
        $("#sign_up_container").hide();
        $("#home_page_container").hide();
        $("#edit_page_container").hide();
        $("#create_page_container").hide();
        $('#error_page').hide();
    } else {
        showTodo();
        $("#welcome_container").hide();
        $("#sign_up_container").hide();
        $("#home_page_container").show();
        $("#edit_page_container").hide();
        $("#create_page_container").hide();
        $('#error_page').hide();
    }
});

// SHOW PAGE ====================================================================

function signupShow() {
    // alert(`masuk signup`)
    $("#home_page_container").hide();
    $("#welcome_container").hide();
    $("#sign_up_container").show();
    $("#edit_page_container").hide();
    $("#create_page_container").hide();
    $('#error_page').hide();
}

function signinShow() {
    // alert(`masuk signup`)
    $("#home_page_container").hide();
    $("#welcome_container").show();
    $("#sign_up_container").hide();
    $("#edit_page_container").hide();
    $("#create_page_container").hide();
    $('#error_page').hide();
}

function cancelShow() {
    $("#home_page_container").hide();
    $("#welcome_container").show();
    $("#sign_up_container").hide();
    $("#edit_page_container").hide();
    $("#create_page_container").hide();
    $('#error_page').hide();
}

function editShow() {
    $("#home_page_container").hide();
    $("#welcome_container").hide();
    $("#sign_up_container").hide();
    $("#edit_page_container").show();
    $("#create_page_container").hide();
    $('#error_page').hide();
}

function createShow() {
    $("#home_page_container").hide();
    $("#welcome_container").hide();
    $("#sign_up_container").hide();
    $("#edit_page_container").hide();
    $("#create_page_container").show();
    $('#error_page').hide();
}

function homePageShow() {
    $("#home_page_container").show();
    $("#welcome_container").hide();
    $("#sign_up_container").hide();
    $("#edit_page_container").hide();
    $("#create_page_container").hide();
    $('#error_page').hide();
}

function showHome() {
    $("#home_page_container").show();
    $("#welcome_container").hide();
    $("#sign_up_container").hide();
    $("#edit_page_container").hide();
    $("#create_page_container").hide();
    $('#error_page').hide();
}

function showError() {
    $("#home_page_container").hide();
    $("#welcome_container").hide();
    $("#sign_up_container").hide();
    $("#edit_page_container").hide();
    $("#create_page_container").hide();
    $('#error_page').show();
}

// AJAX ====================================================================

function signup(event) {
    let email = $('#sign_up_email').val();
    let password = $('#sign_up_password').val();

    event.preventDefault();
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/users/signup",
        data: {
            email,
            password
        }
    })
    .done(function(data) {
        // console.log(`masuk`);
        showHome();
        localStorage.setItem('token', data.token);
    })
    .fail(function (error) {
        $('#errorMsg').empty()
        $('#errorMsg').append(`<div>${error.responseJSON}</div>`)
        $('#errorMsg').append(`<a onclick="signupShow()" id="create_todo_button">BACK</a>`)
        showError()
    })
}

function login(event) {
    // $("#sign_in_form").on("submit", (e) => {]
    let email = $("#email").val();
    let password = $("#password").val();

    event.preventDefault();
    // alert(`masuk login`);
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/users/signin",
        data: {
            email,
            password
        }
    })
        .done(function (data) {
            showHome();
            localStorage.setItem('token', data.token);
            showTodo();
        })
        .fail(function (error) {
            $('#errorMsg').empty()
            $('#errorMsg').append(`<div id="errorMsg">${error.responseJSON}</div>`) 
            $('#errorMsg').append(`<a onclick="signinShow()" id="create_todo_button">BACK</a>`)
            showError()
        })
}

function logout() {
    localStorage.clear();

    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    $("#home_page_container").hide();
    $("#welcome_container").show();
    $("#edit_page_container").hide();
}

function showTodo() {
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/todos",
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(function (todoData) {
            $("#show_todo").empty();
            for (let i = 0; i < todoData.length; i++) {
                $("#show_todo").append(`
                <div id="todo_text_container">
                    <div id="todo_text" onclick="showDescription(${todoData[i].id})">${todoData[i].title}</div>
                    
                    <div id="todo_text_edit">
                        <a id="todo_text_button" onclick="editTodo(${todoData[i].id}), editShow()">edit |</a> 
                        <a id="todo_text_button" onclick="deleteTodo(${todoData[i].id})">delete</a>
                    </div>
                </div>
                `);
            }
        })
        .fail(function (error) {
            $('#errorMsg').empty()
            $('#errorMsg').append(`<div id="errorMsg">${error.responseJSON}</div>`) 
            $('#errorMsg').append(`<a onclick="homePageShow()" id="create_todo_button">BACK</a>`)
            showError()
        })
}

function showDescription(id) {
    let todoId = id;
    
    $.ajax({
        method: "GET",
        url: `http://localhost:3000/todos/${todoId}`,
        headers: {
            token: localStorage.getItem('token')
        } 
    })
    .done(function (result) {
        // console.log(result);
        $('#show_description').empty();
        for (let i = 0; i < result.length; i++) {
            if(result[i].id == id) {
                let date = new Date(result[i].due_date).toISOString().substring(0, 10);
                $('#show_description').append(`
                <h1>${result[i].description}</h1>
                <h1 style="color:rgba(3,75,58,1)">Due Date:</h1> 
                <h1>${date}</h1>
                `)
            }
        }
    })
    .fail(function (error) {
        $('#errorMsg').empty()
        $('#errorMsg').append(`<div id="errorMsg">${error.responseJSON}</div>`) 
        $('#errorMsg').append(`<a onclick="homePageShow()" id="create_todo_button">BACK</a>`)
        showError()
    })
}


function editTodo(todoId) {
    let id = todoId;

    $.ajax({
        method: "GET",
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(function (editTodo) {
            let date = new Date(editTodo[0].due_date).toISOString().substring(0, 10);
            localStorage.setItem('id', editTodo[0].id);
            $("#edit_title").val(editTodo[0].title);
            $("#edit_description").val(editTodo[0].description);
            $("#edit_due_date").val(date);
        })
        .fail(function (error) {
            $('#errorMsg').empty()
            $('#errorMsg').append(`<div id="errorMsg">${error.responseJSON}</div>`) 
            $('#errorMsg').append(`<a onclick="editShow()" id="create_todo_button">BACK</a>`) 
            showError()
        })
}

function edit(event) {
    event.preventDefault();

    $.ajax({
        method: "PUT",
        url: `http://localhost:3000/todos/${localStorage.getItem('id')}`,
        headers: {
            token: localStorage.getItem('token')
        },
        data: {
            title: $("#edit_title").val(),
            description: $("#edit_description").val(),
            due_date: $("#edit_due_date").val()
        }
    })
        .done(function (result) {
            showHome();
            showTodo();
            console.log(result);
        })
        .fail(function (error) {
            $('#errorMsg').empty()
            $('#errorMsg').append(`<div id="errorMsg">${error.responseJSON}</div>`)
            $('#errorMsg').append(`<a onclick="editShow()" id="create_todo_button">BACK</a>`) 
            showError()
        })
}

function deleteTodo(todoId) {

    $.ajax({
        method: "DELETE",
        url: `http://localhost:3000/todos/${todoId}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(function (result) {
            showTodo()
            // console.log(`terhapus cuk`, result);
        })
        .fail(function (error) {
            $('#errorMsg').empty()
            $('#errorMsg').append(`<div id="errorMsg">${error.responseJSON}</div>`) 
            $('#errorMsg').append(`<a onclick="homePageShow()" id="create_todo_button">BACK</a>`)
            showError()
        })
}

function create(event) {
    event.preventDefault();
    
    $.ajax({
        method: "POST",
        url: `http://localhost:3000/todos`,
        headers: {
            token: localStorage.getItem('token')
        },
        data: {
            title: $("#create_title").val(),
            description: $("#create_description").val(),
            status: false,
            due_date: $("#due_date").val()
        }
    })
        .done(function (result) {
            showHome()
            showTodo()
        })
        .fail(function (error) {
            $('#errorMsg').empty()
            $('#errorMsg').append(`<div id="errorMsg">${error.responseJSON}</div>`) 
            $('#errorMsg').append(`<a onclick="createShow()" id="create_todo_button">BACK</a>`)
            showError()
        })
}


function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    // console.log(id_token)
    $.ajax({
        method: "POST",
        url: `http://localhost:3000/users/googleSignIn`,
        headers: {
            id_token
        }
    })
    .done(function (response) {
        // console.log(response);
        $("#welcome_container").hide();
        $("#sign_up_container").hide();
        $("#home_page_container").show();
        localStorage.setItem('token', response.token);
        showTodo();
    })
    .fail(function (error) {
        $('#errorMsg').empty()
        $('#errorMsg').append(`<div id="errorMsg">${error.responseJSON}</div>`) 
        $('#errorMsg').append(`<div id="errorMsg">${error.responseJSON}</div>`) 
        showError()
    })
}
