let settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://api.adviceslip.com/advice",
	"method": "GET",
}

$.ajax(settings).done(function (response) {
    response = JSON.parse(response)
    $(".quotes").append(`
            <h1 style="color: red;"> Random Quotes : </h1>
            <h1> ${response.slip.advice} </h3>
            `)
});

function fetchData() {
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/todos",
        headers: {
            token: localStorage.getItem("token")
        }
    }).done((response) => {
        $("#listdata").empty()
        response.data.forEach(el => {
            $("#listdata").append(`
            <tr>
                <th>${el.title}</th>
                <th>${el.description}</th>
                <th>${el.status === true ? "Done" : "Undone"}</th>
                <th>${new Date(el.due_date).toDateString()}</th>
                <th><button id="edit" class="btn btn-secondary" data-toggle="modal" data-target="#exampleModal">
                <a onclick="findOne(${el.id})"  value=${el.id}>Edit</a></button> <button class="btn btn-danger" ><a onclick="destroy(${el.id})" value=${el.id}>Delete</a></button> <button class="btn btn-success" ${el.status === true ? "disabled" : ""} ><a onclick="complete(${el.id})" ${el.status === true ? "disabled" : ""}  value=${el.id}>Complete</a</button>
            </tr>
            `)
        });
    }).fail(function (err, msg) {
        console.log(msg);
    })
}
function findOne(id) {
    const token = localStorage.getItem("token")
    $.ajax({
        method: "get",
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            token
        }
    }).done((data) => {
        let el = data.data
            $("#modalEdit").append(`
                <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Edit</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                            </div>
                            <div class="modal-body">
                                <form class="form-group">
                                    <label for="todo">Todo Name</label><br>
                                    <input class="form-control input-sm value" id="title_update" type="text" placeholder="Whats You Gonna Do" value="${el.title}"/><br>
                                    <label for="description">Description</label><br>
                                    <input class="form-control input-sm value" id="description_update" type="text" placeholder="Description" value="${el.description}"/><br>
                                    <label for="due_date">Due Date</label><br>
                                    <input class="form-control input-sm value" id="due_date_update" type="date"/>
                                </form>
                            </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="update(${el.id})" >Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
                `)
    }).fail((err) => {
        console.log(err, "error")
    })
}
function update(id){
    const title = $("#title_update").val()
    const description = $("#description_update").val()
    const due_date = $("#due_date_update").val()
    const token = localStorage.getItem("token")
    $.ajax({
        method: "PUT",
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            token
        },
        data: {
            title,
            description,
            due_date
        }
    }).done((data) => {
        $(".value").val(null) //! disini error jadi seudah update value untuk modals selanjutnya ga bisa dimasukin
        fetchData()
    }).fail((err, msg) => {
        console.log(msg);
    })
}
function complete(id){
    const token = localStorage.getItem("token")
    $.ajax({
        method: "PATCH",
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            token
        }
    }).done((data) => {
        Swal.fire(
            'Good job!',
            'success'
          )
        fetchData()
    }).fail((err, msg) => {
        console.log(msg);
    })
}
function destroy(id) {
    const token = localStorage.getItem("token")
    $.ajax({
        method: "delete",
        url: `http://localhost:3000/todos/${id}`,
        headers: {
            token
        }
    }).done((data) => {
        fetchData()
    }).fail((err) => {
        console.log(err, "error")
    })
}

function onSignIn(googleUser) {
    const token = googleUser.getAuthResponse().id_token;
    $.ajax({
        method: 'post',
        url: 'http://localhost:3000/google',
        headers: {
            token
        }
    }).done((data) => {
        localStorage.setItem("token", data.token)
        $("#dashboard-page").show()
        $("#landing-page").hide()
    }).fail((err) => {
        console.log(err, "error")
    })
}

if (localStorage.getItem("token")) {
    $("#dashboard-page").show()
    $("#landing-page").hide()
    fetchData()
} else {
    $("#dashboard-page").hide()
    $("#landing-page").show()
}
$(document).ready(function () {
    $('[data-youtube]').youtube_background({
        fitToBackground: true
    });
    $('.render a').click(function () {
        $('form').animate({
            height: "toggle",
            opacity: "toggle"
        }, "slow");
    });

    $('.register-form').on("submit", (e) => {
        e.preventDefault()
        const email = $(".email").val()
        const password = $(".password").val()
        $.ajax({
            method: "POST",
            url: "http://localhost:3000/register",
            data: {
                email,
                password
            }
        }).done((data) => {
            localStorage.setItem("token", data.token)
            $("#dashboard-page").show()
            $("#landing-page").hide()
        }).fail((err) => {
            error = JSON.parse(err.responseText)
            error.forEach(el => {
                $(".errorRegister").append(`
                    <li style="color: red;list-style-type:none">${el}</li>
                `)
            });
        })
    })


    $('.login-form').on("submit", (e) => {
        e.preventDefault()
        const email = $(".emailLogin").val()
        const password = $(".passwordLogin").val()
        $.ajax({
            method: "POST",
            url: "http://localhost:3000/login",
            data: {
                email,
                password
            }
        }).done((data) => {
            localStorage.setItem("token", data.token)
            $("#dashboard-page").show()
            $("#landing-page").hide()
            $(".errorLogin").empty()
        }).fail((err) => {
            error = JSON.parse(err.responseText)
                $(".errorLogin").append(`
                    <li style="color: red;list-style-type:none">${error}</li>
                `)
        })
    })
    $("#create").on("submit", function (e) {
        e.preventDefault()
        const title = $("#title").val()
        const description = $("#description").val()
        const status = $("#status").val()
        const due_date = $("#due_date").val()
        const token = localStorage.getItem("token")
        console.log(title, description, status, due_date)
        $.ajax({
            method: "POST",
            url: "http://localhost:3000/todos",
            headers: {
                token
            },
            data: {
                title,
                description,
                status,
                due_date
            }
        }).done((data) => {
            $(".error").empty()
            fetchData()
            console.log(data);
        }).fail((err, msg) => {
            error = JSON.parse(err.responseText)
            error.forEach(el => {
                $(".error").append(`
                    <li style="color: red;list-style-type:none">${el}</li>
                `)
            });
        })
    })
    $("#logout").on("click", function () {
        let auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            Swal.fire(
                'You Are Signed Out',
                'success'
              )
        });
        localStorage.clear()
        $("#dashboard-page").hide()
        $("#landing-page").show()
    })
})