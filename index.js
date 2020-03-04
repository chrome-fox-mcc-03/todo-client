$(document).ready(() => {
    $("#login-form").on('keydown', (event) => {
        event.preventDefault();
        if (event.keyCode === 13) {
            console.log("yeh");
        }
    });
});