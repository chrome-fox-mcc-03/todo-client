function onSignIn(googleUser) {
    let profile = googleUser.getBasicProfile();
    appStorage.userName = profile.getName();
    appStorage.avaURL = profile.getImageUrl();

    let id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        url: "http://localhost:3000/gAuth",
        method: "POST",
        headers: {
            gAccessToken: id_token
        }
    })
    .done((response) => {
        appStorage.token = response.token;
        appStorage.httpCode = 200;
    })
    .fail((response) => {
        appStorage.httpCode = response.status;
        appStorage.message = response.responseJSON.error[0]
    })
    .always(() => {
        saveState();
    })
}