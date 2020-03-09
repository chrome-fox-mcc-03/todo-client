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
   $('#navbar').hide()
   $('#registerPage').hide()
   $('#createTodo').hide()
   $('#updateTodo').hide()
   $('#dashboard').hide()
}

function showUpdate(id) {
   $('#form-update').attr('onsubmit', `updateTodo(event, ${id})`)
   $.ajax({
      method: 'GET',
      url: `https://fancy-todo-abdul-basith.herokuapp.com/${id}`,
      headers: {
         token: localStorage.getItem('token')
      }
   })
      .done(response => {         
         let dueDate = moment(response.due_date).format('YYYY-MM-DD')
         $("#titleUpdate").val(response.title);
         $("#descriptionUpdate").val(response.description);
         $("#due_dateUpdate").val(dueDate);
      })
      .fail(err => {
         let msg = err.responseJSON
         let status = err.status
         swal(`Error ${status}`, `${msg}`, "error");
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
   $('#navbar').show()
   $('#dashboard').show()
   getTodos()
   $('body').attr('style', `background-image:url(https://static.pexels.com/photos/371633/pexels-photo-371633.jpeg); background-repeat:no-repeat; background-size: 100%;`)
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
      url: 'https://fancy-todo-abdul-basith.herokuapp.com/signup',
      data: {
         email,
         password
      }
   })
      .done(response => {
         localStorage.setItem('token', response)
         swal({
            title: "Good job!",
            text: "Register is success",
            icon: "success",
            button: "Please Login",
        });
         dashboard()
      })
      .fail(err => {
         let msg = err.responseJSON
         let status = err.status
         swal(`Error ${status}`, `${msg}`, "error");
      })
}

function signIn(event) {
   event.preventDefault()
   const email = $("#emailLogin").val()
   const password = $("#passwordLogin").val()

   $.ajax({
      method: 'POST',
      url: 'https://fancy-todo-abdul-basith.herokuapp.com/signin',
      data: {
         email,
         password
      }
   })
      .done(response => {
         localStorage.setItem('token', response)
         swal({
            title: "Good job!",
            text: "You are Login now",
            icon: "success",
            button: "Oke",
        });
         dashboard()

      })
      .fail(err => {
         let msg = err.responseJSON
         let status = err.status
         swal(`Error ${status}`, `${msg}`, "error");
      })
   }
function signOut() {
   localStorage.removeItem('token')
   var auth2 = gapi.auth2.getAuthInstance();
   auth2.signOut().then(function () {
   });
   swal({
      title: "Good Bye!",
      text: "See You Later",
      imageUrl: "bye.jpg",
  });
   $('body').attr('style', 'background: grey')
   $('#dashboard').hide()
   $('#navbar').hide()
   $('#landingPage').show()
}

function getTodos() {
   $("#listTodo").empty()
   const token = localStorage.getItem('token')
   $.ajax({
      method: 'GET',
      url: 'https://fancy-todo-abdul-basith.herokuapp.com/todos',
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
               <td>${el.description}</td>
               <td>${status}</td>
               <td>${moment(el.due_date).format('LL')}</td>
               <td><button class="btn btn-sm btn-primary" onclick="showUpdate(${el.id})"><i class="far fa-edit"></i> edit</button>
               <button class="btn btn-sm btn-danger" onclick="deleteTodo(${el.id})"><i class="fas fa-trash-alt"></i> delete</button>
               </td>
         </tr>`)
      })
   })
   .fail(err => {
      let msg = err.responseJSON
      let status = err.status
      swal(`Error ${status}`, `${msg}`, "error");
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
      url: "https://fancy-todo-abdul-basith.herokuapp.com/todos",
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
         swal({
            title: "Good job!",
            text: "Todo Created",
            icon: "success",
        });
         dashboard()
         $('.bd-example-modal-lg').modal('hide');
      })
      .fail((err) => {
         console.log(err);
         let msg = err.responseJSON
         let status = err.status
         swal(`Error ${status}`, `${msg}`, "error");
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
      url: `https://fancy-todo-abdul-basith.herokuapp.com/todos/${id}`,
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
      swal({
         title: "Updated",
         text: "TODO UPDATED",
         icon: "success",
         button: "Oke",
     });
      dashboard()
   })
   .fail(err => {
      let msg = err.responseJSON
      let status = err.status
      swal(`Error ${status}`, `${msg}`, "error");
   })
}

function onSignIn(googleUser) {
   var id_token = googleUser.getAuthResponse().id_token;
   $.ajax({
      method: 'POST',
      url: 'https://fancy-todo-abdul-basith.herokuapp.com/googlesignin',
      data: {
         id_token
      }
   })
      .done(response => {
         localStorage.setItem('token', response)
         swal({
            title: "Good job!",
            text: "You are Login now",
            icon: "success",
            button: "Oke",
        });
         dashboard()
      })
      .fail(err => {
         let msg = err.responseJSON
         let status = err.status
         swal(`Error ${status}`, `${msg}`, "error");
      })
}

function deleteTodo(id) {
   if(confirm('Are you sure want to delete?')) {
      $.ajax({
         method: "DELETE",
         url: `https://fancy-todo-abdul-basith.herokuapp.com/todos/${id}`,
         headers: {
            token: localStorage.getItem('token')
         }
      })
      .done(response => {
         swal({
            title: "DELETED",
            text: "TODO DELETED",
            icon: "success",
            button: "Oke",
        });
         dashboard()
      })
      .fail(err => {
         let msg = err.responseJSON
         let status = err.status
         swal(`Error ${status}`, `${msg}`, "error");
      })
   }
}