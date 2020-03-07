const token = localStorage.getItem('token')
let updateId = 0

function onSignIn(googleUser) {
  const gToken = googleUser.getAuthResponse().id_token;
  $.ajax({
    method: "post",
    url: "https://fierce-sierra-83913.herokuapp.com/gsignin",
    headers: {
      token: gToken
    }
  })
    .done(data => {
      localStorage.setItem('token', data.token)
      list()
      home()
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: data.message,
        showConfirmButton: false,
        timer: 2000
      })
    })
    .fail(err => {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: err.responseJSON.message
      })
    })
}

function signin() {
  $('.signin').show()
  $('#btn-signup').show()

  $('.weather').hide()
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

  $('.weather').hide()
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
  $('.weather').show()

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
    url: 'https://fierce-sierra-83913.herokuapp.com/todo',
    headers: {
      token
    }
  })
    .done(({ data }) => {
      let status = null
      $('.table tbody').empty()
      data.forEach((el, i) => {
        if (el.status) {
          status = `<button class="button is-success is-outlined" id="status-true" onclick="doneUndone(${el.id}, ${el.status})">Done</button>`
        } else {
          status = `<button class="button is-danger is-outlined" id="status-false"  onclick="doneUndone(${el.id}, ${el.status})">Undone</button>`
        }
        $('.table tbody').append(`
        <tr>
          <td>${i + 1}</td>
          <td>${el.title}</td>
          <td>${el.description}</td>
          <td>${status}</td>
          <td>${new Date(el.due_date).toLocaleDateString('en-US', options)}</td>
          <td>
          <a onclick="dataUpdate(${el.id})">
          <i class="fas fa-pen" style="margin-right: 15px; color: navy;"></i>
          </a>
          <a onclick="destroy(${el.id})">
          <i class="fas fa-trash" style="color: red;"></i>
          </a>
          </td>
        </tr>
      `)
      })
    })
    .fail(err => {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: err.responseJSON.message
      })
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
    url: `https://fierce-sierra-83913.herokuapp.com/todo/${id}`,
    headers: {
      token
    }
  })
    .done(({ data }) => {
      const { title, description } = data
      let date = new Date(data.due_date)
      let day = ("0" + date.getDate()).slice(-2)
      let month = ("0" + (date.getMonth() + 1)).slice(-2)
      let dateTodo = date.getFullYear() + "-" + (month) + "-" + (day)

      $('#title-update').val(title)
      $('#description-update').val(description)
      $('#due_date-update').val(dateTodo)
      updateForm()
      updateId = id
    })
    .fail(err => {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: err.responseJSON.message
      })
    })
}

function destroy(id) {
  Swal.fire({
    title: 'Are you sure want to delete this ToDo?',
    text: "This ToDo will deleted permanently",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Delete'
  }).then((result) => {
    if (result.value) {
      $.ajax({
        method: 'delete',
        url: `https://fierce-sierra-83913.herokuapp.com/todo/${id}`,
        headers: {
          token
        }
      })
        .then(_ => {
          list()
          home()
          Swal.fire(
            'Deleted!',
            'Your ToDo has been deleted.',
            'success'
          )
        })
        .catch(err => {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: err.responseJSON.message
          })
        })
    }
  })
}

function doneUndone(id, status) {
  status ? status = false : status = true

  $.ajax({
    method: 'put',
    url: `https://fierce-sierra-83913.herokuapp.com/todo/${id}`,
    headers: {
      token
    },
    data: {
      status
    }
  })
    .done(data => {
      list()
      home()
    })
    .fail(err => {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: err.responseJSON.message
      })
    })
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
    $.ajax({
      method: 'post',
      url: 'https://fierce-sierra-83913.herokuapp.com/signup',
      data: {
        username,
        email,
        password
      }
    })
      .done(data => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: data.message,
          showConfirmButton: false,
          timer: 2000
        })
        signin()
        $('#username-signup').val('')
        $('#email-signup').val('')
        $('#password-signup').val('')
      })
      .fail(err => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: err.responseJSON.message
        })
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
      url: 'https://fierce-sierra-83913.herokuapp.com/signin',
      data: {
        email,
        password
      }
    })
      .done(data => {
        localStorage.setItem('token', data.token)
        list()
        home()
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: data.message,
          showConfirmButton: false,
          timer: 2000
        })
        $('#email-signin').val('')
        $('#password-signin').val('')
      })
      .fail(err => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: err.responseJSON.message
        })
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
      url: 'https://fierce-sierra-83913.herokuapp.com/todo',
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
        $('#title-create').val('')
        $('#description-create').val('')
        $('#due_date-create').val('')
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Success create new Todo',
          showConfirmButton: false,
          timer: 2000
        })
      })
      .fail(err => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: err.responseJSON.message
        })
      })
    e.preventDefault()
  })

  // UPDATE
  $('.update').submit(e => {
    const title = $('#title-update').val()
    const description = $('#description-update').val()
    const due_date = $('#due_date-update').val()

    $.ajax({
      method: 'put',
      url: `https://fierce-sierra-83913.herokuapp.com/todo/${updateId}`,
      headers: {
        token: localStorage.getItem('token')
      },
      data: {
        title, description, due_date
      }
    })
      .done(_ => {
        list()
        home()
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Success update Todo',
          showConfirmButton: false,
          timer: 2000
        })
        $('#title-update').val('')
        $('#description-update').val('')
        $('#due_date-update').val('')
      })
      .fail(err => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: err.responseJSON.message
        })
      })
    e.preventDefault()
  })

  // WEATHER API
  $('.weather').submit(e => {
    const city = $('#weather').val()
    const rain = 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/ec0cca0d-55c3-45b9-a196-300ef1fe13e8/db79s4v-6a187d85-bd3d-4370-87df-8bb7ef88df4c.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2VjMGNjYTBkLTU1YzMtNDViOS1hMTk2LTMwMGVmMWZlMTNlOFwvZGI3OXM0di02YTE4N2Q4NS1iZDNkLTQzNzAtODdkZi04YmI3ZWY4OGRmNGMuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.fjw5KUM5mPmDPDbxmfkNTrwHUhEbq_mVSnal0ckIPNI'
    const cloud = 'https://cdn.clipart.email/511b37b2b0db1ddd3359338441ec91ff_cloud-sticker-for-ios-android-giphy_480-240.gif'
    const thunderStorm = 'https://i.gifer.com/5RTL.gif'
    const sunny = 'https://media.giphy.com/media/BCgbjF9Y41UgGEam5O/giphy.gif'

    $.ajax({
      method: 'get',
      url: `https://fierce-sierra-83913.herokuapp.com/api/weather?city=${city}`,
      headers: {
        token
      }
    })
      .done(({ data }) => {
        const { main, description } = data[0]
        let gif = ''
        if (main === 'Rain') {
          gif = rain
        } else if (main === 'Clouds') {
          gif = cloud
        } else if (main === 'Thunderstorm') {
          gif = thunderStorm
        } else {
          gif = sunny
        }
        Swal.fire({
          title: city,
          text: description,
          imageUrl: gif,
          imageWidth: 500,
          imageHeight: 300
        })
        id()
      })
      .fail(_ => {
        Swal.fire({
          icon: 'error',
          title: 'Invalid city name',
          text: 'Please insert city name correctly!'
        })
      })
    $('#weather').val('')
    e.preventDefault()
  })

})