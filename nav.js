function Start() {
    $("#Register").hide()
    $("#Login").hide()
    $("#dashboard").hide()
}

function RegisterSuccess() {
    $("#Register").hide()
    $("#Login").show()
}

function LoginSuccess() {
    $("#Login").hide()
    $("#dashboard").show()
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
function LogoutButton() {
    $('#LogoutButton').on('click', function() {
        $("#Register").hide()
        $("#Login").hide()
        $("#dashboard").hide()
        localStorage.removeItem('access_token')

    })
}