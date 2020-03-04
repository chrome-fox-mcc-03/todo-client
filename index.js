function fetchTodos() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:3000/todos',
        headers: {
            token: localStorage.getItem('token')
        } 
    })
        .done(todos => {
            $('#todos-space').empty();
            for (let i = 0; i < todos.length; i++) {
                $('#todos-space').append(`<p>${todos[i].title}</p><button onclick="editTodo(${todos[i].id})">Edit</button><button onclick="deleteTodo(${todos[i].id})">Delete</button>`)
            }
            console.log(todos);
        })
        .fail(err => {
            console.log(err);
        })
}

function editTodo(id){
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
            $('#update-status').val(todoFound.status);
            $('#update-due_date').val(dateFormat);
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
            fetchTodos();
        })
        .fail(err => {
            console.log('error!', err);
        })
}

$(document).ready(function() {
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

    $('#signup-form').on('submit', function(e) {
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
                console.log('sign up failed', err);
            })
    })

    $('#signin-form').on('submit', function(e) {
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
                console.log('sign in failed', err);
            })
    })

    $('#btn-signout').on('click', function() {
        localStorage.clear();
        $('#dashboard-page').hide();
        $('#signup-page').hide();
        $('#signin-page').show();
        $('#create-todo-page').hide();
        $('#update-todo-page').hide();
    })

    $('#btn-redir-signup').on('click', function() {
        $('#dashboard-page').hide();
        $('#signup-page').show();
        $('#signin-page').hide();
        $('#create-todo-page').hide();
        $('#update-todo-page').hide();
    })

    $('#btn-redir-signin').on('click', function() {
        $('#dashboard-page').hide();
        $('#signup-page').hide();
        $('#signin-page').show();
        $('#create-todo-page').hide();
        $('#update-todo-page').hide();
    })

    $('#btn-redir-create-todo').on('click', function() {
        $('#dashboard-page').hide();
        $('#signup-page').hide();
        $('#signin-page').hide();
        $('#create-todo-page').show();
        $('#update-todo-page').hide();
    })

    $('#create-todo-form').on('submit', function(e) {
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
                console.log('Error!', err);
            })
    })

    $('#update-todo-form').on('submit', function(e) {
        e.preventDefault();
        console.log('update me senpai');
        // const title = $('#update-title').val();
        // const description = $('#update-description').val();
        // const status = $('#update-status').val();
        // const due_date = $('#update-due_date').val();

        // $.ajax({
        //     method: 'PUT',
        //     url: `http://localhost:3000/todos/${}`,//idnya darimana?
        //     data: {

        //     },
        //     headers: {
        //         token: localStorage.getItem('token')
        //     }
        // })
    })
})