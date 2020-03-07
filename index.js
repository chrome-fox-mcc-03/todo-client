let idToEdit
function updateTodo (idUpdate) {
        // showUpdate()
        const token = localStorage.getItem('token')
        let id = idUpdate
        idToEdit = idUpdate
        console.log(idUpdate)
        $.ajax({
            method: "GET",
            headers: {
                token
            },
            url: `http://localhost:3000/todos/${id}`
        })
            .done(response => {
                console.log(response)
                $("#titleUpdate").val(response.title)
                $("#descriptionUpdate").val(response.description)
                $("#statusUpdate").val(`${response.status}`)
                let dd = new Date(response.due_date).getDate();
                let mm = new Date(response.due_date).getMonth() + 1; 
                let yyyy = new Date(response.due_date).getFullYear();
                if (dd < 10) {
                dd = '0' + dd;
                } 
                if (mm < 10) {
                mm = '0' + mm;
                } 
                let newDate = yyyy + '-' + mm + '-' + dd;
                response.due_date = newDate                
                $("#due_dateUpdate").val(response.due_date)
                //submit
                
            })
            .fail(err => {
                console.log(err.responseJSON)
                getError(err)
            })    
}

function deleteTodo(idToDelete) {
    const token = localStorage.getItem('token')
    const id = $("#deleteById").val()
    console.log(id)
    $.ajax({
        method: "DELETE",
        headers: {
            token
        },
        url: `http://localhost:3000/todos/${idToDelete}`
    })
        .done(response => {
            console.log(response)
            $("#tablebody").empty();
            getTodos()
        })
        .fail(err => {
            console.log(err)
            console.log(err.responseJSON)
            getError(err)

        })
}

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    console.log('Id Token: ' + id_token);
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/loginGoogle",
        headers: {
            id_token
        }
    })
        .done(response => {
            console.log(response)
            $("#btn-login").hide()
            $("#btn-reg").hide()
            $("#btn-logout").show()
            localStorage.setItem('token', response.token)
            showJumbotron()
        })  
        .fail(err => {
            console.log(err.responseJSON)
            getError(err)
        }) 
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
}

$("document").ready(function () {

    // $("#containerReg").hide()
    // $("#containerLogin").hide()
    // $("#containerAdd").hide()
    // $("#containerUpdate").hide()
    // $("#containerGetById").hide()
    // $("#containerDeleteById").hide()
    // $("#container2").hide()
    // $("#divTable").hide()
    localStorage.clear()
    showJumbotron()
    $("#btn-login").show()
    $("#btn-reg").show()
    $("#btn-logout").hide()
    
    $("#btn-todos").on('click',function () {
        showTodos()
    })
    $("#button-started").on('click',function () {
        const token = localStorage.getItem('token')
        if (token) {
            $("#tablebody").empty();
            getTodos()
        } else {
            showReg()
        }
    })
    $("#btn-reg").on('click',function () {
        showReg()
    })
    $("#btn-login").on('click',function () {
        showLogin()
    })
    $("#btn-add").on('click',function () {
        $("#titleAdd").val("")
        $("#descriptionAdd").val("")
        $("#status").val("")
        $("#due_dateAdd").val("")
        showAdd()
    })
    $("#btn-home").on('click',function () {
        showJumbotron()
    })
    $("#btn-delete").on('click',function () {
        showDelById()
    })
    $("#btn-getById").on('click',function () {
        showGetById()
    })
    $("#btn-logout").on('click',function () {
        signOut()
        localStorage.clear()
        $("#emailLogin").val("")
        $("#passwordLogin").val("")
        $("#btn-login").show()
        $("#btn-reg").show()
        $("#btn-logout").hide()
        $("#tablebody").empty();
        showJumbotron()
    })

    $("#form-register").on('submit',function (e) {
        const email = $("#emailReg").val()
        const password = $("#passwordReg").val()
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "http://localhost:3000/register",
            data: {
                email,
                password
            }
        })
            .done(response => {
                console.log(response)
            })  
            .fail(err => {
                console.log(err.responseJSON)
                getError(err)
            }) 
    })

    $("#form-login").on('submit',function (e) {
        const email = $("#emailLogin").val()
        const password = $("#passwordLogin").val()
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "http://localhost:3000/login",
            data: {
                email,
                password
            }
        })
            .done(response => {
                localStorage.setItem('token', response.token)
                showJumbotron()
                $("#btn-login").hide()
                $("#btn-reg").hide()
                $("#btn-logout").show()
                console.log(response)
            })  
            .fail(err => {
                console.log(err.responseJSON)
                getError(err)
            }) 
    })

    $("#formAdd").on('submit',function (e) {
        e.preventDefault()

        const title = $("#titleAdd").val()
        const description = $("#descriptionAdd").val()
        let status = $("#status").val()
        if (status === "true") {
            status = true
        } else {
            status = false
        }
        const due_date = $("#due_dateAdd").val()
        const token = localStorage.getItem('token')
        $.ajax({
            method: "POST",
            headers: {
                token
            },
            url: "http://localhost:3000/todos",
            data: {
                title,
                description,
                status,
                due_date
            }
        })
            .done(response => {
                
                console.log(response)
                $("#tablebody").empty();
                getTodos()
            })
            .fail(err => {
                console.log(err.responseJSON)
                getError(err)
            })
    })
    
    // $("#formGetById").on('submit', function (e) {
    //     e.preventDefault()
    //     const token = localStorage.getItem('token')
    //     const id = $("#getById").val()
    //     $.ajax({
    //         method: "GET",
    //         headers: {
    //             token
    //         },
    //         url: `http://localhost:3000/todos/${id}`
    //     })
    //         .done(response => {
    //             console.log(response)
    //         })
    //         .fail(err => {
    //             console.log(err.responseJSON)
    //         })
    // })

    $("#formUpdate").on('submit', function (e) {
        e.preventDefault()
        console.log(idToEdit)
        const token = localStorage.getItem('token')
        let id = idToEdit
        const title = $("#titleUpdate").val()
        const description = $("#descriptionUpdate").val()
        const status = $("#statusUpdate").val()
        const due_date = $("#due_dateUpdate").val()
        $.ajax({
            method: "PUT",
            headers: {
                token
            },
            url: `http://localhost:3000/todos/${id}`,
            data: {
                title,
                description,
                status,
                due_date
            }
        })
            .done(response => {
                console.log(response)
                $("#divCard").empty();
                $('#exampleModalScrollable').modal('hide')
                getTodos()
            })
            .fail(err => {
                // $("#exampleModalScrollable").modal('toggle')
                console.log(err.responseJSON)
                getError(err)
            })
    })

    // $("#formDeleteById").on('submit',function (e) {
    //     e.preventDefault()
    //     const token = localStorage.getItem('token')
    //     const id = $("#deleteById").val()
    //     console.log(id)
    //     $.ajax({
    //         method: "DELETE",
    //         headers: {
    //             token
    //         },
    //         url: `http://localhost:3000/todos/${id}`
    //     })
    //         .done(response => {
    //             console.log(response)
    //         })
    //         .fail(err => {
    //             console.log(err)
    //             console.log(err.responseJSON)
    //         })
    // })
    
    
    // $("body").css('overflow-y', 'hidden');
})

function getError(errors) {
    $("#errorPage").empty()
    $("#errorPage").append(`<h1>Error ${errors.status}: ${errors.responseJSON[0]}<h1>`)
    if(errors.status === 500) {
        $("#errorPage").append('<img id="errorimg" src="./img/serverdown.svg">')
    } else if(errors.status === 404) {
        $("#errorPage").append('<img id="errorimg" src="./img/404.svg">')
    } else if(errors.status === 401){
        $("#errorPage").append('<img id="errorimg" src="./img/unauthorized.svg">')
    } else {
        $("#errorPage").append('<img id="errorimg" src="./img/failed.svg">')
    }
    showErrors()
}




function getTodos() {
    const token = localStorage.getItem('token')
    console.log('token:',token);
    
    $.ajax({
        method: "GET",
        headers: {
            token
        },
        url: "http://localhost:3000/todos"
    })
        .done(response => {
            $("#divCard").empty();
            response.forEach(el => {
                let dd = new Date(el.due_date).getDate();
                let mm = new Date(el.due_date).getMonth() + 1; 
                let yyyy = new Date(el.due_date).getFullYear();
                if (dd < 10) {
                dd = '0' + dd;
                } 
                if (mm < 10) {
                mm = '0' + mm;
                } 
                let newDate = dd + '-' + mm + '-' + yyyy;
                el.due_date = newDate
                $("#divCard").append(`
                <div id="card">
                    <h4 class="card-title">${el.title}</h4>
                    <p>Description : ${el.description}</p>
                    <p>Status      : ${el.status}</p>
                    <p>Due Date    : ${el.due_date}</p>
                    <p id="button">
                        <button type="button" onclick="updateTodo(${el.id})" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalScrollable">
                            Update
                        </button>
                        <button type="button" onclick="deleteTodo(${el.id})">Delete</button>
                    </p>
                </div>
                `)
                showTodos()
                
            });
        })
        .fail(err => {
            console.log(err)
            getError(err)
        })
}

$("#btn-todos").on('click',function () {
    const token = localStorage.getItem('token')
    console.log('token:',token);
    
    $.ajax({
        method: "GET",
        headers: {
            token
        },
        url: "http://localhost:3000/todos"
    })
        .done(response => {
            $("#divCard").empty();
            response.forEach(el => {
                let dd = new Date(el.due_date).getDate();
                let mm = new Date(el.due_date).getMonth() + 1; 
                let yyyy = new Date(el.due_date).getFullYear();
                if (dd < 10) {
                dd = '0' + dd;
                } 
                if (mm < 10) {
                mm = '0' + mm;
                } 
                let newDate = dd + '-' + mm + '-' + yyyy;
                el.due_date = newDate
                $("#divCard").append(`
                    <div id="card">
                        <h4 class="card-title">${el.title}</h4>
                        <p>Description : ${el.description}</p>
                        <p>Status      : ${el.status}</p>
                        <p>Due Date    : ${el.due_date}</p>
                        <p id="button">
                            <button type="button" onclick="updateTodo(${el.id})" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalScrollable">
                                Update
                            </button>
                            <button type="button" onclick="deleteTodo(${el.id})">Delete</button>
                        </p>
                    </div>
                `)
                
            });
        })
        .fail(err => {
            console.log(err)
            getError(err)
        })
})