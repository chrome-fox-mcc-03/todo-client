function showLanding() {
  $("#landing-page").show();
  $("#dashboard-page").hide();
  $("#landing-login").hide();
  $("#landing-register").show();
}

function showDashboard() {
  fetchData();
  $("#landing-page").hide();
  $("#dashboard-page").show();
  $("#todo-detail").show();
  $("#todo-create").hide();
  $("#todo-edit").hide();
}

function signOut() {
  localStorage.clear();
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function() {
    Toast.fire({
      icon: "success",
      title: "Successfully logged out"
    });
  });
  showLanding();
}

function onSignIn(googleUser) {
  let id_token = googleUser.getAuthResponse().id_token;
  $.ajax({
    url: "https://fancier-todos.herokuapp.com/gsignin",
    method: "POST",
    headers: {
      id_token: id_token
    }
  })
    .done(data => {
      localStorage.setItem("token", data.token);
      showDashboard();
      Toast.fire({
        icon: "success",
        title: "Successfully logged in through google"
      });
    })
    .fail(() => {
      Toast.fire({
        icon: "error",
        title: "Error connecting to Google"
      });
    });
}

function fetchData() {
  $.ajax({
    url: "https://fancier-todos.herokuapp.com/todos",
    method: "GET",
    headers: {
      token: localStorage.getItem("token")
    }
  })
    .done(allData => {
      // Toast.fire({
      //   icon: "success",
      //   title: "Successfully fetched all data"
      // });
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
            <i class="fas fa-info"></i>
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
    .fail(responseJSON => {
      Toast.fire({
        icon: "error",
        title: responseJSON
      });
    });
}

function showDetail(index) {
  $.ajax({
    url: `https://fancier-todos.herokuapp.com/todos/${index}`,
    headers: {
      token: localStorage.getItem("token")
    },
    method: "GET"
  })
    .done(dataId => {
      showDashboard();
      $("#todo-detail").empty().append(`
      <div class="card-header">
        <div class="row">
          <div class="col">
            <h5>
              DETAIL
            </h5>
          </div>
          <div class="col-4 my-auto d-flex flex-row-reverse justify-content-right">
            <button type="button" class="btn btn-danger" onclick="deleteTodo(${dataId.data.id})">
              <i class="fas fa-trash-alt"></i>
            </button>       
            <button type="button" class="btn btn-warning" onclick="showEdit(${dataId.data.id})">
              <i class="fas fa-edit"></i>
            </button>
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
      // Toast.fire({
      //   icon: "success",
      //   title: "Successfully fetched a Todos' detail"
      // });
    })
    .fail(responseJSON => {
      Toast.fire({
        icon: "error",
        title: responseJSON.msg
      });
    });
}

function showCreateTodo() {
  $("#todo-create").show();
  $("#todo-detail").hide();
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
    url: `https://fancier-todos.herokuapp.com/todos/${index}`
  })
    .done(found => {
      let { title, description, due_date, status } = found.data;
      $("#edit-title").val(title);
      $("#edit-description").val(description);
      $("#edit-due-date").val(due_date);
      $("#edit-status").val(String(status));
      editIndex = index;
      // Toast.fire({
      //   icon: "success",
      //   title: "Successfully fetched a Todo's detail"
      // });
    })
    .fail(responseJSON => {
      Toast.fire({
        icon: "error",
        title: responseJSON.msg
      });
    });
}

function deleteTodo(index) {
  $.ajax({
    url: `https://fancier-todos.herokuapp.com/todos/${index}`,
    headers: {
      token: localStorage.getItem("token")
    },
    method: "DELETE"
  })
    .done(() => {
      showDashboard();
      $("#todo-detail").hide();
      Toast.fire({
        icon: "success",
        title: "Successfully deleted a Todo"
      });
    })
    .fail(({ responseJSON }) => {
      Toast.fire({
        icon: "error",
        title: responseJSON.msg
      });
    });
}

const Toast = Swal.mixin({
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  onOpen: toast => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  }
});

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
      url: "https://fancier-todos.herokuapp.com/register",
      data: {
        email,
        password
      }
    })
      .done(() => {
        return $.ajax({
          method: "POST",
          url: "https://fancier-todos.herokuapp.com/login",
          data: {
            email,
            password
          }
        }).done(response => {
          $("#todo-detail").hide();
          localStorage.setItem("token", response.token);
          showDashboard();
          Toast.fire({
            icon: "success",
            title: "Successfully logged in"
          });
          $("#register-email").val("");
          $("#register-password").val("");
        });
      })
      .fail(({ responseJSON }) => {
        responseJSON.msg.forEach(el => {
          Toast.fire({
            icon: "error",
            title: el
          });
        });
      });
  });
  $("#login-submit").on("click", e => {
    e.preventDefault();
    let email = $("#login-email").val();
    let password = $("#login-password").val();
    $.ajax({
      method: "POST",
      url: "https://fancier-todos.herokuapp.com/login",
      data: {
        email,
        password
      }
    })
      .done(response => {
        $("#todo-detail").hide();
        localStorage.setItem("token", response.token);
        showDashboard();
        Toast.fire({
          icon: "success",
          title: "Successfully logged in"
        });
        $("#login-email").val("");
        $("#login-password").val("");
      })
      .fail(({ responseJSON }) => {
        Toast.fire({
          icon: "error",
          title: responseJSON.msg
        });
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
      url: "https://fancier-todos.herokuapp.com/todos",
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
        fetchData();
        showDetail(newData.data.id);
        $("#create-title").val("");
        $("#create-description").val("");
        $("#create-due-date").val("");
        $("#create-status").val(null);
        Toast.fire({
          icon: "success",
          title: "Successfully created a new Todo, check your email~"
        });
      })
      .fail(({ responseJSON }) => {
        if (typeof responseJSON.msg === "object") {
          responseJSON.msg.forEach(el => {
            Toast.fire({
              icon: "error",
              title: el
            });
          });
        } else {
          Toast.fire({
            icon: "error",
            title: responseJSON.msg
          });
        }
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
      url: `https://fancier-todos.herokuapp.com/todos/${editIndex}`,
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
      .done(() => {
        showDetail(editIndex);
        Toast.fire({
          icon: "success",
          title: "Successfully updated a Todo"
        });
      })
      .fail(({ responseJSON }) => {
        if (typeof responseJSON.msg === "object") {
          responseJSON.msg.forEach(el => {
            Toast.fire({
              icon: "error",
              title: el
            });
          });
        } else {
          Toast.fire({
            icon: "error",
            title: responseJSON.msg
          });
        }
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
