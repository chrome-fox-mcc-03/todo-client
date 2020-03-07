function showDashboard() {
    $("#landing-page").hide()
    $("#dashboard").show()
    $.ajax({
        method: 'get',
        url: "http://localhost:3000/todos",
        headers: {
            token: localStorage.getItem("token")
        }
        
    }).done(function(response) {
        $('#list-item').empty()
        response.forEach(el => $('#list-item').append(`
            <p>
            <b>${el.title}</b><br>
            ${el.description}<br>
            ${el.due_date}<br>
            <button type="button" class="btn btn-dark" onClick="editToDo(${el})">Edit</button> | 
            <button type="button" class="btn btn-dark" onClick="deleteToDo(${el.id}, '${el.title}')">Delete</button></p><br>`))
            // console.log(response)
    })
    .fail(function(err) {
        console.log(err, " <= It's an error.")
    })
}
function editButton() {

}
function showLandingPage() {
    $("#landing-page").show()
    $("#dashboard").hide()
}
// function editToDo() {
//     $("#edit").click()
// }

// function showEditPage() {

// }
function editToDo(object) {
    console.log(object)
}
function addToDo() {
    $
}

function deleteToDo(id, title) {
    $.ajax({
        method: "DELETE",
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    }).done(deleted => {
        console.log(deleted)
        return alert(`To-Do ~${title}~ has been deleted.`)
    })
    .fail(err => {
        console.log(err)
        return alert(err)
    })
}

function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);

    $.ajax({
        method: "POST",
        url: "http://localhost:3000/users/googleSignIn",
        headers: {
            token: id_token
        }
    }).done(function(response) {
        console.log({
            response: response,
            msg: "Sent google token to server. Received server token."
        })
        localStorage.setItem("token", response.token)
        showDashboard()
    })
    .fail(function(err) {
        console.log(err, "<= It's an error")
    })
}

$(document).ready(function() {
    let token = localStorage.getItem("token")
    if(token !== localStorage.token) {
        // alert('Hi!')
        showLandingPage()
        $('#login').submit(function(e) {
            e.preventDefault()
            $.ajax({
                method: "POST",
                url: "http://localhost:3000/users/login",
                data: {
                    email: $('#email-login').val(),
                    password: $("#password-login").val()
                }
            }).done(function(response) {
                localStorage.setItem("token", response.token)
                // localStorage.setItem("id", response.token)
                showDashboard()
                console.log(response, " <= It's in.")
            })
            .fail(function(err) {
                console.log(err, " <= It's an error.")
            })
        })
        onSignIn(googleUser)
    } else {
        showDashboard()
        $("#btn-logout").click(function() {
            localStorage.clear()
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
            console.log('User signed out.');
            });
            showLandingPage()
        })
    }
})