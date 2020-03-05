function hideAll() {
    $("#loading").hide()
    $("#login").hide()
    $("#register").hide()
    $("#table").hide()
    $("#create").hide()
    $("#update").hide()
}

function fetchData() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:3000/todos',
        headers: {
            access_token : localStorage.getItem('access_token')
        }
    })
        .done(todos => {
            $("#listTodo").empty()
            let counter = 0
            // console.log(todos[0])
            todos.forEach( todo => {
                counter++
                console.log(todo)
                $("#listTodo").append(`
                <tr>
                    <th scope="row">${counter}</th>
                    <td>${todo.title}</td>
                    <td>${todo.description}</td>
                    <td>${todo.due_date}</td>
                    <td>
                    <button type="click" onclick="edit(${todo.id})" class="btn btn-success">Edit</button>| 
                    <button type="click" onclick="remove(${todo.id})" class="btn btn-danger">Delete</button>
                    </td> 
                </tr>
                `)
            })
            $("#table").show()

        })
        .fail(err => {
            console.log(err.responseText)
        })
}

function edit(id) {
    $.ajax({
        method: "GET",
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            access_token : localStorage.getItem("access_token")
        }
    })
        .done(todo => {
            let date = new Date(todo.due_date)
            let day = ("0" + date.getDate()).slice(-2)
            let month = ("0" + (date.getMonth() + 1)).slice(-2)
            let dateTodo = date.getFullYear() + "-" + (month) + "-" + (day)
            hideAll()
            $("#IdUpdate").val(todo.id)
            $("#titleUpdate").val(todo.title)
            $("#descriptionUpdate").val(todo.description)
            $("#dateUpdate").val(dateTodo)

            $("#update").show()
        })
        .fail(err => {
            console.log(err)
        })
}

function remove(id) {
    $.ajax({
        method: "DELETE",
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            access_token: localStorage.getItem("access_token")
        }
    })
        .done(todo => {
            hideAll()
            fetchData()
            console.log(todo)
        })
        .fail(err => {
            console.log(err)
        })
}

function isLogin() {
    if(localStorage.access_token){
        hideAll()
        fetchData()
        
    } else {
        hideAll()
        $("#nav-login").hide()
        $("#login").show()
    }
}

$(document).ready( () => {
    isLogin()

    $("#registerButton").on("click", (e) => {
        e.preventDefault()
        hideAll()
        $("#register").show()
    })

    $("#register").on("submit", (e) => {
        let newUser = {
            email: $("#emailRegister").val(),
            password: $("#passwordRegister").val()
        }
        $.ajax({
            method: 'POST',
            url: 'http://localhost:3000/register',
            data: newUser
        })
            .done(user => {
                e.preventDefault()
                hideAll()
                $("#login").show()
                console.log('berhasil register')
            })
            .fail(err => {
                console.log(err.responseText)
            })
    })

    $("#login").on("submit", (e) => {
        e.preventDefault()
        let userLogin = {
            email: $("#emailLogin").val(),
            password: $("#passwordLogin").val()
        }
        $.ajax({
            method: 'POST',
            url: 'http://localhost:3000/login',
            data: userLogin
        })
            .done(({access_token}) => {
                hideAll()
                $("#nav-login").show()
                localStorage.setItem('access_token', access_token)
                fetchData()
                $("#table").show()
            })
            .fail(err => {
                console.log(err.responseText)
                isLogin()
            })
    })

    $("#logout").on("click", (e) => {
        e.preventDefault()
        localStorage.clear()
        isLogin()
    })

    $("#createTodo").on("click", (e) => {
        hideAll()
        $("#create").show()
    })

    $("#create").on("submit", (e) => {
        e.preventDefault()
        let newTodo = {
            title: $("#titleCreate").val(),
            description: $("#descriptionCreate").val(),
            due_date: $("#dateCreate").val()
        }
        console.log(newTodo.title)
        $.ajax({
            method: "POST",
            url: "http://localhost:3000/todos",
            data: newTodo,
            headers: {
                access_token: localStorage.getItem("access_token")
            }
        })
            .done(todo => {
                hideAll()
                console.log(todo)
                fetchData()
            })
            .fail(err => {
                console.log(err)
            })
    })
    
    $("#update").on("submit", (e) => {
        e.preventDefault()
        let id =  $("#IdUpdate").val()
        let updateTodo = {
            title : $("#titleUpdate").val(),
            description: $("#descriptionUpdate").val(),
            due_date: $("#dateUpdate").val()
        }

        $.ajax({
            method: "PUT",
            url: `http://localhost:3000/todos/${id}`,
            data: updateTodo,
            headers: {
                access_token : localStorage.getItem("access_token")
            }
        })
            .done(todo => {
                hideAll()
                fetchData()
            })
            .fail(err => {
                console.log(err)
            })

    })
})