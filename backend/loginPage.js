$(document).ready(function () {
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