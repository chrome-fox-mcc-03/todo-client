function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  var id_token = googleUser.getAuthResponse().id_token;
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  console.log('token: ' + id_token)
}
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}

function hideAll() {
  $(".register").hide()
  $(".login").hide()
  $(".logout").hide()
  $(".form-login").hide()
  $(".form-register").hide()
  $(".add").hide()
  $(".form-todo").hide()
  $("#list-id").hide()
  $(".form-edit").hide()
  $(".drop").hide()
  $(".news").hide()
  $("#news").hide()
  $("#news-title").hide()
}

function randomImage(){
  const arr = [
    'nature,water',
    'nature',
    'city',
    'lava'
  ]
  return arr[Math.floor(Math.random()*arr.length)]
}

function isLogin() {
  if(localStorage.token) {
    hideAll()
    $(".drop").show()
    $("#list-id").empty()
    $(".news").empty()
    $("#news").show()
    news()
    fetch()
    $(".logout").show()
    $(".add").show()
    $("#list-id").show()
  }else {
    hideAll()
    $(".form-login").show()
    $(".register").show()
  }
}

function news() {
  $("#news-title").show()
  $.ajax({
    url: 'https://fast-headland-53714.herokuapp.com/api',
    method: 'get',
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done(data => {
      for(let i = 0 ; i < 6;i++ ){
        $('#news').append(
          `
        <div class="col s12 m4">
          <div class="card medium">
          <div class="card-image waves-effect waves-block waves-light">
            <img class="activator" src="${data.articles[i].urlToImage}">
          </div>
          <div class="card-content">
            <span class="card-title activator grey-text text-darken-4">${data.articles[i].title}<i class="material-icons right">info_outline
            </i></span>
          </div>
          <div class="card-reveal">
            <span class="card-title grey-text text-darken-4">Details<i class="material-icons right">close</i></span>
            <div>Description: <blockquote>${data.articles[i].description}</blockquote></div>
            <div>publishedAt: <blockquote>${new Date(data.articles[i].publishedAt).toDateString()}</blockquote></div>
            <div>content: <blockquote>${data.articles[i].content}</blockquote></div>
          </div>
          </div>
        </div>
     `
        )
      }
    })
    .fail(err =>{
      console.log(err)
    })
}

function fetch() {
  $("#todo-title").show()
  $.ajax({
    method: "get",
    url: "https://fast-headland-53714.herokuapp.com/todo",
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .then(data => {
      if(data.length < 1) {
        $("#list-id").append(
          `
          <h1 class="center">PLEASE ADD TODO</h1>
          `
        )
      }else{
      data.forEach(el => {
        if(el.status === true){
          el.status = 'Done'
        }else{
          el.status = 'Pending'
        }
        $('#list-id').append(
          `
        <div class="col s12 m4">
          <div class="card medium">
          <div class="card-image waves-effect waves-block waves-light">
            <img class="activator" src="https://source.unsplash.com/200x300/?${randomImage()}">
          </div>
          <div class="card-content">
            <span class="card-title activator grey-text text-darken-4">${el.title}<i class="material-icons right">info_outline
            </i></span>
          </div>
          <div class="card-reveal">
            <span class="card-title grey-text text-darken-4">Details<i class="material-icons right">close</i></span>
            <div>Description: <blockquote>${el.description}</blockquote></div>
            <div>Status: <blockquote>${el.status}</blockquote></div>
            <div>Due_date: <blockquote>${new Date(el.due_date).toDateString()}</blockquote></div>
            <div>Action: <blockquote><a style="cursor: pointer;" onclick="deleted(${el.id})"  value=${el.id}>delete</a> | <a style="cursor: pointer;" onclick="complete(${el.id})"  value=${el.id}>complete</a> | <a style="cursor: pointer;" onclick="findone(${el.id})"  value=${el.id}>edit</a></blockquote></div>
          </div>
          </div>
        </div>
     `
        )
      });
    }
    })
    .catch(err => {
      console.log(err)
    })
}

function complete(id) {
  $(".progress").show()
  $.ajax({
    method: "patch",
    url: 'https://fast-headland-53714.herokuapp.com/todo/user/' + id,
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .then(data => {
      $("#list-id").empty()
      fetch()
      M.toast({html: 'complete succses'})
    })
    .fail(err => {
      M.toast({html: err.responseText })
    })
    .always(done => {
      $('.progress').hide()
    })
}

function deleted(id) {
  $('.progress').show()
  $.ajax({
    method: 'delete',
    url: 'https://fast-headland-53714.herokuapp.com/todo/user/' + id,
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done(data => {
      $("#list-id").empty()
      fetch()
      M.toast({html: 'deleted succses'})
    })
    .fail(err => {
      M.toast({html: err.responseText})
    })
    .always(done => {
      $(".progress").hide()
    })
}

function findone(id) {
  hideAll()
  $('.form-edit').show()
  $.ajax({
    method: 'get',
    url: 'https://fast-headland-53714.herokuapp.com/todo/user/' + id,
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done(data => {
      if(data) {
      }
      $(".form-edit").append(
        `
        <div class="col s12 l4 offset-l4">
          <div class="card">
            <div class="card-content">
              <h4 class="card-title center-align">Todo-Edit</h4>
              <form>
                <div class="row">
                  <div class="input-field col s12">
                    <i class="material-icons prefix">border_color
                    </i>
                    <input type="text" id="titleEdit" class="validate" value="${data.title}"/>
                  </div>
                </div>
                <div class="row">
                  <div class="input-field col s12">
                    <i class="material-icons prefix">event</i>
                    <input type="text" id="descriptionEdit" class="validate" value="${data.description}" />
                  </div>
                </div>
                <div class="row">
                  <div class="input-field col s12">
                    <i class="material-icons prefix">date_range</i>
                    <input type="date" id="dateEdit" class="validate" value="${data.due_date}"/>
                  </div>
                </div>
                <div class="row center-align">
                  <button class="btn waves-effect waves-light" type="submit" id="submitRegister" onclick="edit(${id})" value="${id}">Submit
                    <i class="material-icons right">send</i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        `
      )
    })
    .fail(err => {
      console.log(err)
      M.toast({html: err.responseText})
    })
}

function edit(id) {
  const title = $("#titleEdit").val()
  const description = $('#descriptionEdit').val()
  const due_date = $("#dateEdit").val()
  $('.progress').show()
  $.ajax({
    method: "put",
    url: "https://fast-headland-53714.herokuapp.com/todo/user1/" + id,
    headers: {
      token: localStorage.getItem('token')
    },
    data: {
      title,
      description,
      due_date
    }
  })
    .done(data => {
      M.toast({html: "sucsses update"})
    })
    .fail(err => {
      console.log(err)
      M.toast({html: err.responseText})
    })

    .always(done => {
      $('.progress').hide()
    })
}

function onSignIn(googleUser) {
  $('.progress').show()
  const token = googleUser.getAuthResponse().id_token
$.ajax({
  method: 'get',
  url: 'https://fast-headland-53714.herokuapp.com/loginGoogle',
  headers: {
    token
  }
})
  .done(data =>{
    console.log(data,"COKCOKCOCKOCKOCKOC")
    localStorage.setItem('token',data)
    isLogin()
    M.toast({html: 'login succses'})
  })
  .fail(err => {
    console.log(err)
    M.toast({html: err.responseText})
  })
  .always(done => {
    $(".progress").hide()
  })
}

$(".errorPassword").hide()


$(document).ready(() => {
  isLogin()
  $('.dropdown-trigger').dropdown({
    'hover': true,
    'autoTrigger': true,
    'alignment': 'center'
    
  });
  hideAll()
  isLogin()
  $('.progress').hide()
  $(".form-todo").on('submit', (e) => {
    $('.progress').show()
    e.preventDefault()
    const title = $("#title").val()
    const description = $('#description').val()
    const date = $('#date').val()
    $.ajax({
      method: 'POST',
      url: 'http://localhost:3000/todo/user',
      data: {
        title,
        description,
        due_date: date
      },
      headers: {
        token: localStorage.getItem('token')
      }
    })
      .done(data => {
        hideAll()
        $("#list-id").empty()
        $("#list-id").show()
        $(".logout").show()
        $(".add").show()
        fetch()
        M.toast({html: 'add succses'})
      })
      .fail(err => {
        console.log(err.responseText)
        M.toast({html: `${err.responseText}`})
      })
      .always(result => {
        $('.progress').hide()
      })
  })
  $(".logout").on('click',(e) => {
    e.preventDefault()
    hideAll()
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
    localStorage.clear()
    isLogin()
  })
  $('.sidenav').sidenav();
  $('.register').on('click', (e) => {
    e.preventDefault()
    hideAll()
    $(".form-register").show()
    $('.login').show()
  })
  $('.login').on('click', (e) => {
    e.preventDefault()
    hideAll()
    $(".form-login").show()
    $('.register').show()
  })
  $('.login-form').on('submit', (e) => { 
    e.preventDefault()
    $('.progress').show()
    const email = $("#email").val()
    const password = $("#password").val()
    $.ajax({
      url: 'https://fast-headland-53714.herokuapp.com/login',
      method: 'POST',
      data: {
        email,
        password
      }
    })
      .done(result => {
        localStorage.setItem('token',result)
        isLogin()
        M.toast({html: 'login succses'})
      })
      .fail(err => {
        M.toast({html: `${err.responseText}`})
      })
      .always(result => {
        $('.progress').hide()
      })
  })
  $(".form-register").on('submit', (e) => {
    $(".progress").show()
    e.preventDefault()
    const username = $("#username").val()
    const email = $("#emailRegister").val()
    const password = $("#passwordRegister").val()
    $.ajax({
      url: 'https://fast-headland-53714.herokuapp.com/register',
      method: 'POST',
      data: {
        username,
        email,
        password
      }
    })
      .done(result => {
        M.toast({html: `Account created`})
          hideAll()
          $(".form-login").show()
          $('.register').show()
          M.toast({html: `Register succses`})
      })
      .fail(err => {
        M.toast({html: `${err.responseText}`})
        console.log()
      })
      .always(data => {
        $('.progress').hide()
      })
  })
  $(".add").on('click', (e) => {
    e.preventDefault()
    hideAll()
    $(".form-todo").show()
    $(".logout").show()
    $('#list-id').hide()
  })
  $(".g-signin2").on('click', (e) => {
    e.preventDefault()
  })
  $(".form-edit").on('submit',(e) => {
    e.preventDefault()
    isLogin()
  })
})