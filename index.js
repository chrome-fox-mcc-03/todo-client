$(document).ready(() => {
    let img;
    const token = localStorage.token
    if(token) {
        todos()
        $('#create').hide()
        $('#home').hide()
        $('#dashboard').show()
        $('#login').hide()
    } else {
        $('#error-register').empty()
        $('#home').show()
        $('#create').hide()
        $('#dashboard').hide()
        $('#login').hide()
    }

    $('.navbar-brand-home').on('click', () => {
        resetHome()
        $('#home').show()
        $('#dashboard').hide()
        $('#login').hide()
        $('#create').hide()
    })

    $('.navbar-brand').on('click', () => {
        $('#home').hide()
        $('#dashboard').show()
        $('#login').hide()
        $('#create').hide()
    })

    $('#listtodos-create').on('click', () => {
        $('#home').hide()
        $('#dashboard').show()
        $('#login').hide()
        $('#create').hide()
    })

    $('#btn-login').on('click', () => {
        $('#home').hide()
        $('#dashboard').hide()
        $('#error-login').empty()
        $('#login').show()
        $('#create').hide()
    })

    $('#a-login').on('click', () => {
        $('#home').hide()
        $('#dashboard').hide()
        $('#error-login').empty()
        $('#login').show()
        $('#create').hide()
    })

    $('.btn-home').on('click', () => {
        $('#error-register').empty()
        resetHome()
        $('#home').show()
        $('#dashboard').hide()
        $('#login').hide()
        $('#create').hide()
    })

    $('#btn-logout').on('click', () => {
        localStorage.removeItem('token')
        resetHome()
        logout()
        $('#home').show()
        $('#dashboard').hide()
        $('#create').hide()
        $('#login').hide()
    })

    $('input[type=file]').on("change", function() {
        let $files = $(this).get(0).files;
        if ($files.length) {
            let apiUrl = 'https://api.imgur.com/3/image';
            let apiKey = '7122fd47f342787';
            settings = {
                async: false,
                crossDomain: true,
                processData: false,
                contentType: false,
                type: 'POST',
                url: apiUrl,
                headers: {
                Authorization: 'Client-ID ' + apiKey,
                Accept: 'application/json'
                },
                mimeType: 'multipart/form-data'
            };
    
        let formData = new FormData();
        formData.append("image", $files[0]);
        settings.data = formData;
            $.ajax(settings).done(function(response) {
                response = JSON.parse(response)
                img = response.data.id
                console.log(response)
            });
    
        }
    });

    $('#register-form').on('submit', (e) => {
        e.preventDefault()
        const email = $('#email-register').val()
        const password = $('#password-register').val()
        $.ajax({
            method: 'post',
            url:'http://localhost:3000/register',
            data: {
                email,
                password
            }
        })
            .done(register => {
                localStorage.setItem('token', register.access_token)
                $('#home').hide()
                $('#create').hide()
                $('#dashboard').show()
                $('#login').hide()
            })
            .fail(err => {
                $('#error-register').empty()
                if(err.responseJSON[0]) $('#error-register').append(err.responseJSON[0])
                else $('#error-register').append(`${err.responseJSON.error}`)
                resetHome()
                $('#home').show()
                $('#create').hide()
                $('#dashboard').hide()
                $('#login').hide()
            })
    })

    $('#login-form').on('submit', (e) => {
        e.preventDefault()
        const email = $('#email-login').val()
        const password = $('#password-login').val()
        $.ajax({
            method: 'post',
            url:'http://localhost:3000/login',
            data: {
                email,
                password
            }
        })
            .done(login => {
                localStorage.setItem('token', login.access_token)
                todos()
                $('#home').hide()
                $('#dashboard').show()
                $('#login').hide()
                $('#create').hide()
            })
            .fail(err => {
                $('#error-login').empty()
                resetHome()
                $('#error-login').append(`${err.responseJSON.error}`)
                $('#home').hide()
                $('#create').hide()
                $('#dashboard').hide()
                $('#login').show()
            })
    })

    $('#create-form').on('submit', (e) => {
        e.preventDefault()
        title = $('#title-create').val()
        description = $('#description-create').val()
        due_date = $('#due_date-create').val()
        status = false

        $.ajax({
            method: 'post',
            url:'http://localhost:3000/todos',
            headers: {
                token: localStorage.token
            },
            data: {
                title,
                description,
                due_date,
                status,
                imageId: img
            }
        })
            .done(_ => {
                todos()
                $('#home').hide()
                $('#dashboard').show()
                $('#login').hide()
                $('#create').hide()
            })
            .fail(err => {
                console.log(err)
            })
    })

    $('#create-todo').on('click', (e) => {
        e.preventDefault()
        $('#create').show()
        $('#home').hide()
        $('#dashboard').hide()
        $('#login').hide()
    })

})

function todos() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:3000/todos',
        headers: {
            token: localStorage.token
        }
    })
        .done(todos => {
            $('#todos-list').empty()
            for (let i = 0; i < todos.length / 3; i++) {
                $('#todos-list').append(`<div id="todos-list${i}" class="card-deck" style="margin: 0 50px;"></div><br>`)
                for (let j = i * 3; j < (i+1)*3; j++) {
                    if(j >= todos.length) {
                        $(`#todos-list${i}`).append(`
                            <div class="card">
                            </div>`)
                    } else {
                        if(!todos[j].imageId) todos[j].imageId = "jN4rQYt"
                        let today = new Date()
                        let day = `${today.getDate()}`
                        if (day.length == 1) day = '0' + day
                        let month = `${today.getMonth() + 1}`
                        if  (month.length == 1) month = '0' + month
                        let year = `${today.getFullYear()}`
                        if(todos[j].due_date.split('T')[0].split('-').join('') < `${year}${month}${day}`) {
                            todos[j].status = 'List Expired'
                            $(`#todos-list${i}`).append(`
                                    <div class="card">
                                        <img class="card-img-top" src="https://i.imgur.com/${todos[j].imageId}.jpg" alt="Card image cap">
                                        <div class="card-body">
                                            <h4 class="card-title">${todos[j].title}</h4>
                                            <p class="card-text" style="font-weight: bold;">${todos[j].status}</p>
                                            <p class="card-text">Date Action: ${todos[j].due_date.split('T')[0]}</p>
                                            <p class="card-text">${todos[j].description}</p>
                                            <button type="button" onclick="deleteTodo(${todos[j].id})" class="btn btn-danger">Delete</button>
                                            <p class="card-text"><small class="text-muted">Created at ${todos[j].createdAt.split('T')[0]}</small></p>
                                        </div>
                                    </div>`)
                        } else {
                            if(todos[j].status) {
                                todos[j].status = 'List Done'
                                $(`#todos-list${i}`).append(`
                                    <div class="card">
                                        <img class="card-img-top" src="https://i.imgur.com/${todos[j].imageId}.jpg" alt="Card image cap">
                                        <div class="card-body">
                                            <h4 class="card-title">${todos[j].title}</h4>
                                            <p class="card-text" style="font-weight: bold;">${todos[j].status}</p>
                                            <p class="card-text">Date Action: ${todos[j].due_date.split('T')[0]}</p>
                                            <p class="card-text">${todos[j].description}</p>
                                            <button type="button" onclick="deleteTodo(${todos[j].id})" class="btn btn-danger">Delete</button>
                                            <p class="card-text"><small class="text-muted">Created at ${todos[j].createdAt.split('T')[0]}</small></p>
                                        </div>
                                    </div>`)
                            } else {
                                todos[j].status = 'List on Progress'
                                $(`#todos-list${i}`).append(`
                                    <div class="card">
                                        <img class="card-img-top" src="https://i.imgur.com/${todos[j].imageId}.jpg" alt="Card image cap">
                                        <div class="card-body">
                                            <h4 class="card-title">${todos[j].title}</h4>
                                            <p class="card-text" style="font-weight: bold;">${todos[j].status}</p>
                                            <p class="card-text">Date Action: ${todos[j].due_date.split('T')[0]}</p>
                                            <p class="card-text">${todos[j].description}</p>
                                            <button type="button" onclick="edit(${todos[j].id})" class="btn btn-info">Done</button>
                                            <button type="button" onclick="deleteTodo(${todos[j].id})" class="btn btn-danger">Delete</button>
                                            <p class="card-text"><small class="text-muted">Created at ${todos[j].createdAt.split('T')[0]}</small></p>
                                        </div>
                                    </div>`)
                            }
                        }
                    }
                }
            }
        })
        .fail(err => {
            console.log(err)
        })
}

function update(todo) {
    todo.status = true
    $.ajax({
        method: 'PUT',
        url: `http://localhost:3000/todos/${todo.id}`,
        headers: {
           token: localStorage.token 
        },
        data: todo
    })
        .done(a => {
            $('#home').hide()
            todos()
            $('#dashboard').show()
            $('#login').hide()
        })
        .fail(err => {
            console.log(err)
        })
} 

function deleteTodo(id) {
    $.ajax({
        method: 'DELETE',
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            token: localStorage.token
        }
    })
        .done(deletedTodo => {
            $('#home').hide()
            todos()
            $('#dashboard').show()
            $('#login').hide()
        })
        .fail(err => {
            console.log(err)
        })
}

function edit(id) {
    $.ajax({
        method: 'GET',
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            token: localStorage.token
        }
    })
        .done(todos => {
            update(todos)
        })
        .fail(err => {
            console.log(err)
        })
}

function onSignIn(googleUser) {
    let id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        url: 'http://localhost:3000/loginGoogle',
        method: 'POST', 
        data: {
            id_token
        }
    })
        .done(user => {
            console.log(user)
            localStorage.setItem('token', user.access_token)
            todos()
            $('#create').hide()
            $('#home').hide()
            $('#dashboard').show()
            $('#login').hide()
        })
        .fail(err => console.log(err))
  }

function logout() {
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}

function resetHome (){
    $('#email-login').val('')
    $('#password-login').val('')
    $('#email-register').val('')
    $('#password-register').val('')
}