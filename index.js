$(document).ready(function () {
    if(!localStorage.token) {
        $("#sign_up_form").hide();
        $("#home_page").hide();

        $("#sign_in_form").on("submit", (e) => {
            let email = $("#email").val();
            let password = $("#password").val();
            
            e.preventDefault();
    
            $.ajax({
                method: "POST",
                url: "http://localhost:3000/users/signin",
                data: {
                    email,
                    password
                }
            })
                .done(function (token) {
                    $("#sign_in_page").hide();
                    $("#sign_up_page").hide();
                    $("#home_page").show();
                    console.log(`sign in success <<<<<<<<<<<<<<<<<<, ${token}`);
                    localStorage.setItem('token', token);
                })
                .fail(function(err) {
                    console.log(err);
                    
                })
        });
    } else {
        $("#sign_in_page").hide();
        $("#sign_up_page").hide();
        $("#logout_button").on("click", ()=> {
            localStorage.clear();
            $("#sign_in_page").show();
            $("#home_page").hide();
            console.log(`masoooooooooooook`);
            
        })
    }
    
    
});