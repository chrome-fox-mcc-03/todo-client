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
        response.forEach(el => $('#list-item').append(`
            <p>
            <h5><b>${el.title}</b></h5>
            ${el.description}<br>
            ${el.due_date}<br><br>
            <button type="button" class="btn btn-dark" onClick="editToDo(${el.id}, ['${el.title}', '${el.description}', '${el.status}', '${el.due_date}'])">Edit</button> | 
            <button type="button" class="btn btn-dark" onClick="deleteToDo(${el.id}, '${el.title}')">Delete</button></p><br>
            
            <!-- The Modal -->
            <div class="modal" id="editToDo">
                <div class="modal-dialog">
                <div class="modal-content">
                
                    <!-- Modal Header -->
                    <div class="modal-header">
                    <h4 class="modal-title">Edit To-Do item</h4>
                    <button type="button" class="btn btn-dark" data-dismiss="modal">Cancel</button>
                    </div>
                    
                    <!-- Modal body -->
                    <form id="add-todo">
                        <div class="modal-body">
                            <label for="title-add">Title:</label><br>
                            <input type="text" id="title-add"><br>
                            <label for="description-add">Description:</label><br>
                            <textarea form="add-todo" id="description-add" cols="35"></textarea><br>
                            <label for="due_date-add">Due Date:</label><br>
                            <input type="text" id="due_date-add" placeholder="Please use YYYY-MM-DD!"><br><br>
                        </div>
                        <div class="modal-footer">
                            <input type="submit" data-dismiss="modal" value="Create">
                        </div>
                    </form><br>
                    
                </div>
                </div>
            </div>

            `))
            // console.log(response)
    })
    .fail(function(err) {
        console.log(err, " <= It's an error.")
    })
}
function addButton() {
    $("#add-todo").submit(function(e) {
        e.preventDefault()
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
// function addToDo() {
//     $
// }

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