//rendering page
$(document).ready(() => {
  if (!localStorage.token) {
    showLandingPage()
  } else {
    showContent()
  }
  
  //calling function
  showLogin()
  showRegister()
  backToLogin()
  login()
  register()
  createTodo()
  editTodo()

  //materialize functions
  $('.modal').modal()
  closeModal()
  $('.tooltipped').tooltip()
  M.updateTextFields()

  //to restrict past date in date input forms
  $('#due-date').attr('min', new Date().toISOString().slice(0,10))
})

//show landing page
function showLandingPage() {
  $('#navbar').hide()
  $('#login').hide()
  $('#register').hide()
  $('#todos').hide()
  $('#landing-page').show()
}

//show login
function showLogin() {
  $('#start').on('click', e => {
    e.preventDefault()
    $('#email-login').val('')
    $('#password-login').val('')

    $('#navbar').hide()
    $('#landing-page').hide()
    $('#login').show()
    $('#register').hide()
    $('#todos').hide()
  })
}

//back to login
function backToLogin() {
  $('#back-login').on('click', e => {
    e.preventDefault()
    $('#email-login').val('')
    $('#password-login').val('')

    $('#navbar').hide()
    $('#landing-page').hide()
    $('#login').show()
    $('#register').hide()
    $('#todos').hide()
  })
}

//show register
function showRegister() {
  $('#show-register').on('click', e => {
    e.preventDefault()
    $('#username-register').val('')
    $('#email-register').val('')
    $('#password-register').val('')

    $('#navbar').hide()
    $('#landing-page').hide()
    $('#login').hide()
    $('#register').show()
    $('#todos').hide()
  })
}

//show content
function showContent() {
  $('#navbar').show()
  $('#login').hide()
  $('#register').hide()
  $('#welcome-user').html(`<h5>Welcome ${localStorage.getItem('username')}</h5>`)
  fetchTodo()
  $('#todos').show()
  $('#landing-page').hide()
  weather()
}

function logout () {
  console.log('logout')
    M.toast({html: `Logout success! Goodbye ${localStorage.getItem('username')}`, classes: 'rounded'})
    signOut()
    localStorage.clear()
    showLandingPage()
}

//google logout
function signOut () {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  })
}

function closeModal() {
  $('.modal').modal('close')
}