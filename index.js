function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    console.log(id_token)
    $("#LoginButton").hide()
   $.ajax({
       url:'http://localhost:3000/user/googlelogin',
       method:"POST",
       headers:{
           access_token: id_token
       }

   })
   .done(function(result) {
       console.log(result)
    })
    .fail(function(err) {
        console.log(err)
    })
}
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    });
}
//Google Sign In Sign Out

$(document).ready(function() {
    Start()
    $('#updates').hide()
    const isLogin = localStorage.getItem('access_token')
    console.log(isLogin)
    if(isLogin) {
        $("#dashboard").show()
        $.ajax({
            url:"http://localhost:3000/todos",
            method: "GET",
            headers: {
                access_token: isLogin
            }
        })
            .done(function(result) {
                console.log('hahaha')
                for(let i = 0;i < result.length;i ++) {
                    $("#todos").append(`
                    <tr>
                        <td>${result[i].id}</td>
                        <td>${result[i].Title}</td>
                        <td>${result[i].Status}</td>
                        <td>${result[i].Due_Date}</td>
                        <td><button class="delete" name="delete" value="${result[i].id}">delete</button></td>
                        <td><button class="update" name="update" value="${result[i].id}">update</button></td>
                    </tr>`)

                }
                
                $(".delete").on("click", function() {
                    let currentId = this.value
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
                    })
                    .fail(function(err) {
                        console.log(err)
                    })
                })
                //UPDATE BELUM JADI(KERJAKAN BESOK
                $(".update").on('click', function() {
                    console.log(this.value)
                    $("#updates").show()
                })

                // $()
            })
            .fail(function(err) {
                console.log(err)
            })
    }
   RegisterButton()
   LoginButton()
   LogoutButton()
    $("#form-Register").on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            url:"http://localhost:3000/user/register",
            method:"POST",
            data:{
                Email: $("#Email").val(),
                Password: $("#Password").val()
            }
        })
            .done(function(response) {
               RegisterSuccess()

            })
            .fail(function(err) {
                console.log(err)
            })
    })

    $("#form-Login").on('submit', function(e) {
        e.preventDefault()
        console.log(Email, Password)
        $.ajax({
            url:"http://localhost:3000/user/login",
            method: "POST",
            data: {
                Email: $("#EmailLogin").val(),
                Password: $("#passwordLogin").val()
            }
        })
            .done(function(result) {
                LoginSuccess()
                console.log(result)
                console.log('login')
                localStorage.setItem("access_token", result.access_token)
                $.ajax({
                    url:"http://localhost:3000/todos",
                    method: "GET",
                    headers: {
                        access_token: result.access_token
                    }
                })
                    .done(function(result) {
                        console.log(result)
                        for(let i = 0;i < result.length;i ++) {
                            $("#todos").append(`
                                <tr>
                                    <td>${result[i].id}</td>
                                    <td>${result[i].Title}</td>
                                    <td>${result[i].Status}</td>
                                    <td>${result[i].Due_Date}</td>
                                    <td><button class="delete" name="delete" value="${result[i].id}">delete</button></td>
                                    <td><button class="update" name="update" value="${result[i].id}">update</button></td>
                                </tr>`)
                        }
                        $(".delete").on("click", function() {
                            let currentId = this.value
                            $.ajax({
                                url:`http://localhost:3000/${currentId}`,
                                method:"DELETE",
                                data: {
                                    id: currentId
                                }
                            })
                            .done(function(result) {
                                console.log("successfully delete")
                            })
                            .fail(function(err) {
                                console.log(err)
                            })
                        })
                    })
                    .fail(function(err) {
                        console.log(err)
                    })
            })
            .fail(function(err) {
                console.log(err)
            })
    })


})