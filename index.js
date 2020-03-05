let idToEdit;
let isLogin = false;
let isError = false;

//#region function

const getToken = () => {
    return localStorage.getItem('token');
}

const fetchTodos = () => {
    showLoading();
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/todos",
        headers: {
            token: getToken()
        }
    })
        .done(function (response) {
            $("#todo-table-body").empty();
            response.forEach(el => {
                el.due_date = el.due_date.slice(0, el.due_date.indexOf('.'))
                el.due_date = el.due_date.split("T").join(" ");
                $("#todo-table-body").append(
                    `<tr>
                        <td>${el.title}</td>
                        <td>${el.description}</td>
                        <td>${el.due_date}</td>
                        <td>${el.status}</td>
                        <td>
                            <button type="button" onclick=getEdit(${el.id}) class="btn btn-info">Edit</button>
                            <button type="button" onclick=deleteTodo(${el.id}) class="btn btn-danger">Delete</button>
                        </td>
                    </tr>`
                );
            });
            // fetchTodos();
            showTodoList();
        })
        .fail((err) => {
            console.log(err.responseText);
            console.log(err);
            isError = true;
            // showError(err.responseText);
            showTodoList(err.responseText)
        })
}

const createTodo = () => {
    showLoading();
    const title = $("#todo-title").val();
    const description = $("#todo-description").val();
    const due_date = $("#todo-duedate").val();
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/todos/",
        headers: {
            token: getToken()
        },
        data: {
            title,
            description,
            due_date
        }
    })
        .done(function (response) {
            fetchTodos();
            showTodoList();
        })
        .fail((err) => {
            console.log(err.responseText);
            console.log(err);
            isError = true;
            showTodoList(err.responseJSON[0]);
        })
}

const deleteTodo = (id) => {
    const sure = confirm("are you sure want to delete this data?");
    if (sure) {
        showLoading();
        $.ajax({
            method: "DELETE",
            url: "http://localhost:3000/todos/" + id,
            headers: {
                token: getToken()
            }
        })
            .done(function (response) {
                fetchTodos();
                showTodoList();
            })
            .fail((err) => {
                console.log(err.responseText);
                console.log(err);
                isError = true;
                showTodoList(err.responseText);
                // showError(err.responseText);
            })
    }
}

const editTodo = () => {
    $.ajax({
        method: "PUT",
        url: "http://localhost:3000/todos/" + idToEdit,
        headers: {
            token: getToken()
        },
        data: {
            title: $("#edit-todo-title").val(),
            description: $("#edit-todo-description").val(),
            status: $("#edit-todo-status").val(),
            due_date: $("#edit-todo-duedate").val()
        }
    })
        .done(function (response) {
            fetchTodos();
            showTodoList();
        })
        .fail((err) => {
            console.log(err.responseText);
            console.log(err);
            isError = true;
            showTodoList(err.responseText);
            // showError(err.responseText);
        })
}

const getEdit = (id) => {
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/todos/" + id,
        headers: {
            token: getToken()
        }
    })
        .done(function (response) {
            console.log(response);
            response.due_date = response.due_date.slice(0, response.due_date.indexOf('.'))
            $("#edit-todo-title").val(response.title);
            $("#edit-todo-description").val(response.description);
            $("#edit-todo-status").val(response.status);
            $("#edit-todo-duedate").val(response.due_date);
            idToEdit = response.id;
            showUpdate();
        })
        .fail((err) => {
            console.log(err.responseText);
            console.log(err);
            isError = true;
            showUpdate(err.responseText);
            // showError(err.responseText);
        })
}

const login = () => {
    const email = $("#email-login").val();
    const password = $("#password-login").val();
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/login",
        data: {
            email,
            password
        }
    })
        .done(function (response) {
            console.log(response);
            localStorage.setItem('token', response.token);
            isLogin = true;
            fetchTodos();
            showTodoList();
            showNav();
        })
        .fail((err) => {
            // console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
            // console.log(err.responseText);
            // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            // console.log(err);
            isError = true;
            // showError("Error connecting to server");
            showLoginRegister("Error connecting to server");
        })
}

const register = () => {
    const email = $("#email-register").val();
    const password = $("#password-register").val();
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/register",
        data: {
            email,
            password
        }
    })
        .done(function (response) {
            console.log(response);
            localStorage.setItem('token', response.token)
            isLogin = true;
            fetchTodos();
            showTodoList();
            showNav();
        })
        .fail((err) => {
            console.log(err.responseText);
            console.log(err);
            isError = true;
            showLoginRegister("Error connecting to server")
        })
}

const logout = () => {
    showLoginRegister();
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    

    localStorage.clear();
    isLogin = false;

    showNav();
}

function onSignIn(googleUser) {
    showLoading();
    let profile = googleUser.getBasicProfile();
    let id_token = googleUser.getAuthResponse().id_token;

    $.ajax({
        method: "POST",
        url: "http://localhost:3000/googleLogin",
        headers: {
            gtoken: id_token
        }
    })
        .done(function (response) {
            localStorage.setItem('token', response.token)
            isLogin = true;
            fetchTodos();
            showTodoList();
            showNav();
        })
        .fail((err) => {
            console.log(err.responseText);
            console.log(err);
            isError = true;
            showLoginRegister("Error connecting to server");
            // showError(err.responseText);
        })
}

//#endregion

//#region show

const showLoginRegister = (err) => {
    showError(err);
    $("#login").show();
    $("#register").show();
    $("#update-todo").hide();
    $("#todo-list").hide();
    $("#todo-create").hide();
    $("#loading").hide();
}

const showUpdate = (err) => {
    showError(err);
    $("#login").hide();
    $("#register").hide();
    $("#update-todo").show();
    $("#todo-list").hide();
    $("#todo-create").hide();
    $("#loading").hide();
}

const showTodoList = (err) => {
    showError(err);
    $("#login").hide();
    $("#register").hide();
    $("#update-todo").hide();
    $("#todo-list").show();
    $("#todo-create").show();
    $("#loading").hide();
    // fetchTodos();
}

const showNav = () => {
    showError();
    if (isLogin) {
        $("#nav-logedIn").show();
        $("#nav-not-logedIn").hide();
    } else {
        $("#nav-logedIn").hide();
        $("#nav-not-logedIn").show();
    }
}

const showError = (msg) => {
    if (isError) {
        $("#error-alert").empty();
        $("#error-alert").append(msg);
        $("#error-alert").show();
        isError = false;
    } else {
        $("#error-alert").hide();
    }
}

const showLoading = () => {
    $("#login").hide();
    $("#register").hide();
    $("#update-todo").hide();
    $("#todo-list").hide();
    $("#todo-create").hide();
    $("#loading").show();
}

const hideLoading = (callback) => {
    $("#loading").hide();
    callback();
}

const clearForm = () => {
    $("#email-login").val("");
    $("#password-login").val("");
    $("#email-register").val("");
    $("#password-register").val("");
}

//#endregion

$(document).ready(function () {
    if (getToken()) {
        isLogin = true;
        showTodoList();
        showNav();
    } else {
        showLoginRegister();
        showNav();
    }
})

$("#login-form").on("submit", (e) => {
    e.preventDefault();
    login();
    clearForm();
})

$("#register-form").on("submit", (e) => {
    e.preventDefault();
    register();
    clearForm();
})

$("#create-todo-form").on("submit", (e) => {
    e.preventDefault();
    createTodo();
})

$("#update-todo-form").on("submit", (e) => {
    e.preventDefault();
    editTodo();
})

$("#logout").on("click", (e) => {
    e.preventDefault();
    logout();
})

$("#to-home").on("click", (e) => {
    e.preventDefault();
    showTodoList();
})

$("#to-login").on("click", (e) => {
    e.preventDefault();
    showLoginRegister();
})