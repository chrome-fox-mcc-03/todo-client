function Start() {
    $("#Register").hide()
    $("#Login").hide()
    $("#dashboard").hide()
    $("#creates").hide()
    emptyTable()
}

function RegisterSuccess() {
    $("#Register").hide()
    $("#Login").show()
    
}

function LoginSuccess() {
    $("#Login").hide()
    $("#dashboard").show()
    $("#LoginButton").hide()
    $("#googlelogin").hide()
    $("#LogoutButton").show()


}

function RegisterButton() {
    $("#RegisterButton").on("click", function() {
    $("#Register").show()
    $("#Login").hide()
    $("#dashboard").hide()
    })
}
function LoginButton() {
    $("#LoginButton").on("click", function() {
    $("#Login").show()
    $("#Register").hide()
    $("#dashboard").hide()


    })
}

function emptyTable() {
    $('#todos').empty()
    $('#todos').append(`<tr>
    <th>ID</th>
    <th>Title</th>
    <th>Description</th>
    <th>Status</th>
    <th>Due Date</th>
    <th colspan="2">Actions</th>
</tr>`)
}

function LogoutButton() {
    $('#LogoutButton').on('click', function() {
        $("#Register").hide()
        $("#Login").hide()
        $("#dashboard").hide()
        $("#LoginButton").show()
        $("#googlelogin").show()
        $("#LogoutButton").hide()

        emptyTable()
        localStorage.removeItem('access_token')
        signOut()
    })
}

function UpdateData(CurrentId) {
    let isLogin = localStorage.getItem('access_token')
    $.ajax({
        url:`http://localhost:3000/todos/${CurrentId}`,
        method: "PUT",
        headers: {
            access_token: isLogin
        },
        data: {
            Title: $("#UpdateTitle").val(),
            Description: $("#UpdateDesc").val(),
            Status: $("#UpdateStatus").val(),
            Due_Date: $("#UpdateDate").val()
        }
    })
        .done(function(result) {
            $("#Message").append(`Succesfully Updated`)
            setTimeout(() => {
                $("#Message").empty()
            }, 3000);
            console.log(result)
            $("#updates").hide()
            emptyTable()
            AjaxDashboard()
        })
        .fail(function(err) {
            $("#UpdateError").append(`${err.responseJSON[0]}`)
            setTimeout(() => {
                $("#UpdateError").empty()
            }, 3000);
        })
}

function destroy(currentId) {
    $.ajax({
        url:`http://localhost:3000/todos/${currentId}`,
        method:"DELETE",
        headers:{
            access_token: localStorage.getItem('access_token')
        },
        data: {
            id: currentId
        }
    })
        .done(function(result) {
            console.log("successfully delete")
            console.log(result)
            emptyTable()
            AjaxDashboard()
            
        })
        .fail(function(err) {
            console.log(err)
        })
    }

function AjaxDashboard() {
    let isLogin = localStorage.getItem('access_token')
    $.ajax({
        url:"http://localhost:3000/todos",
        method: "GET",
        headers: {
            access_token: isLogin
        }
    })
        .done(function(result) {
            for(let i = 0;i < result.length;i ++) {
                $("#todos").append(`
                <tr>
                    <td>${result[i].id}</td>
                    <td>${result[i].Title}</td>
                    <td>${result[i].Description}</td>
                    <td>${result[i].Status}</td>
                    <td>${result[i].Due_Date}</td>
                    <td><button class="delete" name="delete" value="${result[i].id}">delete</button></td>
                    <td><button class="update" name="update" value="${result[i].id}">update</button></td>
                </tr>`)

            }
            
            $(".delete").on("click", function() {
                let currentId = this.value;
                destroy(currentId)
            })

            $(".update").on('click', function() {
                $("#dashboard").hide()
                let currentId = this.value
                console.log(this.value)
                $("#updates").show()
                $("#Update-Form").on('submit', function (e) {
                    e.preventDefault()
                    UpdateData(currentId)
                })
            })

        })
        .fail(function(err) {
            console.log('error euy')
            console.log(err)
        })
}

function LoginFailed() {
    $("#Register").hide()
    $("#Login").hide()
    $("#dashboard").hide()
    $("#LoginButton").show()
    $("#googlelogin").show()
    emptyTable()
}

function append(result) {
    emptyTable()
    for(let i = 0;i < result.length;i ++) {
        $("#todos").append(`
        <tr>
            <td>${result[i].id}</td>
            <td>${result[i].Title}</td>
            <td>${result[i].Description}<td>
            <td>${result[i].Status}</td>
            <td>${result[i].Due_Date}</td>
            <td><button class="delete" name="delete" value="${result[i].id}">delete</button></td>
            <td><button class="update" name="update" value="${result[i].id}">update</button></td>
        </tr>`)

    }
}


function getDate() {
    $.ajax({
        url: "http://worldclockapi.com/api/json/utc/now",
        method: "GET"
    })
        .done(function(result) {
            let StringDate = ''
            for(let i = 0; i < 10; i++) {
                StringDate+= result.currentDateTime[i]
            }
            $("#clock").append(`Today is ${result.dayOfTheWeek}, ${StringDate}`)
        })
        .fail(function(err) {
            console.log(err)
        })
}

function CreateTodo(isLogin) {
    $.ajax({
        url:`http://localhost:3000/todos/`,
        method: "POST",
        headers: {
            access_token: isLogin
        },
        data: {
            Title: $("#CreateTitle").val(),
            Description: $("#CreateDesc").val(),
            Status: $("#CreateStatus").val(),
            Due_Date: $("#CreateDate").val()
        }
    })
    .done(function(result) {
        $("#Message").append('Successfully Created')
        setTimeout(() => {
            $("#Message").empty()
        }, 3000);
        $("#creates").hide()
        emptyTable()
        AjaxDashboard()

    })
    .fail(function(err) {
        $("#CreateError").append(`${err.responseJSON[0]}`)
        setTimeout(() => {
            $("#CreateError").empty()

        }, 3000);
        console.log(err)
    })
}