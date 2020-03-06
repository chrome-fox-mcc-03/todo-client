$(".dropdown-trigger").on("click", (event) => {
    event.stopPropagation();
    $(".dropdown").toggleClass("is-active");
    $('#login-warning').empty();
})
$("#add-todo-modal-submit").on("click", (event) => {
    //klik submit button neh
    //loading baten dlu
    $("#add-todo-modal-submit").toggleClass('is-loading');
    $('#add-todo-error-msg').empty();
    console.log("submet");
    let title = $('#add-todo-modal > div.modal-card > section > div:nth-child(1) > div > input').val()
    let desc = $('#add-todo-modal > div.modal-card > section > div:nth-child(2) > div:nth-child(2) > textarea').val()
    let date = $('#due-date').val()
    // console.log('title', title);
    // console.log('desc', desc);
    // console.log('date', date);
    $.ajax({
        url: "http://localhost:3000/todos",
        method: "POST",
        headers: {
            token: appStorage.token
            // token: "<<<<<<<<TEST TANPA TOKEN>>>>>>>>>>>"
        },
        data: {
            title: title,
            description: desc,
            status: 'todo',
            due_date: date
        }
    })
    .done(response => {
        $("#add-todo-modal").toggleClass("is-active");
        promptMessage("New Todo Added")
    })
    .fail((response) => {
        let msg = '';
        let error = response.responseJSON.error;
        if (Array.isArray(error)) {
            msg += '<p class="help is-danger">'
            msg += error.join('</p><p class="help is-danger">')
            msg += '</p>'
        } else {
            msg = `<p class="help is-danger">${error}</p>`;
        }
        $('#add-todo-error-msg').empty();
        // $('#add-todo-error-msg').append(`<p class="help is-danger">Error</p>`);
        $('#add-todo-error-msg').append(msg);
        $('#add-todo-error-msg').toggleClass('is-active');
    })
    .always(() => {
        $("#add-todo-modal-submit").toggleClass('is-loading');
        loadTodos()
    });
})
$("#add-todo-button").on("click", (event) => {
    // console.log(event)
    $("#add-todo-modal").toggleClass("is-active");
    $('#add-todo-error-msg').empty();

    let tomorrow = new Date();
    tomorrow.setDate(new Date().getDate()+1);
    $("#due-date").attr("min",`${tomorrow.toISOString().split('T')[0]}`);
    //title
    $('#add-todo-modal > div.modal-card > section > div:nth-child(1) > div > input').val()
    $('#add-todo-modal > div.modal-card > section > div:nth-child(2) > div:nth-child(2) > textarea').val()
    $("#due-date").val('');
})
$("#add-todo-modal-close,#add-todo-modal-cancel,#add-todo-modal > div.modal-background")
.on("click", (event) => {
    $("#add-todo-modal").toggleClass("is-active");
})
$("#edit-todo-modal-close,#edit-todo-modal-cancel,#edit-todo-modal > div.modal-background")
.on("click", (event) => {
    $("#edit-todo-modal").toggleClass("is-active");
    $('#edit-todo-error-msg').empty();
})
$("#edit-todo-modal-submit").on('click', (event) => {
    event.preventDefault();
    let title = $("#edit-todo-modal > div.modal-card > section > div:nth-child(1) > div > input").val()
    let desc = $("#edit-todo-details > div:nth-child(2) > textarea").val();
    let date = $("#due-date").val();
    let status = $("#edit-todo-select-status").val();
    console.log(title, desc, date, status);
    // munculah loading screen
    // submit button disable
    $("#edit-todo-modal-submit").toggleClass("is-loading");
    console.log(appStorage.editItemId);
    $.ajax({
        url: `http://localhost:3000/todos/${appStorage.editItemId}`,
        method: "PUT",
        headers: {
            token: appStorage.token
            // token: "<<<<<<<<<<<<<<<<TES ERROR>>>>>>>>>>>>>>>>>>"
        },
        data: {
            'title': title,
            'description': desc,
            'status': status,
            'due_date': date
        }
    })
    .done((response) => {
        $("#edit-todo-modal").toggleClass("is-active");
        $('#edit-todo-error-msg').empty();
        load()
        promptMessage("Edit todo berhasil")
        $("#edit-todo-modal-submit").toggleClass("is-loading");
    })
    .fail((response) => {
        let error = response.responseJSON.error;
        console.log(error);
        // submit button enable
        $("#edit-todo-modal-submit").toggleClass("is-loading");
        $("#edit-todo-error-msg").empty()
        $("#edit-todo-error-msg").append(`<p class="help is-danger">Error</p>`);
        $('#add-todo-error-msg').toggleClass('is-active');
    })
    .always(() => {
        // tutup modal kalo ada
    })
})
$(document).on("keydown", (event) => {
    if ($('#add-todo-modal').hasClass('is-active') && event.keyCode === 27) {
        $("#add-todo-modal").toggleClass("is-active");
    }
    if ($('#edit-todo-modal').hasClass('is-active') && event.keyCode === 27) {
        $("#edit-todo-modal").toggleClass("is-active");
    }
})

function loadElements() {
    //to reset element state (show, hidden, empty, etc);
    $('#login-warning').empty();
    $('#register-warning').empty();
    $(".dropdown").toggleClass("is-active");
}