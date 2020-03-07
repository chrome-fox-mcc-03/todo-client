function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var id_token = googleUser.getAuthResponse().id_token;

    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/googleSignIn',
        headers: {
            token: id_token
        }
    })
        .done(token => {
            localStorage.setItem('token', token);
            console.log('sign in success', token);
            fetchTodos();
            $('#dashboard-page').show();
            $('#signup-page').hide();
            $('#signin-page').hide();
            $('#create-todo-page').hide();
            $('#update-todo-page').hide();
        })
        .fail(err => {
            console.log('sign in failed', err);
        })

    console.log(id_token);
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}

function fetchTodos() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:3000/todos',
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(todos => {
            $('.todos').empty();
            for (let i = 0; i < todos.length; i++) {
                let formattedDate = new Date(todos[i].due_date).toISOString().substring(0, 10);
                let year = formattedDate.substring(0, 4);
                let month = formattedDate.substring(5, 7);
                let date = formattedDate.substring(8, 10);

                month = monthConverter(month);
                let fixedFormattedDate = `${date} ${month} ${year}`
                console.log(todos[i].status);
                
                if (!todos[i].status) {
                    $('.todos').append(`
                    <div id="checkbox${todos[i].id}">
                        <i onclick="markTodo(${todos[i].id})" class="fas fa-circle fa-2x"></i>
                    </div>
                    <div onclick="editTodo(${todos[i].id})" class="todo">
                        <div class="theTodo">
                            <div id="titleAndDesc">
                                <h4>${todos[i].title}</h4>
                                <p>${todos[i].description}</p>
                            </div>
                            <h4>${fixedFormattedDate}</h4>
                        </div>
                        <div class="delete">
                            <i onclick="deleteTodo(${todos[i].id})" class="fas fa-trash-alt fa-2x"></i>
                        </div>
                    </div>`)
                } else {
                    $('.todos').append(`
                    <div id="checkbox${todos[i].id}">
                        <i onclick="markTodo(${todos[i].id})" class="fas fa-check-circle fa-2x"></i>
                    </div>
                    <div onclick="editTodo(${todos[i].id})" class="todo">
                        <div class="theTodo">
                            <div id="titleAndDesc">
                                <h4>${todos[i].title}</h4>
                                <p>${todos[i].description}</p>
                            </div>
                            <h4>${fixedFormattedDate}</h4>
                        </div>
                        <div class="delete">
                            <i onclick="deleteTodo(${todos[i].id})" class="fas fa-trash-alt fa-2x"></i>
                        </div>
                    </div>`)
                }
            }
            console.log(todos);
        })
        .fail(err => {
            console.log(err);
        })
}

function monthConverter(month) {
    switch (month) {
        case '01': 
            month = 'Jan';
            break;
        case '02': 
            month = 'Feb';
            break;
        case '03': 
            month = 'Mar';
            break;
        case '04': 
            month = 'Apr';
            break;
        case '05': 
            month = 'May';
            break;
        case '06': 
            month = 'Jun';
            break;
        case '07': 
            month = 'Jul';
            break;
        case '08': 
            month = 'Aug';
            break;
        case '09': 
            month = 'Sep';
            break;
        case '10': 
            month = 'Oct';
            break;
        case '11': 
            month = 'Nov';
            break;
        case '12': 
            month = 'Dec';
            break;
    }
    return month;
}

function editTodo(id) {
    $('#dashboard-page').hide();
    $('#signup-page').hide();
    $('#signin-page').hide();
    $('#create-todo-page').hide();
    $('#update-todo-page').show();
    $.ajax({
        method: 'GET',
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(todoFound => {
            let dateFormat = new Date(todoFound.due_date).toISOString().substring(0, 10);
            $('#update-title').val(todoFound.title);
            $('#update-description').val(todoFound.description);
            $('#update-due_date').val(dateFormat);
            localStorage.setItem('todoId', id);
        })
        .fail(err => {
            console.log('error!', err);
        })
}

function markTodo(id) {
    $.ajax({
        method: 'GET',
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
    .done(todoFound => {
        if(!todoFound.status) {
            $.ajax({
                method: 'PATCH',
                url: `http://localhost:3000/todos/markdone/${id}`,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
                .done(markedTodo => {
                    console.log(markedTodo.status);
                    console.log(markedTodo.id);
                    $(`#checkbox${markedTodo.id}`).empty();
                    $(`#checkbox${markedTodo.id}`).append(`<i onclick="markTodo(${markedTodo.id})" class="fas fa-check-circle fa-2x"></i>`)
                })
                .fail(err => {
                    console.log('error!', err);
                })
        } else {
            $.ajax({
                method: 'PATCH',
                url: `http://localhost:3000/todos/markundone/${id}`,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
                .done(markedTodo => {
                    console.log(markedTodo.status);
                    console.log(markedTodo.id);
                    $(`#checkbox${markedTodo.id}`).empty();
                    $(`#checkbox${markedTodo.id}`).append(`<i onclick="markTodo(${markedTodo.id})" class="fas fa-circle fa-2x"></i>`);
                })
                .fail(err => {
                    console.log('error!', err);
                })
        }
    })
    .fail(err => {
        console.log('error!', err);
    })
}

function deleteTodo(id) {
    $.ajax({
        method: 'DELETE',
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(todoFound => {
            console.log('Successfully deleted a todo', todoFound);
            $('#dashboard-page').show();
            $('#signup-page').hide();
            $('#signin-page').hide();
            $('#create-todo-page').hide();
            $('#update-todo-page').hide();
            fetchTodos();
        })
        .fail(err => {
            console.log('error!', err);
        })
}

function getQuote() {
    $.ajax({
        method: 'GET',
        url: 'https://quote-garden.herokuapp.com/quotes/random'
    })
        .done(response => {
            $('.quote').empty();
            $('.quote').append(`
                <p>${response.quoteText}</p>
                <p>-${response.quoteAuthor}</p>
            `)
        })
        .fail(error => {
            console.log(error);
        })
}

function showDashboard() {
    fetchTodos();
    $('#dashboard-page').show();
    $('#signup-page').hide();
    $('#signin-page').hide();
    $('#create-todo-page').hide();
    $('#update-todo-page').hide();
}

$(document).ready(function () {
    getQuote();
    if (localStorage.getItem('token')) {
        fetchTodos();
        $('#dashboard-page').show();
        $('#signup-page').hide();
        $('#signin-page').hide();
        $('#create-todo-page').hide();
        $('#update-todo-page').hide();
    } else {
        $('#dashboard-page').hide();
        $('#signup-page').hide();
        $('#signin-page').show();
        $('#create-todo-page').hide();
        $('#update-todo-page').hide();
    }

    $('#signup-form').on('submit', function (e) {
        e.preventDefault();
        const email = $('#signup-email').val();
        const password = $('#signup-password').val();
        $.ajax({
            method: 'POST',
            url: 'http://localhost:3000/signup',
            data: {
                email,
                password
            }
        })
            .done(token => {
                fetchTodos();
                $('#dashboard-page').show();
                $('#signup-page').hide();
                $('#signin-page').hide();
                $('#create-todo-page').hide();
                $('#update-todo-page').hide();
                console.log('sign up success', token);
            })
            .fail(err => {
                if (err.responseJSON.error) {
                    swal ( "Oops" ,  `${err.responseJSON.error}` ,  "error" )
                } else {
                    swal ( "Oops" ,  `${err.responseJSON}` ,  "error" )
                }
                console.log('sign up failed', err);
            })
    })

    $('#signin-form').on('submit', function (e) {
        e.preventDefault();
        const email = $('#signin-email').val();
        const password = $('#signin-password').val();
        $.ajax({
            url: 'http://localhost:3000/signin',
            method: 'POST',
            data: {
                email,
                password
            }
        })
            .done(token => {
                localStorage.setItem('token', token);
                console.log('sign in success', token);
                fetchTodos();
                $('#dashboard-page').show();
                $('#signup-page').hide();
                $('#signin-page').hide();
                $('#create-todo-page').hide();
                $('#update-todo-page').hide();
            })
            .fail(err => {
                swal ( "Oops" ,  `${err.responseJSON.error}` ,  "error" )
                console.log('sign in failed', err.responseJSON.error);
            })
    })

    $('#btn-signout').on('click', function () {
        localStorage.clear();
        signOut();
        $('#dashboard-page').hide();
        $('#signup-page').hide();
        $('#signin-page').show();
        $('#create-todo-page').hide();
        $('#update-todo-page').hide();
    })

    $('#btn-redir-signup').on('click', function () {
        $('#dashboard-page').hide();
        $('#signup-page').show();
        $('#signin-page').hide();
        $('#create-todo-page').hide();
        $('#update-todo-page').hide();
    })

    $('#btn-redir-signin').on('click', function () {
        $('#dashboard-page').hide();
        $('#signup-page').hide();
        $('#signin-page').show();
        $('#create-todo-page').hide();
        $('#update-todo-page').hide();
    })

    $('#btn-redir-create-todo').on('click', function () {
        $('#dashboard-page').hide();
        $('#signup-page').hide();
        $('#signin-page').hide();
        $('#create-todo-page').show();
        $('#update-todo-page').hide();
    })

    $('#create-todo-form').on('submit', function (e) {
        e.preventDefault();
        const title = $('#title').val();
        const description = $('#description').val();
        const due_date = $('#due_date').val();
        // console.log(title, description, status, due_date);
        // console.log(localStorage.getItem('token'));
        $.ajax({
            method: 'POST',
            url: 'http://localhost:3000/todos',
            data: {
                title,
                description,
                status: false,
                due_date
            },
            headers: {
                token: localStorage.getItem('token')
            }
        })
            .done(createdTodo => {
                console.log('New todo successfully created', createdTodo);
                $('#dashboard-page').show();
                $('#signup-page').hide();
                $('#signin-page').hide();
                $('#create-todo-page').hide();
                $('#update-todo-page').hide();
                fetchTodos();
            })
            .fail(err => {
                let theErrors = '';
                for (let i = 0; i < err.responseJSON.length; i++) {
                    theErrors += err.responseJSON[i]
                    if (i !== err.responseJSON.length - 1) {
                        theErrors += ', '
                    }
                }
                swal ( "Oops" ,  `${theErrors}` ,  "error" )
                console.log('Error!', err);
            })
    })

    $('#update-todo-form').on('submit', function (e) {
        e.preventDefault();
        console.log('update me senpai');
        const title = $('#update-title').val();
        const description = $('#update-description').val();
        const status = $('#update-status').val();
        const due_date = $('#update-due_date').val();

        $.ajax({
            method: 'PUT',
            url: `http://localhost:3000/todos/${localStorage.getItem('todoId')}`,
            data: {
                title,
                description,
                status,
                due_date
            },
            headers: {
                token: localStorage.getItem('token')
            }
        })
            .done(response => {
                $('#dashboard-page').show();
                $('#signup-page').hide();
                $('#signin-page').hide();
                $('#create-todo-page').hide();
                $('#update-todo-page').hide();
                fetchTodos();
                console.log('save changed', response);
            })
            .fail(err => {
                console.log('Error!', err);
            })
    })
})