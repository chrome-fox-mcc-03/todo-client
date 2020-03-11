const baseURL = "https://still-forest-80696.herokuapp.com"
let id_update;


function landingPage() {
    $("#menu").show()
    $("#navbar").show()
    $("#welcome").show()
    $("#signup").show()
    $("#login").show()
    $("#footer").show()
    $("#formLogin").hide()
    $("#formRegister").hide()
    $("#tableTodo").hide()
    $("#create-button").hide()
    $("#create-form").hide()
    $("#update-form").hide()
    $("#dashboard-button").hide()
    $("#logout").hide()
    $(".loading").hide()
}

function showRegister() {
    $("#menu").show()
    $("#navbar").show()
    $("#welcome").hide()
    $("#formRegister").show()
    $("#formLogin").hide()
    $("#signup").show()
    $("#login").show()
    $("#footer").show()
    $("#tableTodo").hide()
    $("#create-button").hide()
    $("#create-form").hide()
    $("#update-form").hide()
    $("#dashboard-button").hide()
    $("#logout").hide()
    $(".loading").hide()
}

function showLogin() {
    $("#menu").show()
    $("#navbar").show()
    $("#welcome").hide()
    $("#formLogin").show()
    $("#formRegister").hide()
    $("#signup").show()
    $("#login").show()
    $("#footer").show()
    $("#tableTodo").hide()
    $("#create-button").hide()
    $("#create-form").hide()
    $("#update-form").hide()
    $("#dashboard-button").hide()
    $("#logout").hide()
    $(".loading").hide()
}


function dashboard() {
    $("#menu").show()
    $("#navbar").show()
    $("#welcome").show()
    $("#tableTodo").show()
    $("#login").hide()
    $("#signup").hide()
    $("#footer").show()
    $("#formLogin").hide()
    $("#formRegister").hide()
    $("#welcome").hide()
    $("#create-button").show()
    $("#create-form").hide()
    $("#update-form").hide()
    $("#dashboard-button").show()
    $("#logout").show()
    $(".loading").hide()
}

function showCreateForm() {
    $("#menu").show()
    $("#navbar").show()
    $("#welcome").show()
    $("#tableTodo").hide()
    $("#login").hide()
    $("#signup").hide()
    $("#footer").show()
    $("#formLogin").hide()
    $("#formRegister").hide()
    $("#welcome").hide()
    $("#create-button").show()
    $("#create-form").show()
    $("#update-form").hide()
    $("#dashboard-button").show()
    $("#logout").show()
    $(".loading").hide()
}

function showUpdateForm() {
    $("#menu").show()
    $("#navbar").show()
    $("#welcome").show()
    $("#tableTodo").hide()
    $("#login").hide()
    $("#signup").hide()
    $("#footer").show()
    $("#formLogin").hide()
    $("#formRegister").hide()
    $("#welcome").hide()
    $("#create-button").show()
    $("#create-form").hide()
    $("#update-form").show()
    $("#dashboard-button").show()
    $("#logout").show()
    $(".loading").hide()
}

function showLoading() {
    $(".loading").show()
}


function signUp(event) {
    event.preventDefault()
    const email = $("#email").val()
    const password = $("#password").val()
    $.ajax({
        method: "POST",
        url: `${baseURL}/register`,
        data: {
            email,
            password
        }
    })
    .done(function(response){
        localStorage.setItem("token", response.token)
        dashboard()
        showTodo()
        $("#password").val("")
        $("#email").val("")
    })
    .fail(function(err){        
        $("#errorSignUp").empty()                
        err.responseJSON.error.forEach( el => {
            $("#errorSignUp").append(`<p class="text-danger"> ${el} </p>`)
        })
        $("#password").val("")
        $("#email").val("")
    })
}

function login(event) {
    event.preventDefault()
    const email = $("#emailLogin").val() 
    const password = $("#passLogin").val()
    $.ajax({
        method: "POST",
        url: `${baseURL}/login`,
        data: {
            email,
            password
        }
    })
    .done(function(response) {
        localStorage.setItem("token", response.token)
        dashboard()
        showTodo()
        $("#emailLogin").val("") 
        $("#passLogin").val("") 
    })
    .fail(function(err) { 
        $("#errorPass").empty()
        $("#errorPass").append(`<p class="text-danger"> ${err.responseJSON.error} </p>`)
        $("#emailLogin").val("") 
        $("#passLogin").val("") 
    })
}

function showTodo() {
    $.ajax({
        method: "GET",
        url: `${baseURL}/todos`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
    .done(function(response) {
        if(response){
            $("#tbody-list").empty()
            response.data.forEach(list => {
                list.status === false ? list.status = "pending" : list.status = "done"
                $('#tbody-list').append(`
                <tr>
                        <td>${list.title}</td>
                        <td>${list.description}</td>
                        <td>${list.status}</td>
                        <td>${new Date(list.due_date).toDateString()}</td>
                        <td> <a href="${list.countdown}" target="_blank"> link countdown </a> </td>
                        <td> <button class="btn btn-success" onclick="findOne(${list.id})">Edit</button> 
                             <button class="btn btn-danger" onclick="deleteTodo(${list.id})">Delete</button>
                        </td>
                </tr>
                `)
            })
        }
    })
    .fail(function(err) {
    })
}

function onSignIn(googleUser) {
    const token = googleUser.getAuthResponse().id_token;
    $.ajax({
            method : 'POST',
            url: `${baseURL}/signInGoogle`,
            headers: {
                token: token
            }
        })
        .done(result => {
            localStorage.setItem("token", result.token)
            dashboard()
        })
        .fail(err => {
        })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    });
  }


function create(event) {
    event.preventDefault()
    $("#errorUpdate").empty()
    $("#errorCreate").empty()
    const title = $("#title-create").val()
    const description = $("#description-create").val()
    const due_date = $("#due_date-create").val()
    const status = false
    showLoading()
    $.ajax({
        method: "POST",
        url: `${baseURL}/todos`,
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
            dashboard()
            showTodo()
            $("#title-create").val("")
            $("#description-create").val("")
            $("#due_date-create").val("")
        })
        .fail(err => {  
            $(".loading").hide()          
            $("#errorCreate").empty()
            err.responseJSON.error.forEach( el => {
                $("#errorCreate").append(`<p class="text-danger"> ${el} </p>`)
            })
            $("#title-create").val("")
            $("#description-create").val("")
            $("#due_date-create").val("")
        })
}

function deleteTodo(id) {    
    $.ajax({
        method: "DELETE",
        url: `${baseURL}/todos/${id}`,
        headers: {
            token: localStorage.getItem("token")
        }
    })
        .done(response => {
            dashboard()
            showTodo()
        })
        .fail(err => {
        })
}

function findOne(id) {
    $("#errorUpdate").empty()
    $("#errorCreate").empty()
    id_update = id
    $.ajax({
        method: "GET",
        url: `${baseURL}/todos/${id}`,
        headers: {
            token: localStorage.getItem("token")
        }
    })
        .done(response => {
            const dateVal = new Date(response.data.due_date)
            response.data.due_date = `${dateVal.getFullYear()}-${dateVal.getMonth()+1 < 10 ? "0" + (dateVal.getMonth()+1) : dateVal.getMonth()+1}-${dateVal.getDate() < 10 ? "0"+dateVal.getDate() : dateVal.getDate()}`
            response.data.status === false ? response.data.status = "pending" : response.data.status = "done"
            showUpdateForm()
            $("#title-update").val(response.data.title)
            $("#description-update").val(response.data.description)
            $(`#status-update option:selected`).text(response.data.status)
            $("#due_date-update").val(response.data.due_date)
        })
        .fail(err => {
        })
}

function update(event) {
    event.preventDefault()
    const title = $("#title-update").val()
    const description = $("#description-update").val()
    const due_date = $("#due_date-update").val()
    const status = $("#status-update").val()
    showLoading()
    $.ajax({
        method: "PUT",
        url: `${baseURL}/todos/${id_update}`,
        data: {
            title,
            description,
            due_date,
            status
        },
        headers: {
            token: localStorage.getItem("token")
        }
    })
        .done(response => {
            dashboard()
            showTodo()
            $("#title-update").val("")
            $("#description-update").val("")
            $("#due_date-update").val("")
            $("#status-update").val("")
        })
        .fail(err => {     
            $(".loading").hide()       
            $("#errorUpdate").empty()
            err.responseJSON.error.forEach( el => {
                $("#errorUpdate").append(`<p class="text-danger"> ${el} </p>`)
            })
        })
}

$(document).ready(function(){
    if(localStorage.token) {
        dashboard()
        showTodo()
    } else {
        landingPage() 
    }

    $("#create-button").on("click", function(){
        showCreateForm()
    })

    $("#login").on("click", function(){ 
        showLogin()
    })
  
    $("#signup").on("click", function(){
        showRegister()
    })

    $("#home").on("click", function(){
        landingPage()
    })

    $("#dashboard-button").on("click", function(){
        dashboard()
    })

    $("#logout").on("click", function(){
        localStorage.clear()
        landingPage()
        signOut()
    })

})

