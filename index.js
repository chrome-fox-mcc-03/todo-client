import { calendar } from "googleapis/build/src/apis/calendar"

function hideAll() {
    $("#loading").hide()
    $("#landing-page").hide()
    $("#quotes").hide()
    $("#login").hide()
    $("#register").hide()
    $("#lists").hide()
    $("#create").hide()
    $("#update").hide()
}

function fetchData() {
    $.ajax({
        method: 'GET',
        url: 'https://hidden-fjord-69308.herokuapp.com//todos',
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
                    <div class="card mb-3 text-dark" style="max-width: 540px;">
                        <div class="row no-gutters">
                        <div class="col-md-10">
                            <div class="card-body">
                                <h5 class="card-title font-weight-bold">${todo.title}</h5>
                                <p class="card-text font-weight-light">${todo.description}</p>
                                <p class="card-text" id="due_date"><small class="text-muted">${todo.due_date}</small></p>                                
                            </div>
                        </div>
                        <div class="col-md-2 d-flex align-item-center">
                            <button type="button" onclick="edit(${todo.id})" class="btn btn-success">Edit</button>
                            <button type="button" onclick="remove(${todo.id})" class="btn btn-danger">Remove</button>                        </div>
                    </div>
                `)
            })
            $("#lists").show()
        })
        .fail(err => {
            Toastify({
                text: err.responseText,
                newWindow: true,
                backgroundColor: "#b80d57",
                className: "ERROR",
              }).showToast();
        })
}

function fetchQuotes() {
    $.ajax({
        method: 'GET',
        url: 'https://hidden-fjord-69308.herokuapp.com//quotes'
    })
        .done(quote => {
            console.log(quote)
            $("#quote").empty()
            $("#quote").append(`
                    <h1 class="display-3 text-center font-weight-bold">${quote.quoteText}</h1>
                    <p class="display-4 text-center">Login and create your pupose today!</p>
            `)
            
        })
        .fail(err => {
            Toastify({
                text: err.responseText,
                newWindow: true,
                backgroundColor: "#b80d57",
                className: "ERROR",
              }).showToast();
        })
}

function fetchImages() {
    $.ajax({
        method: 'GET',
        url: 'https://hidden-fjord-69308.herokuapp.com//images'
    })
        .done(image => {
            // $("#landing-page").append(`
            // <div  id="quote-container" class="p-6 flex-fill " style="background-image: url(${image.url});">
            //     <div id="quote-image"class="jumbotron-fluid">
                    
            //     </div>
            // </div>
            // `)
            console.log(image)
        })
        .fail(err => {
            Toastify({
                text: err.responseText,
                newWindow: true,
                backgroundColor: "#b80d57",
                className: "ERROR",
              }).showToast();
        })
}

function edit(id) {
    $.ajax({
        method: "GET",
        url: `https://hidden-fjord-69308.herokuapp.com//todos/${id}`,
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
            Toastify({
                text: err.responseText,
                newWindow: true,
                backgroundColor: "#b80d57",
                className: "ERROR",
              }).showToast();
        })
}

function remove(id) {
    $.ajax({
        method: "DELETE",
        url: `https://hidden-fjord-69308.herokuapp.com//todos/${id}`,
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
            Toastify({
                text: err.responseText,
                newWindow: true,
                backgroundColor: "#b80d57",
                className: "ERROR",
            }).showToast();
        })
}

function isLogin() {
    if(localStorage.access_token){
        hideAll()
        $("#quote").empty()
        $("#nav-login").show()
        fetchData()
    } else {
        hideAll()
        $("#nav-login").hide()
        fetchQuotes()
        fetchImages()
        $("#quotes").show()
        $("#login").show()
    }
}

function onSignIn(googleUser) {
    let token_google = googleUser.getAuthResponse().id_token
    let profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    $.ajax({
        method: "POST",
        url: "https://hidden-fjord-69308.herokuapp.com//googleSignIn",
        headers: {
            token_google : token_google
        }
    })
        .done(({ access_token}) => {
            localStorage.setItem("access_token", access_token)
            isLogin()
        })
        .fail( err => {
            Toastify({
                text: err.responseText,
                newWindow: true,
                backgroundColor: "#b80d57",
                className: "ERROR",
              }).showToast();
        })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance()
    auth2.signOut().then(function () {
        console.log('User signed out.')
    })
    localStorage.clear()
}

$(document).ready( () => {
    isLogin()

    $("#registerButton").on("click", (e) => {
        e.preventDefault()
        hideAll()
        $("#register").show()
    })

    $("#logout").on("click", (e) => {
        e.preventDefault()
        signOut()
        isLogin()
    })

    $("#createTodo").on("click", (e) => {
        hideAll()
        $("#create").show()
    })

    $("#register").on("submit", (e) => {
        let newUser = {
            email: $("#emailRegister").val(),
            password: $("#passwordRegister").val()
        }
        $.ajax({
            method: 'POST',
            url: 'https://hidden-fjord-69308.herokuapp.com//register',
            data: newUser
        })
            .done(user => {
                e.preventDefault()
                hideAll()
                $("#login").show()
                console.log('berhasil register')
            })
            .fail(err => {
                Toastify({
                    text: err.responseText,
                    newWindow: true,
                    backgroundColor: "#b80d57",
                    className: "ERROR",
                  }).showToast();
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
            url: 'https://hidden-fjord-69308.herokuapp.com//login',
            data: userLogin
        })
            .done(({access_token}) => {
                hideAll()
                $("#quote").empty()
                $("#nav-login").show()
                localStorage.setItem('access_token', access_token)
                fetchData()
                $("#lists").show()
            })
            .fail(err => {
                Toastify({
                    text: err.responseText,
                    newWindow: true,
                    backgroundColor: "#b80d57",
                    className: "ERROR",
                  }).showToast();
                console.log(err.responseText)
                isLogin()
            })
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
            url: "https://hidden-fjord-69308.herokuapp.com//todos",
            data: newTodo,
            headers: {
                access_token: localStorage.getItem("access_token")
            }
        })
            .done(todo => {
                hideAll()
                console.log(todo)
                fetchData()
                return $.ajax({
                    url: 'https://hidden-fjord-69308.herokuapp.com//googleCalender',
                    method: 'POST',
                    data: {
                      title: data.title,
                      description: data.description,
                      due_date: data.due_date
                    }
                })
            })
            .done(googleCalendar=> {
                console.log(googleCalendar)
            })
            .fail(err => {
                Toastify({
                    text: err.responseText,
                    newWindow: true,
                    backgroundColor: "#b80d57",
                    className: "ERROR",
                  }).showToast();
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
            url: `https://hidden-fjord-69308.herokuapp.com//todos/${id}`,
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
                Toastify({
                    text: err.responseText,
                    newWindow: true,
                    backgroundColor: "#b80d57",
                    className: "ERROR",
                  }).showToast();
            })

    })

})