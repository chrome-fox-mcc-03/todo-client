$(document).ready(() => {
   let token = localStorage.getItem('token')
   if(token) {
      dashboard()
   } else {
      landingPage()
   }
})

function registerPage() {
   $('#landingPage').hide()
   $('#registerPage').show()
   $('#dashboard').hide()
   $('#createTodo').hide()
   $('#updateTodo').hide()
}

function landingPage() {
   $('#landingPage').show()
   $('#registerPage').hide()
   $('#createTodo').hide()
   $('#updateTodo').hide()
   $('#dashboard').hide()
}

function showUpdate(id) {
   $('#form-update').attr('onsubmit', `updateTodo(event, ${id})`)
   $.ajax({
      method: 'GET',
      url: `http://localhost:3000/todos/${id}`,
      headers: {
         token: localStorage.getItem('token')
      }
   })
      .done(response => {
         console.log(response);
         
         let dueDate = moment(response.due_date).format('YYYY-MM-DD')
         $("#titleUpdate").val(response.title);
         $("#descriptionUpdate").val(response.description);
         $("#due_dateUpdate").val(dueDate);
      })
      .fail(err => {
         console.log(err)
      })
   $('#landingPage').hide()
   $('#registerPage').hide()
   $('#createTodo').hide()
   $('#updateTodo').show()
   $('#dashboard').hide()
}

function dashboard() {
   $('#landingPage').hide()
   $('#registerPage').hide()
   $('#createTodo').hide()
   $('#updateTodo').hide()
   $('#dashboard').show()
   getTodos()
}

function createPage() {
   $('#landingPage').hide()
   $('#registerPage').hide()
   $('#createTodo').show()
   $('#updateTodo').hide()
   $('#dashboard').hide()
}

function signUp(event) {
   event.preventDefault()
   const email = $("#email").val()
   const password = $("#password").val()

   $.ajax({
      method: 'POST',
      url: 'http://localhost:3000/signup',
      data: {
         email,
         password
      }
   })
      .done(response => {
         localStorage.setItem('token', response)
         dashboard()
      })
      .fail(err => {
         console.log(err);
      })
}

function signIn(event) {
   event.preventDefault()
   const email = $("#emailLogin").val()
   const password = $("#passwordLogin").val()

   $.ajax({
      method: 'POST',
      url: 'http://localhost:3000/signin',
      data: {
         email,
         password
      }
   })
      .done(response => {
         localStorage.setItem('token', response)
         dashboard()
      })
      .fail(err => {
         console.log(err);
      })
   }
function signOut() {
   localStorage.removeItem('token')
   var auth2 = gapi.auth2.getAuthInstance();
   auth2.signOut().then(function () {
   console.log('User signed out.');
   });
   $('#dashboard').hide()
   $('#landingPage').show()
}

function getTodos() {
   $("#listTodo").empty()
   const token = localStorage.getItem('token')
   $.ajax({
      method: 'GET',
      url: 'http://localhost:3000/todos',
      headers: {
         token
      }
   })
   .done(response => {
      response.map((el, i)=> {
         let status;
         if(el.status) status = 'Completed'
         else status = 'On Progress'
         $('#listTodo').append(`
            <tr>
               <td>${i + 1}</td>
               <td>${el.title}</td>
               <td>${status}</td>
               <td>${moment(el.due_date).format('LL')}</td>
               <td style="text-align:right"><button type="button" class="btn btn-primary" onClick="showUpdate(${el.id})">Update</button></td>
					<td><button type="button" class="btn btn-danger" onClick="deleteTodo(${el.id})">Delete</button></td>
         `)
      })
   })
   .fail(err => {
      console.log(err);
   })
}

function createTodo(event) {
   event.preventDefault();
   let title = $("#titleAdd").val()
   let description = $("#descriptionAdd").val()
   let due_date = $("#due_dateAdd").val()
   let token = localStorage.getItem('token')
   $.ajax({
      method: "POST",
      url: "http://localhost:3000/todos",
      headers: {
         token,
      },
      data: {
         title,
         description,
         due_date
      }
   })
      .done(response => {
         dashboard()
      })
      .fail((err, msg) => {
         console.log(err)
      })
}

function cancel() {
   dashboard()
}

function updateTodo(event, id) {
   event.preventDefault()
   let title = $("#titleUpdate").val();
   let description = $("#descriptionUpdate").val()
   let due_date = $("#due_dateUpdate").val()
   $.ajax({
      method: 'PUT',
      url: `http://localhost:3000/todos/${id}`,
      headers: {
         token: localStorage.getItem('token')
      },
      data: {
         title,
         description,
         due_date
      }
   })
   .done(response => {
      dashboard()
   })
   .fail(err => {
      console.log(err)
   })
}

function onSignIn(googleUser) {
   var id_token = googleUser.getAuthResponse().id_token;
   $.ajax({
      method: 'POST',
      url: 'http://localhost:3000/googlesignin',
      data: {
         id_token
      }
   })
      .done(response => {
         localStorage.setItem('token', response)
         dashboard()
      })
      .fail(err => {
         console.log(err)
      })
}
