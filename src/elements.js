$(".dropdown-trigger").on("click", (event) => {
    event.stopPropagation();
    $(".dropdown").toggleClass("is-active");
    $('#login-warning').empty();
})

function loadElements() {
    //to reset element state (show, hidden, empty, etc);
    $('#login-warning').empty();
    $('#register-warning').empty();
    $(".dropdown").toggleClass("is-active");
    $("#front-message").empty();
}