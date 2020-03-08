function showDashboard() {
    $("#landing-page").hide()
    $("#dashboard").show()
    addButton()
    $.ajax({
        method: 'get',
        url: "http://localhost:3000/todos",
        headers: {
            token: localStorage.getItem("token")
        }
        
    }).done(function(response) {
        $('#list-item').empty()
        response.forEach(el => {
        
        $('#list-item').append(`
        <section>
        <br>
        <div class="text">
            <p>
            <h5><b>${el.title}</b></h5>
            ${el.description}<br>
            <b>Done:</b> ${el.status}<br>
            <b>Due on: </b> ${el.due_date}<br><br>
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
                            <input class="input-one-line" type="text" id="due_date-edit-${el.id}" value="${el.due_date}" placeholder="Please use YYYY-MM-DD!"><br><br>
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

function submitEdit(id) {
    let title = $(`#title-edit-${id}`).val()
    let truth = ($(`#status-edit-${id}`).val() == "true")
    $(`#edit-todo-${id}`).submit(function() {
        $.ajax({
            method: "PUT",
            url: `http://localhost:3000/todos/${id}`,
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
        })
        .fail(err => console.log(err))
    })
}

function edit(id) {
    console.log(id)
    let title = $(`#title-edit-${id}`).val()
    let truth = ($(`#status-edit-${id}`).val() == "true")
    console.log({title: title, test: truth})
    $.ajax({
        method: "PUT",
        url: `http://localhost:3000/todos/${id}`,
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
        alert(`Updated item "${title}"`)
    })
    .fail(err => console.log(err))
    hideToDo(id)
}

function addButton() {
    $("#add-todo").submit(function() {
        $.ajax({
            method: "POST",
            url: "http://localhost:3000/todos",
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
        .fail(err => console.log(err))
    })

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
function editToDo(id, array) {
    console.log(id)
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
        showDashboard()
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