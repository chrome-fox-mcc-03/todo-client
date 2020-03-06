$(document).ready(function () {
    if (!localStorage.token) {
        $("#sign_up_page").hide();
        $("#home_page").hide();
        $("#welcome_container").show();
        $("#edit_page").hide();
        $("#create_page").hide();
    } else {
        showTodo();
        $("#welcome_container").hide();
        $("#sign_up_page").hide();
        $("#home_page").show();
        $("#edit_page").hide();
        $("#create_page").hide();
    }
});

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
            // console.log(token);
            $("#welcome_container").hide();
            $("#sign_up_page").hide();
            $("#home_page").show();
            // console.log(`sign in success <<<<<<<<<<<<<<<<<<, ${token}`);
            localStorage.setItem('token', data.token);
            showTodo();
        })
        .fail(function (err) {
            console.log(err);

        })
    // });
}

function logout() {
    // $("#logout_button").on("click", () => {
    // console.log(`masoooooooooooook`);
    localStorage.clear();


    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });


    $("#home_page").hide();
    // alert('masuk logout')
    $("#welcome_container").show();
    $("#edit_page").hide();
    // })
}

function signupShow() {
    // alert(`masuk signup`)
    $("#home_page").hide();
    $("#welcome_container").hide();
    $("#sign_up_page").show();
    $("#edit_page").hide();
    $("#create_page").hide();
}

function cancelShow() {
    $("#home_page").hide();
    $("#welcome_container").show();
    $("#sign_up_page").hide();
    $("#edit_page").hide();
    $("#create_page").hide();
}

function editShow() {
    $("#home_page").hide();
    $("#welcome_container").hide();
    $("#sign_up_page").hide();
    $("#edit_page").show();
    $("#create_page").hide();
}

function createShow() {
    $("#home_page").hide();
    $("#welcome_container").hide();
    $("#sign_up_page").hide();
    $("#edit_page").hide();
    $("#create_page").show();
}

function showHome() {
    $("#home_page").show();
    $("#welcome_container").hide();
    $("#sign_up_page").hide();
    $("#edit_page").hide();
    $("#create_page").hide();
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
            // console.log(`masukkkkkk show todo`);
            // console.log(todoData);
            $("#show_todo").empty();
            for (let i = 0; i < todoData.length; i++) {
                $("#show_todo").append(`<p>${todoData[i].title} | <button onclick="editTodo(${todoData[i].id}), editShow()">edit</button> | <button onclick="deleteTodo(${todoData[i].id})">delete</button></p>`);
            }
        })
        .fail(function (error) {
            console.log(error);
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
            console.log(error);
        })
}

function edit(event) {
    // console.log($("#edit_description").val());

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
            // console.log(`masuk edit cuk`);
            showHome();
            showTodo();
            console.log(result);
        })
        .fail(function (error) {
            console.log(error);
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
            console.log(`error edit cuk`, error);
        })
}

function create(event) {
    event.preventDefault();
    // console.log(`masuk cuk`);

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
            // console.log(`created cuk`, result);
        })
        .catch(function (error) {
            console.log(`error create cuk`, error);
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
        $("#sign_up_page").hide();
        $("#home_page").show();
        localStorage.setItem('token', response.token);
        showTodo();
    })
    .catch(function (error) {
        // console.log('check')
        console.log(error);
    })
}
