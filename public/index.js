let idToEdit;
let isLogin = false;
let isError = false;
// const URL = "http://localhost:3000/"
const URL = "https://young-mountain-49683.herokuapp.com/"

//#region function

const getToken = () => {
    return localStorage.getItem('token');
}

const fetchTodos = () => {
    showLoading();
    $.ajax({
        method: "GET",
        url: URL + "todos",
        headers: {
            token: getToken()
        }
    })
        .done(function (response) {
            $("#todo-table-body").empty();
            $("#quotes").empty();
            console.log(response);
            response.data.forEach(el => {
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

            response.quotes.forEach(el => {
                $("#quotes").append(`<h4>${el}</h4>`);
            });

            showTodoList();
        })
        .fail((err) => {
            console.log(err.responseText);
            console.log(err);
            isError = true;
            // showError(err.responseText);
            showTodoList(err)
        })
}

const createTodo = () => {
    showLoading();
    const title = $("#todo-title").val();
    const description = $("#todo-description").val();
    const due_date = $("#todo-duedate").val();
    $.ajax({
        method: "POST",
        url: URL + "todos/",
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
            showTodoList(err);
            // showTodoList(err.responseJSON[0]);
        })
}

const deleteTodo = (id) => {
    // const sure = confirm("are you sure want to delete this data?");
    // if (sure) {
    //     showLoading();
    //     $.ajax({
    //         method: "DELETE",
    //         url: URL + "todos/" + id,
    //         headers: {
    //             token: getToken()
    //         }
    //     })
    //         .done(function (response) {
    //             fetchTodos();
    //             showTodoList();
    //         })
    //         .fail((err) => {
    //             console.log(err.responseText);
    //             console.log(err);
    //             isError = true;
    //             showTodoList(err);
    //             // showError(err.responseText);
    //         })
    // }
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.value) {
            showLoading();
            $.ajax({
                method: "DELETE",
                url: URL + "todos/" + id,
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
                    showTodoList(err);
                    // showError(err.responseText);
                })
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
        }
    })
}

const editTodo = () => {
    $.ajax({
        method: "PUT",
        url: URL + "todos/" + idToEdit,
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
            console.log(err);
            isError = true;
            showTodoList(err);
            // showError(err.responseText);
        })
}

const convertDate = (iso) => {
    return iso.slice(0, iso.indexOf('.'));
}

const generateDate = () => {
    let date = convertDate(new Date().toISOString());
    date = date.slice(0, date.length-3)
    return date
}

const clearCreateTodo = () => {
    $("#todo-duedate").val(generateDate());
    $("#todo-description").val("");
    $("#todo-title").val("");
}

const getEdit = (id) => {
    $.ajax({
        method: "GET",
        url: URL + "todos/" + id,
        headers: {
            token: getToken()
        }
    })
        .done(function (response) {
            response = response.data;
            response.due_date = convertDate(response.due_date);
            $("#edit-todo-title").val(response.title);
            $("#edit-todo-description").val(response.description);
            $("#edit-todo-status").val(response.status);
            $("#edit-todo-duedate").val(response.due_date);
            idToEdit = response.id;
            showUpdate();
        })
        .fail((err) => {
            console.log(err);
            isError = true;
            showUpdate(err);
            // showError(err.responseText);
        })
}

const login = () => {
    const email = $("#email-login").val();
    const password = $("#password-login").val();
    $.ajax({
        method: "POST",
        url: URL + "login",
        data: {
            email,
            password
        }
    })
        .done(function (response) {
            localStorage.setItem('token', response.token);
            isLogin = true;
            fetchTodos();
            showTodoList();
            showNav();
        })
        .fail((err) => {
            console.log(err);
            isError = true;
            showLoginRegister(err);
        })
}

const register = () => {
    const email = $("#email-register").val();
    const password = $("#password-register").val();
    $.ajax({
        method: "POST",
        url: URL + "register",
        data: {
            email,
            password
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
            console.log(err);
            isError = true;
            console.log("<<<<<<<<<<<<<<<<<<<");
            showLoginRegister(err);
        })
}

const logout = () => {
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    
    showLoginRegister();

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
        url: URL + "googleLogin",
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
            showLoginRegister(err);
            // showError(err.responseText);
        })
}

//#endregion

//#region show

const showLoginRegister = (err) => {
    showError(err);
    $("#login").show();
    $("#register").show();
    $("#login-register").show();
    $("#update-todo").hide();
    $("#todo-list").hide();
    $("#todo-create").hide();
    $("#loading").hide();
}

const showUpdate = (err) => {
    showError(err);
    // $("#login").hide();
    // $("#register").hide();
    $("#login-register").hide();
    $("#update-todo").show();
    $("#todo-list").hide();
    $("#todo-create").hide();
    $("#loading").hide();
}

const showTodoList = (err) => {
    showError(err);
    // $("#todo-duedate").val(generateDate());
    clearCreateTodo();
    // $("#login").hide();
    // $("#register").hide();
    $("#login-register").hide();
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

const showError = (err) => {
    console.log(err);
    console.log("<<<<<<<<<<");
    if (isError) {
        let msg;
        if(err.status == 400) {
            msg = err.responseJSON.error;
        } else {
            msg = err.responseJSON.error;
        }
        console.log(msg);
        console.log("<<<<<<<<<<<<<<<<<<");
        $("#error-alert").empty();
        $("#error-alert").append(msg);
        $("#error-alert").show();
        isError = false;
    } else {
        $("#error-alert").hide();
    }
}

const showLoading = () => {
    // $("#login").hide();
    // $("#register").hide();
    $("#login-register").hide();
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
        fetchTodos();
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