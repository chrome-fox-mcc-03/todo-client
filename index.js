function fetchData() {
  $.ajax({
    method: "GET",
    url: "http://localhost:3000/todos",
    headers: {
      token: localStorage.getItem("token")
    }
  })
    .done(response => {
      $("#dashboard-todos-all-table").empty().append(`
      <tr>
      <th>id</th>
      <th>title</th>
      <th>description</th>
      <th>status</th>
      <th>due date</th>
      <th>Options</th>
      <tr>
      `);
      for (let i = 0; i < response.length; i++) {
        $("#dashboard-todos-all-table").append(`
        <tr>
        <td>${response[i].id}</td>
        <td>${response[i].title}</td>
        <td>${response[i].description}</td>
        <td>${response[i].status}</td>
        <td>${response[i].due_date}</td>
        <td>
        <input class="btn btn-warning" type="button" value="Edit" onclick="showEditPage(${response[i].id})">
        <input class="btn btn-danger" type="button" value="Delete" onclick="deleteTodo(${response[i].id})">
        </td>
        </tr>`);
      }
    })
    .fail(err => {
      console.log(err);
    });
}
function showLanding() {
  $("#landing-register").show();
  $("#landing-login").hide();
  $("#landing-page").show();
  $("#dashboard-page").hide();
  $("#dashboard-create").hide();
  $("#dashboard-todos-all").show();
}
function showDashboard() {
  $("#landing-page").hide();
  $("#dashboard-page").show();
  $("#dashboard-create").hide();
  $("#dashboard-create").hide();
  $("#dashboard-todos-all").show();
  $("#dashboard-edit").hide();
}
function deleteTodo(index) {
  $.ajax({
    method: "DELETE",
    url: `http://localhost:3000/todos/${index}`,
    headers: {
      token: localStorage.getItem("token")
    }
  })
    .done(response => {
      console.log(response);
      console.log("Successfully deleted a todo");
      setTimeout(() => {
        fetchData();
      }, 100);
    })
    .fail(err => console.log(err))
    .always(() => console.log("Sending data...."));
}
function showEditPage(index) {
  $("#create-link").hide();
  $("#dashboard-edit").show();
  $("#dashboard-todos-all").hide();
  // use ajax to fetch todo data
  $.ajax({
    method: "GET",
    headers: {
      token: localStorage.getItem("token")
    },
    url: `http://localhost:3000/todos/${index}`
  })
    .done(response => {
      $("#edit-index").val(response.id);
      $("#edit-title").val(response.title);
      $("#edit-description").val(response.description);
      $("#edit-status").val(String(response.status));
      $("#edit-due-Date").val(response.due_date);
    })
    .fail(err => console.log(err))
    .always(() => console.log("sending data..."));
}
function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;
  $.ajax({
    method: "POST",
    url: "http://localhost:3000/gsignin",
    data: {
      token: id_token
    }
  })
    .done(response => {
      console.log("Successfully login through google");
      console.log(response);
      localStorage.setItem("token", response.token);
      showDashboard();
      fetchData();
    })
    .fail(err => console.log(err))
    .always(() => {
      console.log("sending data....");
    });
}

$(document).ready(() => {
  const token = localStorage.getItem("token");

  if (token) {
    showDashboard();
    fetchData();
  } else {
    showLanding();
  }
  $("#login-link").on("click", () => {
    $("#landing-login").show();
    $("#landing-register").hide();
  });
  $("#register-link").on("click", () => {
    $("#landing-login").hide();
    $("#landing-register").show();
  });
  $("#register-submit").on("click", e => {
    e.preventDefault();
    let email = $("#register-email").val();
    let password = $("#register-password").val();
    $.ajax({
      method: "POST",
      url: "http://localhost:3000/register",
      data: {
        email,
        password
      }
    })
      .done(response => {
        console.log(response);
      })
      .fail(err => {
        console.log(err);
      });
  });
  $("#login-submit").on("click", e => {
    e.preventDefault();
    let email = $("#login-email").val();
    let password = $("#login-password").val();
    $.ajax({
      method: "POST",
      url: "http://localhost:3000/login",
      data: {
        email,
        password
      }
    })
      .done(response => {
        localStorage.setItem("token", response.token);
        showDashboard();
        fetchData();
      })
      .fail(err => {
        console.log(err);
      });
  });
  $("#create-link").on("click", e => {
    e.preventDefault();
    $("#dashboard-create").show();
    $("#dashboard-todos-all").hide();
    $("#create-link").hide();
  });
  $("#create-submit").on("click", e => {
    e.preventDefault();
    let title = $("#create-title").val();
    let description = $("#create-description").val();
    let status = $("#create-status").val();
    let due_date = $("#create-due-date").val();
    $.ajax({
      method: "POST",
      url: "http://localhost:3000/todos",
      headers: {
        token: localStorage.getItem("token")
      },
      data: {
        title,
        description,
        status,
        due_date
      }
    })
      .done(response => {
        console.log(response);
        console.log("Successfully created something");
        showDashboard(); // delete this after development
      })
      .fail(err => console.log(err))
      .always(() => console.log("sending data..."));
  });
  $("#edit-submit").on("click", e => {
    e.preventDefault();
    let title = $("#edit-title").val();
    let description = $("#edit-description").val();
    let status = $("#edit-status").val();
    let due_date = $("#edit-due-date").val();
    let index = $("#edit-index").val();
    $.ajax({
      method: "PUT",
      url: `http://localhost:3000/todos/${index}`,
      headers: {
        token: localStorage.getItem("token")
      },
      data: {
        title,
        description,
        status,
        due_date
      }
    })
      .done(response => {
        console.log(response);
        console.log("Successfully edited a todo");
        fetchData();
        showDashboard();
      })
      .fail(err => {
        console.log(err);
      })
      .always(() => {
        console.log("sending data...");
      });
  });
  $("#dashboard-logout").on("click", () => {
    localStorage.clear();
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
      console.log("User signed out.");
    });
    showLanding();
  });
  $(".to-home").on("click", () => {
    showDashboard();
  });
});
