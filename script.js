function showTodo(token){
    return $.ajax({
        url: 'http://localhost:3000/todos',
        method: 'GET',
        headers: {
            user_token: token
        }
    })
}

function placeTodo(result) {
    let todosData = []
    $.each(result, (i, v) => {
        $("#ds-1").append(`<p class='todos' id='todos-${v.id}'>${v.title}</p>`)
        todosData.push(v)
        $(`#todos-${v.id}`).on('click', () => {
            $("#ds-2").empty()
            todos= {
                title: todosData[i].title,
                description: todosData[i].description,
                status: (todosData[i].status) ? 'Done' : 'Not done'
            }
            let color = ''
            if(!todosData[i].status) color = 'style = "color:red"'
            else color = 'style = "color:green"'
            $("#ds-2").append(`<p class='todos-detail todos-title' > ${todos.title.toUpperCase()}</p>`)
            $("#ds-2").append(`<p class='todos-detail todos-desc' > ${todos.description}</p>`)
            $("#ds-2").append(`<p class='todos-detail todos-status' ${color}> ${todos.status}</p>`)
            $("#ds-2").append(`<button id='button-${v.id}'>Delete</button>`)
            $(`#button-${v.id}`).on('click', () => {
                deleteTodo(v.id)
            })
            $("#ds-2").append(`<button id='edit-${v.id}'>Edit</button>`)
            $(`#edit-${v.id}`).on('click', () => {
                showUpdateTodo(v.id)
            })
            
        })
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
        $("#ds-2").empty()
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
                $(".edit-todos").hide()
                $(".dashboard-class").css("filter", "")
                $("#ds-1").empty()
                showTodo(localStorage.getItem('token'))
                .then(placeTodo)
                $("#ds-2").empty()
            })
        })
    })
}

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
            $("#log-in-page").hide()
            $(".landing-page").hide()
            $(".dashboard-class").show()
            $(".welcome-text-child-name").remove()
            $(".welcome-text").append(`<h1 class='welcome-text-child-name'> ${localStorage.getItem('name')}</h1>`)
            showTodo(localStorage.getItem('token'))
            .then(placeTodo)
            $("#log-out").show()
        })
        
    })

    $(".add-btn").on('click', () => {
        $(".add-todos").slideDown()
        $(".dashboard-class").css("filter", "blur(3px)")
    })

    $(".back-todos-add").on('click', (e) => {
        e.preventDefault()
        $(".add-todos").hide()
        $(".dashboard-class").css("filter", "")
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
            $(".add-todos").hide()
            $(".dashboard-class").css("filter", "")
            $("#ds-1").empty()
            showTodo(localStorage.getItem('token'))
            .then(placeTodo)
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

  
