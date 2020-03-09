$("document").ready(() => {
    generateQuotes()
    $("#log-out").hide()
    $(".dashboard-class").hide()
    if(localStorage.getItem('token')) {
        restartDashboard()
        $("#log-out").show()
        $(".landing-page").hide()
        $(".dashboard-class").show()
        generateQuotes()
        .then(quotes => {
            const random = Math.floor(Math.random() * 5)
            const quoteToShow = quotes.results[random].quote
            const author = quotes.results[random].author
            $("#quotes").append(`<p class="quote-text">"${quoteToShow}"</p><p class="quote-author">— ${author}</p>`)
        })
        $(".welcome-text").append(`<h1 class='welcome-text-child-name'> ${localStorage.getItem('name')}</h1>`)
        
    }
    $("#log-in-page").hide()
    $("#sign-up-page").hide()
    $("#start-now").on('click', (e) => {
        e.preventDefault()
        $("#sign-up-page").slideDown()
        $(".landing-page").css("filter", "blur(3px)")
    })

    $(".sign-up-back-btn").on('click', (e) => {
        e.preventDefault()
        $("#sign-up-page").hide()
        $("#log-in-page").hide()
        $('#error-signup').text(``)
        $('#error-login').text(``)
        $(".landing-page").css("filter", "")
    })
     
    $("#login").on('click', (e) => {
        e.preventDefault()
        $("#log-in-page").slideDown()
        $(".landing-page").css("filter", "blur(3px)")
    })

    $("#sign-up-form").on('submit', (e) => {
        e.preventDefault()
        const data = {
            first_name: $("#first_name").val(),
            last_name: $("#last_name").val(),
            username: $("#username").val(),
            email: $("#email").val(),
            password: $("#password").val(),
        }
        $.ajax({
            url: 'https://stormy-falls-14919.herokuapp.com/users/register',
            method: 'POST',
            data: data
        })
        .then(signedUpData => {
            return $.ajax({
                url: 'https://stormy-falls-14919.herokuapp.com/users/login',
                method: 'POST',
                data: {
                    emailOrUsername: data.email,
                    password: data.password
                }
            })
        })
        .done(response => {
            localStorage.setItem('token', response.userToken)
            localStorage.setItem('name', response.name)
            $('#error-signup').text(``)
            $("#sign-up-page").hide()
            $("#log-in-page").hide()
            $(".landing-page").hide()
            $(".dashboard-class").show()
            $(".welcome-text-child-name").remove()
            $(".welcome-text").append(`<h1 class='welcome-text-child-name'> ${localStorage.getItem('name')}</h1>`)
            showTodo(localStorage.getItem('token'))
            .then(placeTodo)
            $("#log-out").show()
        })
        .fail(error => {
            const errors = error.responseJSON.msg.split(',')
            $('#error-signup').text(`${errors[0].split(': ')[1]}`)
        })
        

    })

    $("#log-in-form").on('submit', (e) => {
        e.preventDefault()
        const data = {
            emailOrUsername: $("#emailOrUsername").val(),
            passwordLogIn: $("#passwordLogIn").val(),
        }
        $.ajax({
            url: 'https://stormy-falls-14919.herokuapp.com/users/login',
            method: 'POST',
            data: {
                emailOrUsername: data.emailOrUsername,
                password: data.passwordLogIn
            }
        })
        .done(response => {
            localStorage.setItem('token', response.userToken)
            localStorage.setItem('name', response.name)
            $("#sign-up-page").hide()
            $('#error-login').text(``)
            $("#log-in-page").hide()
            $(".landing-page").hide()
            $(".dashboard-class").show()
            $(".welcome-text-child-name").remove()
            $(".welcome-text").append(`<h1 class='welcome-text-child-name'> ${localStorage.getItem('name')}</h1>`)
            showTodo(localStorage.getItem('token'))
            .then(placeTodo)
            $("#log-out").show()
        })
        .fail(error => {
            $('#error-login').text(`${error.responseJSON.msg}`)
        })
        
    })

    $(".add-btn").on('click', () => {
        $(".add-todos").slideDown()
        $(".dashboard-class").css("filter", "blur(3px)")
    })

    $(".back-todos-add").on('click', (e) => {
        e.preventDefault()
        $('#error-add').text(``)
        backToDashboard(".add-todos")
    })

    $("#todos-form").on('submit', (e) => {
        e.preventDefault()
        const inputDate = `${$("#due_date").val()}T${$("#due_time").val()}:00`
        const data = {
            title: $("#title").val(),
            description: $("#description").val(),
            due_date: new Date(inputDate),
        }
        $.ajax({
            url: 'https://stormy-falls-14919.herokuapp.com/todos',
            method: 'POST',
            data,
            headers: {
                user_token: localStorage.getItem('token')
            }
        })
        .done((result) => {
            if(gapi.auth2.getAuthInstance().isSignedIn.get()) gCalendar(data)
            backToDashboard(".add-todos")
            $('#error-add').text(``)
            $("#ds-2").empty()
        })
        .fail(error => {
            const errors = error.responseJSON.msg.split(',')
            $('#error-add').text(`${errors[0].split(': ')[1]}`)
        })
    })

    $("#log-out").on('click', () => {
        localStorage.clear()
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
          console.log('User signed out.');
        });
        $(".landing-page").show()
        $(".dashboard-class").hide()
        $("#log-out").hide()
        $(".landing-page").css("filter", "")
        $("#ds-3").empty()
        $("#ds-2").empty()
        $("#ds-1").empty()
        $("#emailOrUsername").val('')
        $("#passwordLogIn").val('')
        $("#first_name").val(''),
        $("#last_name").val(''),
        $("#username").val(''),
        $("#email").val(''),
        $("#password").val(''),
        $("#sign-up-page").val('')
    })
})

function showTodo(token){
    return $.ajax({
        url: 'https://stormy-falls-14919.herokuapp.com/todos',
        method: 'GET',
        headers: {
            user_token: token
        }
    })
}

function backToDashboard(toHide){
    $(toHide).hide()
    $(".dashboard-class").css("filter", "") 
    restartDashboard()
    generateQuotes()
    .then(quotes => {
        const random = Math.floor(Math.random() * 5)
        const quoteToShow = quotes.results[random].quote
        const author = quotes.results[random].author
        $("#quotes").append(`<p class="quote-text">"${quoteToShow}"</p><p class="quote-author">— ${author}</p>`)
    })

}

function generateQuotes(){
    $("#quotes").empty()
    return $.ajax({ 
        type : "GET", 
        url : "https://api.paperquotes.com/apiv1/quotes/?lang=en&random=random&order=?", 
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Token {token}');},
        success : function(result) { 
            return result.results; 
        }, 
        error : function(result) { 
          console.error(result)
        } 
      }); 
}

function restartDashboard(){
    $("#ds-2").empty()
    $("#ds-1").empty()
    $("#ds-3").empty()
    restartTodosForm()
    $("#quotes").empty()
    showTodo(localStorage.getItem('token'))
    .then(placeTodo)
}

function placeTodo(result) {
    $("#ds-1").empty()
    $("#ds-2").empty()
    $("#ds-3").empty()
    $("#ds-1").append('<h3 class="div-title">Your todos</h3>')
    $("#ds-3").append('<h3 class="div-title">Done todos</h3>')
    $("#ds-2").append('<h3 class="div-title">Detail</h3>')
    $.each(result, (i, v) => {
        const status = (v.status) ? 'Done' : 'Not done (yet!!!)'
        const color = (v.status) ?  'style = "color:green"' : 'style = "color: rgb(48, 3, 48)"'
        const toAppend = (v.status) ?  "#ds-3" : "#ds-1"
        $(toAppend).append(`<p class='todos' id='todos-${v.id}'>${v.title}</p>`)
        $(`#todos-${v.id}`).on('click', () => {
            $("#ds-2").empty()
            $("#ds-2").append('<h3 class="div-title">Detail</h3>')
            $("#ds-2").append(`<p class='todos-detail todos-title' > ${v.title.toUpperCase()}</p>`)
            $("#ds-2").append(`<p class='todos-detail todos-desc' > ${v.description} </p>`)
            $("#ds-2").append(`<p style="font-size:12px; margin:0; color:black">Due date: </p>`)
            $("#ds-2").append(`<p class='todos-detail todos-due_date' style="margin:0" >${parseDueDate(v.due_date)} </p>`)
            $("#ds-2").append(`<p class='todos-detail todos-status' ${color}> ${status}</p>`)
            if(status !== 'Done') {
                $("#ds-2").append(`<button id='done-${v.id}' class= 'done-todos-btn'>I've done this!</button>`)
                $(`#done-${v.id}`).on('click', () => {
                    doneTodo(v.id)
                })
            }
            $("#ds-2").append(`<button id='edit-${v.id}' class= 'todos-btn'>Edit</button>`)
            $(`#edit-${v.id}`).on('click', () => {
                showUpdateTodo(v.id)
            })
            $("#ds-2").append(`<button class= 'todos-btn'id='button-${v.id}'>Delete</button>`)
            $(`#button-${v.id}`).on('click', () => {
                deleteTodo(v.id)
            })
        })
    })
}

function deleteTodo(id){
    $.ajax({
        url: `https://stormy-falls-14919.herokuapp.com/todos/${id}`,
        method: 'DELETE',
        headers: {
            user_token: localStorage.getItem('token')
        }
    })
    .done (result => {
        $(`#todos-${id}`).remove()
        restartDashboard()
    })
}

function doneTodo(id){
    $.ajax({
        url: `https://stormy-falls-14919.herokuapp.com/todos/${id}`,
        method: 'PUT',
        headers: {
            user_token: localStorage.getItem('token')
        },
        data : {
            status: true,
        }
    })
    .done(res => {
        restartDashboard()
    })
}

function showUpdateTodo(id){
    $.ajax({
        url: `https://stormy-falls-14919.herokuapp.com/todos/${id}`,
        method: 'GET',
        headers: {
            user_token: localStorage.getItem('token')
        }
    })
    .done(result => {
        $('body').append(`
        <section id="edit-todos-${id}" class="edit-todos">
        <div class= "add-todos-div">
            <form id="edit-todos-form-${id}" class="edit-todos-form">
                <h3>Edit a todo</h3> <br>
                <label for="title" class= "sign-up-text-top">Title </label><br>
                <input type="text" id="edit-title-${id}" name="title" class= "sign-up-text" value="${result[0].title}"><br>
                <label for="description" class= "sign-up-text-top">Description: </label><br>
                <input type="text" id="edit-description-${id}" name="description" class= "sign-up-text" value="${result[0].description}"><br>
                <input type="submit" value="Edit" class="add-todos-btn" id="edit-todos-${id}">
                <button type="button" id="back-todos-edit-${id}" class="back-todos-edit">Back</button>
                <p id="error-edit" class="error-msg"><br></p>
            </form>
        </div>
        </section>`)
        $(`#back-todos-edit-${id}`).on('click', (e) => {
            e.preventDefault()
            $(`#edit-todos-${id}`).hide()
            $(".dashboard-class").css("filter", "")
        })
        $(`#edit-todos-${id}`).slideDown()
        $(".dashboard-class").css("filter", "blur(3px)")
        $(`#edit-todos-form-${id}`).on('submit', (e) => {
            e.preventDefault()
            const data = {
                title: $(`#edit-title-${id}`).val(),
                description: $(`#edit-description-${id}`).val(),
                due_date: $(`#edit-due_date-${id}`).val(),
            }
            $.ajax({
                url: `https://stormy-falls-14919.herokuapp.com/todos/${id}`,
                method: 'PUT',
                data,
                headers: {
                    user_token: localStorage.getItem('token')
                }
            })
            .done(result => {
                backToDashboard(".edit-todos")
            })
            .fail(error => {
                const errors = error.responseJSON.msg.split(',')
                $('#error-edit').text(`${errors[0].split(': ')[1]}`)
            })
        })
    })
}



function onSignIn(googleUser) {
    const id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        url: 'https://stormy-falls-14919.herokuapp.com/users/googleLogin',
        method: 'POST',
        headers: {
            token: id_token
        }
    })
    .then(response => {
        localStorage.setItem('token', response.token)
        localStorage.setItem('name', response.name)
        $("#sign-up-page").hide()
        $("#log-in-page").hide()
        $(".landing-page").hide()
        $(".dashboard-class").show()
        $(".welcome-text-child-name").remove()
        $(".welcome-text").append(`<h1 class='welcome-text-child-name'> ${localStorage.getItem('name')}</h1>`)
        showTodo(localStorage.getItem('token'))
        .then(placeTodo)
        $("#log-out").show()
    })
  }

  
function parseDueDate(datei){
    datei = new Date(datei) + 1
    let date = datei.getUTCDate();
    let month = datei.getUTCMonth() + 1;
    let year = datei.getUTCFullYear();
    let hour = datei.getHours()
    let ampm = ''
    if(hour > 12) {
        hour = hour - 12;
        ampm = 'PM'
    } else {
        ampm = 'AM'
    }
    if(String(hour).length < 2) hour = '0' + hour;
    let minutes = datei.getMinutes()
    if(String(minutes).length < 2) minutes = '0' + minutes;

    return ` ${hour} : ${minutes} ${ampm} - ${date}/${month}/${year}`;
}

function parseDueDateEdit(datei){
    datei = new Date(datei)
    let date = datei.getUTCDate() + 1;
    if(String(date).length < 2) date = '0' + date;
    let month = datei.getUTCMonth() + 1;
    if(String(month).length < 2) month = '0' + month;
    let year = datei.getUTCFullYear();
    return `${year}-${month}-${date}`;
}

function restartTodosForm(){
    $("#title").val('')
    $("#description").val('')
    $("#due_date").val('')
}

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

    
function initClient() {
    gapi.client.init({
        apiKey: "AIzaSyDUNeL833ES7R5RL2M9i6xPLQSYSKA1VNU",
        clientId: "128769362473-sb68dubhj91viobotpq4htj7bmqnpb38.apps.googleusercontent.com",
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        scope: "https://www.googleapis.com/auth/calendar"
    }).then(function () {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }, function(error) {
        console.log(JSON.stringify(error, null, 2));
    });
}

function updateSigninStatus(isSignedIn) {
    return true
}

function gCalendar(todo){
    const event = {
        'summary': `${todo.title}`,
        'location': 'Jakarta',
        'description': `${todo.description}`,
        'start': {
        'dateTime': new Date(`${todo.due_date}`),
        'timeZone': 'Africa/Abidjan'
        },
        'end': {
        'dateTime': new Date(`${todo.due_date}`),
        'timeZone': 'Africa/Abidjan'
        },
        'recurrence': [
        'RRULE:FREQ=DAILY;COUNT=1'
        ],
        'reminders': {
        'useDefault': false,
        'overrides': [
            {'method': 'email', 'minutes': 24 * 60},
            {'method': 'popup', 'minutes': 10}
        ]
        }
    };
    const request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
    });
    
    request.execute(function(event) {
        console.log(event)
    })
}