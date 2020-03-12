$(document).ready(function () {
    $("#login-page").hide()
    $("#Dashboard").hide()
    $("#register-page").hide()


    $("#login-btn").on("click", function (event) {
        $("#register-page").hide()
        $("#login-page").show()
        $(".g-signin2").show()
    });

    $("#register-btn").on("click", function (event) {
        $("#login-page").hide()
        $("#register-page").show()
    })

    if (localStorage.getItem("token")) {
        $("#list-todo").empty()
        afterLogin()
    }

    // ---- form login ------------
    $("#form-login").on("submit", function (event) {
        event.preventDefault()
        $("#login-page").hide()
        let email = $("#email-log").val()
        let password = $("#password-log").val()
        $.ajax({
            url: 'https://stormy-castle-37257.herokuapp.com/users/signin',
            method: 'POST',
            data: {
                email,
                password
            }
        })
            .done(result => {
                localStorage.setItem("token", result)
                $("#list-todo").empty()
                afterLogin()
                Swal.fire(
                    'Good job!',
                    'You are now logged in!',
                    'success'
                )
            })
            .fail(err => {
                let msg = err.responseJSON
                Swal.fire(
                    'Error!',
                    `${msg}`,
                    'error'
                )
            })
    })

    // ---- form register ------------
    $("#form-register").on("submit", function (event) {
        event.preventDefault()
        let email = $("#email-reg").val()
        let password = $("#password-reg").val()
        $.ajax({
            url: "https://stormy-castle-37257.herokuapp.com/users/signup",
            method: "POST",
            data: {
                email,
                password
            }
        })
            .done(result => {
                Swal.fire(
                    'Good job!',
                    'You can login now!',
                    'success'
                )
                $("#register-page").hide()
                $("#login-page").show()
            })
            .fail(err => {
                let msg = err.responseJSON
                Swal.fire(
                    'Error!',
                    `${msg}`,
                    'error'
                )
            })
    })

    // logout
    $("#logout").on("click", function (event) {
        localStorage.removeItem("token")
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () { });
        $("#Dashboard").hide()
        $("#landing-page").show()
        $(".g-signin2").show()
    })


    //Add Todo--------------------------


    $("#btn-addTodo").on("click", async function (event) {
        const {
            value: formValues
        } = await Swal.fire({
            title: 'Add Todo',
            html: '<h3>Title</h3>' +
                '<input id="title-add" class="swal2-input input is-primary">' +
                '<h3>Description</h3>' +
                '<input id="description-add" class="swal2-input input is-primary">' +
                '<h3>Due Date</h3>' +
                `<input id="due-date-add" type="date" class="swal2-input input is-primary">`,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    title: document.getElementById('title-add').value,
                    description: document.getElementById('description-add').value,
                    due_date: document.getElementById('due-date-add').value
                }
            }
        })

        if (formValues) {
            let title = formValues.title
            let description = formValues.description
            let due_date = formValues.due_date
            $.ajax({
                url: "https://stormy-castle-37257.herokuapp.com/todos",
                method: "POST",
                headers: {
                    token: localStorage.getItem('token')
                },
                data: {
                    title,
                    description,
                    due_date,
                    status: false
                }
            })
                .done(res => {
                    $("#list-todo").empty()
                    afterLogin()
                    Swal.fire(
                        'Good job!',
                        'success add new todo'
                    )
                })
                .fail(err => {
                    Swal.fire({
                        icon: 'error',
                        title: `Oops... ${err.status}`,
                        text: err.responseText
                    })
                })
        }

    })
});





function afterLogin() {
    $("#register-page").hide()
    $("#login-page").hide()
    $(".g-signin2").hide()
    $("#list-todo-completed").empty()
    $("#list-todo-pending").empty()
    $("#landing-page").hide()
    $("#Dashboard").show()
    $.ajax({
        url: "https://stormy-castle-37257.herokuapp.com/todos",
        method: "GET",
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(result => {
            for (let i = 0; i < result.length; i++) {
                let dateFormat = new Date(result[i].due_date).toISOString().substring(0, 10)
                let year = dateFormat.substring(0, 4)
                let month = dateFormat.substring(5, 7)
                let date = dateFormat.substring(8, 10)
                month = monthConverter(month)
                let due_date = `${date} - ${month} - ${year}`
                if (result[i].status) {
                    $("#list-todo-completed").append(`
                    <div class="tile is-parent">
                    <article class = "message is-success tile is-child box"  >
                    <div class = "message-header">
                    <a class="update-btn-${result[i].id}" style="text-decoration: none;"><i class="fas fa-calendar-check"></i></a>
                    <a class="update-btn-${result[i].id}" style="text-decoration: none;">${result[i].title}</a>
                    <button class ="delete btn-delete" aria-label= "delete"></button> 
                    </div> 
                    <div class = "message-body">
                    ${result[i].description}
                    </div> 
                    <div class="tags has-addons">
                    <a class="update-btn-${result[i].id}" style="text-decoration: none;">
                    <span class="tag">Due Date</span>
                    <span class="tag is-primary">${due_date}</span>
                    </a>
                    </div> 
                    </article>
                    </div> 
                `)
                } else {
                    $("#list-todo-pending").append(`
                    <div class="tile is-parent">
                    <article class = "message is-danger tile is-child box"  >
                    <div class = "message-header">
                    <a class="update-btn-${result[i].id}" style="text-decoration: none;"><i class="fas fa-calendar-minus"></i></a>
                    <a class="update-btn-${result[i].id}" style="text-decoration: none;">${result[i].title}</a>
                    <button class ="delete btn-delete" aria-label= "delete"></button> 
                    </div> 
                    <div class = "message-body">
                    ${result[i].description}
                    </div> 
                    <div class="tags has-addons">
                    <a class="update-btn-${result[i].id}" style="text-decoration: none;">
                    <span class="tag">Due Date</span>
                    <span class="tag is-danger">${due_date}</span>
                    </a>
                    </div> 
                    </article> 
                    </div
                `)
                }


                $(".btn-delete").on("click", function (event) {
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, delete it!'
                    }).then((res) => {
                        if (res.value) {
                            $.ajax({
                                url: `https://stormy-castle-37257.herokuapp.com/todos/${result[i].id}`,
                                method: "DELETE",
                                headers: {
                                    token: localStorage.getItem('token')
                                }
                            })
                                .done(result => {
                                    Swal.fire(
                                        'Deleted!',
                                        'Your file has been deleted.',
                                        'success'
                                    )
                                    afterLogin()
                                })
                        }
                    })
                })

                $(`.update-btn-${result[i].id}`).on("click", async function (event) {
                    let id = result[i].id
                    let title = result[i].title
                    let description = result[i].description
                    let due_date_update = dateFormat
                    let statusTrue = ""
                    let statusFalse = ""
                    if (result[i].status) {
                        statusTrue = "selected"
                    } else statusFalse = "selected"
                    const {
                        value: formValues
                    } = await Swal.fire({
                        title: 'Update Todo',
                        html: '<h3>Title</h3>' +
                            `<input id="title-update" class="swal2-input input is-primary" value="${title}">` +
                            '<h3>Description</h3>' +
                            `<input id="description-update" class="swal2-input input is-primary" value="${description}">` +
                            '<h3>Due Date</h3>' +
                            `<input id="due-date-update" type="date" class="swal2-input input is-primary" value="${due_date_update}">` +
                            '<h3>Status</h3>' +
                            `<div class="select is-primary">
                            <select id="status-update">
                            <option>Select Status</option>` +
                            `<option ${statusTrue} value="true">Completed</option>
                                <option ${statusFalse} value="false">Pending</option>` +
                            `</select>
                            </div>`,
                        focusConfirm: false,
                        preConfirm: () => {
                            return {
                                title: document.getElementById('title-update').value,
                                description: document.getElementById('description-update').value,
                                due_date: document.getElementById('due-date-update').value,
                                status: document.getElementById('status-update').value
                            }
                        }
                    })

                    if (formValues) {
                        let title = formValues.title
                        let description = formValues.description
                        let due_date = formValues.due_date
                        let status = formValues.status
                        let data = {
                            title,
                            description,
                            due_date,
                            status
                        }
                        update(id, data)
                    }
                })
            }
        })
}


function update(id, data) {
    $.ajax({
        url: `https://stormy-castle-37257.herokuapp.com/todos/${id}`,
        method: "PUT",
        headers: {
            token: localStorage.getItem('token')
        },
        data
    })
        .done(res => {
            $("#list-todo").empty()
            afterLogin()
            Swal.fire(
                'Good job!',
                'success Update todo'
            )
        })
        .fail(err => {
            console.log(err);
            Swal.fire({
                icon: 'error',
                title: `Oops... ${err.status}`,
                text: err.responseText
            })
        })
}

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    const id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        url: "https://stormy-castle-37257.herokuapp.com/users/goosignin",
        method: "POST",
        headers: {
            token: id_token
        }
    })
        .done(result => {
            localStorage.setItem("token", result)
            afterLogin()
            Swal.fire(
                'Good job!',
                'You are now logged in!',
                'success'
            )
        })
        .always(result => {

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