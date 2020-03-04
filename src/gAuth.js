function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    var id_token = googleUser.getAuthResponse().id_token;
    // console.log("Token pake n: " + id_token);
    $.ajax({
        url: "http://localhost:3000/gAuth",
        method: "POST",
        headers: {
            gAccessToken: id_token
        }
    })
    .done((response) => {
        console.log("jadi gini bang");
        //dapet token nih
        // console.log(response);
        appStorage.token = response.token;
        appStorage.httpCode = 200;
    })
    .fail((response) => {
        console.log("fail bang")
        appStorage.httpCode = response.status;
        appStorage.message = response.responseJSON.error[0]
    })
    .always(() => {
        console.log("always");
        if (appStorage.httpCode === 200) {
            console.log("oke bang")
            saveState();
        } else {
            console.log("gagal bang")
            saveState();
        }
    })
}