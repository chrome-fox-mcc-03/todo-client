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
            let status = response.data[i].status = false ? 'Finished' : 'Unfinished'
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