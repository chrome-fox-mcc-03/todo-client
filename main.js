function login() {
  $(".login").show()
  $(".register").hide()
  $(".list").hide()
}

function register() {
  $(".login").hide()
  $(".register").show()
  $(".list").hide()
}

function list() {
  $(".login").hide()
  $(".register").hide()
  $(".list").show()
  fetch()
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
      home()
    })
    .fail(err => {
      console.log(err, 'error gsignin')
    })
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
          <td>Feature</td>
        </tr> 
        `)

      })
      
    })
    .fail(err => console.log(err))

}


$(document).ready(_ => {
  const token = localStorage.getItem("token")
  if (token) {
    list()
  } else {
    login()
  }

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

  
})