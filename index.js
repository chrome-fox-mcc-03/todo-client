
$(document).ready(function() {
    let token = localStorage.getItem('token')
    
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
    const email = $("#email-login").val();
    const password = $("#password-login").val();
    $("#errorMessage").empty()

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
                $("#todoLists").append(`
                <tr>
                    <td>${i+1}</td>
                    <td>${element.title}</td>
                    <td>${element.description}</td>
                    <td>${response.status === "true" ? "Completed"  : "On Progress"}</td>
                    <td>${moment(element.due_date).format('LL')}</td>
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
            getTodos(response)
        })
        .fail(function(err, msg) {
            err.responseText = JSON.parse(err.responseText)
            $("#errorMessage-login").append(err.responseText.message)
        })

  }

  function quotes() {

        $("#quotesOfTheDay").empty()
        $.ajax({
            method: "GEaasdasdT", // only 50 calls / day, if exceeded, will show given quotes, change to "GET" with caution! 
            url: "http://localhost:3000/todos/quotes"
        })
            .done(response => {
                let quote = response[0].quote
                let author = response[0].author
                $("#quotesOfTheDay").append(`
                <p id="quotes"> ${quote} </p>
                <p id="author"> - ${author} </p>
                `)
            })
            .fail(err => {
                $("#quotesOfTheDay").append(`
                <p id="quotes"> Astra inclinant, sed non obligant. </p>
                <p id="author"> NOT Andreas Anggara </p>
                `)
            })
  }