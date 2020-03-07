function hideShow() {
  let token = localStorage.getItem('access_token');
  if (token) {
    $('#landing-page').hide();
    $('#dashboard').show();
    $('#edit-todo').hide();
  } else {
    $('#landing-page').show();
    $('#dashboard').hide();
  }
}

function logout() {
  localStorage.removeItem('access_token');
  hideShow();
}

let showForm = true;
function hideShowForm() {
  showForm = !showForm;
  if (showForm) {
    $('#login-form').show();
    $('#register-form').hide();
  } else {
    $('#login-form').hide();
    $('#register-form').show();
  }
}

// Google SignIn button custom theme
function renderButton() {
  gapi.signin2.render('my-signin2', {
    'scope': 'profile email',
    'width': 240,
    'height': 50,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': onSuccess,
    'onfailure': onFailure
  });
}

// Google SignIn
function onSignIn(googleUser) {
  // const profile = googleUser.getBasicProfile();
  let id_token = googleUser.getAuthResponse().id_token;
  $('.loading-login').append('Logging In...');
  $.ajax({
    url: `${BASE_URL}/googleSignIn`,
    type: 'POST',
    headers: {
      token: id_token,
    }
  })
    .done(access_token => {
      $('.err-message').empty();
      localStorage.setItem('access_token', access_token);
      hideShow();
    })
    .fail(err => {
      $('.err-message').empty();
      hideShow();
      $('.err-message').val(err);
    })
    .always(_=> {
      $('#email-login').val('');
      $('#password-login').val('');
      $('.loading-login').empty();
    })
}

function fetchTodo() {
  $("#todo-board").loading();
  fetchAllTodo()
    .done(result => {
      let content = '';
      let obj = {}
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      result.forEach(el => {
        if (!el.status) {
          obj = {
            id: el.id,
            title: el.title,
            description: el.description,
            due_date: el.due_date,
          };
          let date = new Date(el.due_date).toLocaleDateString('en-UK', options)

          content += `
            <div class="container" style="margin: 10px;padding-top: 10px;padding-bottom: 10px;background-color: #242426;opacity: 0.87;">
            <div>
                <h4 style="color: #ffffff;">${ el.title }</h4>
                <p style="color: rgb(255,255,255);">${ el.description }</p>
                <p style="color: rgb(255,255,255);">Due date: ${ date }</p>


                <div class="d-lg-flex">
                <button class="btn text-white shadow hvr-radial-out" onclick="statusChange(${el.id}, ${el.status})" type="button" style="background-color: #214a80;"><i class="fas fa-check"></i> Complete
                </button>
                <button class="btn text-white shadow hvr-radial-out" onclick="populateForm(${JSON.stringify(obj).split('"').join("&quot;")})" type="button" style="background-color: #214a80;margin-left: 12px;">
                <i class="fas fa-pencil-alt"></i> Edit
                </button>
              
                </div>
            </div>
          </div>
          `;
        }
        $('#todo-board').html(content);
      })
    })
    .fail(err => {
      let content = `
      <div style="margin: 10px;padding-top: 10px;padding-bottom: 10px;background-color: #242426;opacity: 0.87;"
          class="container hvr-glow">
        <div>
          <h4 style="color: #ffffff;" class="text-warning">You have no Todo right now</h4>
          <div class="d-lg-flex"></div>
        </div>
      </div>`
      $('#todo-board').html(content);
    })
    .always(_=> {
      $("#todo-board").loading('stop');
    })
}

function fetchCompletedTodo() {
  let content = '';
  $("#todo-board").loading();
  fetchAllTodo()
    .done(result => {
        result.forEach(el => {
          const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
          let date = new Date(el.due_date).toLocaleDateString('en-UK', options);
          if (el.status) {
            content += `
              <div class="container hvr-glow" style="margin: 10px;padding-top: 10px;padding-bottom: 10px;background-color: #242426;opacity: 0.87;">
              <div>
                  <h4 style="color: #ffffff; text-decoration: line-through;">${ el.title }</h4>
                  <p style="color: rgb(255,255,255); text-decoration: line-through;">${ el.description }</p>
                  <p style="color: rgb(255,255,255); text-decoration: line-through;">Due date: ${ date }</p>
                  <div class="d-lg-flex">
                  
                  <button class="btn text-white shadow hvr-radial-out" onclick="statusChange(${el.id}, ${el.status})" 
                    type="button" style="background-color: #214a80;">
                    <i class="fas fa-check"></i>Undo</button>
                    <button class="btn text-white bg-danger shadow" onclick="clickDelete(${el.id})" type="submit" style="margin-left: 12px;">Delete</button>
                  </div>
              </div>
            </div>
            `;
          }
          $('#todo-board').html(content);
        })

    })
    .fail(err => {
      // hideShow();
      let content = `
      <div style="margin: 10px;padding-top: 10px;padding-bottom: 10px;background-color: #242426;opacity: 0.87;"
          class="container float-none text-center">
        <div>
          <h4 style="color: #ffffff;" class="text-warning">You have no completed Todo right now</h4>
          <div class="d-lg-flex"></div>
        </div>
      </div>`
      $('#todo-board').html(content);
      $.notify(err.responseJSON.message, 'error')
    })
    .always(_=> {
      $("#todo-board").loading('stop');
    })
}

function statusChange(id, status) {
  status = !status;
  if (status) {
    updateStatus({ id, status })
      .done(result=> {
        $.notify(result.message, 'success')
      })
      .fail(err=> {
        $.notify(err.responseJSON.message, 'error')
      })
      .always(_ => {
        fetchCompletedTodo();
      })
  } else {
    updateStatus({ id, status })
      .done(result=> {
        $.notify(result.message, 'success')
      })
      .fail(err=> {
        $.notify(err.responseJSON.message, 'error')
      })
      .always(_ => {
        fetchTodo();
      })
  }
}

function populateForm(payload) {
  let date = new Date(payload.due_date);
  
  $('#edit-title').val(payload.title);
  $('#edit-description').val(payload.description);
  $('#edit-date').val(date.toISOString().substring(0, 10));
  $('#edit-id').val(payload.id);
  $('#edit-todo').show();
  $('#add-todo').hide();
}

function clickDelete(id) {
  showModal(id)
}

function showModal(id) {
  let content = `
  <div class="container border rounded shadow-lg" 
  id="delete-modal"    
  style="margin: 10px;padding-top: 10px;padding-bottom: 10px;background-color: #242426;opacity: 1; width:80%">
  <div>
      <h4 style="color: #ffffff;">Delete Confirmation</h4>
      <p style="color: rgb(255,255,255);">Are you sure to delete this todo?</p>
      <p style="color: rgb(255,255,255);"></p>
      <div class="d-lg-flex">
          <button onclick="fetchCompletedTodo()" class="btn btn-light text-primary" type="button">
              Cancel
          </button>
          <button onclick="confirmed(${id})" class="btn btn-danger" type="button" style="margin-left: 12px;">
              Delete
          </button>
      </div>
  </div>
</div>
  `
  $('#todo-board').html(content);
}

function confirmed(id) {
  $("#todo-board").loading();
  deleteTodo(id)
    .done(result => {
      $.notify(`Todo ${id} deleted`, 'success');
    })
    .fail(err => {
      $.notify(err.responseJSON.message, 'error');
    })
    .always(_ => {
      $("#todo-board").loading('stop');
      fetchCompletedTodo();
    })
}


$(document).ready(function() {
  hideShow();

  // Login
  $('#login-form').submit(e => {
    e.preventDefault();
    let email = $('#email-login').val();
    let password = $('#password-login').val();

    $('.loading-login').append('Logging In...');
    $('.err-message').empty();
    login({email, password})
      .done(token => {
        localStorage.setItem('access_token', token);
        $('.err-message').empty();
        hideShow();
        fetchTodo();
      })
      .fail(err => {
        $('.err-message').empty();
        hideShow();
        $('.err-message').append(err.responseJSON.message)
      })
      .always(_=> {
        $('#email-login').val('');
        $('#password-login').val('');
        $('.loading-login').empty();
      })
  })

  // Register
  $('#register-form').submit(e => {
    e.preventDefault();
    let email = $('#email-register').val();
    let password = $('#password-register').val();
    $('.loading-register').append('Registering...');

    register({email, password})
      .done(_ => {
        hideShow();
        hideShowForm();
        $('.err-message').empty();
        $('.loading-register').empty();
        $('.loading-login').append('Register success! Please login now');
      })
      .fail(err => {
        $('.err-message').empty();
        hideShow();
        $('.err-message').append(err.responseJSON.message)
      })
      .always(_=> {
        $('.loading-register').empty();
        $('#email-login').val('');
        $('#password-login').val('');
      })
  })

  // Click Register Now link
  $('#to-register').click(_ => {
    hideShowForm();
    $('.err-message').empty();
  })

  // Click Already Have an Account link
  $('#to-login').click(_ => {
    hideShowForm();
    $('.err-message').empty();
  })

  // Logout
  $('#logout').click(_ => {
    logout();
    signOut();
  });

  // fetch data
  fetchTodo();
    // always ==> loading done;
  
  // Add new todo
  $('#add-todo').submit(e => {
    e.preventDefault();
    let title = $('#add-todo-title').val();
    let description = $('#add-todo-description').val();
    let due_date = $('#add-todo-date').val();

    addTodo({
      title,
      description,
      due_date,
    })
      .done(_=> {
        fetchTodo();
        $.notify('Success added new todo', 'success');  
        $.notify('Check your email now', 'info');  
      })
      .fail(err => {
        $.notify(err.responseJSON.message, 'error');  
      })
      .always(_=> {
        $('#add-todo-title').val('');
        $('#add-todo-description').val('');
        $('#add-todo-date').val('');
      })
  });

  // Click Completed Task on sidebar
  $('#uncomplete-todo').click(_ => {
    fetchTodo();

  })

  // Click Todo List on sidebar
  $('#completed-todo').click(_ => {
    fetchCompletedTodo();
  })

  // Edit Todo
  $('#edit-todo').submit(e => {
    e.preventDefault();
    let id = $('#edit-id').val();
    let title = $('#edit-title').val();
    let description = $('#edit-description').val();
    let due_date = new Date($('#edit-date').val());
    let payload = {
      id,
      title,
      description,
      due_date,
    };
    $('#todo-board').loading()
    editTodo(payload)
      .done(result => {
        $.notify(result.message, 'success')
        fetchTodo()
      })
      .fail(err => {
        $.notify(err.responseJSON.message, 'error')
      })
      .always(_=> {
        $('#todo-board').loading('stop')
      })

  })

  // Click cancel button on edit form
  $('#cancel-edit').click(_=> {
    $('#edit-todo').hide();
    $('#add-todo').show();
  })

  // Disable date before today in input date
  let today = new Date().toISOString().split('T')[0];
  document.getElementById("add-todo-date").setAttribute('min', today);
  document.getElementById("edit-date").setAttribute('min', today);

  // Click delete on edit form 
  $('#edit-delete').click(_=> {
    let id = $('#edit-id').val();
    showModal(id);
  })
})
