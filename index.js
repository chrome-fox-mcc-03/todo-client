function showLandingPage() {
    $("#landing-page").show()
    $("#section-register").hide()
    $("#section-login").hide()
    $("#dashboard-page").hide()
    $("#add-todo").hide()
    $('#update-todo').hide()
}

function showRegister() {
    $("#section-register").show()
    $("#section-login").hide()
    $("#dashboard-page").hide()
    $("#landing-page").hide()
}

function showLogin() {
    $("#section-register").hide()
    $("#section-login").show()
    $("#dashboard-page").hide()
    $("#landing-page").hide()
}

function showDashboard() {
    $("#section-register").hide()
    $("#section-login").hide()
    $("#dashboard-page").show()
    $("#landing-page").hide()
    fetchMovies()
}

function isLogin() {
    if (localStorage.getItem('token')) {
        return true
    } else {
        return false
    }
}

function finishTodo(id) {
    $.ajax({
        type: 'PATCH',
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            token: localStorage.getItem("token")
        },
        data: {
            status: true
        }
    })
        .done(result => {
            fetchTodos()
        })
        .fail(err => {
            console.log(err)
        })
}

function unfinishTodo(id) {
    $.ajax({
        type: 'PATCH',
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            token: localStorage.getItem("token")
        },
        data: {
            status: false
        }
    })
        .done(result => {
            fetchTodos()
        })
        .fail(err => {
            console.log(err)
        })
}

function fetchTodos() {
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/todos",
        headers: {
            token: localStorage.getItem("token")
        }
    }).done(function (response) {
        $('#table-todo').empty()
        $('#table-todo').append(`
                <tr>
                    <th>No</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th></th>

                </tr>
            `)
        response.forEach((el, i) => {
            const due_date = new Date(el.due_date).toLocaleDateString()
            $('#table-todo').append(`
                    <tr>
                        <td>${i + 1}</td>
                        <td>${el.title}</td>
                        <td>${el.description}</td>
                        <td>${el.status === true ? 'complete' : 'uncomplete'}</td>
                        <td>${due_date}</td>
                        <td>
                            ${
                el.status
                    ? `
                                    <a onclick="finishTodo(${el.id})" href="#">
                                        <span class="icon has-text-success ">
                                        <i class="fas fa-check"></i>
                                        </span>
                                    </a>`
                    : `
                                    <a onclick="unfinishTodo(${el.id})" href="#">
                                        <span class="icon has-text-warning">
                                        <i class="fas fa-check"></i>
                                        </span>
                                    </a> 
                                `
                }
                            <a onclick="showFormUpdate(${el.id})" href="#">
                                <span class="icon has-text-info">
                                    <i class="fas fa-edit"></i>
                                </span>
                            </a>
                            <a onclick="deleteTodo(${el.id})" href="#">
                                <span class="icon has-text-danger">
                                    <i class="fas fa-trash-alt"></i>
                                </span>
                            </a>
                        </td>
                    </tr>
                `)
        })
    }).fail(function (err) {
        console.log(err);
    })
}

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token
    $.ajax({
        url: 'http://localhost:3000/users/googleLogin',
        method: 'POST',
        data: { id_token }
    })
        .done(({ token }) => {
            localStorage.token = token
            showDashboard(true)
            fetchTodos()
        })
        .fail(err => {
            console.log(err)
        })
}

function buttonWhenLogin() {
    $("#button-register").hide()
    $("#button-login").hide()
    $("#button-logout").show()
    $("#button-todo").show()

}

function buttonWhenLogout() {
    $("#button-register").show()
    $("#button-login").show()
    $("#button-logout").hide()
    $("#button-todo").hide()

}

function showFormAdd() {
    $('#add-todo').show()
}

function hideFormAdd() {
    $('#add-todo').hide()
}

function showFormUpdate(id) {
    $('#update-todo').show()
    $.ajax({
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            token: localStorage.getItem("token")
        },
        method: 'GET'
    })
        .done(response => {
            const { id, title, description, due_date } = response
            const date = new Date(due_date).toISOString().split('T')[0]

            $('#id-update').val(id)
            $('#title-update').val(title)
            $('#description-update').val(description)
            $('#due_date-update').val(date)
        })
        .fail(err => {
            console.log(err)
        })
}

function hideFormUpdate() {
    $('#update-todo').hide()
}

function deleteTodo(id) {
    $.ajax({
        method: 'DELETE',
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(function (response) {
            console.log(response)
            fetchTodos()
        })
        .fail(function (err) {
            console.log(err)
        })

}

function fetchMovies() {
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/movies",
        headers: {
            token: localStorage.getItem("token")
        }
    })
        .done(function (response) {
            console.log(response)
            response.data.forEach((el, i) => {
                $('#movie-list').append(`          
                    <div class="card">
                        <div class="card-image">
                            <figure class="image is-4by3">
                            <img src="https://image.tmdb.org/t/p/w500${el.poster_path}" alt="Placeholder image">
                            </figure>
                        </div>
                        <div class="card-content">
                            <div class="media">
                                <div class="media-content">
                                    <p class="title is-4">${el.title}</p>
                                    <p class="subtitle is-6">Release: ${el.release_date}</p>
                                </div>
                            </div>

                            <div class="content">
                            ${el.overview.substring(0, 200)}
                            </div>
                        </div>
                    </div>
                `)
            })
        })
        .fail(function (err) {
            console.log(err)
        })
}


$(document).ready(function () {
    if (isLogin()) {
        showLandingPage()
        buttonWhenLogin()
    } else {
        showLogin()
        buttonWhenLogout()
    }

    $("#button-register").on("click", function () {
        showRegister()
    })

    $("#button-home").on("click", function () {
        showLandingPage()
    })

    $("#button-login").on("click", function () {
        showLogin()
    })
    $("#button-todo").on("click", function () {
        showDashboard()
        fetchTodos()
    })

    $("#form-signup").on("submit", function (e) {
        e.preventDefault()
        const email = $("#email").val()
        const password = $("#password").val()
        $.ajax({
            method: "POST",
            url: "http://localhost:3000/users/register",
            data: {
                email,
                password
            }
        }).done(function (response) {
            localStorage.setItem("token", response.token)
            showDashboard()
            fetchTodos()
            buttonWhenLogin()
        }).fail(function (err) {
            console.log(err, "error")
        })
    })

    $("#add-todo").on("submit", function (e) {
        e.preventDefault()
        const title = $('#title').val()
        const description = $('#description').val()
        const due_date = $('#due_date').val()
        let data = {
            title,
            description,
            due_date,
            status: false
        }

        $.ajax({
            method: 'POST',
            url: 'http://localhost:3000/todos',
            headers: {
                token: localStorage.getItem('token')
            },
            data
        })
            .done(response => {
                console.log(response)
                fetchTodos()
                hideFormAdd()
            })
            .fail(err => {
                console.log(err)
            })
    })


    $("#update-todo").on("submit", function (e) {
        e.preventDefault()
        const id = $('#id-update').val()
        const title = $('#title-update').val()
        const description = $('#description-update').val()
        const due_date = $('#due_date-update').val()
        let data = {
            title,
            description,
            due_date
        }

        $.ajax({
            method: 'PUT',
            url: `http://localhost:3000/todos/${id}`,
            headers: {
                token: localStorage.getItem('token')
            },
            data
        })
            .done(response => {
                console.log(response)
                fetchTodos()
                hideFormUpdate()
            })
            .fail(err => {
                console.log(err)
            })
    })




    $("#form-login").on("submit", function (e) {
        e.preventDefault()
        const email = $("#email_login").val()
        const password = $("#password_login").val()
        $.ajax({
            method: "POST",
            url: "http://localhost:3000/users/login",
            data: {
                email,
                password
            }
        }).done(function (response) {
            localStorage.setItem("token", response.token)
            showDashboard()
            fetchTodos()
            buttonWhenLogin()
        })
    })



    $("#button-logout").on("click", function () {
        const auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
        });
        localStorage.clear()
        showLandingPage()
        buttonWhenLogout()
    })
})
