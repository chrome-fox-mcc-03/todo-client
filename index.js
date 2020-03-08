function fetchData() {
  $.ajax({
    method: "GET",
    url: "http://localhost:3000/todos",
    headers: {
      token: localStorage.getItem("token")
    }
  })
    .done(res => {
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
      for (let i = 0; i < res.length; i++) {
        $("#dashboard-todos-all-table").append(`
        <tr>
        <td>${res[i].id}</td>
        <td>${res[i].title}</td>
        <td>${res[i].description}</td>
        <td>${res[i].status}</td>
        <td>${res[i].due_date}</td>
        <td>
        <input class="btn btn-success" type="button" value="Detail" onclick="detailTodo(${res[i].id})">
        <input class="btn btn-warning" type="button" value="Edit" onclick="showEditPage(${res[i].id})">
        <input class="btn btn-danger" type="button" value="Delete" onclick="deleteTodo(${res[i].id})">
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
  fetchData();
  showDashboard();
  $("#landing-page").hide();
  $("#dashboard-page").show();
  $("#dashboard-create").hide();
  $("#dashboard-create").hide();
  $("#dashboard-todos-all").show();
  $("#dashboard-edit").hide();
  $("#create-link").show();
}
function deleteTodo(index) {
  $.ajax({
    method: "DELETE",
    url: `http://localhost:3000/todos/${index}`,
    headers: {
      token: localStorage.getItem("token")
    }
  })
    .done(res => {
      console.log(res);
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
    .done(res => {
      $("#edit-index").val(res.id);
      $("#edit-title").val(res.title);
      $("#edit-description").val(res.description);
      $("#edit-status").val(String(res.status));
      $("#edit-due-Date").val(res.due_date);
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
    .done(res => {
      console.log("Successfully login through google");
      console.log(res);
      localStorage.setItem("token", res.token);
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
      .done(res => {
        console.log(res);
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
      .done(res => {
        localStorage.setItem("token", res.token);
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
      .done(res => {
        console.log(res);
        console.log("Successfully created something");
        fetchData();
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
      .done(res => {
        console.log(res);
        console.log("Successfully edited a todo");
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
