let localhost = `http://localhost:3000`
let heroku = `https://infinite-taiga-37673.herokuapp.com`

function showDashboard() {
    $("#landing-page").hide()
    $("#dashboard").show()
    addButton()
    $.ajax({
        method: 'get',
        url: `${heroku}/todos`,
        headers: {
            token: localStorage.getItem("token")
        }
        
    }).done(function(response) {
        $('#list-item').empty()
        response.forEach(el => {
        let date = new Date(el.due_date)
        $('#list-item').append(`
        <section>
        <br>
        <div class="text">
            <p>
            <h5><b>${el.title}</b></h5>
            ${el.description}<br>
            <b>Done:</b> ${el.status}<br>
            <b>Task due on: </b> ${date}<br><br>
            <button type="button" class="edit-or-delete" onClick="showToDo(${el.id})">Edit</button> | 
            <button type="button" class="edit-or-delete" onClick="deleteToDo(${el.id}, '${el.title}')">Delete</button>
            </p>
        </div>
        <section>
        <form id="edit-todo-${el.id}">
                        <div class="edit-form">
                            <label for="title-edit-${el.id}">Title:</label><br>
                            <input class="input-one-line"  type="text" id="title-edit-${el.id}" value="${el.title}"><br>
                            <label for="description-edit-${el.id}">Description:</label><br>
                            <textarea form="edit-todo" id="description-edit-${el.id}" cols="35" placeholder="Describe this activity!">${el.description}</textarea><br>
                            <label for="status-edit-${el.id}">Done?</label><br>
                            <select class="due-date" id="status-edit-${el.id}">
                            <option value=true>true</option>
                            <option value=false>false</option>
                            </select><br>
                            <label for="due_date-edit-${el.id}">Due Date:</label><br>
                            <input class="input-one-line" type="date" id="due_date-edit-${el.id}" value="${el.due_date}" placeholder="Please use YYYY-MM-DD!"><br><br>
                            <button type="button" class="pinkbutton" onClick="edit(${el.id})">Post</button>
                            <button type="button" class="edit-or-delete" onClick="hideToDo(${el.id})">Cancel</button>
                        </div>
                    </form>
            `)
        hideToDo(el.id)
        // submitEdit(el.id)
        })
            // console.log(response)
    })
    .fail(function(err) {
        
        console.log(err, " <= It's an error.")
    })
}

function showToDo(id) {
    $(`#edit-todo-${id}`).show()
}

function hideToDo(id) {
    $(`#edit-todo-${id}`).hide()
}

function edit(id) {
    console.log(id)
    let title = $(`#title-edit-${id}`).val()
    let truth = ($(`#status-edit-${id}`).val() == "true")
    console.log({title: title, test: truth})
    $.ajax({
        method: "PUT",
        url: `${heroku}/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        },
        data: {
            title: $(`#title-edit-${id}`).val(),
            description: $(`#description-edit-${id}`).val(),
            status: truth,
            due_date: $(`#due_date-edit-${id}`).val()
        }
    }).done(response => {
        console.log(response)
        console.log(`Updated item "${title}"`)
        showDashboard()
        $('#alert').append(`Updated item "${title}"`)
        $('#alert').fadeTo(2000, 500).slideUp(500, function(){
            $("#alert").slideUp(500);
            $('#alert').empty()
        })
    })
    .fail(err => {
        err.responseJSON.forEach(el => {
            $('#alert').append(`${el}<br>`)
            $('#alert').fadeTo(2000, 500).slideUp(500, function(){
                $("#alert").slideUp(500);
                $('#alert').empty()
            })
        })
    })
    hideToDo(id)
}

function addButton() {
    $("#add-todo").submit(function(e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: `${heroku}/todos`,
            headers: {
                token: localStorage.getItem('token')
            },
            data: {
                title: $("#title-add").val(),
                description: $("#description-add").val(),
                status: false,
                due_date: $("#due_date-add").val()
            }
        }).done(response => {
            console.log(response.title)
            console.log("added one item")
            // $('#addToDoModal').modal('toggle')
            showDashboard()
        })
        .fail(err => {
            err.responseJSON.forEach(el => {
                $('#alert').append(`${el}<br>`)
                $('#alert').fadeTo(2000, 500).slideUp(500, function(){
                    $("#alert").slideUp(500);
                    $('#alert').empty()
                })
            })
        })
    })

}
function showLandingPage() {
    $("#landing-page").show()
    $("#dashboard").hide()
}


function deleteToDo(id, title) {
    $.ajax({
        method: "DELETE",
        url: `${heroku}/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    }).done(deleted => {
        console.log(deleted)
        showDashboard()
        $('#alert').append(`To-Do "${title}" has been deleted.`)
        $('#alert').fadeTo(2000, 500).slideUp(500, function(){
            $("#alert").slideUp(500);
            $('#alert').empty()
        })
        return
    })
    .fail(err => {
        console.log(err)
        $('#alert').append(err.responseJSON)
        $('#alert').fadeTo(2000, 500).slideUp(500, function(){
            $("#alert").slideUp(500);
            $('#alert').empty()
        })
        return
    })
}

function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    // console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    // console.log('Full Name: ' + profile.getName());
    // console.log('Given Name: ' + profile.getGivenName());
    // console.log('Family Name: ' + profile.getFamilyName());
    // console.log("Image URL: " + profile.getImageUrl());
    // console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    // console.log("ID Token: " + id_token);

    $.ajax({
        method: "POST",
        url: `${heroku}/users/googleSignIn`,
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
    $('#alert').hide()
    let token = localStorage.getItem("token")
    if(token !== localStorage.token) {
        // alert('Hi!')
        showLandingPage()
        $('#login').submit(function(e) {
            e.preventDefault()
            $.ajax({
                method: "POST",
                url: `${heroku}/users/login`,
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
                $('#alert').append(err.responseJSON)
                $('#alert').fadeTo(2000, 500).slideUp(500, function(){
                    $("#alert").slideUp(500);
                    $('#alert').empty()
                })
                console.log(err.responseJSON)
                console.log(err, " <= It's an error.")
            })
        })
        $('#register').submit(function(e) {
            e.preventDefault()
            $.ajax({
                method: "POST",
                url: `${heroku}/users/register`,
                data: {
                    email: $('#email-register').val(),
                    password: $("#password-register").val()
                }
            }).done(function(response) {
                localStorage.setItem("token", response.token)
                // localStorage.setItem("id", response.token)
                showDashboard()
                console.log(response, " <= It's in.")
            })
            .fail(function(err) {
                // alert(err.responseJSON)
                $('#alert').append(err.responseJSON)
                $('#alert').fadeTo(2000, 500).slideUp(500, function(){
                    $("#alert").slideUp(500);
                    $('#alert').empty()
                })
                console.log(err.responseJSON)
                console.log(err, " <= It's an error.")
            })
        })
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