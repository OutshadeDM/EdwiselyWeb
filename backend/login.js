$(document).ready(function () {

  // Login Function
  let loginToken = "";
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
              if (result.force_password_change) {
                loginToken = result;
                $('#passwordModal').modal();
              } else{
                $.cookie('user', JSON.stringify(result), {expires: 365});
                window.location.replace("index.html");
              }
            } else {
              window.location.replace('login.html?status=danger&message=401');
            }
        },
        error: function (error) {
            alert(error);
        }
    });
  }

  function forgotPassword (credentials) {
    var form = new  FormData();
    form.append("email", credentials.email);
    $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/user/forgotPassword',
        type: 'POST',
        dateType: 'json',
        data: form,
        contentType: false,
        processData: false,
        success: function (result) {
            // alert(result.status);
            console.log(result, result.token, JSON.stringify(result));
            if (result.status == 200) {
              window.location.replace('login.html?status=success&message=201');
            } else {
              window.location.replace('login.html?status=danger&message=402');
            }
        },
        error: function (error) {
            alert(error);
        }
    });
  }  

  function updatePassword(credentials) {
    var form = new  FormData();
    form.append("user_id", credentials.email);
    form.append("new_password", credentials.password);
    $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/user/updatePassword',
        type: 'POST',
        dateType: 'json',
        contentType: false,
        headers: {
            'Authorization': `Bearer ${loginToken.token}`
        },
        data: form,
        processData: false,
        success: function (result) {
            // alert(result.status);
            console.log(result, result.token, JSON.stringify(result));
            if (result.status == 200) {
              $.cookie('user', JSON.stringify(loginToken), {expires: 365});
              window.location.replace("index.html");
            } else {
              console.log(result);
              window.location.replace('login.html?status=danger&message=402');
            }
        },
        error: function (error) {
            alert(error);
        }
    });    
  }

  var url_string = window.location.href;
  var url = new URL(url_string);
  var status = url.searchParams.get("status");
  var message = url.searchParams.get("message");
  if (status) {
    if (message == 401)
      $('.alert strong').text('Wrong Email Id or Password!');
    else if (message == 402)
    $('.alert strong').text('No User With Such Email Found');
    else if (message == 200)
      $('.alert strong').text('Successfully Logged Out');
    else if (message == 201)
      $('.alert strong').text('Please Check Your Mail For New Password!');
      else if (message == 202)
      $('.alert strong').text('Successfully Updated Password!');            
    $('.alert').addClass(`alert-${status}`);
    $('.alert').removeClass('d-none');
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

  $('#forgot').click(function() {
    const credentials = {email: $('#email').val()};
    forgotPassword(credentials);
  });

  $('#forget, #back').click(function() {
    $('#loginTab, #forgotTab').toggleClass('d-none');
  });

  $('#update').click(function() {
    let password = $('#password').val();
    let rpassword = $('#rpassword').val();

    if (password === rpassword) {
      const credentials = {email: $('#inputEmail').val(), password: password}
      updatePassword(credentials);
    } else {
      $('.error').text('The password and reenter password must be same');
    }
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