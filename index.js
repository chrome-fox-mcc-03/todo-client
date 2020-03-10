function showLanding() {
  $("#landing-page").show();
  $("#dashboard-page").hide();
  $("#landing-login").hide();
  $("#landing-register").show();
  $(".alert").hide();
}

function showDashboard() {
  $("#landing-page").hide();
  $("#dashboard-page").show();
  $(".alert").hide();
  $("#todo-detail").show();
  $("#todo-create").hide();
  $("#todo-edit").hide();
  fetchData();
}

function signOut() {
  localStorage.clear();
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function() {
    console.log("User signed out.");
  });
  showLanding();
}

function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;
  $.ajax({
    url: "http://localhost:3000/gsignin",
    method: "POST",
    data: {
      token: id_token
    }
  })
    .done(data => {
      $("#register-alert").hide();
      $("#login-alert").hide();
      localStorage.setItem("token", data.token);
      showDashboard();
    })
    .fail(err => {
      $("#register-alert")
        .show()
        .empty().append(`
      <strong>Error</strong>
      <hr><p>Failed to connect to google</p>
      `);
      $("#login-alert")
        .show()
        .empty().append(`
      <strong>Error</strong>
      <hr><p>Failed to connect to google</p>
      `);
    });
}

function fetchData() {
  $.ajax({
    url: "http://localhost:3000/todos",
    method: "GET",
    headers: {
      token: localStorage.getItem("token")
    }
  })
    .done(allData => {
      $("#todos-library").empty().append(`
      <li class="list-group-item">
                          <div class="row">
                            <div class="col-2 my-auto">
                              <button
                                type="button"
                                class="btn btn-secondary btn-block"
                                disabled
                              >
                                ID
                              </button>
                            </div>
                            <div class="col my-auto">
                              <button
                                type="button"
                                class="btn btn-secondary btn-block"
                                disabled
                              >
                                TITLE
                              </button>
                            </div>
                            <div class="col-3 my-auto">
                              <button
                                type="button"
                                class="btn btn-secondary btn-block"
                                disabled
                              >
                                OPTION
                              </button>
                            </div>
                          </div>
                        </li>
      `);
      allData.data.forEach(el => {
        $("#todos-library").append(`
        <li class="list-group-item">
        <div class="row">
          <div class="col-2 my-auto">
            <button
              type="button"
              class="btn btn-outline-dark btn-block"
              disabled
            >
              ${el.id}
            </button>
          </div>
          <div class="col my-auto">
            <button
              type="button"
              class="btn btn-outline-dark btn-block"
              disabled
            >
              ${el.title}
            </button>
          </div>
          <div class="col-3 my-auto">
            <button
              type="button"
              class="btn btn-warning btn-block"
              onclick="showDetail(${el.id})"
            >
              DETAIL
            </button>
          </div>
        </div>
      </li>
        `);
      });
      $("#todos-library").append(`
      <li class="list-group-item">
      <div class="row">
        <div class="col my-auto">
          <button
            type="button"
            class="btn btn-success btn-block"
            onclick="showCreateTodo()"
          >
            CREATE A NEW TODO
          </button>
        </div>
      </div>
    </li>
      `);
    })
    .fail(() => showErrorDashboard());
}

function showErrorDashboard() {
  $("#dashboard-alert")
    .show()
    .empty().append(`
<strong>Error</strong>
<hr><p>Failed to fetch data</p>`);
}

function showDetail(index) {
  $.ajax({
    url: `http://localhost:3000/todos/${index}`,
    headers: {
      token: localStorage.getItem("token")
    },
    method: "GET"
  })
    .done(dataId => {
      showDashboard();
      $("#dashboard-alert").hide();
      $("#todo-detail").empty().append(`
      <div class="card-header">
        <div class="row">
          <div class="col">
            <h5>
              DETAIL
            </h5>
          </div>
          <div class="col-4 my-auto d-flex flex-row-reverse justify-content-around">
            <button type="button" class="btn btn-danger" onclick="deleteTodo(${dataId.data.id})">DELETE</button>       
            <button type="button" class="btn btn-warning" onclick="showEdit(${dataId.data.id})">EDIT</button>
          </div>
        </div>
      </div>
      <div class="card-body">
        <h5 class="card-title"><strong>title:</strong> ${dataId.data.title}</h5>
        <p class="card-text"><strong>description:</strong>
          ${dataId.data.description}
        </p>
        <p class="card-text"><strong>due date:</strong>
          ${dataId.data.due_date}
        </p>
        <p class="card-text"><strong>status:</strong>
          ${dataId.data.status}
        </p>
        <hr>
        <div style="padding: 20px;">
        <img
          src="${dataId.data.photo}"
          alt="todo-gif"
          style="width: 100%;height:100%;"
        />
      </div>
      </div>
      `);
    })
    .fail(err => {
      $("#dashboard-alert")
        .show()
        .empty().append(`
  <strong>Error ${err.responseJSON.status}</strong>
  <hr><p>${err.responseJSON.msg}</p>`);
    });
}

function showCreateTodo() {
  $("#todo-create").show();
  $("#todo-detail").hide();
}

function killAlert() {
  $(".alert").hide();
}

let editIndex = null;
function showEdit(index) {
  $("#todo-edit").show();
  $("#todo-detail").hide();
  // find detail
  $.ajax({
    method: "GET",
    headers: {
      token: localStorage.getItem("token")
    },
    url: `http://localhost:3000/todos/${index}`
  })
    .done(found => {
      let { title, description, due_date, status } = found.data;
      $("#edit-title").val(title);
      $("#edit-description").val(description);
      $("#edit-due-date").val(due_date);
      $("#edit-status").val(String(status));
      editIndex = index;
    })
    .fail(err => {
      showErrorDashboard();
    });
}

function deleteTodo(index) {
  $.ajax({
    url: `http://localhost:3000/todos/${index}`,
    headers: {
      token: localStorage.getItem("token")
    },
    method: "DELETE"
  })
    .done(deleted => {
      killAlert();
      showDashboard();
      $("#todo-detail").hide();
    })
    .fail(err => {
      showErrorDashboard;
    });
}

$(document).ready(() => {
  let token = localStorage.getItem("token");

  if (token) {
    showDashboard();
    $("#todo-detail").hide();
  } else {
    showLanding();
  }
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
      .done(() => {
        $("#register-alert").hide();
        $("#progress-modal").hide();
        $("#landing-register").hide();
        $("#landing-login").show();
      })
      .fail(err => {
        $("#register-alert")
          .show()
          .empty().append(`
        <strong>Error ${err.status}</strong>
        `);
        err.responseJSON.msg.forEach(el => {
          $("#register-alert").append(`
          <hr>
          <p class="mb-0">${el}</p>`);
        });
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
        $("#login-alert").hide();
        localStorage.setItem("token", response.token);
        showDashboard();
      })
      .fail(err => {
        $("#login-alert")
          .show()
          .empty().append(`
      <strong>Error ${err.status}</strong>
      <hr><p>${err.responseJSON.msg}</p>
      `);
      });
  });
  $("#switch-login").on("click", () => {
    $("#landing-login").show();
    $("#landing-register").hide();
  });
  $("#switch-register").on("click", () => {
    $("#landing-register").show();
    $("#landing-login").hide();
  });
  $("#create-submit").on("click", e => {
    e.preventDefault();
    let title = $("#create-title").val();
    let description = $("#create-description").val();
    let due_date = $("#create-due-date").val();
    let status = $("#create-status").val();
    $.ajax({
      method: "POST",
      url: "http://localhost:3000/todos",
      headers: {
        token: localStorage.getItem("token")
      },
      data: {
        title,
        description,
        due_date,
        status
      }
    })
      .done(newData => {
        killAlert();
        fetchData();
        setTimeout(() => {
          showDetail(newData.data.id);
        }, 50);
      })
      .fail(() => {
        showErrorDashboard();
      });
  });
  $("#edit-submit").on("click", e => {
    e.preventDefault();
    let title = $("#edit-title").val();
    let description = $("#edit-description").val();
    let due_date = $("#edit-due-date").val();
    let status = $("#edit-status").val();
    $.ajax({
      method: "PUT",
      url: `http://localhost:3000/todos/${editIndex}`,
      headers: {
        token: localStorage.getItem("token")
      },
      data: {
        title,
        description,
        due_date,
        status
      }
    })
      .done(resEdited => {
        killAlert();
        showDetail(editIndex);
      })
      .fail(err => {
        showErrorDashboard;
      });
  });

  $(document)
    .ajaxStart(function() {
      $("#supreme-container").addClass("blur");
      $("#exampleModalCenter").show();
    })
    .ajaxStop(function() {
      $("#exampleModalCenter").hide();
      $("#supreme-container").removeClass("blur");
    });
});
