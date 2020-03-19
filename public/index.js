$(document).ready(function() {
    let token = localStorage.getItem('token')
    $("#addTodo-class").modal('hide')
    $("#updateTodo-class").modal('hide') 
    $("#errorMessage-login").empty()   

    if(token) {
        $("#dashboard-page").show()
        $("#register-page").hide()
        $("#login-page").hide()
        getTodos(token)
    }
    else {
        $("#dashboard-page").hide()
        $("#register-page").hide()
        $("#login-page").show()
    }

})

function login(event) {
    event.preventDefault()
    $("#errorMessage-login").empty()
    const email = $("#email-login").val();
    const password = $("#password-login").val();

    $.ajax({
        method: "POST",
        url: "http://localhost:3000/login",
        data: {
            email,
            password
        }
    })
        .done(function(response) {
            localStorage.setItem('token', response);
            $("#login-page").hide()
            $("#dashboard-page").show()
            getTodos(response)
            quotes()
        })
        .fail(function(err, msg) {
            err.responseText = JSON.parse(err.responseText)
            $("#errorMessage-login").append(err.responseText.message)
        })
}

function register(event) {
    $("#errorMessage-register").empty()

    event.preventDefault();
    const email = $("#email-register").val();
    const password = $("#password-register").val();

    $.ajax({
        method: "POST",
        url: "http://localhost:3000/register",
        data: {
            email,
            password
        }
    })
        .done(function(response) {
            localStorage.setItem('token', response);
            $("#login-page").hide()
            $("#register-page").hide()
            $("#dashboard-page").show()
            getTodos(response)
        })
        .fail(function(err, msg) {
            err.responseText = JSON.parse(err.responseText)
            let message = err.responseText.message[0]
            $("#errorMessage-register").append(message)
        })

}

function logout() {
    localStorage.removeItem('token');

    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });

    $("#dashboard-page").hide()
    $("#register-page").hide()
    $("#login-page").show()
}

function wantToRegister() {
    $("#dashboard-page").hide()
    $("#register-page").show()
    $("#login-page").hide()
}

function wantToLogin() {
    $("#register-page").hide()
    $("#login-page").show()
    $("#dashboard-page").hide()
}

function getTodos(token) {
    let status;
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/todos",
        headers: {
            token
        }
    })
        .done(function(response) {
            $("#todoLists").empty()
            response.todos.forEach((element, i) => {
                if(element.status) {
                    status = "Completed"
                }
                else {
                    status = "On Progress"
                }
                $("#todoLists").append(`
                <tr>
                    <td>${i+1}</td>
                    <td>${element.title}</td>
                    <td>${element.description}</td>
                    <td>${status}</td>
                    <td>${moment(element.due_date).format('LL')}</td>
                    <td>
                    <button onclick="updateTodoLanding(event, ${element.id})" type="button" data-toggle="modal" data-target="#updateTodo-class" class="btn btn-primary">Update</button>                    
                    <button onclick="deleteTodo(event, ${element.id})" type="button" class="btn btn-danger">Delete</button>
                    </td>
                </tr>
                `)
            })
        } )
        .fail(function(err, msg) {
            err.responseText = JSON.parse(err.responseText)
            $("#errorMessage").append(err.responseText.message)
        })
}

function onSignIn(googleUser) {

    let profile = googleUser.getBasicProfile();
   /*  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present. */
    let id_token = googleUser.getAuthResponse().id_token;

    $.ajax({
        method: "POST",
        url: "http://localhost:3000/googleLogIn",
        headers: {
            token: id_token
        }
    })
        .done(function(response) {
            localStorage.setItem('token', response)
            $("#dashboard-page").show()
            $("#register-page").hide()
            $("#login-page").hide()
            localStorage.setItem('token', response)
            quotes()
        })
        .fail(function(err, msg) {
            $("#errorMessage-login").empty()
            err.responseText = JSON.parse(err.responseText)
            $("#errorMessage-login").append(err.responseText.message)
        })

  }

function quotes() {

    $("#quotesOfTheDay").empty()
    $.ajax({
        method: "GE_T", // only 50 calls / month, if exceeded, will show given quotes, change to "GET" with caution! 
        url: "http://localhost:3000/todos/quotes"
    })
        .done(response => {
            let quote = response[0].quote
            let author = response[0].author
            $("#quotesOfTheDay").append(`
            <p id="quotes-title" >Your Quotes of The Day!</p>
            <p id="quotes"> ${quote} </p>
            <p id="author"> - ${author} </p>
            `)
        })
        .fail(err => {
            $("#quotesOfTheDay").append(`
            <p id="quotes-title" >Your Quotes of The Day!</p>
            <p id="quotes"> Astra inclinant, sed non obligant. </p> 
            <p id="author"> NOT Andreas Anggara </p>
            `)
            // Astra inclinant, sed non obligant means "The stars incline us, they do not bind us" in latin
        })
}

function createTodo(event) {
    event.preventDefault()
    $("#errorMessage-addTodo").empty()
    const title = $("#todo-title").val();
    const description = $("#todo-description").val();
    const due_date = $("#todo-due_date").val();
    let token = localStorage.getItem('token') 
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/todos",
        headers: {
            token  
        },
        data: {
            title,
            description,
            due_date
        }
    })
        .done(response => {
            getTodos(token)
            $("#dashboard-page").show()
            $("#register-page").hide()
            $("#login-page").hide()
            $("#addTodo-class").modal('toggle')

        })
        .fail(err => {
            err.responseText = JSON.parse(err.responseText)
            $("#errorMessage-addTodo").append(err.responseText.message[0])
        })
}

function deleteTodo(event, id) {
    event.preventDefault()
    let token = localStorage.getItem('token')
    $.ajax({
        method: "DELETE",
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            token
        }
    })
        .done(response => {
            getTodos(token)
            $("#dashboard-page").show()
            $("#register-page").hide()
            $("#login-page").hide()
        })
        .fail(err => {
            console.log(err);
        })
}

function updateTodo(event, id) {
    event.preventDefault()
    let token = localStorage.getItem('token')
    let title = $("#update-todo-title").val()
    let description = $("#update-todo-description").val()
    let due_date = $("#update-todo-due_date").val()
    let status = $("#update-todo-status").val()

    $.ajax({
        method: "PUT",
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            token
        },
        data: {
            title,
            description,
            due_date,
            status
        }
    })
        .done(response => {
            getTodos(token)
            $("#dashboard-page").show()
            $("#register-page").hide()
            $("#login-page").hide()
            $("#updateTodo-class").modal('toggle')
        })

        .fail(err => {
            console.log(err);
        })
}

function updateTodoLanding(event, id) {
    event.preventDefault()
    $("#updateTodo").attr("onsubmit", `updateTodo(event, ${id})`)

    let token = localStorage.getItem('token')
    $.ajax({
        method: "GET",
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            token
        }
    })
        .done(response => {
            let date = response.todo.due_date.substring(0,10)
            $("#update-todo-title").val(response.todo.title)
            $("#update-todo-description").val(response.todo.description)
            $("#update-todo-due_date").val(date)
            if(response.todo.status) {
                $("#status-true").attr("selected", "")
            }
            else {
                $("#status-false").attr("selected", "")
            }
        })

        .fail(err => {
            console.log(err);
        })
}