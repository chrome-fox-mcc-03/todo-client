function todos() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:3000/todos',
        headers: {
            token: localStorage.token
        }
    })
        .done(todos => {
            $('#table-todos').empty()
            todos.forEach((element, i) => {
                $('#table-todos').append(`
                <tr>
                    <td>${i + 1}</td>
                    <td>${element.title}</td>
                    <td>${element.description}</td>
                    <td>${element.status}</td>
                    <td>${element.due_date}</td>
                    <td><button type="button" onclick="edit(${element.id})" class="btn btn-info">Edit</button> | <button type="button" class="delete" class="btn btn-danger">Delete</button></td>
                </tr>`)
            });
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
            $('#table-todos').empty()
            localStorage.idUpdate = todos.id
                $('#table-todos').append(`
                <tr>
                    <form>
                    <td>${todos.id}</td>
                    <td><input id="title-update" value="${todos.title}"></td>
                    <td><input id="description-update" value="${todos.description}"></td>
                    <td><input id="status-update" value="${todos.status}"></td>
                    <td><input id="due_date-update" value="${todos.due_date}"></td>
                    <td><button type="button" class="update" class="btn btn-info">Update</button></td>
                </tr>`)
        })
        .fail(err => {
            console.log(err)
        })
}


$(document).ready(() => {
    const token = localStorage.token
    if(token) {
        todos()
        $('#home').hide()
        $('#dashboard').show()
        $('#login').hide()
    } else {
        $('#home').show()
        $('#dashboard').hide()
        $('#login').hide()
    }

    $('#btn-login').on('click', () => {
        $('#home').hide()
        $('#dashboard').hide()
        $('#login').show()
    })

    $('#a-login').on('click', () => {
        $('#home').hide()
        $('#dashboard').hide()
        $('#login').show()
    })

    $('.btn-home').on('click', () => {
        $('#home').show()
        $('#dashboard').hide()
        $('#login').hide()
    })

    $('#btn-logout').on('click', () => {
        localStorage.removeItem('token')
        $('#home').show()
        $('#dashboard').hide()
        $('#login').hide()
    })

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
                $('#dashboard').show()
                $('#login').hide()
            })
            .fail(err => {
                $('#home').show()
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
            })
            .fail(err => {
                $('#home').show()
                $('#dashboard').hide()
                $('#login').hide()
            })
    })

    $('.update').on('click', (e) => {
        e.preventDefault()
        const title = $('title-update').val()
        const description = $('description-update').val()
        const status = $('status-update').val()
        const due_date = $('due_date-update').val()
        $.ajax({
            method: 'PUT',
            url: `http://localhost:3000/todos/${localStorage.idUpdate}`,
            headers: {
               token: localStorage.token 
            },
            data: {
                title,
                description,
                status,
                due_date
            }
        })
            .done(_ => {
                localStorage.removeItem('idUpdate')
                $('#home').hide()
                $('#dashboard').show()
                $('#login').hide()
            })
            .fail(err => {
                console.log(err)
            })
    })


})