const access_token = localStorage.getItem('access_token')

$(document).ready(function(){

    if(access_token){
        $('#todo-dashboard').show()
        $('#home').hide()
        $('#register-section').hide()
        $('#login-section').hide()
        
    }else{
        $('#todo-dashboard').hide()
        $('#home').show()
        $('#register-section').hide()
        $('#login-section').hide()
        
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
            console.log(response)
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
            console.log(response);
            var todoData = {}
            $.each( response, function( key, val ) {
                if(key !== 'access_token'){
                    todoData = val
                }
            });
            for(let i = 0; i < todoData.length; i++){
                
                var outer_div = document.createElement('div');
                outer_div.className = 'list-group w-25 p-3 example hoverable'
                var inner_div = document.createElement('div');
                inner_div.className = "d-flex w-100 justify-content-between example hoverable w-50 p-3"
                
                let todo_data = document.createElement('a')
                todo_data.className = "list-group-item list-group-item-action flex-column align-items-start"
                

                $.each( todoData[i], function(subkey, todoVal){
                    console.log(subkey, todoVal);
                    switch (subkey) {
                        case 'title':
                            let str_title = document.createElement('h5')
                            str_title.className = "text-default h5"
                            str_title.append(`>> ${todoVal}`)

                            outer_div.appendChild(str_title)
                            
                            break;
                        case 'description':
                            let todo_desc = document.createElement('p')
                            todo_desc.append(`Todo Description :`)

                            let str_desc = document.createElement('p')
                            str_desc.append(`${todoVal}`)

                            todo_desc.appendChild(str_desc)
                            inner_div.appendChild(todo_desc)

                            break;
                        case 'due_date':
                            let due_date = document.createElement('small')
                            let convert_date = new Date(todoVal).toLocaleDateString()
                            due_date.append(`${convert_date}`)

                            inner_div.appendChild(due_date)
                            break;
                        case 'status':
                            let status = document.createElement('small')
                            status.append(`Completion Status : ${todoVal}`)

                            outer_div.appendChild(status)
                            break;
                        default:
                            break;
                    }

                    todo_data.appendChild(inner_div)
                    outer_div.appendChild(todo_data)
                    $('#todo-dashboard').append(outer_div)
                })
                
            }
            
               
            
            localStorage.setItem('access_token', response.access_token)
            $('#todo-dashboard').show()
            $('#login-section').hide()
        }).fail( function (err) {
            console.log(err);
        })
    })

    $('#btn-logout').on('click', function(e){
        e.preventDefault()
        localStorage.removeItem('access_token')
        $('#home').show()
        $('#todo-dashboard').hide()

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