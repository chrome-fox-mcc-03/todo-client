function hideShow() {
  const token = localStorage.getItem('access_token');
  if (token) {
    $('#landing-page').hide();
    $('#dashboard').show();
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
  const id_token = googleUser.getAuthResponse().id_token;

  $.ajax({
    url: `${BASE_URL}/googleSignIn`,
    type: 'POST',
    headers: {
      token: id_token,
    }
  })
    .done(access_token => {
      localStorage.setItem('access_token', access_token);
      hideShow();
    })
    .fail(err => {
      hideShow();
      console.log(err.responseJSON.message, '>>>>>');
    })
    .always(_=> {
      $('#email-login').val('');
      $('#password-login').val('');
    })
}

function fetchTodo() {
  fetchAllTodo()
    .done(result => {
      console.log(result);
      let content = '';
      result.forEach(el => {
        if (!el.status) {
          content += `
            <div class="container" style="margin: 10px;padding-top: 10px;padding-bottom: 10px;background-color: #242426;opacity: 0.87;">
            <div>
                <h4 style="color: #ffffff;">${ el.title }</h4>
                <p style="color: rgb(255,255,255);">${ el.description }</p>
                <p style="color: rgb(255,255,255);">${ el.due_date }</p>
                <div class="d-lg-flex"><button class="btn text-white shadow" type="button" style="background-color: #214a80;"><i class="fas fa-check"></i> Complete</button><button class="btn text-white shadow" type="button" style="background-color: #214a80;margin-left: 12px;"><i class="fas fa-pencil-alt"></i> Edit</button></div>
            </div>
          </div>
          `;
        }
        $('#todo-board').html(content);
      })
    })
    .fail(err => {
      console.log(err);
    })
}


$(document).ready(function() {
  hideShow();

  // Login
  $('#login-form').submit(e => {
    e.preventDefault();
    const email = $('#email-login').val();
    const password = $('#password-login').val();
    console.log(email, password, $('#email-login').val(), '>>> dari index.js')
    login({email, password})
      .done(token => {
        localStorage.setItem('access_token', token);
        hideShow();
        fetchTodo();
      })
      .fail(err => {
        hideShow();
        console.log(err.responseJSON.message, '>>>>>');
      })
      .always(_=> {
        $('#email-login').val('');
        $('#password-login').val('');
      })
  })

  // Register
  $('#register-form').submit(e => {
    e.preventDefault();
    const email = $('#register-login').val();
    const password = $('#register-login').val();

    register({email, password})
      .done(_ => {
        hideShow();
        hideShowForm();
      })
      .fail(err => {
        hideShow();
        console.log(err.responseJSON.message, '>>>>>');
      })
  })

  // Click Register Now link
  $('#to-register').click(_ => {
    hideShowForm();
  })

  // Click Already Have an Account link
  $('#to-login').click(_ => {
    hideShowForm();
  })

  // Logout
  $('#logout').click(_ => {
    logout();
    signOut();
  });

  // fetch data
  fetchTodo();
    // always ==> loading done;
  
})