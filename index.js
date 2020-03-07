const access_token = localStorage.getItem('access_token')

function refreshContent(){
    $.ajax({
        method: 'GET',
        url: 'http://localhost:3000/todos/users',
        headers: {
            access_token
        }
    })
    .done(function(response){
        $('#list-content').empty()
        for(let i = 0; i < response.data.length; i++){
            let todo_id = response.data[i].id
            let due_date = new Date(response.data[i].due_date).toLocaleDateString()
            let title = response.data[i].title
            let description = response.data[i].description
            let status = response.data[i].status ? 'Finished' : 'Unfinished'
            $('#list-content').append(`
            <div class="list-group w-25 p-3 example hoverable border border-primary" id="content_${i}">

                <h5 id='content_${todo_id}_id' value='${todo_id}'>${todo_id}</h5> 
                <h5 class="text-default h5" id='content_${todo_id}_title' value='${title}'> ${title}  </h5>
                    <small id='content_${todo_id}_due_date' value="${due_date}"> ${due_date} </small>
                        <a class="list-group-item list-group-item-action flex-column align-items-start">
                            <div id='container_${todo_id}_desc' class=""d-flex w-100 justify-content-between example hoverable w-50 p-3"">
                                <span id='content_${todo_id}_desc'>${description}</span> 
                            </div>
                        </a>
                    <small id='content_${todo_id}_status' value="${status}">status : ${status} </small>
                
                <a id="delete-btn-${todo_id}" href="" class="btn btn-default btn-rounded" data-toggle="modal" data-target="#modalDeleteForm"> 
                    Delete
                </a>
                <a id="update-btn-${todo_id}" href="" class="btn btn-default btn-rounded" data-toggle="modal" data-target="#modalUpdateForm"> 
                    Update 
                </a>
                
            </div>`)
            
            $(`#delete-btn-${todo_id}`).click(function(){
                deleteData(todo_id)
                $(this).parent().remove();
            });

            $(`#update-btn-${todo_id}`).click(function(){
                const id = $(`#content_${todo_id}_id`).attr('value')
                const title = $(`#content_${todo_id}_title`).attr('value')
                const description = $(`#content_${todo_id}_desc`).text()
                const due_date = $(`#content_${todo_id}_due_date`).attr('value')
                const status = $(`#content_${todo_id}_status`).attr('value')
                updateData(id, title, description, due_date, status)
                
            })
            
        }
    })
    .fail(err => {
        console.log(err);
    })
}

function updateData(id, title, description, due_date, status){
    // console.log(id, title, description, due_date, status);
    $('#id-to-update').val(id).prop('readonly', true)
    $('#title-to-update').val(title)
    $('#description-to-update').val(description)
    $('#status-to-update select').val(status)
    $('#due-date-to-update').val(due_date)
    
}

function deleteData(todo_id) {
    const access_token = localStorage.getItem('access_token')
    const id_toDelete = todo_id
    // console.log(todo_id);
    
    $.ajax({

        type: 'DELETE',
        url: `http://localhost:3000/todos/${todo_id}`,
        headers: {
            'access_token': access_token
        },
        data:{
            id: id_toDelete
        }
    })
    .done(function (response) {
        refreshContent()
    })
    .fail(function (err) {
        console.log(err);
        
    })
}


$(document).ready(function(){

    if(access_token){
        $('#todo-dashboard').show()
        $('#home').hide()
        $('#register-section').hide()
        $('#login-section').hide()
        refreshContent()
        //FETCHING DATA TODO BY ID (ACCESS_TOKEN)
        

        

    }else{
        $('#todo-dashboard').hide()
        $('#home').show()
        $('#register-section').hide()
        $('#login-section').hide()
        $('#todo-create-section').hide()
        $('#todo-update-section').hide()
        
    }

    $('#btn-reg').on('click', function(e){
        e.preventDefault()

        $('#btn-reg').html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Loading...').addClass('disabled');
        
        const email = $('#defaultRegisterFormEmail').val()
        const password = $('#defaultRegisterFormPassword').val()

        $.ajax({
            method: 'POST',
            url : 'http://localhost:3000/user/register',
            data : {
                email,
                password
            }
        }).done( function(response){
            // console.log(response)
            $('#home').show()
            $('#register-section').hide()
        }).fail( function(err){
            console.log(err);
        })
    })

    $('#btn-login').on('click', function(e){
        e.preventDefault()

        $('#btn-login').html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Loading...').addClass('disabled');
          
        const email = $('#defaultLoginFormEmail').val()
        const password = $('#defaultLoginFormPassword').val()

        $.ajax({
            method: 'POST',
            url : 'http://localhost:3000/user/login',
            data : {
                email,
                password
            }
        }).done( function(response){

            localStorage.setItem('access_token', response.access_token)
            $('#todo-dashboard').show()
            $('#login-section').hide()
            let identifier = Math.ceil((Math.random() * 100)+100)
            $('#profile-photo').attr('src', `https://api.adorable.io/avatars/${identifier}`)

        }).fail( function (err) {
            console.log(err);
        })
    })

    //CREATE TODO
    $('#btn-create').on('click', function(e){
        e.preventDefault()

        const title = $('#title-input').val()
        const description = $('#description-input').val()
        const due_date = $('#date-input').val()
        const access_token = localStorage.getItem('access_token')
        // console.log(title, description, due_date);
        // console.log(access_token);
        
        
        $.ajax({
            method: 'POST',
            url: 'http://localhost:3000/todos',
            headers: {
                access_token
            },
            data: {
                title: title,
                description: description,
                due_date: due_date
            }
        })
        .done(function(response){
            refreshContent()
            // $('#modalCreateForm').modal('hide')
            
        })
        .fail(function(err){
            console.log(err);
            
        })
    })

    $('#btn-update').on('click', function(e){
        e.preventDefault()
        
        const todo_id = $('#id-to-update').val()
        const title = $('#title-to-update').val()
        const description = $('#description-to-update').val()
        const status = $('#status-to-update').val()
        const due_date = $('#due-date-to-update').val()
        const access_token = localStorage.getItem('access_token')
        console.log(access_token);
        
        // console.log(todo_id, title, description, status, due_date);

        $.ajax({
            type: 'PUT',
            url: `http://localhost:3000/todos/${todo_id}`,
            headers: {
                'access_token': access_token,

            },
            data: {
                id: todo_id,
                title : title,
                description: description,
                status: status,
                due_date: due_date
            }
        })
        .done(function(responese){
            refreshContent()
        })
        .fail(function(err){
            console.log(err);
            
        })
        
        
    })

    
    $('#btn-logout').on('click', function(e){
        e.preventDefault()
        localStorage.removeItem('access_token')
        $('#home').show()
        $('#todo-dashboard').hide()
        var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
            console.log('User signed out.');
        });

    })

    $('#redirect-login').on('click', function(e){
        e.preventDefault()
        $('#login-section').show()
        $('#home').hide()
    })

    $('#redirect-register').on('click', function(e){
        e.preventDefault()
        $('#register-section').show()
        $('#home').hide()
    })

    $('#docs-jumbotron').on('click', function(e){
        e.preventDefault()
        window.open('https://bhaktitodoapps.docs.apiary.io/#', '_blank');
    })

})