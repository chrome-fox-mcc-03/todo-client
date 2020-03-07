function checkLogin() {
  if (!localStorage.token) {
    landingPage()
  } else {
    dashboardPage()
  }
}

function landingPage() {
  $("#landing-page").show()
  $("#dashboard-page").hide()
  $("#navbar-home").show()
  $("#home-section").show()
  $("#login-section").hide()
  $("#register-section").hide()
  showPublicHoliday()
}

function dashboardPage() {
  $("#landing-page").hide()
  $("#dashboard-page").show()
  fetchTodo()
}

function registerPage() {
  $("#landing-page").show()
  $("#dashboard-page").hide()
  $("#navbar-home").show()
  $("#home-section").hide()
  $("#login-section").hide()
  $("#register-section").show()
}

function registerProcess(name, email, password) {
  $.ajax({
    url: 'http://localhost:3000/register',
    method: 'POST',
    data: {
      name,
      email,
      password
    }
  })
    .done(data => {
      loginPage()
    })
    .fail(err => {
      console.log(err.responseJSON.errors)
    })
}

function loginPage() {
  $("#landing-page").show()
  $("#dashboard-page").hide()
  $("#navbar-home").show()
  $("#home-section").hide()
  $("#login-section").show()
  $("#register-section").hide()
}

function loginProcess(email, password) {
  $.ajax({
    url: 'http://localhost:3000/login',
    method: 'POST',
    data: {
      email,
      password
    }
  })
    .done(data => {
      localStorage.token = data.accessToken
      dashboardPage()
    })
    .fail(err => {
      console.log(err.responseJSON.errors)
    })
}

function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;

  $.ajax({
      url: "http://localhost:3000/googleSign",
      method : "POST",
      data: {
          id_token
      }
  })
      .done(function(data) {
          localStorage.token = data.accesToken
          dashboardPage()
      })
      .fail(function(err) {
          console.log(err)
      })
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}

function logoutProcess() {
  localStorage.removeItem('token')
  landingPage()
  signOut()
}

function fetchTodo() {
  let token = localStorage.token
  $.ajax({
    url: 'http://localhost:3000/todos',
    method: 'GET',
    headers: {
      token
    }
  })
    .done(data => {
      $('.list-todos').empty()
      let index = 0
      data.forEach(todo => {
        let date_todo = new Date(todo.due_date).toLocaleDateString()
        let li = `
        <li class="todo-user">
          <div class="title">
            <p class="top-named">Project title</p>
            <p class="todo-content">${todo.title}</p>
          </div>
          <div class="description">
            <p class="top-named">Description</p>
            <p class="todo-content">${todo.description}</p>
          </div>
          <div class="person">
            <p class="top-named">Person</p>
            <p class="todo-content">${todo.User.name}</p>
          </div>
          <div class="due-date">
            <p class="top-named">Due by</p>
            <p class="todo-content">${date_todo}</p>
          </div>
          <div class="status">
              <span class="badge badge-pill badge-success">${todo.Status.name}</span>
          </div>
          <div class="view-details">
              <a onclick="viewDetail(${todo.id})">View Details</a>
          </div>
          <div class="delete-todo">
              <a style="cursor:pointer;" onclick="deleteTodo(${todo.id})"><i class="fas fa-trash-alt"></i></a>
          </div>
        </li>
        `
        $(".list-todos").append(li)
      })
      
    })
    .fail(err => {
      console.log(err.responseJSON.errors)
    })
}

function fetchStatus () {
  $.ajax({
    url: 'http://localhost:3000/statuses',
    method: 'GET'
  })
    .done(data => {
      console.log(data)
      data.forEach(status => {
        let option = `<option value="${status.id}">${status.name}</option>`
        $("#todo-status").append(option)
      })
    })
    .fail(err => {
      console.log(err)
    })
}

function addTodo(title, description, StatusId, due_date) {
  let token = localStorage.token
  
  $.ajax({
    url: 'http://localhost:3000/todos',
    method: 'POST',
    headers: {
      token
    },
    data : {
      title,
      description,
      StatusId,
      due_date
    }
  })
    .done(data => {
      console.log(data)
      $('#add-todo').modal('hide')
      dashboardPage()
      return $.ajax({
        url: 'http://localhost:3000/googleCalender',
        method: 'POST',
        data: {
          title: data.title,
          description: data.description,
          due_date: data.due_date
        }
      })
    })
    .done(dataCalender => {
      console.log(dataCalender, '>>>>>>>>>>>>>')
    })
    .fail(err => {
      console.log(err)
    })
}

function viewDetail(todoId) {
  let token = localStorage.token
  $.ajax({
    url: 'http://localhost:3000/todos/' + todoId,
    method: 'GET',
    headers: {
      token
    }
  })
    .done(data => {
      $("#edit-todo").empty()
      console.log(data)
      let dateTodo = new Date(data.dataTodo.due_date).toLocaleDateString('fr-CA')
      let modalEdit = `
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Edit Todo</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form>
                <div>
                  <label for="title">Title</label>
                  <input type="text" id="edit-title" class="form-control" value="${data.dataTodo.title}" required>
                </div>
                <div class="mb-3">
                  <label for="validationTextarea">Description</label>
                  <textarea class="form-control" id="edit-description">${data.dataTodo.description}</textarea>
                  <div class="invalid-feedback">
                    Please enter a message in the textarea.
                  </div>
                </div>
                <div class="form-group">
                  <label for="exampleFormControlSelect1">Example select</label>
                  <select id="edit-status" class="form-control" id="exampleFormControlSelect1">
                  
                  </select>
                </div>
                <div>
                  <label for="due_date">Example select</label>
                  <input type="date" id="edit-duedate"  value="${dateTodo}" class="form-control">
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>
                  <button type="submit" class="btn btn-primary" onclick="editTodo(${data.dataTodo.id})">Edit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      `
      $("#edit-todo").append(modalEdit)
      
      data.dataStatus.forEach(status => {
        if ( data.dataTodo.Status.id === status.id) {
          let option = `<option value="${data.dataTodo.Status.id}" selected>${data.dataTodo.Status.name}</option>`
          $("#edit-status").append(option)
        } else {
          let option = `<option value="${status.id}">${status.name}</option>`
          $("#edit-status").append(option)
        }
      })

      $('#edit-todo').modal({
        show : true
      })
    })
    .fail(err => {
      console.log(err.responseJSON.errors)
    })
}

function editTodo(todoId) {
  let token = localStorage.token
  let title = $("#edit-title").val()
  let description = $("#edit-description").val()
  let StatusId = $("#edit-status").val()
  let due_date = $("#edit-duedate").val()
  // console.log(title, description, StatusId, due_date)
  $.ajax({
    url: 'http://localhost:3000/todos/' + todoId,
    method: 'PUT',
    headers: {
      token
    },
    data: {
      title,
      description,
      StatusId,
      due_date
    }
  })
    .done(data => {
      console.log(data, 'UPDATE >>>>>>>>>>')
      $('#edit-todo').modal('hide')
      dashboardPage()
    })
    .fail(err => {
      console.log()
    })
}

function deleteTodo(todoId) {
  let token = localStorage.token
  $.ajax({
    url: 'http://localhost:3000/todos/' + todoId,
    method: 'DELETE',
    headers: {
      token
    }
  })
    .done(response => {
      dashboardPage()
    })
    .catch(err => {
      console.log(err)
    })
}

function showPublicHoliday() {
  $.ajax({
    url: "http://localhost:3000/api/publicHoliday",
    method: "GET"
  })
    .done(function (holidayDate) {
        $("#public-holiday #dating").empty()
        $("#public-holiday #year h1").empty()
      let currentYear = new Date().getFullYear()
      $("#public-holiday #year h1").append(`
      <h1 style="">${currentYear} Indonesian Public Holiday</h1>
      `)
      let arr = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DES']
      holidayDate.data.forEach(element => {
        let month = +element.date.slice(5, 7)
        let tanggal = element.date.slice(8, 10)
        $("#public-holiday #dating").append(
          `
            <li>
                <div class="time">
                  <h2>${arr[month - 1]}</h2>
                </div> 
                <div class="details">
                  <div class="date">
                    <h2>${tanggal}</h2>
                  </div>  
                  <h3>${element.localName}</h3> 
                </div>
                <div style="clear: both;"> </div>
              </li>
          `
        )
      });
    })
    .fail(function (err) {
      console.log(err)
    })
}

$(document).ready(function() {
  checkLogin()

  $("#navbar-home .register").on('click', function() {
    registerPage()
  })

  $("#navbar-home .login").on('click', function() {
    loginPage()
  })

  $("#register-section").on('submit', function(e) {
    e.preventDefault()
    let name = $("#register-name").val()
    let email = $("#register-email").val()
    let password = $("#register-password").val()
    registerProcess(name, email, password)
  })
  
  $("#login-section").on('submit', function(e) {
    e.preventDefault()
    let email = $("#login-email").val()
    let password = $("#login-password").val()
    loginProcess(email, password)
  })

  $("#register-g-sign").on("click", e=> {
    e.preventDefault()
    dashboardPage()
  })

  $("#logout").on("click", e => {
    e.preventDefault()
    logoutProcess()
})

  $("#form-add-todo").on('click', function() {
    $("#todo-status").empty()
    fetchStatus()
    $("#add-todo").modal('show')
  })

  $("#add-todo").on('submit', function(e) {
    e.preventDefault()
    let title = $("#todo-title").val()
    let description = $("#todo-description").val()
    let StatusId = Number($("#todo-status").val())
    let due_date = $("#todo-duedate").val()
    console.log(title, description, StatusId, due_date, 'MASUK >>>>>>>>>>')
    addTodo(title, description, StatusId, due_date)
  })

  $("#view-detail").on('click', function(e) {
    
  })
})