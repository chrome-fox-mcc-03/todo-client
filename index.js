let message
let token
let title
let description
let status
let due_date
let email
let password
let userId
let todoId

// $( document ).ready(function() {})
    token = localStorage.getItem('token')
    if(token) {
        renderDashboard()
    } else {
        renderLanding()
    }


    $("#btn-register").on('click', function() {
        renderSignUp()
    })

    $("#btn-login").on('click', function() {
        renderSignIn()
    })

    $("#btn-logout").on('click', function() {
        localStorage.clear()
        renderSignIn()
    })


    // $("#signin-form").on("click")


function renderDashboard() {
    $("#signin-page").hide()
    $("#signup-page").hide()
    $("#dashboard-page").show()
    // showTodos()
}

function renderLanding() {
    $("#signin-page").show()
    $("#signup-page").hide()
    $("#dashboard-page").hide()
}

function renderSignUp() {
    $("#signup-page").show()
    $("#signin-page").hide()
    $("#dashboard-page").hide()
}

function renderSignIn() {
    $("#signup-page").hide()
    $("#signin-page").show()
    $("#dashboard-page").hide()
}

function login(event) {
    event.preventDefault()

    email = $("#signin-email").val()
    password = $("#signin-password").val()

    console.log(`Welcome Back to Todos App, ${email}`);

    $.ajax({
        method: "post",
        url: "http://localhost:4000/users/signin",
        data: {
            email,
            password
        }
    })
    .done(response => {


        console.log(`Register success, now generating token`);
        console.log(`response is`);
        console.log(response);
        localStorage.setItem('token', response.token)
       
        showTodos(event)
        renderDashboard()

    })
    .fail((err, msg) => {
        console.log(err);
        err.responseText = JSON.parse(err.responseText)
        $(".remarks").append(`<h3>${err.responseText.message}</h3>`)
    })


}

function showTodos(event) {
    event.preventDefault()
    $("#tbl-todo-data").empty()
    token = localStorage.getItem('token')
    $.ajax({
        method: "get",
        url: "http://localhost:4000/todos/",
        headers: {
            token: localStorage.getItem("token")
        }
    }).done(response => {
        console.log(`login success. showing todos`);
        console.log(response);
        console.log(`todos layer 1`);
        console.log(response.todos);

        
        response.todos.forEach(el => {
                $("#tbl-todo-data").append(`
                    <tr>
                        <td>${el.id}</td>
                        <td>${el.title}</td>
                        <td>${el.description}</td>
                        <td>${el.status}</td>
                        <td>${el.due_date}</td>
                        <td>DEfault</td>
                    </tr>
                `)
            })
         
        
    })
    .fail((err, msg) => {
        console.log(err);
        err.responseText = JSON.parse(err.responseText)
        $(".remarks").append(`<h3>${err.responseText.message}</h3>`)
    })


}

function register(event) {
        event.preventDefault()
       
        email = $("#signup-email").val()
        password = $("#signup-password").val()

        console.log(`Welcome to Todos App, ${email}`);

        $.ajax({
            method: "post",
            url: "http://localhost:4000/users/signup",
            data: {
                email,
                password
            }
        })
        .done(response => {
            console.log(`Register success, now generating token`);
            console.log(`response is`);
            console.log(response);
            // localStorage.setItem('token', response.token)
            const newUser = response.datum.email
            const tempMessage = response.datum.message
            message = `${tempMessage}. Welcome, ${newUser}.`

            $(".remarks").append(`<h3>${message}</h3>`)

            renderSignIn()

        })
        .fail((err, msg) => {
            console.log(err);
            err.responseText = JSON.parse(err.responseText)
            $(".remarks").append(`<h3>${err.responseText.message}</h3>`)
        })

}

function createTodo(event) {
    event.preventDefault()
    token = localStorage.getItem('token')
    
    console.log(`title to be created`);

    title = $("#create-todo-title").val()
    description = $("#create-todo-description").val()
    status = $(".create-todo-status").val()
    due_date = $("#create-todo-due_date").val()

    console.log(`testing`);
    console.log(`${title} ${description} ${status} ${due_date}`);
    
    $.ajax({
        method: "post",
        url: "http://localhost:4000/todos/",
        headers: {
            token:token
        },
        data: {
            title:title,
            description:description,
            status:status,
            due_date:due_date
        }
    })
    .done(response => {
        console.log(response);
    })
    .fail((err, msg) => {
        console.log(err);
        err.responseText = JSON.parse(err.responseText)
        $(".remarks").append(`<h3>${err.responseText.message}</h3>`)
    })

}

function onSignIn(googleUser) {
    let profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    let id_token = googleUser.getAuthResponse().id_token;

    $.ajax({
        method: "POST",
        url: "http://localhost/4000/googleSignin",
        headers: {
            token: id_token
        }
    })
    .done(response => {
        console.log(`successfully use oauth google sign in`);
        console.log(`response is: ${response}`);

        localStorage.setItem('token', response)
        showTodos(event)
    })
    .fail(err => {
        console.log(err);
        err.responseText = JSON.parse(err.responseText)
        $(".remarks").append(`<h3>${err.responseText.message}</h3>`)
    })


}
  