// const isLogin = localStorage.getItem('access_token')

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    $("#LoginButton").hide()
    emptyTable()
    $.ajax({
        url:'http://localhost:3000/user/googlelogin',
        method:"POST",
        headers:{
            access_token: id_token
        }
    })
    .done(function(result) {
        console.log(result)
        localStorage.setItem("access_token", result.access_token)
        if(isLogin) {
        $("#dashboard").show()
        AjaxDashboard()
    }
    })
    .fail(function(err) {
        console.log(err)
    })
    
}
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    });
    localStorage.removeItem('access_token')
    $("#dashboard").hide()

}
//Google Sign In Sign Out

$(document).ready(function() {
    Start()
    emptyTable()
    getDate()
    $("#LogoutButton").hide()

    $('#updates').hide()

    
    //IF ALREADY LOGIN GENERATE DASHBOARD
    let isLogin = localStorage.getItem('access_token')
    if(isLogin) {
        LoginSuccess()
        AjaxDashboard()
        $("#LogoutButton").show()


    }
    //START DASHBOARD DONE

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
                console.log(response)
               RegisterSuccess()

            })
            .fail(function(err) {
                console.log(err)
                $("#RegisterFail").append(
                    `${err.responseJSON[0]}`
                )
                setTimeout(() => {
                    $("#RegisterFail").empty()
                }, 3000);
            })
    })

    $("#form-Login").on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            url:"http://localhost:3000/user/login",
            method: "POST",
            
            data: {
                Email: $("#EmailLogin").val(),
                Password: $("#passwordLogin").val()
            }
        })
            .done(function(result) {
                localStorage.setItem("access_token", result.access_token)
                let isLogin = localStorage.getItem('access_token')
                console.log(isLogin)
                if(isLogin == undefined) {
                    $("#LoginFail").append(
                        `Wrong Username / Password`
                    )
                    LoginFailed()
                }
                else {
                    LoginSuccess()
                    console.log(result)
                    console.log('done form login')
                    emptyTable()
                    AjaxDashboard()
                    
                }
            })
            .fail(function(err) {
                console.log(err)
                $("#LoginFail").append(
                    `${err.responseJSON.name}`
                )
            })
    })

    $("#CreateButton").on("click", function() {
        $("#creates").show()
    })

    $("#Create-Form").on('submit', function(e) {
        e.preventDefault()
        let isLogin = localStorage.getItem('access_token')
        CreateTodo(isLogin)
    })


})