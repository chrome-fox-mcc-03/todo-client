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
    $('#createForm').hide();
    $('#updateForm').hide();
    $('#emailAlert').hide();
    $('#passwordAlert').hide();
    $('#create').hide();
    $('#modalDelete').hide();

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
    $('#create').hide();
    $('#createForm').hide();
    $('#updateForm').hide();
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
    $('#createForm').hide();
    $('#updateForm').hide();
    $('#emailLoginAlert').hide();
    $('#passwordLoginAlert').hide();
    $('#create').show();
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

/* CLEAR INPUT Login */

const clearLogin = () => {
    $('#loginEmail').val('');
    $('#loginPassword').val('');
}

const cancel = () => {
    clearInput();
    clearLogin();
}

const cancelUpdate = () => {
    $('#todoCards').show();
    $('#updateForm').hide();
}

/* CONTENT CARD TODO */

const cardTodo = (todos) => {
    let string;
    $('#todoCards').empty();
    todos.forEach((todo, index) => {
        string = `<div class="card-box">
        <div class="card text-white bg-info todolist">
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
    ${todo.due_date.split('T')[0]}
    </p>    
  </div>
  <div class="btn-group">
      <button onclick="toUpdateTodo(${todo.id})" type="button" class="updateTodo btn btn-light">
        Update
      </button>
      <button onclick="toDeleteTodo(${todo.id})" type="button" class="deleteTodo btn btn-dark" data-toggle="modal" data-target="#modalDelete">
        Delete
      </button>
      </div>
    </div>
    </div>`
        $('#todoCards').append(string);
    })
}

/* UPDATE TODO */

const toUpdateTodo = (id) => {
    let string;
    fetchOne(id).done(response => {
        string = `<h3>UPDATE TODO</h3>
        <div class="form-group">
          <label for="updateId">ID</label>
          <input class="form-control" type="text" id="updateId" name="id" value="${response.id}" readonly/>
        </div>
        <div class="form-group">
          <label for="updateTitle">TITLE</label>
          <input class="form-control" type="text" id="updateTitle" name="title" value="${response.title}"/>
        </div>
        <div class="form-group">
          <label for="updateDescription">DESCRIPTION</label>
          <input class="form-control" type="text" id="updateDescription" name="description" value="${response.description}" />
        </div>
        <div class="form-group">
          <label for="updateStatus">STATUS</label>
          <input class="form-control" type="text" id="updateStatus" name="status" value="${response.status}"/>
        </div>
        <div class="form-group">
          <label for="updateDueDate">DUE DATE</label>
          <input class="form-control" type="date" id="updateDueDate" name="due_date" value="${response.due_date.split('T')[0]}" />
        </div>        
        <button type="submit" class="btn btn-outline-dark">
          Update
        </button>
        <button onclick="cancelUpdate()" type="button" class="btn btn-outline-dark">
          Cancel
        </button>`;
        $('#todoCards').hide();
        $('#updateForm').show();
        $('#updateForm').html(string);
    }).fail(err => {
        console.log(err)
    })
}

/* DELETE TODO */

const toDeleteTodo = (id) => {
    let string = `<div class="modal-body">
    Are you sure want to delete this todo?    
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
    <button type="submit" class="btn btn-primary">Delete</button>
  </div>`
    localStorage.setItem('todoId', `${id}`);
    $('#deleteForm').html(string);
}

/* Google */

function onSignIn(googleUser) {
    let id_token = googleUser.getAuthResponse().id_token;
    console.log(id_token)

    googleSign(id_token).done(response => {
        // localStorage.setItem('token', response.access_token)

        $('#logout').show()
    }).fail(err => {
        console.log(err)
    })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
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
        login(payload).done(response => {
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

    // Creating Process
    $('#buttonCreate').on('click', () => {
        // create form;
        $('#todoCards').hide();
        $('#createForm').show();
    });

    $('#createForm').submit((event) => {
        event.preventDefault();
        const payload = {
            title: $('#createTitle').val(),
            description: $('#createDescription').val(),
            due_date: $('#createDueDate').val()
        }
        createTodo(payload).done(
            response => {
                fetchTodos().done(todos => {
                    $('#createForm').empty();
                    $('#createForm').hide();
                    $('#todoCards').show();
                    cardTodo(todos);
                }).fail(err => {
                    console.log(err);
                })
            }
        ).fail(err => {
            console.log(err)
        })
    })

    // Update Process

    $('#updateForm').submit(event => {
        event.preventDefault();
        let updateId = $('#updateId').val();
        let updateStatus = $('#updateStatus').val();
        let updateDate = $('#updateDueDate').val();
        if (updateStatus === 'true') {
            updateStatus = true;
        } else {
            updateStatus = false;
        }
        const payload = {
            id: +updateId,
            title: $('#updateTitle').val(),
            description: $('#updateDescription').val(),
            status: updateStatus,
            due_date: new Date(updateDate)
        }

        updateOneTodo(payload.id, payload).done(todo => {
            if (todo) {
                $('#updateForm').hide();
                fetchTodos().done(response => {
                    $('#todoCards').show();
                    cardTodo(response);
                }).fail(err => {
                    console.log(err);
                })
            }
        }).fail(err => {
            console.log(err)
        })
    });

    // Delete
    $('#deleteForm').submit(event => {
        event.preventDefault();
        const todoId = localStorage.getItem('todoId');
        deleteTodo(+todoId).done(response => {
            $('#deleteForm').empty();
            $('#modalDelete').modal('hide');
            localStorage.removeItem('todoId')

            fetchTodos().done(response => {
                $('#todoCards').show();
                cardTodo(response);
            }).fail(err => {
                console.log(err);
            })

        }).fail(err => {
            console.log(err)
        })
    });

    // Logout
    $('#logout').on('click', () => {
        signOut()
        localStorage.clear();
        clearLogin();
        defaultView();
    });
})

