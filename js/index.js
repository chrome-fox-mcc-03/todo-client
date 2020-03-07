/* DEFAULT */
const defaultView = () => {
    $('#registerForm').show();
    $('#register').show();
    // todoCards
    $('#todoCards').hide();
    // Login Form
    $('#loginForm').hide();
    $('#login').show();
    // Logout Button
    $('#logout').hide();
    // Default Register Form Show
    $('#emailAlert').hide();
    $('#passwordAlert').hide();
};

const loginView = () => {
    $('#registerForm').hide();
    // todoCards
    $('#todoCards').hide();
    // Login Form
    $('#loginForm').show();
    // Logout Button
    $('#logout').hide();
    // Default Register Form Show
    $('#emailLoginAlert').hide();
    $('#passwordLoginAlert').hide();
}

const isLogin = () => {
    $('#registerForm').hide();
    $('#register').hide();
    // Login Form
    $('#login').hide();
    $('#loginForm').hide();
    // Logout Button
    $('#logout').show();
    // Default Register Form Show
    $('#emailLoginAlert').hide();
    $('#passwordLoginAlert').hide();
}

/*  FUNCTIONS */

const registerSuccess = () => {
    $('#registerForm').hide();
    $('#loginForm').show();
};

const registerClick = () => {
    $('#register').on('click', () => {
        // register form;
        defaultView();
    });
}

/* LOGIN AREA */
const loginClick = () => {
    $('#login').on('click', () => {
        // login form;
        loginView();
    });
}

/* CLEAR INPUT */

const clearInput = () => {
    $('#inputEmail').val('');
    $('#inputPassword').val('');
}

/* CONTENT CARD TODO */

const cardTodo = (todos) => {
    let string;
    $('#todoCards').empty();
    todos.forEach((todo, index) => {
        if (todo.status === null) todo.status = false;
        string = `<div class="card-box"><div class="card text-white bg-info todolist">
  <div class="card-header">#${index + 1}.</div>
  <div class="card-body">
    <h5 class="card-title">${todo.title}</h5>
    <p class="card-text">
    ${todo.description}
    </p>
    <h6>Todo Status</h6>
    <p class="card-text">
    ${todo.status}
    </p>
    <h6>Due Date</h6>
    <p class="card-text">
    ${todo.due_date}
    </p>    
  </div>
  <div class="btn-group">
      <button type="button" class="updateTodo btn btn-light">
        Update
      </button>
      <button type="button" class="deleteTodo btn btn-dark">
        Delete
      </button>
      </div>
    </div>
    </div>`
        $('#todoCards').append(string);
    })
}


$(document).ready(() => {
    if (!localStorage.token) {
        defaultView();
        registerClick();
        loginClick();

        $('#home').on('click', () => {
            defaultView();
        })
    } else {
        isLogin();
        // Show Todo Area
        $('#home').on('click', () => {
            isLogin();
        })
    }

    // Register Process
    $('#registerForm').submit((event) => {
        event.preventDefault();
        const payload = {
            email: $('#inputEmail').val(),
            password: $('#inputPassword').val()
        }

        register(payload).done(response => {
            $('#loginForm').show();
            $('#registerForm').hide();
            clearInput();
        }).fail(err => {
            defaultView();
        })
    })

    // Login Process

    $('#loginForm').submit((event) => {
        event.preventDefault();
        const payload = {
            email: $('#loginEmail').val(),
            password: $('#loginPassword').val()
        }

        console.log(payload);

        login(payload).done(response => {
            console.log(response)
            const token = response.token;
            localStorage.setItem('token', token);
            isLogin();
            // Fetch todos
            fetchTodos().done(response => {
                $('#todoCards').show();
                cardTodo(response);
            }).fail(err => {
                console.log(err);
            })

        }).fail(err => {
            loginView();
        })
    })

    $('#logout').on('click', () => {
        localStorage.removeItem('token');
        localStorage.clear();
        loginView();
        clearInput();
    });
})

