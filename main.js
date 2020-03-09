function login() {
  $(".login").show()
  $(".register").hide()
  $(".list").hide()
  $(".create").hide()
  $(".update").show()
  $("#logout").hide()
}

function register() {
  $(".login").hide()
  $(".register").show()
  $(".list").hide()
  $(".create").hide()
  $(".update").show()
  $("#logout").show()
}

function formCreate() {
  $(".login").hide()
  $(".register").hide()
  $(".list").hide()
  $(".create").show()
  $(".update").show()
  $("#logout").show()
}
function formUpdate() {
  $(".login").hide()
  $(".register").hide()
  $(".list").hide()
  $(".create").hide()
  $(".update").show()
  $("#logout").show()
}

function takeUpdate(id) {
  $.ajax({
    method: "GET",
    url: `http://localhost:3000/todos/${id}`,
    headers: {token: localStorage.getItem('token')}
  })
    .done(response => {
      $("#formUpdate").append(`
      <div class="modal-body">
        <form class="form-group">
            <label for="todo">Todo Name</label><br>
            <input class="form-control input-sm value" id="title_update" type="text" placeholder="Whats You Gonna Do" value="${response.title}"/><br>
            <label for="description">Description</label><br>
            <input class="form-control input-sm value" id="description_update" type="text" placeholder="Description" value="${response.description}"/><br>
            <label for="due_date">Due Date</label><br>
            <input class="form-control input-sm value" id="due_date_update" type="date"/>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" onclick="update(${response.id})">Save changes</button>
      </div>`)
    })
    .fail(err => console.log(err))
}

function update(id) {
  console.log(id)
  const title = $('#title-update').val()
  const description = $('#description-update').val()
  const due_date = new Date($('#due_date-update').val())
  let token= localStorage.getItem('token')
  $.ajax({
    method: "PUT",
    url: `http://localhost:3000/todos/${id}`,
    headers: {token},
    data: {
      title, 
      description, 
      due_date
    }
  })
    .done(response => {
      console.log(response)
      list()
    })
    .fail(err => console.log(err))
}

function destroy(id) {
  $.ajax({
    method: "DELETE",
    url: `http://localhost:3000/todos/${id}`,
    headers: {token: localStorage.getItem('token')}
  })
    .done(response => {
      console.log(response)
      list()
    })
    .fail(err => console.log(err))
}

function fetch() {
  $.ajax({
    method: "GET",
    url: "http://localhost:3000/todos",
    headers: {token: localStorage.getItem('token')}
  })
    .done(response => {
      $("#tbody-list").empty()
      response.forEach(el => {
        // console.log(el)
        $("#tbody-list").append(`
        <tr>
          <td>${el.title}</td>
          <td>${el.description}</td>
          <td>${el.status}</td>
          <td>${new Date(el.due_date).toDateString()}</td>
          <td>
          <button type="button" onClick="takeUpdate(${el.id})">EDIT</button> || <button type="button" onClick="destroy(${el.id})">DELETE</button>
          </td>
        </tr> 
        `)
      })
      
    })
    .fail(err => console.log(err))
}

{/*  */}

function list() {
  fetch()
  $(".login").hide()
  $(".register").hide()
  $(".list").show()
  $(".create").hide()
  $(".update").show()
  $("#logout").show()
}

function onSignIn(googleUser) {
  const gToken = googleUser.getAuthResponse().id_token;
  $.ajax({
    method: "post",
    url: "http://localhost:3000/google",
    headers: {
      token: gToken
    }
  })
    .done(data => {
      localStorage.setItem('token', data.token)
      list()
    })
    .fail(err => {
      console.log(err, 'error gsignin')
    })
}



$(document).ready(_ => {
  const token = localStorage.getItem("token")
  if (token) {
    list()
  } else {
    login()
  }



  $("#logout").on("click", e => {
    e.preventDefault()
    localStorage.clear()
    login()
  })

  $("#login-register").on("click", e =>{
    e.preventDefault()
    register()
  })
  $("#register-login").on("click", e =>{
    e.preventDefault()
    login()
  })

  $(".login-form").on("submit", e => {
    e.preventDefault()
    const email = $("#email-login").val()
    const password = $("#password-login").val()
    $.ajax({
      method: "POST",
      url: "http://localhost:3000/login",
      data: {email, password}
    })
      .done(response => {
        // console.log(response)
        localStorage.setItem("token", response.token)
        list()
      })
      .fail(err => console.log(err))
  })

  $("#create-todo").on("click", e => {
    e.preventDefault()
    // console.log('eh kepencet')
    formCreate()
  })

  $('#create-post-todo').on('submit', e => {
    e.preventDefault()
    const title = $('#title').val()
    const description = $('#description').val()
    const status = $('#status').val()
    const due_date = $('#due_date').val()
    const token = localStorage.getItem('token')
    // console.log(title, description, status, due_date)
    $.ajax({
      method: "POST",
      url: "http://localhost:3000/todos",
      headers: {
        token
      },
      data: {
        title,
        description,
        status,
        due_date
      }
  })
      .done(response => {
        console.log(response)
        list()
      })
      .fail(err => console.log(err))
  })

  $(".register-form").on("submit", e => {
    e.preventDefault()
    const email = $("#email-register").val()
    const password = $("#password-register").val()
    $.ajax({
      method: "POST",
      url: "http://localhost:3000/register",
      data: {email, password}
    })
      .done(response => {
        // console.log(response)
        // localStorage.setItem("token", response.token)
        login()
      })
      .fail(err => console.log(err))
  })

  $("#edit-id").on("click", e => {
    console.log('edit')
  })

  $("#create-todo").on("click", e => {
    formCreate()
  })
  
})