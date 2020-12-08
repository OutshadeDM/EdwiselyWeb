$(document).ready(function () {

  // Login Function
  function login (credentials) {
    var form = new  FormData();
    form.append("username", credentials.email);
    form.append("password", credentials.password);
    $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/auth/loginUser',
        type: 'POST',
        dateType: 'json',
        data: form,
        contentType: false,
        processData: false,
        success: function (result) {
            // alert(result.status);
            console.log(result, result.token, JSON.stringify(result));
            if (result.token) {
              $.cookie('user', JSON.stringify(result), {expires: 365});
              // window.location.replace("index.html");
            } else {
              window.location.replace('login.html');
            }
        },
        error: function (error) {
            alert(error);
        }
    });
  }

  // Check if user is already logged in
  if (!isLoggedIn()) {
    $('html').removeClass('d-none');
  } else {
    window.location.replace("index.html");
  }  
  // Call Login Function on submit
  $('#submit').click(function() {
    const credentials = {email: $('#inputEmail').val(), password: $('#inputPassword').val()};
    login(credentials);
  });
  // $('#submit').click(function() {
  //   console.log($('#inputEmail').val());
  // });

  $("#password a").on('click', function (event) {
    event.preventDefault();
    if ($('#password input').attr("type") == "text") {
      $('#password input').attr('type', 'password');
      $('#password i').addClass("fa-eye-slash");
      $('#password i').removeClass("fa-eye");
    } else if ($('#password input').attr("type") == "password") {
      $('#password input').attr('type', 'text');
      $('#password i').removeClass("fa-eye-slash");
      $('#password i').addClass("fa-eye");
    }
  });
});