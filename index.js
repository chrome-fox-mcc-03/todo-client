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
                $('#todos-space').append(`<p>${todos[i].title}</p><button onclick="editTodo(${todos[i].id})">Edit</button>`)
            }
            console.log(todos);
        })
        .fail(err => {
            console.log(err);
        })
}
function editTodo(id){
    // alert(id)
    $.ajax({
        method: 'GET',
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        } 
    })
        .done(todoFound => {
            console.log(todoFound);
            $('#update-title').val(todoFound.title)
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
    } else {
        $('#dashboard-page').hide();
        $('#signup-page').hide();
        $('#signin-page').show();
        $('#create-todo-page').hide();
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
    })

    $('#btn-redir-signup').on('click', function() {
        $('#dashboard-page').hide();
        $('#signup-page').show();
        $('#signin-page').hide();
        $('#create-todo-page').hide();
    })

    $('#btn-redir-signin').on('click', function() {
        $('#dashboard-page').hide();
        $('#signup-page').hide();
        $('#signin-page').show();
        $('#create-todo-page').hide();
    })

    $('#btn-redir-create-todo').on('click', function() {
        $('#dashboard-page').hide();
        $('#signup-page').hide();
        $('#signin-page').hide();
        $('#create-todo-page').show();
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
            })
            .fail(err => {
                console.log('Error!', err);
            })
    })

    $('#btn-edit-todo22').on('click', function() {
        console.log('editin dong');
    })
})