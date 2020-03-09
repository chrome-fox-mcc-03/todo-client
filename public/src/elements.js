$(".dropdown-trigger").on("click", (event) => {
    event.stopPropagation();
    $(".dropdown").toggleClass("is-active");
    $('#login-warning').empty();
})
$("#add-todo-modal-submit").on("click", (event) => {
    $("#add-todo-modal-submit").toggleClass('is-loading');
    $('#add-todo-error-msg').empty();
    let title = $('#add-todo-modal > div.modal-card > section > div:nth-child(1) > div > input').val()
    let desc = $('#add-todo-modal > div.modal-card > section > div:nth-child(2) > div:nth-child(2) > textarea').val()
    let date = $('#due-date').val()
    $.ajax({
        url: `${serverURL}/todos`,
        method: "POST",
        headers: {
            token: appStorage.token
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
        $('#add-todo-error-msg').append(msg);
        $('#add-todo-error-msg').toggleClass('is-active');
    })
    .always(() => {
        $("#add-todo-modal-submit").toggleClass('is-loading');
        loadTodos()
    });
})
$(".todo-user-add-new").on("click", (event) => {
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
    let date = $("#edit-due-date").val();
    let status = $("#edit-todo-select-status").val();
    $("#edit-todo-modal-submit").toggleClass("is-loading");
    $.ajax({
        url: `${serverURL}/todos/${appStorage.editItemId}`,
        method: "PUT",
        headers: {
            token: appStorage.token
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
        let msg = '';
        if (Array.isArray(error)) {
            msg += '<p class="help is-danger">'
            msg += error.join('</p><p class="help is-danger">')
            msg += '</p>'
        } else {
            msg = `<p class="help is-danger">${error}</p>`;
        }
        $("#edit-todo-modal-submit").toggleClass("is-loading");
        $("#edit-todo-error-msg").empty()
        $("#edit-todo-error-msg").append(msg);
        $('#add-todo-error-msg').toggleClass('is-active');
    })
    .always(() => {
        delete appStorage.editItemId;
    })
})

$("#details-todo-modal-close,#details-todo-modal-cancel").on('click', (event) => {
    $("#details-todo-modal").toggleClass("is-active");
})

$("#delete-todo-modal-close,#delete-todo-modal-cancel,#delete-todo-modal > div.modal-background")
.on("click", (event) => {
    $("#delete-todo-modal").toggleClass("is-active");
    $('#delete-todo-error-msg').empty();
})
$("#delete-todo-modal-submit").on('click', (event) => {
    event.preventDefault();
    $("#delete-todo-modal-progress").empty();
    $("#delete-todo-modal-progress").append(`<progress class="progress is-small is-primary" max="100">15%</progress>`);
    $.ajax({
        url: `${serverURL}/todos/${appStorage.deleteItemId}`,
        method: "DELETE",
        headers: {
            token: appStorage.token
        }
    })
    .done(response => {
        $("#delete-todo-modal").toggleClass("is-active");
        promptMessage(`Tugas "${response.deleted.title}" berhasil dihapus.`)
        loadTodos()
    })
    .fail(response => {
        $("#delete-todo-modal-progress").empty();
        $("#delete-todo-modal-progress").append(`<p class="help is-danger">${response.responseJSON.error}</p>`);
    })
    .always(() => {
        delete appStorage.deleteItemId;
    })
    
})
$(document).on("keydown", (event) => {
    if ($('#add-todo-modal').hasClass('is-active') && event.keyCode === 27) {
        $("#add-todo-modal").toggleClass("is-active");
    }
    if ($('#edit-todo-modal').hasClass('is-active') && event.keyCode === 27) {
        $("#edit-todo-modal").toggleClass("is-active");
    }
    if($("#details-todo-modal").hasClass("is-active") && event.keyCode === 27) {
        $("#details-todo-modal").toggleClass("is-active");
    }
    if($("#delete-todo-modal").hasClass("is-active") && event.keyCode === 27) {
        $("#delete-todo-modal").toggleClass("is-active");
    }
})

function loadElements() {
    $('#login-warning').empty();
    $('#register-warning').empty();
    $(".dropdown").toggleClass("is-active");
}