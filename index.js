let idToEdit
function updateTodo (idUpdate) {
        showUpdate()
        const token = localStorage.getItem('token')
        let id = idUpdate
        idToEdit = idUpdate
        $.ajax({
            method: "GET",
            headers: {
                token
            },
            url: `http://localhost:3000/todos/${id}`
        })
            .done(response => {
                $("#idUpdate").val(response.id)
                $("#titleUpdate").val(response.title)
                $("#descriptionUpdate").val(response.description)
                $("#statusUpdate").val(response.status)
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
            localStorage.setItem('token', response)
            showJumbotron()
        })  
        .fail(err => {
            console.log(err.responseJSON)
        }) 
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
}

$("document").ready(function () {
    $("#containerReg").hide()
    $("#containerLogin").hide()
    $("#containerAdd").hide()
    $("#containerUpdate").hide()
    $("#containerGetById").hide()
    $("#containerDeleteById").hide()
    $("#container2").hide()
    $("#divTable").hide()

    $("#btn-todos").on('click',function () {
        showTodos()
    })
    $("#button-started").on('click',function () {
        showReg()
    })
    $("#btn-reg").on('click',function () {
        showReg()
    })
    $("#btn-login").on('click',function () {
        showLogin()
    })
    $("#btn-add").on('click',function () {
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
        localStorage.clear()
        $("#btn-login").show()
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
                localStorage.setItem('token', response)
                $("#btn-login").hide()
                showJumbotron()
                console.log(response)
            })  
            .fail(err => {
                console.log(err.responseJSON)
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
            })
            .fail(err => {
                console.log(err.responseJSON)
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
                $("#tablebody").empty();
                getTodos()
            })
            .fail(err => {
                console.log(err.responseJSON)
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

function getTodos() {
    const token = localStorage.getItem('token')
    $.ajax({
        method: "GET",
        headers: {
            token
        },
        url: "http://localhost:3000/todos"
    })
        .done(response => {
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
                let newDate = yyyy + '-' + mm + '-' + dd;
                el.due_date = newDate
                // console.log(el.id)
                $("#tablebody").append(`
                <tr>
                    <td>${el.title}</td>
                    <td>${el.description}</td>
                    <td>${el.status}</td>
                    <td>${el.due_date}</td>
                    <td>
                        <button type="button" onclick="updateTodo(${el.id})">Update</button>
                        <button type="button" onclick="deleteTodo(${el.id})">Delete</button>
                    </td>
                <tr>
                `)
                showTodos()
            });
        })
        .fail(err => {
            console.log(err.responseJSON)
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
            $("#tablebody").empty();
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
                let newDate = yyyy + '-' + mm + '-' + dd;
                el.due_date = newDate
                $("#tablebody").append(`
                <tr>
                    <td>${el.title}</td>
                    <td>${el.description}</td>
                    <td>${el.status}</td>
                    <td>${el.due_date}</td>
                    <td>
                        <button type="button" onclick="updateTodo(${el.id})">Update</button>
                        <button type="button" onclick="deleteTodo(${el.id})">Delete</button>
                    </td>
                <tr>
                `)
                
            });
        })
        .fail(err => {
            console.log(err.responseJSON)
        })
})