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
let datum

// $( document ).ready(function() {})
    token = localStorage.getItem('token')
    if(token) {
        renderDashboard() //LOGIN
    } else {
        renderLanding()
    }


    $("#btn-register").on('click', function() {
        renderSignUp()
    })

    $("#btn-login").on('click', function() {
        renderSignIn()
    })

    $(".btn-logout").on('click', function() {
        localStorage.clear()
        renderSignIn()
    })

    $(".btn-back2Home").on("click", function() {
        renderDashboard()
    })

    $("#btn-create-todo").on("click", function() {
        renderAddForm()
    })

    


    // $("#signin-form").on("click")

function renderAddForm() {
    $("#signin-page").hide()
    $("#signup-page").hide()
    $("#dashboard-page").hide()
    $("#pg-create-todo").show()
    $("#pg-update-todo").hide()
    $("#pg-delete-todo").hide()
    $(".error-msg").empty()
}

function renderDashboard() {
    $("#signin-page").hide()
    $("#signup-page").hide()
    $("#dashboard-page").show()
    $("#pg-create-todo").hide()
    $("#pg-update-todo").hide()
    $("#pg-delete-todo").hide()
    $(".error-msg").empty()
}

function renderLanding() {
    $("#signin-page").show()
    $("#signup-page").hide()
    $("#dashboard-page").hide()
    $("#pg-create-todo").hide()
    $("#pg-update-todo").hide()
    $("#pg-delete-todo").hide()
    $(".error-msg").empty()
}

function renderSignUp() {
    $("#signin-page").hide()
    $("#signup-page").show()
    $("#dashboard-page").hide()
    $("#pg-create-todo").hide()
    $("#pg-update-todo").hide()
    $("#pg-delete-todo").hide()
    $(".error-msg").empty()
}

function renderSignIn() {
    $("#signin-page").show()
    $("#signup-page").hide()
    $("#dashboard-page").hide()
    $("#pg-create-todo").hide()
    $("#pg-update-todo").hide()
    $("#pg-delete-todo").hide()
    $(".error-msg").empty()
}

function login(event) {
    event.preventDefault()

    email = $("#signin-email").val()
    password = $("#signin-password").val()

    console.log(`Welcome Back to Todos App, ${email}. Please login first`);

    $.ajax({
        method: "post",
        url: `http://localhost:4000/users/signin`,
        data: {
            email,
            password
        }
    })
    .done(response => {


        console.log(`LOGIN SUCCESS, NOW CREATING TOKEN`);
        console.log(`RESPONSE IS`);
        console.log(response);
        localStorage.setItem('token', response.token)
       
        showTodos(event)
        renderDashboard()

    })
    .fail(err => {
        console.log(`main error is`);
        console.log(err);
        console.log(`the response text is`);
        console.log(err.responseText);
        $(".error-msg").empty()
        $(".error-msg").append(`<h3>${err.responseText}</h3>`)
    })



}

function renderEditForm() {
    $("#signin-page").hide()
    $("#signup-page").hide()
    $("#dashboard-page").hide()
    $("#pg-create-todo").hide()
    $("#pg-update-todo").show()
    $("#pg-delete-todo").hide()
    $(".error-msg").empty()
}

function showTodos(event) {
    event.preventDefault()
    $(".error-msg").empty()

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
                        <td>

                        <button id="btn-go2-edit-form" onclick="editFormTodo(${el.id}, event)">UPDATE</button> || 
                        <button id="btn-delete-todo" onclick="deleteTodo(${el.id}, event)">DELETE</button>
                        
                        </td>
                    </tr>
                `)
            })
    })
    .fail(err => {
        console.log(`main error is`);
        console.log(err);
        console.log(`the response text is`);
        console.log(err.responseText);
        $(".error-msg").empty()
        $(".error-msg").append(`<h3>${err.responseText}</h3>`)
    })


}

function register(event) {
        event.preventDefault()
        $(".error-msg").empty()
        $(".success-msg").empty()

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

            $(".success-msg").append(`<h3>${message}</h3>`)

            renderSignIn()

        })
        .fail(err => {
            console.log(`main error is`);
            console.log(err);
            console.log(`the response text is`);
            console.log(err.responseText);
            $(".error-msg").empty()
            $(".error-msg").append(`<h3>${err.responseText}</h3>`)
        })

}

function createTodo(event) {
    event.preventDefault()
    $(".error-msg").empty()
    $(".success-msg").empty()

    token = localStorage.getItem('token')
    
    console.log(`title to be created`);

    title = $("#create-todo-title").val()
    description = $("#create-todo-description").val()
    status = $("#create-select-todo-status").val()
    due_date = $("#create-todo-due_date").val()

    console.log(`testing create`);
    console.log(`${title} ${description} ${status} ${due_date}`);
    
    $.ajax({
        method: "POST",
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
        $(".success-msg").empty()
        $(".success-msg").append(`<h3>TODO #${todoId}: ${title} CREATED</h3>`)
        showTodos(event)
        renderDashboard()
    })
    .fail(err => {
        console.log(`main error is`);
        console.log(err);
        console.log(`the response text is`);
        console.log(err.responseText);
        $(".error-msg").empty()
        $(".error-msg").append(`<h3> ${err.responseText} </h3>`)
    })

}

function onSignIn(googleUser) {
    event.preventDefault()
    $(".error-msg").empty()
    $(".success-msg").empty()

    let profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    let id_token = googleUser.getAuthResponse().id_token;

    $.ajax({
        method: "POST",
        url: "http://localhost:4000/users/googleSignin",
        headers: {
            token: id_token
        }
    })
    .done(response => {
        console.log(`successfully use oauth google sign in`);
        console.log(`response is: `);
        console.log(response);

        localStorage.setItem('token', response.token)
        showTodos(event)
        renderDashboard()
    })
    .fail(err => {
        console.log(`main error is`);
        console.log(err);
        console.log(`the response text is`);
        console.log(err.responseText);
        $(".error-msg").empty()
        $(".error-msg").append(`<h3>${err.responseText}</h3>`)
    })
}

function editFormTodo(id, event) {
    event.preventDefault()
    $(".error-msg").empty()
    $(".success-msg").empty()

    todoId = id
    // event.preventDefault()
    // $("#tbl-todo-data").empty()
    token = localStorage.getItem('token')
    $.ajax({
        method: "GET",
        url: `http://localhost:4000/todos/${id}`,
        headers: {
            token: localStorage.getItem("token")
        }
    }).done(response => {
        console.log(`edit target found:`);
        console.log(response);
        console.log(`edit target's first inner layer is`);
        console.log(response.todo);
        renderEditForm()
        datum = response.todo
        
        $("#edit-todo-id").val(datum.id)
        $("#edit-todo-title").val(datum.title)
        $("#edit-todo-description").val(datum.description)
        $("#edit-select-todo-status").val(datum.status)

        let dd = new Date(datum.due_date).getDate()
        let mm = new Date(datum.due_date).getMonth() + 1
        let yyyy = new Date(datum.due_date).getFullYear()

        if(dd < 10) {
            dd = '0'+dd
        }

        if(mm < 10) {
            mm = '0'+mm
        }

        let parsdDate = yyyy+"-"+mm+"-"+dd
        $("#edit-todo-due_date").val(parsdDate)

        // editTodo(id, event)

    })
    .fail(err => {
        console.log(`main error is`);
        console.log(err);
        console.log(`the response text is`);
        console.log(err.responseText);
        $(".error-msg").empty()
        $(".error-msg").append(`<h3>${err.responseText}</h3>`)
    })
    
}

function editTodo(todoId, event) {
    event.preventDefault()
    $(".error-msg").empty()
    $(".success-msg").empty()

    token = localStorage.getItem('token')
    console.log(`the id of item we gonna put is ${todoId}`);
    console.log(`but the id from the form is`);
    console.log($("#edit-todo-id").val());

    title = $("#edit-todo-title").val()
    description = $("#edit-todo-description").val()
    status = $("#edit-select-todo-status").val()
    due_date = $("#edit-todo-due_date").val()

    console.log(`testing update`);
    console.log(`${title} ${description} ${status} ${due_date}`);
    $.ajax({
        method: "PUT",
        url: `http://localhost:4000/todos/${todoId}`,
        headers: {
            token: token
        },
        data: {
            title:title,
            description:description,
            status:status,
            due_date:due_date
        }
    })
    .done(response => {
        console.log(`our edited item is`);
        console.log(response);
        $(".success-msg").empty()
        $(".success-msg").append(`<h3>TODO #${todoId}: ${title} UPDATED</h3>`)
        showTodos(event)
        renderDashboard()
    })
    .fail(err => {
        console.log(`main error is`);
        console.log(err);
        console.log(`the response text is`);
        console.log(err.responseText);
        
        $(".error-msg").empty()
        $(".error-msg").append(`<h3>${err.responseText}</h3>`)
    })
}

function deleteTodo(todoId, event) {
    event.preventDefault()
    $(".error-msg").empty()
    $(".success-msg").empty()


    console.log(`we are about to delete todo with id ${todoId}`);

    token = localStorage.getItem('token')
    $.ajax({
        method: "DELETE",
        headers: {
            token:token
        },
        url: `http://localhost:4000/todos/${todoId}`
    })
    .done(response => {
        console.log(`we have deleted!`);
        console.log(response);
        $(".success-msg").empty()
        $(".success-msg").append(`<h3>TODO #${todoId} DELETED</h3>`)
        showTodos(event)
        renderDashboard()
    })
    .fail(err => {
        console.log(`main error is`);
        console.log(err);
        console.log(`the response text is`);
        console.log(err.responseText);
        $(".error-msg").empty()
        $(".error-msg").append(`<h3>${err.responseText}</h3>`)
    })
}
