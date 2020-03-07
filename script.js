$("document").ready(() => {
    $("#log-out").hide()
    $(".dashboard-class").hide()
    if(localStorage.getItem('token')) {
        $("#log-out").show()
        $(".landing-page").hide()
        $(".dashboard-class").show()
        $(".welcome-text").append(`<h1 class='welcome-text-child-name'> ${localStorage.getItem('name')}</h1>`)
        
    }
    $("#log-in-page").hide()
    $("#sign-up-page").hide()
    $("#start-now").on('click', (e) => {
        e.preventDefault()
        $("#sign-up-page").slideDown()
        $(".landing-page").css("filter", "blur(3px)")
    })

    $(".sign-up-back-btn").on('click', (e) => {
        e.preventDefault()
        $("#sign-up-page").hide()
        $("#log-in-page").hide()
        $('#error-signup').text(``)
        $('#error-login').text(``)
        $(".landing-page").css("filter", "")
    })
     
    $("#login").on('click', (e) => {
        e.preventDefault()
        $("#log-in-page").slideDown()
        $(".landing-page").css("filter", "blur(3px)")
    })

    $("#sign-up-form").on('submit', (e) => {
        e.preventDefault()
        const data = {
            first_name: $("#first_name").val(),
            last_name: $("#last_name").val(),
            username: $("#username").val(),
            email: $("#email").val(),
            password: $("#password").val(),
        }
        $.ajax({
            url: 'http://localhost:3000/users/register',
            method: 'POST',
            data: data
        })
        .then(signedUpData => {
            return $.ajax({
                url: 'http://localhost:3000/users/login',
                method: 'POST',
                data: {
                    emailOrUsername: data.email,
                    password: data.password
                }
            })
        })
        .done(response => {
            localStorage.setItem('token', response)
            localStorage.setItem('name', response.name)
            $('#error-signup').text(``)
            $("#sign-up-page").hide()
            $("#log-in-page").hide()
            $(".landing-page").hide()
            $(".dashboard-class").show()
            $(".welcome-text-child-name").remove()
            $(".welcome-text").append(`<h1 class='welcome-text-child-name'> ${localStorage.getItem('name')}</h1>`)
            showTodo(localStorage.getItem('token'))
            .then(placeTodo)
            $("#log-out").show()
        })
        .fail(error => {
            const errors = error.responseJSON.msg.split(',')
            $('#error-signup').text(`${errors[0].split(': ')[1]}`)
        })
        

    })

    $("#log-in-form").on('submit', (e) => {
        e.preventDefault()
        const data = {
            emailOrUsername: $("#emailOrUsername").val(),
            passwordLogIn: $("#passwordLogIn").val(),
        }
        $.ajax({
            url: 'http://localhost:3000/users/login',
            method: 'POST',
            data: {
                emailOrUsername: data.emailOrUsername,
                password: data.passwordLogIn
            }
        })
        .done(response => {
            localStorage.setItem('token', response.userToken)
            localStorage.setItem('name', response.name)
            $("#sign-up-page").hide()
            $('#error-login').text(``)
            $("#log-in-page").hide()
            $(".landing-page").hide()
            $(".dashboard-class").show()
            $(".welcome-text-child-name").remove()
            $(".welcome-text").append(`<h1 class='welcome-text-child-name'> ${localStorage.getItem('name')}</h1>`)
            showTodo(localStorage.getItem('token'))
            .then(placeTodo)
            $("#log-out").show()
        })
        .fail(error => {
            $('#error-login').text(`${error.responseJSON.msg}`)
        })
        
    })

    $(".add-btn").on('click', () => {
        $(".add-todos").slideDown()
        $(".dashboard-class").css("filter", "blur(3px)")
    })

    $(".back-todos-add").on('click', (e) => {
        e.preventDefault()
        $('#error-add').text(``)
        backToDashboard(".add-todos")
    })

    $("#todos-form").on('submit', (e) => {
        e.preventDefault()
        const data = {
            title: $("#title").val(),
            description: $("#description").val(),
            due_date: $("#due_date").val(),
        }
        $.ajax({
            url: 'http://localhost:3000/todos',
            method: 'POST',
            data,
            headers: {
                user_token: localStorage.getItem('token')
            }
        })
        .done((result) => {
            backToDashboard(".add-todos")
            $('#error-add').text(``)
            restartDashboard()
        })
        .fail(error => {
            const errors = error.responseJSON.msg.split(',')
            $('#error-add').text(`${errors[0].split(': ')[1]}`)
        })
    })

    $("#log-out").on('click', () => {
        localStorage.clear()
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
          console.log('User signed out.');
        });
        $(".landing-page").show()
        $(".dashboard-class").hide()
        $("#log-out").hide()
        $(".landing-page").css("filter", "")
        $("#ds-3").empty()
        $("#ds-2").empty()
        $("#ds-1").empty()
        $("#emailOrUsername").val('')
        $("#passwordLogIn").val('')
        $("#first_name").val(''),
        $("#last_name").val(''),
        $("#username").val(''),
        $("#email").val(''),
        $("#password").val(''),
        $("#sign-up-page").val('')
    })
})

function showTodo(token){
    return $.ajax({
        url: 'http://localhost:3000/todos',
        method: 'GET',
        headers: {
            user_token: token
        }
    })
}

function backToDashboard(toHide){
    $(toHide).hide()
    $(".dashboard-class").css("filter", "") 
}

function restartDashboard(){
    $("#ds-2").empty()
    $("#ds-1").empty()
    $("#ds-3").empty()
    showTodo(localStorage.getItem('token'))
    .then(placeTodo)
}

function placeTodo(result) {
    let todosDataNotDone = []
    let todosDataDone = []
    $("#ds-1").append('<h3>Your todos</h3>')
    $("#ds-3").append('<h3>Done todos</h3>')
    $.each(result, (i, v) => {
        if(!v.status) {
            $("#ds-1").append(`<p class='todos' id='todos-${v.id}'>${v.title}</p>`)
            todosDataNotDone.push(v)
            $(`#todos-${v.id}`).on('click', () => {
                $("#ds-2").empty()
                const todos = {
                    title: v.title,
                    description: v.description,
                    status: (v.status) ? 'Done' : 'Not done (yet!!!)',
                    due_date: parseDueDate(v.due_date)
                }
                let color = ''
                if(!v.status) color = 'style = "color: rgb(48, 3, 48)"'
                else color = 'style = "color:green"'
                $("#ds-2").append('<h3>Detail</h3>')
                $("#ds-2").append(`<p class='todos-detail todos-title' > ${todos.title.toUpperCase()}</p>`)
                $("#ds-2").append(`<p class='todos-detail todos-desc' > ${todos.description} </p>`)
                $("#ds-2").append(`<p class='todos-detail todos-due_date' > Due date: ${todos.due_date} </p>`)
                $("#ds-2").append(`<p class='todos-detail todos-status' ${color}> ${todos.status}</p>`)
                if(todos.status !== 'Done') {
                    $("#ds-2").append(`<button id='done-${v.id}' class= 'done-todos-btn'>I've done this!</button>`)
                    $(`#done-${v.id}`).on('click', () => {
                        doneTodo(v.id)
                    })
                }
                $("#ds-2").append(`<button id='edit-${v.id}' class= 'todos-btn'>Edit</button>`)
                $(`#edit-${v.id}`).on('click', () => {
                    showUpdateTodo(v.id)
                })
                $("#ds-2").append(`<button class= 'todos-btn'id='button-${v.id}'>Delete</button>`)
                $(`#button-${v.id}`).on('click', () => {
                    deleteTodo(v.id)
                })
            })
        }
        else{
        $("#ds-2").empty()
            $("#ds-3").append(`<p class='todos' id='todos-${v.id}'>${v.title}</p>`)
            todosDataDone.push(v)
            $(`#todos-${v.id}`).on('click', () => {
                $("#ds-2").empty()
                const todos= {
                    title: todosDataDone[i].title,
                    description: todosDataDone[i].description,
                    status: (todosDataDone[i].status) ? 'Done' : 'Not done (yet!!!)',
                    due_date: parseDueDate(todosDataDone[i].due_date)
                }
                let color = ''
                if(!todosDataDone[i].status) color = 'style = "color: rgb(48, 3, 48)"'
                else color = 'style = "color:green"'
                $("#ds-2").append('<h3>Detail</h3>')
                $("#ds-2").append(`<p class='todos-detail todos-title' > ${todos.title.toUpperCase()}</p>`)
                $("#ds-2").append(`<p class='todos-detail todos-desc' > ${todos.description} </p>`)
                $("#ds-2").append(`<p class='todos-detail todos-due_date' > Due date: ${todos.due_date} </p>`)
                $("#ds-2").append(`<p class='todos-detail todos-status' ${color}> ${todos.status}</p>`)
                if(todos.status !== 'Done') {
                    $("#ds-2").append(`<button id='done-${v.id}' class= 'done-todos-btn'>I've done this!</button>`)
                    $(`#done-${v.id}`).on('click', () => {
                        doneTodo(v.id)
                    })
                }
                $("#ds-2").append(`<button id='edit-${v.id}' class= 'todos-btn'>Edit</button>`)
                $(`#edit-${v.id}`).on('click', () => {
                    showUpdateTodo(v.id)
                })
                $("#ds-2").append(`<button class= 'todos-btn'id='button-${v.id}'>Delete</button>`)
                $(`#button-${v.id}`).on('click', () => {
                    deleteTodo(v.id)
                })
            })
        }
    })
}

function deleteTodo(id){
    $.ajax({
        url: `http://localhost:3000/todos/${id}`,
        method: 'DELETE',
        headers: {
            user_token: localStorage.getItem('token')
        }
    })
    .done (result => {
        $(`#todos-${id}`).remove()
    })
}

function doneTodo(id){
    $.ajax({
        url: `http://localhost:3000/todos/${id}`,
        method: 'PUT',
        headers: {
            user_token: localStorage.getItem('token')
        },
        data : {
            status: true,
        }
    })
    .done(res => {
        restartDashboard()
    })
}

function showUpdateTodo(id){
    $.ajax({
        url: `http://localhost:3000/todos/${id}`,
        method: 'GET',
        headers: {
            user_token: localStorage.getItem('token')
        }
    })
    .done(result => {
        $('body').append(`
        <section id="edit-todos-${id}" class="edit-todos">
        <div class= "add-todos-div">
            <form id="edit-todos-form-${id}" class="edit-todos-form">
                <h3>Edit a todo</h3> <br>
                <label for="title" class= "sign-up-text-top">Title </label><br>
                <input type="text" id="edit-title-${id}" name="title" class= "sign-up-text" value="${result[0].title}"><br>
                <label for="description" class= "sign-up-text-top">Description: </label><br>
                <input type="text" id="edit-description-${id}" name="description" class= "sign-up-text" value="${result[0].description}"><br>
                <label for="due_date" class= "sign-up-text-top">Due-date: </label><br>
                <input type="text" id="edit-due_date-${id}" name="due_date" class= "sign-up-text" value="${result[0].due_date}"><br>
                <input type="submit" value="Edit" class="add-todos-btn" id="edit-todos-${id}">
                <button type="button" id="back-todos-edit-${id}" class="back-todos-edit">Back</button>
            </form>
        </div>
        </section>`)
        $(`#back-todos-edit-${id}`).on('click', (e) => {
            e.preventDefault()
            $(`#edit-todos-${id}`).hide()
            $(".dashboard-class").css("filter", "")
        })
        $(`#edit-todos-${id}`).slideDown()
        $(".dashboard-class").css("filter", "blur(3px)")
        $(`#edit-todos-form-${id}`).on('submit', (e) => {
            e.preventDefault()
            const data = {
                title: $(`#edit-title-${id}`).val(),
                description: $(`#edit-description-${id}`).val(),
                due_date: $(`#edit-due_date-${id}`).val(),
            }
            $.ajax({
                url: `http://localhost:3000/todos/${id}`,
                method: 'PUT',
                data,
                headers: {
                    user_token: localStorage.getItem('token')
                }
            })
            .done(result => {
                backToDashboard(".edit-todos")
                restartDashboard()
            })
        })
    })
}



function onSignIn(googleUser) {
    const id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        url: 'http://localhost:3000/users/googleLogin',
        method: 'POST',
        headers: {
            token: id_token
        }
    })
    .then(response => {
        localStorage.setItem('token', response.token)
        localStorage.setItem('name', response.name)
        $("#sign-up-page").hide()
        $("#log-in-page").hide()
        $(".landing-page").hide()
        $(".dashboard-class").show()
        $(".welcome-text-child-name").remove()
        $(".welcome-text").append(`<h1 class='welcome-text-child-name'> ${localStorage.getItem('name')}</h1>`)
        showTodo(localStorage.getItem('token'))
        .then(placeTodo)
        $("#log-out").show()
    })
  }

  
function parseDueDate(datei){
    datei = new Date(datei)
    let date = datei.getUTCDate() + 1;
    if(String(date).length < 2) date = '0' + date;
    let month = datei.getUTCMonth() + 1;
    if(String(month).length < 2) month = '0' + month;
    let year = datei.getUTCFullYear();
    return `${date}/${month}/${year}`;
}