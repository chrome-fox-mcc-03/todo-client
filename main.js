const token = localStorage.getItem('token')
let tempUpdate = {}

function onSignIn(googleUser) {
  const gToken = googleUser.getAuthResponse().id_token;
  $.ajax({
    method: "post",
    url: "http://localhost:3000/gsignin",
    headers: {
      token: gToken
    }
  })
    .done(data => {
      localStorage.setItem('token', data.token)
      list()
      home()
    })
    .fail(err => {
      console.log(err, 'error gsignin')
    })
}

function signin() {
  $('.signin').show()
  $('#btn-signup').show()

  $('.todo').hide()
  $('.signup').hide()
  $('.create').hide()
  $('.update').hide()
  $('#btn-signout').hide()
  $('#btn-signin').hide()
}

function signup() {
  $('.signup').show()
  $('#btn-signin').show()

  $('.todo').hide()
  $('.create').hide()
  $('.update').hide()
  $('.signin').hide()
  $('#btn-signup').hide()
  $('#btn-signout').hide()
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    localStorage.clear()
    signin()
  });
}

function home() {
  $('.todo').show()
  $('#btn-signout').show()

  $('.signup').hide()
  $('.signin').hide()
  $('.create').hide()
  $('.update').hide()
  $('#btn-signup').hide()
  $('#btn-signin').hide()

}

function list() {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

  $.ajax({
    method: 'get',
    url: 'http://localhost:3000/todo',
    headers: {
      token
    }
  })
    .done(({ data }) => {
      $('.table tbody').empty()
      data.forEach(el => {
        $('.table tbody').append(`
        <tr>
          <td>${el.title}</td>
          <td>${el.description}</td>
          <td>${el.status}</td>
          <td>${new Date(el.due_date).toLocaleDateString('en-US', options)}</td>
          <td>
          <a onclick="dataUpdate(${el.id})">
          <i class="fas fa-pen" style="margin-right: 15px; color: navy;"></i>
          </a>
          <a>
          <i class="fas fa-trash" style="color: red;"></i>
          </a>
          </td>
        </tr>
      `)
      })
    })
    .fail(err => {
      console.log(err, 'error list')
    })
}

function createForm() {
  $('.create').show()
  $('#btn-signout').show()

  $('.todo').hide()
  $('.update').hide()
  $('.signup').hide()
  $('.signin').hide()
  $('#btn-signup').hide()
  $('#btn-signin').hide()
}

function updateForm() {
  $('.update').show()
  $('#btn-signout').show()
  
  $('.todo').hide()
  $('.signup').hide()
  $('.signin').hide()
  $('.create').hide()
  $('#btn-signup').hide()
  $('#btn-signin').hide()
}

function dataUpdate(id) {
  $.ajax({
    method: 'get',
    url: `http://localhost:3000/todo/${id}`,
    headers: {
      token
    }
  })
    .done(({ data }) => {
      update(data)
    })
    .fail(err => {
      console.log(err, 'error dataUpdate')
    })
}

function update(data) {
  updateForm()
  const { id, title, description, status, due_date } = data
  const day = ('0' + new Date(due_date).getDate()).slice(-2)
  const month = ('0', + (due_date.getMonth() + 1)).slice(-2)
  const date = `${day} - ${month} - ${new Date(due_date).getFullYear}`
  console.log(month)

  const newTitle = $('#title-update').val(title)
  const newDescription = $('#description-update').val(description)
  const newStatus = status
  const newDue_date = $('#due_date-update').val(new Date(due_date))
  


}

$(document).ready(_ => {
  if (token) {
    list()
    home()
  } else {
    signin()
  }

  // SIGN OUT
  $('#btn-signout').on('click', (e) => {
    signOut()
  })

  // SIGN UP
  $('#btn-signup').on('click', (e) => {
    signup()
  })
  $('.signup').submit(e => {
    const username = $('#username-signup').val()
    const email = $('#email-signup').val()
    const password = $('#password-signup').val()
    console.log(username, email, password)
    $.ajax({
      method: 'post',
      url: 'http://localhost:3000/signup',
      data: {
        username,
        email,
        password
      }
    })
      .done(data => {
        console.log(data, 'data signup')
      })
      .fail(err => {
        console.log(err, 'error signup')
      })
    e.preventDefault()
  })

  // SIGN IN
  $('#btn-signin').on('click', (e) => {
    signin()
  })
  $('.signin').submit(e => {
    const email = $('#email-signin').val()
    const password = $('#password-signin').val()
    $.ajax({
      method: 'post',
      url: 'http://localhost:3000/signin',
      data: {
        email,
        password
      }
    })
      .done(data => {
        localStorage.setItem('token', data.token)
        list()
        home()
      })
      .fail(err => {
        console.log(err, 'error signin')
      })
    e.preventDefault()
  })

  // HOME
  $('#a-logo').on('click', _ => {
    list()
    home()
  })

  // CREATE
  $('#a-create').on('click', (e) => {
    createForm()
  })
  $('.create').submit(e => {
    const title = $('#title-create').val()
    const description = $('#description-create').val()
    const due_date = $('#due_date-create').val()

    $.ajax({
      method: 'post',
      url: 'http://localhost:3000/todo',
      headers: {
        token: localStorage.getItem('token')
      },
      data: {
        title,
        description,
        due_date: new Date(due_date)
      }
    })
      .done(data => {
        list()
        home()
        console.log(data, 'data create')
      })
      .fail(err => {
        console.log(err, 'error create')
      })
    e.preventDefault()
  })

  // UPDATE
  $('#a-').on('click', (e) => {
    updateForm()
  })
  $('.update').submit(e => {
    const title = $('#title-update').val()
    const description = $('#description-update').val()
    const due_date = $('#due_date-update').val()
    console.log(title, description, new Date(due_date))
  })

})