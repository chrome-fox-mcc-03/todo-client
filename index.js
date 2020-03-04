let message
let token

// $( document ).ready(function() {
    token = localStorage.getItem('token')
    if(token) {
        renderDashboard()
    } else {
        renderLanding()
    }


    $("#btn-register").on('click', function() {
        renderSignUp()
    })

    $("#btn-login").on('click', function() {
        renderSignIn()
    })


    // $("#signin-form").on("click")

// });

function renderDashboard() {
    $("#signin-page").hide()
    $("#signup-page").hide()
    $("#dashboard-page").show()
    // showTodos()
}

function renderLanding() {
    $("#signin-page").show()
    $("#signup-page").hide()
    $("#dashboard-page").hide()
}

function renderSignUp() {
    $("#signup-page").show()
    $("#signin-page").hide()
    $("#dashboard-page").hide()
}

function renderSignIn() {
    $("#signup-page").hide()
    $("#signin-page").show()
    $("#dashboard-page").hide()
}



function login(event) {
    event.preventDefault()

    const email = $("#signin-email").val()
    const password = $("#signin-password").val()

    console.log(`Welcome Back to Todos App, ${email}`);

    $.ajax({
        method: "post",
        url: "http://localhost:4000/users/signin",
        data: {
            email,
            password
        }
    })
    .done(response => {
        console.log(`Register success, now generating token`);
        console.log(`response is`);
        console.log(response);
        localStorage.setItem('token', response.token)
        //show dashboard, hide login
        // showTodos()
        // renderDashboard()

        // token = localStorage.getItem('token')

        $.ajax({
            method: "get",
            url: "http://localhost:4000/todos/",
            headers: {
                token: localStorage.getItem("token")
            }
        })
        .done(response => {
            console.log(`login success. showing todos`);
            console.log(response);
            console.log(`todos layer 1`);
            console.log(response.todos);

            response.todos.forEach(el => {
                $("tbl-todo-data").append(`
                    <tr>
                        <td>${el.id}</td>
                        <td>${el.title}</td>
                        <td>${el.description}</td>
                        <td>${el.status}</td>
                        <td>${el.due_date}</td>
                        <td>DEfault</td>
                    </tr>
                `)
            })

        })
        
        renderDashboard()
        
    })
    .fail(err => {
        console.log(err);
        $(".remarks").append(`<h3>${err}</h3>`)
    })

}

/* function showTodos() {
    token = localStorage.getItem('token')
    $.ajax({
        method: "get",
        url: "http://localhost:4000/todos/",
        headers: {
            token: localStorage.getItem("token")
        }
    }).done(response => {
        console.log(`login success. showing todos`);
        console.log(response);
        console.log(`todos layer 1`);
        console.log(response.todos);

        
        response.todos.forEach(el => {
            $("tbl-todo-data").append(`
                <tr>
                    <td>${el.id}</td>
                    <td>${el.title}</td>
                    <td>${el.description}</td>
                    <td>${el.status}</td>
                    <td>${el.due_date}</td>
                    <td>DEfault</td>
                </tr>
            `)
        })
         
        
    })
    // .fail(err => {
    //     showMessage(err.response.JSON.message)
    // })

}
 */
function register(event) {
        event.preventDefault()
       
        const email = $("#signup-email").val()
        const password = $("#signup-password").val()

        console.log(`Welcome to Todos App, ${email}`);

        $.ajax({
            method: "post",
            url: "http://localhost:4000/users/signup",
            data: {
                email,
                password
            }
        })
        .done(response => {
            console.log(`Register success, now generating token`);
            console.log(`response is`);
            console.log(response);
            // localStorage.setItem('token', response.token)
            const newUser = response.datum.email
            const tempMessage = response.datum.message
            message = `${tempMessage}. Welcome, ${newUser}.`

            $(".remarks").append(`<h3>${message}</h3>`)

            renderSignIn()

        })
        .fail(err => {
            console.log(err);
            $(".remarks").append(`<h3>${err}</h3>`)
        })

}

