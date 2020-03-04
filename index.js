function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  var id_token = googleUser.getAuthResponse().id_token;
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  $.ajax({
    method:"GET",
    url: "http://localhost:3000/glogin",
    headers: {
      token: id_token
    }
  })
  .done((token) => {
    localStorage.setItem('token', token)
    console.log(token);
    fetchTodoList()
    $('#register-page').hide()
    $('#login-page').hide()
    $('#dashboard-page').show()
    $('#create-page').hide()
  })
  .fail((err) => {
    console.log(err);
  })
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}

function fetchTodoList() {
  $.ajax({
    method: "GET",
    url: "http://localhost:3000/todos",
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done((todo) => {
      $('#todos').empty()
      for (let i = 0; i < todo.length; i++) {
        $('#todos').append(`<p>${todo[i].title}</p><button onclick="editTodo(${todo[i].id})">Edit</button>`)
      }
      console.log(todo);
    })
    .fail((err) => {
      console.log(err);
    })
}

// function editTodo(id) {

// }

$(document).ready(function () {
  let token = localStorage.getItem('token')
  if (token) {
    $('#register-page').hide()
    $('#login-page').hide()
    $('#dashboard-page').show()
    $('#create-page').hide()
    fetchTodoList()
  } else {
    $('#register-page').hide()
    $('#login-page').show()
    $('#dashboard-page').hide()
    $('#create-page').hide()

  }

  $('#form-register').on('submit', function () {
    event.preventDefault()
    let email = $('#email-register').val()
    let password = $('#password-register').val()
    $.ajax({
      method: "POST",
      url: "http://localhost:3000/register",
      data: { email, password }
    })
      .done((token) => {
        localStorage.setItem('token', token)
        console.log(token);
        fetchTodoList()
        $('#register-page').hide()
        $('#login-page').hide()
        $('#dashboard-page').show()
        $('#create-page').hide()
      })
      .fail((err) => {
        console.log(err);
      })
  })

  $('#form-login').on('submit', function () {
    event.preventDefault()
    let email = $('#email-login').val()
    let password = $('#password-login').val()
    // console.log(email, password);
    $.ajax({
      method: "POST",
      url: "http://localhost:3000/login",
      data: { email, password }
    })
      .done((token) => {
        localStorage.setItem('token', token)
        console.log(token);
        fetchTodoList()
        $('#register-page').hide()
        $('#login-page').hide()
        $('#dashboard-page').show()
        $('#create-page').hide()
      })
      .fail((err) => {
        console.log(err);

      })
  })

  $('#create-form').on('submit', function () {
    event.preventDefault()
    let title = $('#todo-title').val()
    let description = $('#todo-description').val()
    let duedate = $('#todo-due_date').val()
    $.ajax({
      method: "POST",
      url: "http://localhost:3000/todos",
      headers: {
        token: localStorage.getItem('token')
      },
      data: {
        title: title,
        description: description,
        status: false,
        due_date: duedate
      }
    })
      .done((todo) => {
        console.log(todo);
        $('#register-page').hide()
        $('#login-page').hide()
        $('#dashboard-page').show()
        $('#create-page').hide()
      })
      .fail((err) => {
        console.log(err);

      })
  })

  $('#login-btn').on('click', function () {
    $('#register-page').hide()
    $('#login-page').show()
    $('#dashboard-page').hide()
    $('#create-page').hide()

  })

  $('#register-btn').on('click', function () {
    $('#register-page').show()
    $('#login-page').hide()
    $('#dashboard-page').hide()
    $('#create-page').hide()

  })

  $('#logout-btn').on('click', function () {
    localStorage.clear()
    signOut()
    $('#register-page').hide()
    $('#login-page').show()
    $('#dashboard-page').hide()
    $('#create-page').hide()
  })

  $('#create-btn').on('click', function () {
    $('#register-page').hide()
    $('#login-page').hide()
    $('#dashboard-page').show()
    $('#create-page').show()

  })

});