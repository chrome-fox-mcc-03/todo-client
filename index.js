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
            <div class="list-group w-25 p-3 example hoverable" id="content_${i}">
            <h5 id='content_${todo_id}_id'>${todo_id}</h5> 
            <h5 class="text-default h5" id='content_${todo_id}_title'> >>> ${title}  </h5>
                <small id='content_${todo_id}_due_date'> ${due_date} </small>
                <a class="list-group-item list-group-item-action flex-column align-items-start">
                    <div id='content_${todo_id}_desc' class=""d-flex w-100 justify-content-between example hoverable w-50 p-3"">
                        ${description}
                    </div>
                </a>
                <small id='content_${todo_id}_status'>status : ${status} </small>
                
                
                
            </div>`)
            
        }
    })
    .fail(err => {
        console.log(err);
    })
}

function updateContent(){
    console.log('hello');
    
    $('#update-form-content#title-to-update').val('jguyfhhjv')
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