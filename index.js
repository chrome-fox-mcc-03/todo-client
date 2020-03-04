function findAll() {
  $.ajax({
    method: "GET",
    url: "http://localhost:3000/todos",
    headers: {
      token: localStorage.getItem("token")
    }
  })
    .done(response => {
      for (let i = 0; i < response.length; i++) {
        $("#dashboard-todos-all-table").append(`
        <tr>
        <td>${response[i].id}</td>
        <td>${response[i].title}</td>
        <td>${response[i].description}</td>
        <td>${response[i].status}</td>
        <td>${response[i].due_date}</td>
        <td>Options</td>
        </tr>`);
      }
    })
    .fail(err => {
      console.log(err);
    });
}

$(document).ready(() => {
  console.log("ready");
  $("#dashboard-create").hide();
  const token = localStorage.getItem("token");

  if (token) {
    $("#landing-page").hide();
    $("#dashboard-page").show();
    findAll();
  } else {
    $("#landing-page").show();
    $("#landing-login").hide();
    $("#landing-register").show();
    $("#dashboard-page").hide();
  }

  $("#login-link").on("click", () => {
    $("#landing-login").show();
    $("#landing-register").hide();
  });

  $("#register-link").on("click", () => {
    $("#landing-login").hide();
    $("#landing-register").show();
  });

  $("#loading-link").on("clock", e => {
    e.preventDefault();
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
        $("#landing-page").hide();
        $("#dashboard-page").show();
        findAll();
      })
      .fail(err => {
        console.log(err);
      });
  });

  $("#create-link").on("click", e => {
    e.preventDefault();
    $("#dashboard-create").show();
    $("#dashboard-todos-all").hide();
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
        // this is the last point that you worked on
        console.log(response);
      })
      .fail(err => console.log(err));
  });
});
