//login
function login () {
  $('#login-form').on('submit', e => {
    e.preventDefault()
    const email = $('#email-login').val()
    const password = $('#password-login').val()
    $.ajax({
      // url: 'http://localhost:3000/users',
      url: 'https://stormy-dusk-36316.herokuapp.com/users',
      method: 'POST',
      data: { email, password }
    })
      .done(response => {
        let token = response.token
        let username = response.username
        localStorage.setItem('token', token)
        localStorage.setItem('username', username)
        showContent()
        M.toast({html: `Login successful. Welcome ${username}`, classes: 'rounded'})
      })
      .fail(err => {
        $('#email-login').val('')
        $('#password-login').val('')
        M.toast({html: `${err.responseText}`, classes: 'rounded red'});
      })
  })
}

//google sign in
function onSignIn (googleUser) {
  // const profile = googleUser.getBasicProfile();
  const id_token = googleUser.getAuthResponse().id_token
  // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  // console.log('Name: ' + profile.getName());
  // console.log('Image URL: ' + profile.getImageUrl());
  // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

  //sending to server through api
  $.ajax('https://stormy-dusk-36316.herokuapp.com/users/googleLogin', {
    method: 'POST',
    headers: {
      id_token
    }
  })
    .done(response => {
      localStorage.token = response.token
      localStorage.username = response.username
      $('#user').val("")
      $('#password').val("")
      showContent()
      M.toast({html: `Login successful. Welcome ${username}`, classes: 'rounded'})
  
    })
    .fail(err => {
      signOut()
      M.toast({html: `${err.responseText}`, classes: 'rounded red'});
    })
}

function register() {
  $('#register-form').on('submit', e => {
    e.preventDefault()
    const username = $('#username-register').val()
    const email = $('#email-register').val()
    const password = $('#password-register').val()

    $.ajax({
      // url: 'http://localhost:3000/users/register',
      url: 'https://stormy-dusk-36316.herokuapp.com/register',
      method: 'POST',
      data: { username, email, password }
    })
      .done(response => {
        $('#navbar').hide()
        $('#landing-page').hide()
        $('#login').show()
        $('#register').hide()
        $('#todos').hide()
        M.toast({html: `${response.message}`, classes: 'rounded'})
      })
      .fail(err => {
        $('#username-register').val('')
        $('#email-register').val('')
        $('#password-register').val('')
        M.toast({html: `${err.responseJSON}`, classes: 'rounded red'})
      })
  })
}

function fetchTodo() {
  let fetching =  true
  $.ajax({
    // url: 'http://localhost:3000/todos',
    url: 'https://stormy-dusk-36316.herokuapp.com/todos',
    method: 'GET',
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done(todos => {
      fetching = false
      let todoCards = ''
      if (!todos.length) {
        todoCards = `
          <div class="col s12 center">
            <div class="card hoverable">
              <div class="card-content">
                <span class="card-title"><h3>You don't have any todo, yet...</h3></span>
                <h6>Please make a todo by clicking '+' button</h6>
              </div>
            </div>
          </div>
        `
      } else {
        todos.forEach(todo => {
          let due_date = new Date(todo.due_date).toLocaleString('id', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

          let status = ''
          if (todo.status) status = `<h6 id="status-${todo.id}" style="color: green">Done</h6>`
          else status = `<h6 style="color: red;">Not done</h6>`
          
          todoCards += `
            <div class="col s12">
              <div class="card hoverable">
                <div class="card-content">
                  <span class="card-title"><h3>${todo.title}</h3></span>
                  <h5>Due date: ${due_date}</h5>
                  ${status}
                  <p>${todo.description}</p>
                </div>
                <div class="card-action center">
                  <a onClick="markTodo(${todo.id}, ${todo.status})" href="#" class="btn-large brown lighten-3 left"><i class="large material-icons left">check_box</i>Mark</a>
                  <a onClick="showOneTodo(${todo.id})" href="#" class="btn-large brown lighten-3 modal-trigger" data-target="updateTodo"><i class="large material-icons left">edit</i>Edit</a>
                  <a onClick="deleteTodo(${todo.id})" href="#" class=" btn-large right brown lighten-3"><i class="large material-icons left">delete</i>Delete</a>
                </div>
              </div>
            </div>
          `
        });
      }
      $('#todo').html(todoCards)
    })
    .fail(err => {
      console.log(err)
      M.toast({html: 'Something went wrong. Please login again', classes: 'rounded red'})
    })
    .always(() => {
      let loading = `
        <div class="progress">
          <div class="indeterminate"></div>
        </div>
      `
      if (fetching) $('#todo').html(loading)
    })
}

function createTodo () {
  $('#newTodo-form').on('submit', e => {
    let title = $('#title-todo').val()
    let description = $('#description').val()
    let status = false
    let due_date = $('#due-date').val()
    // let loading = true
    e.preventDefault()
    $.ajax({
      // url: 'http://localhost:3000/todos/create',
      url: 'https://stormy-dusk-36316.herokuapp.com/todos/create',
      method: 'POST',
      headers: { token: localStorage.getItem('token') },
      data: { title, description, status, due_date }
    })
      .done(response => {
        closeModal()
        $('#title').val('')
        $('#description').val('')
        $('#due_date').val('')
        fetchTodo()
        M.toast({html: `${response.message}`, classes: 'rounded'})
      })
      .fail(err => {
        $('#title').val('')
        $('#description').val('')
        $('#due-date').val('')
        M.toast({html: `${err.responseJSON.errors}`, classes: 'rounded red'})
      })
  })
}

function markTodo (todoId, todoStatus) {
  let token = localStorage.getItem('token')
  let newStatus = !todoStatus
  $.ajax({
    // url: `http://localhost:3000/todos/${todoId}/status`,
    url: `https://stormy-dusk-36316.herokuapp.com/todos/${todoId}/status`,
    method: 'PATCH',
    data: { status: newStatus },
    headers: { token }
  })
    .done(response => {
      fetchTodo()
      M.toast({html: `${response.message}`, classes: 'rounded'})
    })
    .fail(err => {
      M.toast({html: `${err.responseJSON.errors}`, classes: 'rounded red'})
    })
}

function showOneTodo (todoId) {
  let token = localStorage.getItem('token')
  $.ajax({
    // url: `http://localhost:3000/todos/${todoId}`,
    url: `https://stormy-dusk-36316.herokuapp.com/todos/${todoId}`,
    method: 'GET',
    headers: { token }
  })
  .done(todo => {
    let due_date = new Date(todo.due_date)
    const offset = due_date.getTimezoneOffset(); 
    due_date = new Date(due_date.getTime() + (offset*60*1000)); 
    due_date = due_date.toISOString().split('T')[0]

    $('#updateId').val(`${todo.id}`)
    $('#title-update').val(`${todo.title}`)
    $('#description-update').val(`${todo.description}`)
    $('#due-date-update').val(`${due_date}`)
  })
  .fail(err => {
    closeModal()
    M.toast({html: `${err.responseJSON.errors}`, classes: 'rounded red'})
  })
}

function editTodo () {
  $('#updateTodo-form').on('submit', e => {
    let token = localStorage.getItem('token')
    let todoId = $('#updateId').val()
    let title = $('#title-update').val()
    let description = $('#description-update').val()
    let due_date = $('#due-date-update').val()

    $.ajax({
      // url: `http://localhost:3000/todos/${id}/edit`,
      url: `https://stormy-dusk-36316.herokuapp.com/todos/${todoId}/edit`,
      method: 'PUT',
      data: { title, description, due_date },
      headers: { token } 
    })
    .done(response => {
      closeModal()
      $('#updateId').val('')
      $('#title-update').val('')
      $('#description-update').val('')
      $('#due-date-update').val('')
      fetchTodo()
      M.toast({html: `${response.message}`, classes: 'rounded'})
    })
    .fail(err => {
      M.toast({html: `${err.responseJSON.errors}`, classes: 'rounded red'})
    })
  })
}

function deleteTodo (todoId) {
  let token = localStorage.getItem('token')
  $.ajax({
    // url: `http://localhost:3000/todos/${todoId}/delete`,
    url: `https://stormy-dusk-36316.herokuapp.com/todos/${todoId}/status`,
    method: 'DELETE',
    headers: { token }
  })
    .done(response => {
      fetchTodo()
      M.toast({html: `${response.message}`, classes: 'rounded'})
    })
    .fail(err => {
      M.toast({html: `${err.responseJSON.errors}`, classes: 'rounded red'})
    })
}

function weather() {
  let token = localStorage.getItem('token')
  $('#weather-card').html(`
    <div class="progress">
      <div class="indeterminate"></div>
    </div>
  `)
  $.ajax({
    // url: 'http://localhost:3000/api/weather',
    url: `https://stormy-dusk-36316.herokuapp.com/api/weather`,
    method: 'GET',
    headers: { token }
  })
    .done(response => {
      fetching = false
      let weatherCard = `
        <div class="card-image">
          <img 
            src="https://www.metaweather.com/static/img/weather/png/${response.weather_state_abbr}.png"
            height="100" 
            width="42"
          >
        </div>
        <div class="card-stacked">
          <div class="card-content">
            <span class="card-title">Tommorow will be ${response.weather_state_name} in Jakarta</span>
            <p>${Math.trunc(response.the_temp)} &#8451</p>
            <p>${response.humidity}% of humidity</p>
            <p>${response.predictability} % of happening</p>
          </div>
          <div class="card-action">
            <a href="https://www.metaweather.com" target="_blank">Provided by meta weather</a>
          </div>
        </div>
      `
      $('#weather-card').html(weatherCard)
    })
    .fail(err => {
      let msg = ''
      if (err.status === 500) msg = err.statusText
      else msg = err.responseJSON.errors
      M.toast({html: `${msg}`, classes: 'rounded red'})
      $('#weather-card').html('WEATHER ERROR')
    })
}