function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  var id_token = googleUser.getAuthResponse().id_token;
  $.ajax({
    method: "GET",
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
      $('#update-page').hide()
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
        $('#todos').append(`<p>${todo[i].title}</p><button onclick="editTodo(${todo[i].id})">Edit</button><button onclick="deleteTodo(${todo[i].id})">Delete</button>`)
      }
      console.log(todo);
    })
    .fail((err) => {
      console.log(err);
    })
}

function editTodo(id) {
  // console.log('touch me');
  $('#register-page').hide()
  $('#login-page').hide()
  $('#dashboard-page').hide()
  $('#create-page').hide()
  $('#update-page').show()
  $.ajax({
    method: "GET",
    url: `http://localhost:3000/todos/${id}`,
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done((todoedit) => {
      // console.log(todoedit.title);
      localStorage.setItem('id', id)
      let date = new Date(todoedit.due_date).toISOString().substring(0, 10)
      $('#update-title').val(todoedit.title)
      $('#update-description').val(todoedit.description)
      $('#update-status').val(todoedit.status)
      $('#update-due_date').val(date)

    })
    .fail((err) => {
      console.log(err);

    })
}

function deleteTodo(id) {
  $.ajax({
    method: "DELETE",
    url: `http://localhost:3000/todos/${id}`,
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done(() => {
      console.log('ah ke hapus');
      fetchTodoList()
      $('#register-page').hide()
      $('#login-page').hide()
      $('#dashboard-page').show()
      $('#create-page').hide()
      $('#update-page').hide()
    })
    .fail((err) => {
      console.log(err);

    })

}

$(document).ready(function () {
  let token = localStorage.getItem('token')
  if (token) {
    $('#register-page').hide()
    $('#login-page').hide()
    $('#dashboard-page').show()
    $('#create-page').hide()
    $('#update-page').hide()
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
        $('#update-page').hide()
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
        $('#update-page').hide()
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
        fetchTodoList()
      })
      .fail((err) => {
        console.log(err);

      })
  })

  $('#update-form').on('submit', function () {
    event.preventDefault()
    let title = $('#update-title').val()
    let description = $('#update-description').val()
    let status = $('#update-status').val()
    let duedate = $('#update-due_date').val()
    $.ajax({
      method: "PUT",
      url: `http://localhost:3000/todos/${localStorage.getItem("id")}`,
      headers: {
        token: localStorage.getItem("token")
      },
      data: {
        title: title,
        description: description,
        status: status,
        due_date: duedate
      }
    })
      .done((updatedtodo) => {
        console.log(updatedtodo);
        fetchTodoList()
        $('#register-page').hide()
        $('#login-page').hide()
        $('#dashboard-page').show()
        $('#create-page').hide()
        $('#update-page').hide()
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
    $('#update-page').hide()
  })

  $('#register-btn').on('click', function () {
    $('#register-page').show()
    $('#login-page').hide()
    $('#dashboard-page').hide()
    $('#create-page').hide()
    $('#update-page').hide()
  })

  $('#logout-btn').on('click', function () {
    localStorage.clear()
    signOut()
    $('#register-page').hide()
    $('#login-page').show()
    $('#dashboard-page').hide()
    $('#create-page').hide()
    $('#update-page').hide()
  })

  $('#create-btn').on('click', function () {
    $('#register-page').hide()
    $('#login-page').hide()
    $('#dashboard-page').show()
    $('#create-page').show()
    $('#update-page').hide()
  })

});