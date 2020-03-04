function todos() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:3000/todos',
        headers: {
            token: localStorage.token
        }
    })
        .done(todos => {
            todos.forEach((element, i) => {
                $('#table-todos').append(`
                <tr>
                    <td>${i + 1}</td>
                    <td>${element.title}</td>
                    <td>${element.description}</td>
                    <td>${element.status}</td>
                    <td>${element.due_date}</td>
                </tr>`)
            });
        })
        .fail(err => {
            
        })
}

$(document).ready(() => {
    const token = localStorage.token
    if(token) {
        todos()
        $('#home').hide()
        $('#dashboard').show()
        $('#register').hide()
        $('#login').hide()
    } else {
        $('#home').show()
        $('#dashboard').hide()
        $('#register').hide()
        $('#login').hide()
    }

    $('#btn-login').on('click', () => {
        $('#home').hide()
        $('#dashboard').hide()
        $('#register').hide()
        $('#login').show()
    })

    $('#btn-register').on('click', () => {
        $('#home').hide()
        $('#dashboard').hide()
        $('#register').show()
        $('#login').hide()
    })

    $('.btn-home').on('click', () => {
        $('#home').show()
        $('#dashboard').hide()
        $('#register').hide()
        $('#login').hide()
    })

    $('#btn-logout').on('click', () => {
        localStorage.removeItem('token')
        $('#home').show()
        $('#dashboard').hide()
        $('#register').hide()
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
                $('#register').hide()
                $('#login').hide()
            })
            .fail(err => {
                $('#home').hide()
                $('#dashboard').hide()
                $('#register').show()
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
                $('#home').hide()
                $('#dashboard').show()
                $('#register').hide()
                $('#login').hide()
            })
            .fail(err => {
                $('#home').hide()
                $('#dashboard').hide()
                $('#register').show()
                $('#login').hide()
            })
    })
})