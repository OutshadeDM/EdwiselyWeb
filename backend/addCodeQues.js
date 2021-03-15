$(document).ready(function () {

    $user = "";
    if (isLoggedIn()) {
    // console.log(isLoggedIn(), 'yes');
    $user = JSON.parse(isLoggedIn());
    $('html').removeClass('d-none');
    } else {
        window.location.replace("login.html");
    }

    

});