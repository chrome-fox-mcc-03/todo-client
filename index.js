function showMessage(arr){
    $('#section-message').empty() ;

    arr.forEach(element => {
        $('#section-message').append(`<li>${element}</li>`)
    });
}

function showTodos(isComplete){

    const token = localStorage.getItem('token');

    $.ajax({
        method : 'GET',
        url : 'http://localhost:3000/todos',
        headers : {
            token,
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

function updateTodo (id) {
    const token = localStorage.getItem('token');

    localStorage.setItem ('idToUpdate', id) ;

    $.ajax ({
        method : "GET",
        url : `http://localhost:3000/todos/${id}`,
        headers : {
            token
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
            console.log('deleted');
            // $('#section-data').empty() ;
            showTodos(false)
        })
        .fail ( (err) =>{
            console.log(err);
        })
}

function makeItDone(id){
    const token = localStorage.getItem('token');

    $.ajax ({
        method : "PUT",
        url : `http://localhost:3000/todos/${id}`,
        headers : {
            token
        }
    })
        .done ((response)=>{
            console.log('done');
            // $('#section-data').empty() ;
            showTodos(false)
        })
        .fail ( (err) =>{
            console.log(err);
        })

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

    // BUTTON //

    $('#btn-signup').on('click', function(){
        $('#section-list').hide() ;
        $('#section-message').empty() ;
        $("#page-home").hide();
        $("#page-signup").show();
        $("#page-login").hide();
        $("#page-dashboard").hide();
        $("#page-createtodo").hide();
        $("#page-updatetodo").hide();
    })

    $('#btn-login').on('click', function(){
        $('#section-list').hide() ;
        $('#section-message').empty() ;
        $("#page-home").hide();
        $("#page-signup").hide();
        $("#page-login").show();
        $("#page-dashboard").hide();
        $("#page-createtodo").hide();
        $("#page-updatetodo").hide();
    })

    $('#btn-logout').on('click', function(){
        $('#section-list').hide() ;
        $('#section-message').empty() ;
        localStorage.clear()
        $("#page-home").show();
        $("#page-signup").hide();
        $("#page-login").hide();
        $("#page-dashboard").hide();
        $("#page-createtodo").hide();
        $("#page-updatetodo").hide();
    })

    $('#btn-home').on('click', function(){
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
    })

    $('#btn-createtodo').on('click', function(e){
        e.preventDefault() ;        
        $('#section-list').hide() ;
        $('#section-message').empty() ;
        $("#page-home").hide();
        $("#page-signup").hide();
        $("#page-login").hide();
        $("#page-dashboard").hide();
        $("#page-createtodo").show();
        $("#page-updatetodo").hide();
    })

    $('#btn-show_history').on('click', function(){
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
    })

    $('#btn-current').on('click', function(){
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
    })

    

    // PAGE //

    $('#page-signup').on('submit', function(e){
        e.preventDefault() ;
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
    })

    $('#page-login').on('submit',function(e){
        e.preventDefault() ;
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
    })

    $('#page-createtodo').on('submit', function(e){
        $('#section-message').empty() ;
        e.preventDefault();
        const title = $('#title-create').val();
        const description = $('#description-create').val() || "" ;
        const due_date = $('#due_date-create').val();

        $('#title-create').val('');
        $('#description-create').val('') ;
        $('#due_date-create').val('')
        $.ajax({
            method : "POST",
            url : 'http://localhost:3000/todos/',
            headers : {
                token
            },
            data : {
                title,
                description,
                due_date
            }  
        })
            .done ((response) => {
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
    })

    $('#page-updatetodo').on('submit', function(e){
        $('#section-message').empty() ;
        e.preventDefault();
        const title = $('#title-update').val();
        const description = $('#description-update').val() || "" ;
        const due_date = $('#due_date-update').val();

        const idToUpdate = localStorage.getItem('idToUpdate');
        localStorage.removeItem('idToUpdate');
        
        $('#title-update').val('');
        $('#description-update').val('') ;
        $('#due_date-update').val('')

        $.ajax({
            method : "PUT",
            url : `http://localhost:3000/todos/${idToUpdate}`,
            headers : {
                token
            },
            data : {
                title,
                description,
                due_date
            }  
        })
            .done ((response) => {

                $('#newtodo').empty()
                showMessage(['To do successfully updated'])
                // $('#newtodo').append(
                //     `<img src="${response.imageURL}" alt="Flowers in Chania">`
                // )
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
                showMessage(err.responseJSON.message);
            })
    })

    
})