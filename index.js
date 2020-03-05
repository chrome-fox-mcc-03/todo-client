function showLandingPage() {
    $("#landing-page").show()
    $("#section-register").hide()
    $("#section-login").hide()
    $("#dashboard-page").hide()
    $("#button-logout").hide()
   
    
}

function showRegister() {
    $("#section-register").show()
    $("#section-login").hide()
    $("#dashboard-page").hide()
    $("#landing-page").hide()
}

function showLogin() {
    $("#section-register").hide()
    $("#section-login").show()
    $("#dashboard-page").hide()
    $("#landing-page").hide()
}

function showDashboard() {
    $("#section-register").hide()
    $("#section-login").hide()
    $("#dashboard-page").show()
    $("#landing-page").hide()
    $("#button-logout").show()
}

function isLogin() {
    if (localStorage.getItem('token')) {
        return true
        
    } else {
        return false
    }
}
function fetchTodos() {
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/todos",
        headers: {
            token: localStorage.getItem("token")
        }
    }).done(function (response) {
        $('#table-todo').empty()
        $('#table-todo').append(`
                <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Due Date</th>
                </tr>
            `)
        response.forEach(el => {
            const due_date = new Date(el.due_date).toLocaleDateString()
            $('#table-todo').append(`
                    <tr>
                        <td>${el.title}</td>
                        <td>${el.description}</td>
                        <td>${el.status === true ? 'complete' : 'uncomplete'}</td>
                        <td>${due_date}</td>
                    </tr>
                `)
        })
    }).fail(function (err, msg) {
        console.log(msg);
    })
}

function onSignIn(googleUser) {
    // var profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    var id_token = googleUser.getAuthResponse().id_token
    // console.log(id_token)
    $.ajax({
        url: 'http://localhost:3000/users/googleLogin',
        method: 'POST',
        data: { id_token }
    })
        .done(({ token }) => {
            localStorage.token = token
            showDashboard(true)
            fetchTodos()
        })
        .fail(err => {
            console.log(err)
        })
}

$(document).ready(function () {
    showLandingPage()
    const token = localStorage.getItem("token")

    $("#button-register").on("click", function () {
        showRegister()
        $("#button-logout").hide()
        
    })

    $("#button-home").on("click", function () {
        showLandingPage()
        $("#button-register").show()
        $("#button-login").show()
       
       
    })

    $("#button-login").on("click", function () {
        showLogin()
        $("#button-logout").hide()

    })

    $("#form-signup").on("submit", function (e) {
        e.preventDefault()
        const email = $("#email").val()
        const password = $("#password").val()
        $.ajax({
            method: "POST",
            url: "http://localhost:3000/users/register",
            data: {
                email,
                password
            }
        }).done(function (response) {
            localStorage.setItem("token", response)
            showDashboard()
            fetchTodos()
        }).fail(function (err) {
            console.log(err, "error")
        })
    })

    $("#form-login").on("submit", function (e) {
        e.preventDefault()
        const email = $("#email_login").val()
        const password = $("#password_login").val()
        $.ajax({
            method: "POST",
            url: "http://localhost:3000/users/login",
            data: {
                email,
                password
            }
        }).done(function (response) {
            localStorage.setItem("token", response)
            showDashboard()
            fetchTodos()
        })
    })

    $("#button-logout").on("click", function () {
        console.log("logout")
        const auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
        });
        localStorage.clear()
        showLandingPage()
        $("#button-register").show()
        $("#button-login").show()
    })
})
