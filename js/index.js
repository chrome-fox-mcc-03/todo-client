function fetchData() {
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/todos",
        headers: {
            token: localStorage.getItem("token")
        }
    }).done((data)=>{
        $("#listdata").empty()
        data.forEach(el => {
            $("#listdata").append(`
            <tr>
                <th>${el.title}</th>
                <th>${el.description}</th>
                <th>${el.status === true ? "Done" : "Undone"}</th>
                <th>${new Date(el.due_date).toDateString()}</th>
                <th><button class="btn btn-secondary" ><a onclick="edit(${el.id})"  value=${el.id}>Edit</a></button> <button class="btn btn-danger" ><a onclick="destroy(${el.id})" value=${el.id}>Delete</a></button> <button class="btn btn-success" ><a onclick="complete(${el.id})"  value=${el.id}>Complete</a</button>
            </tr>
            `)
        });
    }).fail(function(err, msg){
        console.log(msg);
    })
}
function destroy(id){
    console.log(id)
    const token = localStorage.getItem("token")
    $.ajax({
        method : "delete",
        url : `http://localhost:3000/todos/${id}`,
        headers: {
            token
        }
    }).done((data)=> {
        fetchData()
    }).fail((err)=> {
        console.log(err, "error")
    })
}

$(document).ready(function(){
    if(localStorage.getItem("token")) {
        $("#dashboard-page").show()
        $("#landing-page").hide()
        fetchData()
    } else {
        $("#dashboard-page").hide()
        $("#landing-page").show()
    }
    $('[data-youtube]').youtube_background({
        fitToBackground: true
    });
    $('.render a').click(function(){
        $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
    });
    
    $('.register-form').on("submit", (e)=> {
        e.preventDefault()
        const email = $(".email").val()
        const password = $(".password").val()
        $.ajax({
            method : "POST",
            url : "http://localhost:3000/register",
            data : {
                email,
                password
            }
        }).done((data)=> {
            localStorage.setItem("token", data.token)
            $("#dashboard-page").show()
            $("#landing-page").hide()
        }).fail((err)=> {
            console.log(err, "error")
        })
    })
    
    $('.login-form').on("submit", (e)=> {
        e.preventDefault()
        const email = $(".emailLogin").val()
        const password = $(".passwordLogin").val()
        $.ajax({
            method : "POST",
            url : "http://localhost:3000/login",
            data : {
                email,
                password
            }
        }).done((data)=> {
            localStorage.setItem("token", data.token) 
            $("#dashboard-page").show()
            $("#landing-page").hide()
        }).fail((err)=> {
            console.log(err, "error")
        })
    })
    $("#create").on("submit", function(e){
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
        }).done((data)=> {
            fetchData()
            console.log(data);
        }).fail((err, msg)=>{
            console.log(msg);
        })
    })
    $("#logout").on("click", function(){
        localStorage.clear()
        $("#dashboard-page").hide()
        $("#landing-page").show()
    })
})
