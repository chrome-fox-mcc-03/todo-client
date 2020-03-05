// PAGE //

function showMessage(arr){
    $('#section-message').empty() ;

    if (typeof arr == 'string'){
        arr = [arr] ;
        arr.forEach(element => {
            $('#section-message').append(`<li>${element}</li>`)
        });
    } else {
        arr.forEach(element => {
            $('#section-message').append(`<li>${element}</li>`)
        });
    }
}

function showTodos(isComplete){

    $.ajax({
        method : 'GET',
        url : 'http://localhost:3000/todos',
        headers : {
            token : localStorage.getItem('token'),
            isComplete
        }
    })

        .done (function(response){
            
            $('#section-data').empty() ;
            response.data.forEach(element => {
                let due_date = new Date (element.due_date)
                let year = due_date.getFullYear() ;
                let month = due_date.getMonth() + 1 ;
                let day = due_date.getDate() + 1 ;

                if (month < 10){
                    month = `0${month}`
                }
                if (day < 10){
                    day = `0${day}`
                }
                let formatted_date = day  + "-" + month + "-" + year ;
                let status;
                if ( element.status === false) {
                    status = 'pending'
                } else {
                    status = 'completed'
                }
                if (isComplete === false){
                    $('#section-data').append(`
                    <tr>
                        <td>${element.title}</td>
                        <td>${element.description}</td>
                        <td>${formatted_date}</td>
                        <td>${status}</td>
                        <td><button class="btn btn-success" onClick="makeItDone(${element.id})" id="btn-update-${element.id}">Done</button> <button class="btn btn-info" onClick="updateTodo(${element.id})" id="btn-update-${element.id}">Edit</button> <button class="btn btn-danger" onClick="deleteTodo(${element.id})" id="btn-delete-${element.id}">Delete</button></td>
                    </tr>
                    `)
                } else {
                    $('#section-data').append(`
                    <tr>
                        <td>${element.title}</td>
                        <td>${element.description}</td>
                        <td>${formatted_date}</td>
                        <td>${status}</td>
                        <td><button class="btn btn-info" onClick="updateTodo(${element.id})" id="btn-update-${element.id}">Edit</button> <button class="btn btn-danger" onClick="deleteTodo(${element.id})" id="btn-delete-${element.id}">Delete</button></td>
                    </tr>
                    `)

                }
            });
        })
        .fail (function(err){            
            showMessage(err.responseJSON.message)
        })
}

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var id_token = googleUser.getAuthResponse().id_token;

    $.ajax({
        method : 'POST',
        url : 'http://localhost:3000/users/googleSignIn',
        headers : {
            token : id_token
        }
    })
        .done(function (response) {
            const token = response.token ;
            localStorage.setItem ('token', token) ;
            $('#section-list').show() ;
            showTodos(false) ;
            $("#page-home").hide();
            $("#page-signup").hide();
            $("#page-login").hide();
            $("#page-dashboard").show();
            $("#page-createtodo").hide();
            $("#page-updatetodo").hide();
        })
        .fail(function (err) {
            showMessage([err.responseJSON.message])
        })   
}

function createTodo(event){
    $('#section-message').empty() ;
    event.preventDefault();
    const title = $('#title-create').val();
    const description = $('#description-create').val() || "" ;
    const due_date = $('#due_date-create').val();

    
    $.ajax({
        method : "POST",
        url : 'http://localhost:3000/todos/',
        headers : {
            token : localStorage.getItem('token')
        },
        data : {
            title,
            description,
            due_date
        }  
    })
        .done ((response) => {                
            $('#title-create').val('');
            $('#description-create').val('') ;
            $('#due_date-create').val('')
            $('#newtodo').empty()
            showMessage(['To do successfully created'])
            $('#newtodo').append(
                `<img src="${response.imageURL}" alt="Flowers in Chania">`
            )
            $('#section-list').show() ;
            showTodos(false)
            $("#page-home").hide();
            $("#page-signup").hide();
            $("#page-login").hide();
            $("#page-dashboard").show();
            $("#page-createtodo").hide();
            $("#page-updatetodo").hide();
        })

        .fail ((err) => {
            showMessage(err.responseJSON.message)
        })
}

function signUp(event) {
        event.preventDefault() ;
        const email = $('#email-signup').val();
        const password = $('#password-signup').val() ;

        $('#email-login').val('');
        $('#password-login').val('')

        $.ajax({
            method : 'POST',
            url : 'http://localhost:3000/users/register',
            data : {
                email,
                password
            }
        })
            .done(function (response) {
                showMessage(['Signed up success'])
                $("#page-home").hide();
                $("#page-signup").hide();
                $("#page-login").show();
                $("#page-dashboard").hide();
                $("#page-createtodo").hide();
                $("#page-updatetodo").hide();
            })
            .fail(function (err) {
                showMessage(err.responseJSON.message)
            })
}

function signIn(event){
        event.preventDefault() ;
        const email = $('#email-login').val();
        const password = $('#password-login').val() ;

        $('#email-login').val('');
        $('#password-login').val('')

        $.ajax({
            method : 'POST',
            url : 'http://localhost:3000/users/login',
            data : {
                email,
                password
            }
        })
            .done(function (response) {
                const token = response.token ;
                localStorage.setItem ('token', token) ;
                $('#section-list').show() ;
                showTodos(false) ;
                $("#page-home").hide();
                $("#page-signup").hide();
                $("#page-login").hide();
                $("#page-dashboard").show();
                $("#page-createtodo").hide();
                $("#page-updatetodo").hide();
            })
            .fail(function (err) {
                showMessage([err.responseJSON.message])
            })
}

function updateTodo (id) {

    localStorage.setItem ('idToUpdate', id) ;

    $.ajax ({
        method : "GET",
        url : `http://localhost:3000/todos/${id}`,
        headers : {
            token  : localStorage.getItem('token')
        }
    })
        .done ( (response) => {
            let due_date = new Date (response.data.due_date)
            let year = due_date.getFullYear() ;
            let month = due_date.getMonth() + 1 ;
            let day = due_date.getDate() + 1 ;

            if (month < 10){
                month = `0${month}`
            }
            if (day < 10){
                day = `0${day}`
            }
            let formatted_date = year + "-" + month + "-" + day
            $('#title-update').val(response.data.title);
            $('#description-update').val(response.data.description) ;
            $('#due_date-update').val(formatted_date) ;

            $('#section-message').empty() ;
            $('#section-list').hide() ;
            $("#page-home").hide();
            $("#page-signup").hide();
            $("#page-login").hide();
            $("#page-dashboard").hide();
            $("#page-createtodo").hide();
            $("#page-updatetodo").show();
        })

        .fail ( (err) => {
            console.log(err);
        })
}

function submitUpdateTodo (event) {
    $('#section-message').empty() ;
    event.preventDefault();
    const title = $('#title-update').val();
    const description = $('#description-update').val() || "" ;
    const due_date = $('#due_date-update').val();

    const idToUpdate = localStorage.getItem('idToUpdate');
    localStorage.removeItem('idToUpdate');

    $.ajax({
        method : "PUT",
        url : `http://localhost:3000/todos/${idToUpdate}`,
        headers : {
            token : localStorage.getItem('token'),
        },
        data : {
            title,
            description,
            due_date
        }  
    })
        .done ((response) => {
            $('#title-update').val('');
            $('#description-update').val('') ;
            $('#due_date-update').val('') ;

            $('#newtodo').empty()
            showMessage(['To do successfully updated'])
            $('#section-list').show() ;
            showTodos(false)
            $("#page-home").hide();
            $("#page-signup").hide();
            $("#page-login").hide();
            $("#page-dashboard").show();
            $("#page-createtodo").hide();
            $("#page-updatetodo").hide();
        })

        .fail ((err) => {
            $('#title-update').val('');
            $('#description-update').val('') ;
            $('#due_date-update').val('') ;
            showMessage(err.responseJSON.message);
        })
}

function deleteTodo(id) {
    const token = localStorage.getItem('token');

    $.ajax ({
        method : "DELETE",
        url : `http://localhost:3000/todos/${id}`,
        headers : {
            token
        }
    })
        .done ((response)=>{
            showTodos(false)
        })
        .fail ( (err) =>{
            console.log(err);
        })
}

function makeItDone(id){

    $.ajax ({
        method : "PUT",
        url : `http://localhost:3000/todos/${id}`,
        headers : {
            token : localStorage.getItem('token')
        }
    })
        .done ((response)=>{
            showTodos(false)
        })
        .fail ( (err) =>{
            console.log(err);
        })
}


// BUTTON // 

function logout() {
    $('#newtodo').empty()
    $('#section-list').hide() ;
    $('#section-message').empty() ;
    localStorage.clear()
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });

    $("#page-home").show();
    $("#page-signup").hide();
    $("#page-login").hide();
    $("#page-dashboard").hide();
    $("#page-createtodo").hide();
    $("#page-updatetodo").hide();
}

function signUpBtn() {
    $('#section-list').hide() ;
    $('#section-message').empty() ;
    $("#page-home").hide();
    $("#page-signup").show();
    $("#page-login").hide();
    $("#page-dashboard").hide();
    $("#page-createtodo").hide();
    $("#page-updatetodo").hide();
}

function loginBtn () {
    $('#newtodo').empty()
    $('#section-list').hide() ;
    $('#section-message').empty() ;
    $("#page-home").hide();
    $("#page-signup").hide();
    $("#page-login").show();
    $("#page-dashboard").hide();
    $("#page-createtodo").hide();
    $("#page-updatetodo").hide();
}

function homeBtn() {
    const token = localStorage.getItem('token') ;
    $('#newtodo').empty()
    $('#section-message').empty() ;
    if (token) {
        $('#section-list').show() ;
        showTodos(false)
        $("#page-home").hide();
        $("#page-signup").hide();
        $("#page-login").hide();
        $("#page-dashboard").show();
        $("#page-createtodo").hide();
        $("#page-updatetodo").hide();
    } else {
        $('#section-list').hide() ;
        $("#page-home").show();
        $("#page-signup").hide();
        $("#page-login").hide();
        $("#page-dashboard").hide();
        $("#page-createtodo").hide();
        $("#page-updatetodo").hide();
    }
}

function createTodoBtn (event) {
    event.preventDefault() ;        
    $('#section-list').hide() ;
    $('#section-message').empty() ;
    $("#page-home").hide();
    $("#page-signup").hide();
    $("#page-login").hide();
    $("#page-dashboard").hide();
    $("#page-createtodo").show();
    $("#page-updatetodo").hide();
}

function showHistoryBtn(){
    $('#newtodo').empty()
    $('#section-message').empty() ;
    $('#section-list').show() ;
    showTodos(true)
    $("#page-home").hide();
    $("#page-signup").hide();
    $("#page-login").hide();
    $("#page-dashboard").show();
    $("#page-createtodo").hide();
    $("#page-updatetodo").hide();
}

function showPendingBtn(){
    $('#newtodo').empty()
    $('#section-message').empty() ;
    $('#section-list').show() ;
    showTodos(false)
    $("#page-home").hide();
    $("#page-signup").hide();
    $("#page-login").hide();
    $("#page-dashboard").show();
    $("#page-createtodo").hide();
    $("#page-updatetodo").hide();
}

$(document).ready (function(){

    const token = localStorage.getItem('token') ;

    if (token) {
        $('#section-message').empty() ;
        showTodos(false)
        $("#page-home").hide();
        $("#page-signup").hide();
        $("#page-login").hide();
        $("#page-dashboard").show();
        $("#page-createtodo").hide();
        $("#page-updatetodo").hide();
    } else {
        $('#section-message').empty() ;
        $('#section-list').hide() ;
        $("#page-home").show();
        $("#page-signup").hide();
        $("#page-login").hide();
        $("#page-dashboard").hide();
        $("#page-createtodo").hide();
        $("#page-updatetodo").hide();
    }    
})